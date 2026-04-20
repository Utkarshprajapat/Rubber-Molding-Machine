import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function SimulationControls({ controls, onChange }) {
  const handleToggle = () => {
    onChange({ ...controls, running: !controls.running });
  };

  const handleSlider = (key, value) => {
    onChange({ ...controls, [key]: Number(value) });
  };

  return (
    <div className="panel">
      <header className="panel-header">
        <p>Simulation Controls</p>
        <span className={classNames('status-pill', controls.running ? 'status-running' : 'status-idle')}>
          {controls.running ? 'Running' : 'Idle'}
        </span>
      </header>
      <div className="control-group">
        <button type="button" className="primary-btn" onClick={handleToggle}>
          {controls.running ? 'Pause Simulation' : 'Start Simulation'}
        </button>
        <label>
          Mold Heat Deviation: {controls.temperatureStress}%
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={controls.temperatureStress}
            onChange={(e) => handleSlider('temperatureStress', e.target.value)}
          />
        </label>
        <label>
          Clamp Force Deviation: {controls.pressureStress}%
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={controls.pressureStress}
            onChange={(e) => handleSlider('pressureStress', e.target.value)}
          />
        </label>
        <label>
          Cycle Speed Multiplier: {controls.speedMultiplier.toFixed(1)}x
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={controls.speedMultiplier}
            onChange={(e) => handleSlider('speedMultiplier', e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}

SimulationControls.propTypes = {
  controls: PropTypes.shape({
    running: PropTypes.bool.isRequired,
    temperatureStress: PropTypes.number.isRequired,
    pressureStress: PropTypes.number.isRequired,
    speedMultiplier: PropTypes.number.isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired
};

