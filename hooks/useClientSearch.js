import { useState, useEffect } from 'react';

const useClientSearch = (apiUrl) => {
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [client, setClient] = useState(null);
  const [clientsError, setClientsError] = useState(null);

  const fetchClients = async () => {
    setLoadingClients(true);
    setClientsError(null);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching clients: ${response.statusText}`);
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      setClientsError(error.message);
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [apiUrl]);

  const searchClients = (mobileNumber) => {
    if (!mobileNumber) {
      setClient(null);
      return;
    }

    const foundClient = clients.find(client => client.mobile === mobileNumber);
    setClient(foundClient || null);
  };

  return { clients, loadingClients, client, clientsError, searchClients };
};

export default useClientSearch;
