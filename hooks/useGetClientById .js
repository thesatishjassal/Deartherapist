import { useEffect, useState } from 'react';
import axios from 'axios';

const useGetClientById = (Id) => {
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5500/api/clients/${Id}`);
        setClient(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    if (Id) {
      fetchClient();
    }

  }, [Id]);

  return { client, isLoading, error };
};

export default useGetClientById;
