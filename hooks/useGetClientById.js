import { useState, useEffect } from 'react';
import axios from 'axios';

const useGetClientById = (apiUrl, id) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await axios.get(`${apiUrl}/${id}`);
        setClient(response.data);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClient();
    } else {
      setLoading(false);  // Set loading to false if no ID is provided
    }
  }, [apiUrl, id]);

  return { client, loading, error };
};

export default useGetClientById;
