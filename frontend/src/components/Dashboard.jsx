import useSensorData from '../hooks/useSensorData';
import RealtimeCharts from './Charts/RealtimeCharts.jsx';
import MachineStatus from './MachineStatus.jsx';
import Alerts from './Alerts.jsx';

export default function Dashboard() {
  const { liveData, history, stats, isConnected, error, loading } = useSensorData();

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading IoT data...</div>;
  }

  return (
    <div className="grid dashboard-grid">
      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '1rem', borderRadius: '8px', border: '1px solid #ef4444', gridColumn: '1 / -1' }}>
          ⚠️ Backend Disconnected - {error}
        </div>
      )}

      <section className="card highlight-card" style={{ gridColumn: '1 / -1' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p>Live Manufacturing Pulse</p>
            <h1>MoldSense Overview</h1>
          </div>
          {isConnected && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(34, 197, 94, 0.2)', padding: '0.5rem 1rem', borderRadius: '999px', color: '#4ade80', fontWeight: 'bold' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
              LIVE
            </div>
          )}
        </header>

        {liveData && (
          <div className="metrics-grid">
            <div>
              <p>Mold Cavity Temp</p>
              <h2>{liveData.temperature?.toFixed(1)} °C</h2>
            </div>
            <div>
              <p>Clamp Pressure</p>
              <h2>{liveData.pressure?.toFixed(1)} psi</h2>
            </div>
            <div>
              <p>Cure Cycle Time</p>
              <h2>{liveData.cycleTime?.toFixed(2)} s</h2>
            </div>
            <div>
              <p>Clamp Force</p>
              <h2>{liveData.clampForce?.toFixed(1)} kN</h2>
            </div>
            <div>
              <p>Cure Status</p>
              <h2 style={{ 
                color: liveData.cureStatus === 'CURING' ? '#4ade80' : 
                       liveData.cureStatus === 'COOLING' ? '#60a5fa' : '#9ca3af' 
              }}>{liveData.cureStatus}</h2>
            </div>
            <div>
              <p>Quality Score</p>
              <h2>{liveData.qualityScore?.toFixed(1)}%</h2>
            </div>
            <div>
              <p>Defect Probability</p>
              <h2>{liveData.defectProbability?.toFixed(2)}%</h2>
            </div>
            <div>
              <p>Machine Status</p>
              <h2 style={{ 
                color: liveData.machineStatus === 'STABLE' ? '#4ade80' : 
                       liveData.machineStatus === 'WARNING' ? '#facc15' : '#ef4444' 
              }}>{liveData.machineStatus}</h2>
            </div>
          </div>
        )}
      </section>

      <section className="card chart-card" style={{ gridColumn: '1 / -1' }}>
        <RealtimeCharts data={history} />
      </section>

      <section className="card">
        <MachineStatus data={liveData} />
      </section>

      <section className="card alerts-card" style={{ gridColumn: '1 / -1' }}>
        <Alerts liveData={liveData} />
      </section>
    </div>
  );
}
