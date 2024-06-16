import { useState, useEffect } from 'react';

// Custom hook to filter appointments that match today's date
const useTodayAppointments = (clients) => {
const [allAppointments, setAllAppointments] = useState([]);

  useEffect(() => {
    const flattenAppointments = clients.reduce((acc, client) => {
      return acc.concat(client.appointments);
    }, []);

    // Set state with all appointments
    setAllAppointments(flattenAppointments);
  }, [clients]);

  return allAppointments;
};

export default useTodayAppointments;
