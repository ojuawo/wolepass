import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import styles from './Tickets.module.css';

export default function Tickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Detail/Comment states
  const [commentBody, setCommentBody] = useState('');
  const [commentPhoto, setCommentPhoto] = useState(null);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const isAdmin = user?.global_role === 'tenant_admin';

  const fetchTickets = useCallback(async () => {
    try {
      const res = await api.get('/tickets');
      setTickets(res.data.data);
    } catch (err) {
      setError('Failed to fetch tickets.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStaff = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await api.get('/tickets/staff');
      setStaff(res.data.data);
    } catch (err) {
      console.error('Failed to fetch staff');
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchTickets();
    fetchStaff();
  }, [fetchTickets, fetchStaff]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('priority', priority);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      await api.post('/tickets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setPhoto(null);
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectTicket = async (ticket) => {
    try {
      const res = await api.get(`/tickets/${ticket.id}`);
      setSelectedTicket(res.data.data);
    } catch (err) {
      alert('Failed to load ticket details.');
    }
  };

  const handleUpdateStatus = async (ticketId, updates) => {
    try {
      const res = await api.post(`/tickets/${ticketId}`, updates);
      setTickets(prev => prev.map(t => t.id === ticketId ? res.data.data : t));
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(prev => ({ ...prev, ...res.data.data }));
      }
    } catch (err) {
      alert('Failed to update ticket.');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    setCommentSubmitting(true);

    const formData = new FormData();
    formData.append('body', commentBody);
    if (commentPhoto) {
      formData.append('photo', commentPhoto);
    }

    try {
      const res = await api.post(`/tickets/${selectedTicket.id}/comments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSelectedTicket(prev => ({
        ...prev,
        comments: [...prev.comments, res.data.data],
      }));
      setCommentBody('');
      setCommentPhoto(null);
    } catch (err) {
      alert('Failed to post comment.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>🛠️ Maintenance Hub</h1>
          <p className={styles.subtitle}>Report issues, track tickets, and message technicians</p>
        </div>
        {!isAdmin && (
          <button className={styles.btnPrimary} onClick={() => setShowCreateModal(true)}>
            + Report An Issue
          </button>
        )}
      </header>

      {error && <div className={styles.errorState}>{error}</div>}

      <div className={styles.layout}>
        {/* Left pane: Ticket List */}
        <div className={styles.listPane}>
          {loading ? (
            <div className={styles.loading}>Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📦</span>
              <p>No maintenance tickets raised yet.</p>
            </div>
          ) : (
            <div className={styles.ticketGrid}>
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className={`${styles.ticketCard} ${selectedTicket?.id === t.id ? styles.selectedCard : ''}`}
                  onClick={() => handleSelectTicket(t)}
                >
                  <div className={styles.ticketCardHeader}>
                    <span className={`${styles.badge} ${styles[`priority_${t.priority}`]}`}>
                      {t.priority}
                    </span>
                    <span className={`${styles.badge} ${styles[`status_${t.status}`]}`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className={styles.ticketTitle}>{t.title}</h3>
                  <p className={styles.ticketExcerpt}>{t.description.substring(0, 100)}...</p>
                  <div className={styles.ticketCardFooter}>
                    <span>📍 {t.unit?.unit_label || 'Common Area'}</span>
                    <span>🕒 {new Date(t.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right pane: Ticket Detail & Chat */}
        <div className={styles.detailPane}>
          {selectedTicket ? (
            <div className={styles.detailContent}>
              <div className={styles.detailHeader}>
                <div>
                  <h2 className={styles.detailTitle}>{selectedTicket.title}</h2>
                  <p className={styles.detailSub}>
                    Raised by <strong>{selectedTicket.reporter?.name}</strong> • 📍 {selectedTicket.unit?.unit_label}
                  </p>
                </div>
                <div className={styles.detailActions}>
                  {isAdmin && (
                    <div className={styles.adminControls}>
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => handleUpdateStatus(selectedTicket.id, { status: e.target.value })}
                        className={styles.selectInput}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>

                      <select
                        value={selectedTicket.assignee_id || ''}
                        onChange={(e) => handleUpdateStatus(selectedTicket.id, { assignee_id: e.target.value || null })}
                        className={styles.selectInput}
                      >
                        <option value="">Unassigned</option>
                        {staff.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.global_role.replace('_', ' ')})</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Status stepper */}
              <div className={styles.stepper}>
                {['open', 'in_progress', 'resolved', 'closed'].map((step, index) => {
                  const currentIdx = ['open', 'in_progress', 'resolved', 'closed'].indexOf(selectedTicket.status);
                  const isPast = index <= currentIdx;
                  return (
                    <div key={step} className={`${styles.step} ${isPast ? styles.stepActive : ''}`}>
                      <div className={styles.stepNum}>{index + 1}</div>
                      <div className={styles.stepText}>{step.replace('_', ' ')}</div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.descriptionSection}>
                <p className={styles.descriptionText}>{selectedTicket.description}</p>
                {selectedTicket.photo_url && (
                  <div className={styles.photoContainer}>
                    <img src={selectedTicket.photo_url} alt="Issue Attachment" className={styles.issuePhoto} />
                  </div>
                )}
              </div>

              {/* Comments Thread */}
              <div className={styles.commentsSection}>
                <h3 className={styles.sectionTitle}>Updates & Comments</h3>
                <div className={styles.commentsList}>
                  {selectedTicket.comments?.length === 0 ? (
                    <p className={styles.noComments}>No updates posted yet.</p>
                  ) : (
                    selectedTicket.comments?.map((c) => {
                      const isSelf = c.author_id === user.id;
                      return (
                        <div key={c.id} className={`${styles.commentRow} ${isSelf ? styles.commentRowSelf : ''}`}>
                          <div className={styles.commentBubble}>
                            <div className={styles.commentMeta}>
                              <strong>{c.author?.name}</strong> • <span className={styles.roleBadge}>{c.author?.global_role}</span>
                            </div>
                            <p className={styles.commentBody}>{c.body}</p>
                            {c.photo_url && (
                              <img src={c.photo_url} alt="Attachment" className={styles.commentPhoto} />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form onSubmit={handleAddComment} className={styles.commentForm}>
                  <textarea
                    placeholder="Type an update or comment..."
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    className={styles.commentInput}
                    rows={2}
                    required
                  />
                  <div className={styles.commentFormActions}>
                    <input
                      type="file"
                      accept="image/*"
                      id="comment-photo"
                      style={{ display: 'none' }}
                      onChange={(e) => setCommentPhoto(e.target.files[0])}
                    />
                    <label htmlFor="comment-photo" className={styles.photoLabel}>
                      📷 {commentPhoto ? 'Photo Added' : 'Attach Photo'}
                    </label>
                    <button type="submit" className={styles.btnPrimary} disabled={commentSubmitting}>
                      {commentSubmitting ? 'Posting...' : 'Send'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className={styles.detailsPlaceholder}>
              <span className={styles.largeIcon}>🛠️</span>
              <h3>Select a ticket from the left to view details and start messaging.</h3>
            </div>
          )}
        </div>
      </div>

      {/* Report Issue Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Report a Maintenance Issue</h2>
              <button className={styles.closeBtn} onClick={() => setShowCreateModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateTicket} className={styles.modalForm}>
              <div className={styles.inputGroup}>
                <label className={styles.fieldLabel}>Issue Title</label>
                <input
                  type="text"
                  placeholder="e.g. Broken elevator or Leaking pipe"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.modalInput}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.fieldLabel}>Description</label>
                <textarea
                  placeholder="Please describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.modalTextarea}
                  rows={4}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.fieldLabel}>Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className={styles.modalSelect}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.fieldLabel}>Attach Photo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  className={styles.modalFileInput}
                />
              </div>

              <button type="submit" className={styles.modalSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Raise Ticket'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
