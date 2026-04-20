const gaussian = () => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

export const generateSensorSnapshot = ({
  temperatureStress = 0,
  pressureStress = 0
} = {}) => {
  const temperature = 190 + gaussian() * 8 + temperatureStress;
  const pressure = 100 + gaussian() * 5 + pressureStress;
  const cycleTime = 40 + gaussian() * 2;
  const vibration = 5 + Math.abs(gaussian());
  const humidity = 50 + gaussian() * 4;

  // New simulated values for MoldSense IoT
  const clampForce = 200 + gaussian() * 5;
  const statusSeed = Math.random();
  let cureStatus = 'CURING';
  if (statusSeed > 0.7 && statusSeed <= 0.9) cureStatus = 'COOLING';
  else if (statusSeed > 0.9) cureStatus = 'IDLE';

  return {
    temperature: Number(temperature.toFixed(2)),
    pressure: Number(pressure.toFixed(2)),
    cycleTime: Number(cycleTime.toFixed(2)),
    vibration: Number(vibration.toFixed(2)),
    humidity: Number(humidity.toFixed(2)),
    clampForce: Number(clampForce.toFixed(2)),
    cureStatus,
    timestamp: new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  };
};

