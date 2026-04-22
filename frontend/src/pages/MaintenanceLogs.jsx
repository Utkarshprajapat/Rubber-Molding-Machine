import { useState, useEffect } from 'react';
import api from '../services/api';

export default function MaintenanceLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await api.maintenance.getAll();
        if (response.success) {
          setLogs(response.data);
        }
      } catch (err) {
        console.error('Failed to load maintenance logs', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'COMPLETED': return '#4ade80'; // green
      case 'IN_PROGRESS': return '#facc15'; // yellow
      case 'SCHEDULED': return '#60a5fa'; // blue
      default: return '#9ca3af';
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p>Historical maintenance records</p>
          <h1>Maintenance Logs</h1>
        </div>
      </header>
      
      <div className="card" style={{ padding: '2rem' }}>
        {loading ? (
          <p>Loading records...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1f2937' }}>
                <th style={{ padding: '1rem', color: '#94a3b8' }}>Machine Name</th>
                <th style={{ padding: '1rem', color: '#94a3b8' }}>Type</th>
                <th style={{ padding: '1rem', color: '#94a3b8' }}>Description</th>
                <th style={{ padding: '1rem', color: '#94a3b8' }}>Status</th>
                <th style={{ padding: '1rem', color: '#94a3b8' }}>Operator</th>
                <th style={{ padding: '1rem', color: '#94a3b8' }}>Scheduled Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.record_id} style={{ borderBottom: '1px solid #1f2937' }}>
                  <td style={{ padding: '1rem' }}>{log.machine_name}</td>
                  <td style={{ padding: '1rem' }}>{log.maintenance_type}</td>
                  <td style={{ padding: '1rem' }}>{log.description}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      backgroundColor: `${getStatusColor(log.status)}33`, 
                      color: getStatusColor(log.status),
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{log.operator_name || 'N/A'}</td>
                  <td style={{ padding: '1rem' }}>{new Date(log.scheduled_date).toLocaleDateString()}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No maintenance records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
