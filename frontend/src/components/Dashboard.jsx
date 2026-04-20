import MachineStatus from './MachineStatus.jsx';
import BatchStatus from './BatchStatus.jsx';
import Alerts from './Alerts.jsx';
import SimulationControls from './SimulationControls.jsx';
import RealtimeCharts from './Charts/RealtimeCharts.jsx';

export default function Dashboard({
  liveData,
  history,
  machineStatus,
  batchStatus,
  qualityScore,
  defectProbability,
  alerts,
  onControlChange,
  controls
}) {
  return (
    <div className="grid dashboard-grid">
      <section className="card highlight-card">
        <header>
          <p>Live Manufacturing Pulse</p>
          <h1>{machineStatus.state}</h1>
        </header>
        <div className="metrics-grid">
          <div>
            <p>Mold Cavity Temp</p>
            <h2>{liveData.temperature.toFixed(1)} °C</h2>
          </div>
          <div>
            <p>Clamp Pressure</p>
            <h2>{liveData.pressure.toFixed(1)} psi</h2>
          </div>
          <div>
            <p>Cure Cycle Time</p>
            <h2>{liveData.cycleTime.toFixed(2)} s</h2>
          </div>
          <div>
            <p>Clamp Force</p>
            <h2>{liveData.clampForce.toFixed(1)} kN</h2>
          </div>
          <div>
            <p>Cure Status</p>
            <h2 className={`status-text-${liveData.cureStatus.toLowerCase()}`}>{liveData.cureStatus}</h2>
          </div>
          <div>
            <p>Quality Score</p>
            <h2>{qualityScore.toFixed(1)}%</h2>
          </div>
          <div>
            <p>Defect Probability</p>
            <h2>{(defectProbability * 100).toFixed(2)}%</h2>
          </div>
        </div>
      </section>

      <section className="card chart-card">
        <RealtimeCharts data={history} />
      </section>

      <section className="card">
        <MachineStatus data={machineStatus} />
      </section>

      <section className="card">
        <BatchStatus data={batchStatus} />
      </section>

      <section className="card alerts-card">
        <Alerts alerts={alerts} />
      </section>

      <section className="card controls-card">
        <SimulationControls controls={controls} onChange={onControlChange} />
      </section>
    </div>
  );
}

