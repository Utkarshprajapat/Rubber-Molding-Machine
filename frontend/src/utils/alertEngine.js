let alertCounter = 0;

const timestamp = () =>
  new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

export class AlertSystem {
  constructor() {
    this.buffer = [];
  }

  evaluate(snapshot, qualityScore, defectProbability) {
    const alerts = [];

    if (snapshot.temperature > 220) {
      alerts.push(this.createAlert('critical', 'Thermal spike detected', 'Mold overheating beyond spec'));
    }
    if (snapshot.pressure > 120) {
      alerts.push(this.createAlert('warning', 'Hydraulic pressure drift', 'Check piston alignment and seals'));
    }
    if (defectProbability > 0.35) {
      alerts.push(
        this.createAlert(
          'critical',
          'Defect probability high',
          `Predictive model estimates ${(defectProbability * 100).toFixed(1)}%`
        )
      );
    }
    if (qualityScore < 75) {
      alerts.push(this.createAlert('warning', 'Quality score degrading', 'Auto-tuning algorithm engaged'));
    }

    this.buffer = [...alerts, ...this.buffer].slice(0, 20);
    return alerts;
  }

  createAlert(severity, title, description) {
    alertCounter += 1;
    return {
      id: `alert-${alertCounter}`,
      severity,
      title,
      description,
      timestamp: timestamp()
    };
  }

  getHistory() {
    return this.buffer;
  }
}

