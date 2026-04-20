import { deriveBatchDelta } from './algorithms.js';

export class Sensor {
  constructor(type) {
    this.type = type;
  }

  read(value) {
    return {
      type: this.type,
      value,
      timestamp: Date.now()
    };
  }
}

export class ManufacturingUnit {
  constructor() {
    this.state = 'Idle';
    this.cpuUtilization = 0;
  }

  evaluate(snapshot, qualityScore) {
    const loadFactor = Number((snapshot.temperature / 220).toFixed(2));
    this.cpuUtilization = Math.min(99, Math.round(40 + loadFactor * 50));
    this.state = qualityScore > 85 ? 'Stable' : qualityScore > 70 ? 'Adaptive' : 'At Risk';

    return {
      state: this.state,
      throughput: Math.max(30, Math.round(60 / snapshot.cycleTime) * 10),
      loadBalance: Math.round(loadFactor * 100),
      energyUsage: Number((35 + loadFactor * 12).toFixed(1)),
      cpuUtilization: this.cpuUtilization,
      note: this.state === 'At Risk' ? 'Optimizer rerouting workloads' : 'Nominal routing via sensor bus'
    };
  }
}

export class ProductionBatch {
  constructor(batchId = 'Batch-042', targetOutput = 1200) {
    this.batchId = batchId;
    this.targetOutput = targetOutput;
    this.unitsProduced = 0;
  }

  update(snapshot) {
    this.unitsProduced += deriveBatchDelta(snapshot);
    const progress = Math.min(100, Math.round((this.unitsProduced / this.targetOutput) * 100));
    const qualityGate = progress > 66 ? 'Stage 3' : progress > 33 ? 'Stage 2' : 'Stage 1';

    return {
      batchId: this.batchId,
      unitsProduced: this.unitsProduced,
      targetOutput: this.targetOutput,
      progress,
      qualityGate,
      nextAction: progress > 90 ? 'Prep final QA' : 'Rubber curing in progress'
    };
  }
}

