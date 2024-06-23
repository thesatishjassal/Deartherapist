import { useState, useEffect } from 'react';
import axios from 'axios';

const useAppointments = (clientId) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://93.127.199.158/api/clients/${clientId}/appointments`);
        setAppointments(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [clientId]);

  return { appointments, loading, error };
};

export default useAppointments;
