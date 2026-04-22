function generateSensorReading() {
  const isTempFault = Math.random() < 0.05;
  const isPressureFault = Math.random() < 0.05;

  const tempBase = isTempFault ? 200 + (Math.random() * 20) : 170 + (Math.random() * 25);
  const pressureBase = isPressureFault ? 115 + (Math.random() * 10) : 90 + (Math.random() * 20);

  const temperature = parseFloat(tempBase.toFixed(2));
  const pressure = parseFloat(pressureBase.toFixed(2));
  const clampForce = parseFloat((180 + Math.random() * 40).toFixed(2));
  const cycleTime = parseFloat((40 + Math.random() * 15).toFixed(2));
  const qualityScore = parseFloat((82 + Math.random() * 17).toFixed(2));

  let defectProbability;
  if (temperature > 200 || pressure > 115) {
    defectProbability = parseFloat((15 + Math.random() * 10).toFixed(2));
  } else {
    defectProbability = parseFloat((2 + Math.random() * 8).toFixed(2));
  }

  const cureStatusRand = Math.random();
  let cureStatus;
  if (cureStatusRand < 0.7) {
    cureStatus = "CURING";
  } else if (cureStatusRand < 0.9) {
    cureStatus = "COOLING";
  } else {
    cureStatus = "IDLE";
  }

  let machineStatus = "STABLE";
  if (temperature > 200 || pressure > 115) {
    machineStatus = "FAULT";
  } else if (temperature > 195 || pressure > 110) {
    machineStatus = "WARNING";
  }

  return {
    machineId: 1,
    temperature,
    pressure,
    clampForce,
    cycleTime,
    qualityScore,
    defectProbability,
    cureStatus,
    machineStatus,
    timestamp: new Date().toISOString()
  };
}

module.exports = { generateSensorReading };
