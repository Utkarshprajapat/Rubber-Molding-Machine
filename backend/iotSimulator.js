async function sendSensorData() {
  try {
    const response = await fetch('http://localhost:5000/api/sensors/reading', {
      method: 'POST'
    });

    if (response.ok) {
        const data = await response.json();
        console.log(`📡 Sensor data sent: ${data.machineStatus} | Temp: ${data.temperature}°C | Pressure: ${data.pressure} psi`);
    } else {
        console.error("Failed to send sensor data:", response.status, response.statusText);
    }
  } catch (err) {
      console.error("Error sending sensor data. Ensure server is running.");
  }
}

setInterval(sendSensorData, 3000);
console.log("Starting IoT Simulator. Press Ctrl+C to stop.");
