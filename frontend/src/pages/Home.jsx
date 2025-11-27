import { useEffect, useMemo, useRef, useState } from 'react';
import Dashboard from '../components/Dashboard.jsx';
import { generateSensorSnapshot } from '../utils/dataGenerator.js';
import { calculateQualityScore, calculateDefectProbability } from '../utils/algorithms.js';
import { ManufacturingUnit, ProductionBatch } from '../utils/sensorEngine.js';
import { AlertSystem } from '../utils/alertEngine.js';

const initialControls = {
  running: true,
  temperatureStress: 8,
  pressureStress: 4,
  speedMultiplier: 1
};

export default function Home() {
  const [controls, setControls] = useState(initialControls);
  const [liveData, setLiveData] = useState(generateSensorSnapshot());
  const [history, setHistory] = useState([]);
  const [qualityScore, setQualityScore] = useState(92);
  const [defectProbability, setDefectProbability] = useState(0.08);
  const [machineStatus, setMachineStatus] = useState({
    state: 'Stable',
    throughput: 320,
    loadBalance: 60,
    energyUsage: 46,
    cpuUtilization: 58,
    note: 'Ready to ramp batches'
  });
  const [batchStatus, setBatchStatus] = useState({
    batchId: 'Batch-042',
    progress: 15,
    unitsProduced: 180,
    targetOutput: 1200,
    qualityGate: 'Stage 1',
    nextAction: 'Align composite spool'
  });
  const [alerts, setAlerts] = useState([]);

  const manufacturingUnit = useRef(new ManufacturingUnit());
  const productionBatch = useRef(new ProductionBatch());
  const alertSystem = useRef(new AlertSystem());

  useEffect(() => {
    if (!controls.running) {
      return undefined;
    }

    const tick = () => {
      const snapshot = generateSensorSnapshot({
        temperatureStress: controls.temperatureStress,
        pressureStress: controls.pressureStress
      });
      const quality = calculateQualityScore(snapshot);
      const defect = calculateDefectProbability(snapshot, quality);
      const machine = manufacturingUnit.current.evaluate(snapshot, quality);
      const batch = productionBatch.current.update(snapshot);
      const newAlerts = alertSystem.current.evaluate(snapshot, quality, defect);

      setLiveData(snapshot);
      setQualityScore(quality);
      setDefectProbability(defect);
      setMachineStatus(machine);
      setBatchStatus(batch);
      setAlerts(alertSystem.current.getHistory());
      setHistory((prev) => {
        const next = [...prev, snapshot];
        return next.slice(-40);
      });
    };

    const interval = setInterval(tick, Math.max(250, 1000 / controls.speedMultiplier));
    return () => clearInterval(interval);
  }, [controls]);

  const dashboardProps = useMemo(
    () => ({
      liveData,
      history,
      machineStatus,
      batchStatus,
      qualityScore,
      defectProbability,
      alerts,
      controls
    }),
    [liveData, history, machineStatus, batchStatus, qualityScore, defectProbability, alerts, controls]
  );

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p>Brake Shoes & Pads Manufacturing Simulator</p>
          <h1>Real-time Operations Control</h1>
        </div>
        {/*
        <div>
          <p>Academic Backbone</p>
          <span className="tag">Probability</span>
          <span className="tag">Architecture</span>
          <span className="tag">Algorithms</span>
          <span className="tag">OOP</span>
        </div>
        */}
      </header>
      <Dashboard
        {...dashboardProps}
        onControlChange={setControls}
      />
    </div>
  );
}

