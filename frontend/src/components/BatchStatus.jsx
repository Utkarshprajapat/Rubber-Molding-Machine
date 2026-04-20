import PropTypes from 'prop-types';

export default function BatchStatus({ data }) {
  const gateClass = `status-${data.qualityGate.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="panel">
      <header className="panel-header">
        <p>Production Run</p>
        <strong>{data.batchId}</strong>
      </header>
      <div className="panel-body">
        <div className="status-row">
          <p>Completion</p>
          <strong>{data.progress}%</strong>
        </div>
        <div className="bar">
          <span style={{ width: `${data.progress}%` }} />
        </div>
        <div className="status-row">
          <p>Units Produced</p>
          <strong>{data.unitsProduced}</strong>
        </div>
        <div className="status-row">
          <p>Target Output</p>
          <strong>{data.targetOutput}</strong>
        </div>
        <div className="status-row">
          <p>Vulcanization Stage</p>
          <span className={`status-pill ${gateClass}`}>
            {data.qualityGate}
          </span>
        </div>
        <p className="status-note">{data.nextAction}</p>
      </div>
    </div>
  );
}

BatchStatus.propTypes = {
  data: PropTypes.shape({
    batchId: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    unitsProduced: PropTypes.number.isRequired,
    targetOutput: PropTypes.number.isRequired,
    qualityGate: PropTypes.string.isRequired,
    nextAction: PropTypes.string.isRequired
  }).isRequired
};

