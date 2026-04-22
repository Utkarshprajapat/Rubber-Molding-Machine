import PropTypes from 'prop-types';

export default function MachineStatus({ data }) {
  if (!data) return null;
  const throughput = Math.round(3600 / (data.cycleTime || 45));
  const pillClass = `status-${(data.machineStatus || 'stable').replace(/\s+/g, '-').toLowerCase()}`;
  
  return (
    <div className="panel">
      <header className="panel-header">
        <p>Machine Status</p>
        <span className={`status-pill ${pillClass}`}>
          {data.machineStatus || 'STABLE'}
        </span>
      </header>
      <div className="panel-body">
        <div className="status-row">
          <p>Throughput</p>
          <strong>{throughput} units/hr</strong>
        </div>
        <div className="status-row">
          <p>Load Balance</p>
          <strong>60%</strong>
        </div>
        <div className="status-row">
          <p>Energy Usage</p>
          <strong>46 kWh</strong>
        </div>
        <div className="status-row">
          <p>CPU Utilization</p>
          <strong>58%</strong>
        </div>
      </div>
    </div>
  );
}

MachineStatus.propTypes = {
  data: PropTypes.shape({
    machineStatus: PropTypes.string,
    cycleTime: PropTypes.number
  })
};
