const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./db');
const sensorRoutes = require('./routes/sensors');
const machineRoutes = require('./routes/machines');
const maintenanceRoutes = require('./routes/maintenance');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://synapse1023.vercel.app',
    '*'
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/sensors', sensorRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/maintenance', maintenanceRoutes);

app.get('/', (req, res) => {
  res.json({
    message: "MoldSense IoT API Running",
    status: "OK",
    timestamp: new Date()
  });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await testConnection();
});
