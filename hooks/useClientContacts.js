import { useState, useEffect } from 'react';

const useClientContacts = (apiUrl) => {
  const [contacts, setContacts] = useState({ mobileNumbers: [], emails: [] });
  const [wait, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Error fetching contacts: ${response.statusText}`);
        }
        const data = await response.json();
        const mobileNumbers = data.map(client => client.mobile);
        const emails = data.map(client => client.email);
        setContacts({ mobileNumbers, emails });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [apiUrl]);

  return { contacts, wait, error };
};

export default useClientContacts;
