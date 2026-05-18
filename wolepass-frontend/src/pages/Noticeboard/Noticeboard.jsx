import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import styles from './Noticeboard.module.css';

const ICONS = {
  announcement: '📣',
  poll: '📊',
  pinned: '📌',
};

function PollWidget({ poll, noticeId, onVote }) {
  const handleVote = (optionId) => {
    onVote(noticeId, optionId);
  };

  return (
    <div className={styles.pollWidget}>
      {poll.options.map((opt) => {
        const isVoted = poll.user_voted_option === opt.id;
        return (
          <button
            key={opt.id}
            className={`${styles.pollOption} ${isVoted ? styles.pollOptionVoted : ''}`}
            onClick={() => handleVote(opt.id)}
          >
            <div className={styles.pollOptionHeader}>
              <span className={styles.pollOptionText}>{opt.text}</span>
              <span className={styles.pollOptionPercent}>{opt.percentage}%</span>
            </div>
            <div className={styles.pollBar}>
              <div
                className={styles.pollBarFill}
                style={{ width: `${opt.percentage}%` }}
              />
            </div>
            <span className={styles.pollVoteCount}>{opt.votes} vote{opt.votes !== 1 ? 's' : ''}</span>
          </button>
        );
      })}
      <p className={styles.totalVotes}>{poll.total_votes} total vote{poll.total_votes !== 1 ? 's' : ''}</p>
    </div>
  );
}

function ComposeModal({ onClose, onSubmit }) {
  const [type, setType] = useState('announcement');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [pinned, setPinned] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);

  const addOption = () => pollOptions.length < 6 && setPollOptions([...pollOptions, '']);
  const updateOption = (i, val) => setPollOptions(pollOptions.map((o, idx) => idx === i ? val : o));
  const removeOption = (i) => pollOptions.length > 2 && setPollOptions(pollOptions.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { title, body, type, pinned };
    if (type === 'poll') payload.poll_options = pollOptions.filter(Boolean);
    await onSubmit(payload);
    setLoading(false);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>New Post</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.typeToggle}>
            <button type="button" className={type === 'announcement' ? styles.typeActive : styles.typeBtn}
              onClick={() => setType('announcement')}>📣 Announcement</button>
            <button type="button" className={type === 'poll' ? styles.typeActive : styles.typeBtn}
              onClick={() => setType('poll')}>📊 Poll</button>
          </div>

          <input className={styles.modalInput} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <textarea className={styles.modalTextarea} placeholder="Write your message here..." value={body}
            onChange={e => setBody(e.target.value)} rows={4} required />

          {type === 'poll' && (
            <div className={styles.pollBuilder}>
              <label className={styles.fieldLabel}>Poll Options</label>
              {pollOptions.map((opt, i) => (
                <div key={i} className={styles.optionRow}>
                  <input className={styles.modalInput} placeholder={`Option ${i + 1}`} value={opt}
                    onChange={e => updateOption(i, e.target.value)} required />
                  {pollOptions.length > 2 && (
                    <button type="button" className={styles.removeBtn} onClick={() => removeOption(i)}>✕</button>
                  )}
                </div>
              ))}
              {pollOptions.length < 6 && (
                <button type="button" className={styles.addOptionBtn} onClick={addOption}>+ Add Option</button>
              )}
            </div>
          )}

          <label className={styles.pinnedToggle}>
            <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} />
            Pin this post to the top
          </label>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Posting...' : 'Post Now'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Noticeboard() {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [error, setError] = useState(null);

  const isAdmin = user?.global_role === 'tenant_admin';

  const fetchNotices = useCallback(async () => {
    try {
      const res = await api.get('/notices');
      setNotices(res.data.data);
    } catch {
      setError('Failed to load notices.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotices(); }, [fetchNotices]);

  const handleCompose = async (payload) => {
    try {
      await api.post('/notices', payload);
      setShowCompose(false);
      fetchNotices();
    } catch {
      alert('Failed to post notice.');
    }
  };

  const handleVote = async (noticeId, optionId) => {
    try {
      const res = await api.post(`/notices/${noticeId}/vote`, { poll_option_id: optionId });
      setNotices(prev => prev.map(n => n.id === noticeId ? res.data.data : n));
    } catch {
      alert('Failed to record vote.');
    }
  };

  const handleDelete = async (noticeId) => {
    if (!confirm('Delete this notice?')) return;
    await api.delete(`/notices/${noticeId}`);
    setNotices(prev => prev.filter(n => n.id !== noticeId));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>📣 Community Board</h1>
          <p className={styles.subtitle}>Estate announcements, updates, and polls</p>
        </div>
        {isAdmin && (
          <button className={styles.composeBtn} onClick={() => setShowCompose(true)}>
            + New Post
          </button>
        )}
      </div>

      {loading && <div className={styles.emptyState}>Loading notices...</div>}
      {error && <div className={styles.errorState}>{error}</div>}

      {!loading && notices.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <p>No notices yet. Check back later!</p>
        </div>
      )}

      <div className={styles.feed}>
        {notices.map((notice) => (
          <article key={notice.id} className={`${styles.card} ${notice.pinned ? styles.pinned : ''}`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardMeta}>
                <span className={styles.typeIcon}>{notice.pinned ? ICONS.pinned : ICONS[notice.type]}</span>
                <span className={`${styles.typeBadge} ${styles[`type_${notice.type}`]}`}>{notice.type}</span>
                {notice.pinned && <span className={styles.pinnedBadge}>Pinned</span>}
              </div>
              {isAdmin && (
                <button className={styles.deleteBtn} onClick={() => handleDelete(notice.id)}>✕</button>
              )}
            </div>

            <h2 className={styles.cardTitle}>{notice.title}</h2>
            <p className={styles.cardBody}>{notice.body}</p>

            {notice.type === 'poll' && notice.poll && (
              <PollWidget poll={notice.poll} noticeId={notice.id} onVote={handleVote} />
            )}

            <div className={styles.cardFooter}>
              <span className={styles.author}>By {notice.author?.name ?? 'Estate Management'}</span>
              <span className={styles.date}>
                {new Date(notice.published_at).toLocaleDateString('en-NG', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </span>
            </div>
          </article>
        ))}
      </div>

      {showCompose && <ComposeModal onClose={() => setShowCompose(false)} onSubmit={handleCompose} />}
    </div>
  );
}
