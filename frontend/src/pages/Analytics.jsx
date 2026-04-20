import { useEffect, useState } from 'react';
import RealtimeCharts from '../components/Charts/RealtimeCharts.jsx';
import { generateSensorSnapshot } from '../utils/dataGenerator.js';
import { calculateQualityScore, calculateDefectProbability } from '../utils/algorithms.js';

export default function Analytics() {
  const [series, setSeries] = useState([]);
  const [quality, setQuality] = useState(0);
  const [defectProbability, setDefectProbability] = useState(0);

  useEffect(() => {
    const snapshot = generateSensorSnapshot();
    setQuality(calculateQualityScore(snapshot));
    setDefectProbability(calculateDefectProbability(snapshot, quality));

    const mockSeries = Array.from({ length: 30 }).map(() => generateSensorSnapshot());
    setSeries(mockSeries);
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p>Deeper Insight</p>
          <h1>Analytics & Quality Intelligence</h1>
        </div>
      </header>
      <section className="grid analytics-grid">
        <article className="card metric-card">
          <p>Quality Score</p>
          <h2>{quality.toFixed(2)}%</h2>
          <small>Algorithmic quality estimator</small>
        </article>
        {/*<article className="card metric-card">
          <p>Defect Probability</p>
          <h2>{(defectProbability * 100).toFixed(2)}%</h2>
          <small>Predictive defect engine</small>
        </article>*/}
        <article className="card metric-card">
          <p>SQL Query Stack</p>
          <ul>
            <li>Threshold detection</li>
            <li>Predictive alerting</li>
            <li>Quality assessment</li>
          </ul>
        </article>
      </section>
      <section className="card">
        <RealtimeCharts data={series} />
      </section>
    </div>
  );
}

