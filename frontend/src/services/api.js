const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = {
  sensors: {
    postReading: async () => {
      const res = await fetch(`${BASE_URL}/sensors/reading`, { method: 'POST' });
      return res.json();
    },
    getLatest: async () => {
      const res = await fetch(`${BASE_URL}/sensors/latest`);
      return res.json();
    },
    getLatestByMachine: async (machineId) => {
      const res = await fetch(`${BASE_URL}/sensors/latest/${machineId}`);
      return res.json();
    },
    getStats: async () => {
      const res = await fetch(`${BASE_URL}/sensors/stats`);
      return res.json();
    }
  },
  machines: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/machines`);
      return res.json();
    },
    getById: async (id) => {
      const res = await fetch(`${BASE_URL}/machines/${id}`);
      return res.json();
    },
    updateStatus: async (id, status) => {
      const res = await fetch(`${BASE_URL}/machines/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return res.json();
    }
  },
  maintenance: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/maintenance`);
      return res.json();
    },
    create: async (data) => {
      const res = await fetch(`${BASE_URL}/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    }
  }
};

export default api;
