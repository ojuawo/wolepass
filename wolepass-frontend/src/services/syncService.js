import api from './api';
import db from './db';

export const downloadPasses = async () => {
  try {
    const response = await api.get('/gate/sync');
    // Assuming backend returns an array of passes
    const passes = response.data.passes || response.data.data || response.data;
    
    await db.passes.clear();
    
    if (passes && Array.isArray(passes) && passes.length > 0) {
      const mappedData = passes.map(pass => ({
        otp_code: pass.otp_code,
        status: pass.status,
        expected_arrival: pass.expected_arrival,
        visitor_name: pass.visitor_name || pass.visitor?.name || 'Unknown',
        destination: pass.destination || (pass.unit ? pass.unit.name : 'Unknown')
      }));
      await db.passes.bulkPut(mappedData);
    }
    return true;
  } catch (error) {
    console.error('Failed to download passes:', error);
    return false;
  }
};

export const uploadLogs = async () => {
  try {
    const logs = await db.offline_logs.where('synced').equals(0).toArray();
    
    if (logs.length === 0) return true; // Nothing to sync

    const payload = {
      offline_logs: logs
    };

    await api.post('/gate/sync', payload);

    // On success, clear the synchronized logs from local DB to save space
    const logIds = logs.map(log => log.id);
    await db.offline_logs.bulkDelete(logIds);

    return true;
  } catch (error) {
    console.error('Failed to upload offline logs:', error);
    return false;
  }
};
