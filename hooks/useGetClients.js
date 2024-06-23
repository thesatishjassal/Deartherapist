// useGetClients.js

import { useEffect, useState } from 'react';
import axios from 'axios';

const useGetClients = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://93.127.199.158/api/clients');
        setClients(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  return { clients, isLoading, error };
};

export default useGetClients;
