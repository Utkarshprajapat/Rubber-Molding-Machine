const flowItems = [
  {
    title: 'Sensors',
    description: 'Temperature, Pressure, Cycle Time feed raw signals',
    detail: 'Probability models smooth the input stream'
  },
  {
    title: 'Sensor Bus & CPU',
    description: 'CNDC Architecture layer optimizes throughput',
    detail: 'Simulated cache + pipeline scheduling'
  },
  {
    title: 'SQL Core',
    description: 'SQL Queries evaluate production batches',
    detail: 'Quality scoring • Threshold detection • Predictive alerts'
  },
  {
    title: 'ER Diagram Units',
    description: 'ManufacturingUnit • Sensor • ProductionBatch • AlertSystem',
    detail: 'Each module orchestrates state-rich simulation behaviors'
  }
];

export default function SystemFlow() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p>CNDC Architecture & Data Flow</p>
          <h1>Sensor → CPU → SQL Queries → Alerts</h1>
        </div>
      </header>
      <section className="card flow-card">
        <div className="flow-diagram">
          {flowItems.map((item, index) => (
            <div key={item.title} className="flow-step">
              <span className="flow-index">{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <small>{item.detail}</small>
              {index < flowItems.length - 1 && <span className="flow-arrow">⟶</span>}
            </div>
          ))}
        </div>
      </section>
      <section className="grid flow-grid">
        <article className="card">
          <h3>Sensor-to-CPU Pipeline</h3>
          <p>Data is buffered, normalized, and dispatched to the monitoring loop every simulation tick.</p>
        </article>
        <article className="card">
          <h3>Optimized Monitoring Loop</h3>
          <p>Loop speed is user-controlled. Cycle Speed Multiplier directly impacts sampling cadence.</p>
        </article>
        <article className="card">
          <h3>Alert Bus</h3>
          <p>AlertSystem ranks severity, annotates with time codes, and persists the latest 20 events.</p>
        </article>
      </section>
    </div>
  );
}

