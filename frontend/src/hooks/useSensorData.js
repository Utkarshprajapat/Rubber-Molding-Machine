import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useSensorData = () => {
  const [liveData, setLiveData] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLiveReading = useCallback(async () => {
    try {
      // POST to generate and store new reading in DB
      const response = await api.sensors.postReading();
      if (response.success) {
        setLiveData(response.data);
        setIsConnected(true);
        setError(null);
        
        // Update history array (keep last 40 readings for chart)
        setHistory(prev => {
          const updated = [...prev, response.data];
          return updated.slice(-40);
        });
      }
    } catch (err) {
      setIsConnected(false);
      setError('Backend not reachable. Check if server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.sensors.getStats();
      if (response.success) setStats(response.data);
    } catch (err) {
      console.error('Stats fetch failed:', err);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const response = await api.sensors.getLatest();
      if (response.success && response.data.length > 0) {
        // Reverse so that the oldest is first, newest last
        setHistory(response.data.slice(0, 40).reverse());
      }
    } catch (err) {
      console.error('History load failed:', err);
    }
  }, []);

  useEffect(() => {
    // Load existing history from DB on mount
    loadHistory();
    fetchStats();
    
    // Start polling every 3 seconds
    fetchLiveReading();
    const interval = setInterval(() => {
      fetchLiveReading();
    }, 3000);

    // Fetch stats every 30 seconds
    const statsInterval = setInterval(fetchStats, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(statsInterval);
    };
  }, [fetchLiveReading, fetchStats, loadHistory]);

  return { liveData, history, stats, isConnected, error, loading };
};

export default useSensorData;
