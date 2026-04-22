import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function Alerts({ liveData }) {
  if (!liveData) return null;

  const alerts = [];
  
  if (liveData.machineStatus === 'FAULT') {
    alerts.push({ id: 'fault', severity: 'critical', title: '🚨 FAULT: Critical parameter threshold exceeded' });
  } else if (liveData.machineStatus === 'WARNING') {
    alerts.push({ id: 'warn', severity: 'warning', title: '⚠️ WARNING: Parameter approaching limit' });
  }

  if (liveData.defectProbability > 15) {
    alerts.push({ id: 'defect', severity: 'warning', title: `⚠️ High defect probability detected: ${liveData.defectProbability}%` });
  }

  return (
    <div className="panel alerts-panel">
      <header className="panel-header">
        <p>Alert Center</p>
        <span>{alerts.length} active</span>
      </header>
      <div className="alert-list">
        {alerts.map((alert) => (
          <article key={alert.id} className={classNames('alert-item', `soft-${alert.severity === 'critical' ? 'red' : 'yellow'}`)}>
            <div>
              <p style={{ fontWeight: 'bold' }}>{alert.title}</p>
            </div>
            <span>Now</span>
          </article>
        ))}
        {alerts.length === 0 && <p className="muted">✅ No alerts triggered</p>}
      </div>
    </div>
  );
}

Alerts.propTypes = {
  liveData: PropTypes.object
};
