import { useState, useEffect } from 'react';

const useGetClientById = (apiUrl, clientId) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!clientId) return;

    const fetchClient = async () => {
      setLoading(true);
      setError(null);
      setClient(null);
      try {
        const response = await fetch(`${apiUrl}/${Id}`);
        if (!response.ok) {
          throw new Error(`Error fetching client: ${response.statusText}`);
        }
        const data = await response.json();
        setClient(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [apiUrl, clientId]);

  return { client, loading, error };
};

export default useGetClientById;
