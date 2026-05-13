import Dexie from 'dexie';

const db = new Dexie('WolePassDB');

db.version(1).stores({
  passes: 'otp_code, status, expected_arrival, visitor_name, destination',
  offline_logs: '++id, otp_code, checked_in_at, synced'
});

export default db;
