import { useState, useEffect } from "react";
import { format } from "date-fns";

const useTodayAppointments = (clients) => {
  const [allAppointments, setAllAppointments] = useState([]);

  useEffect(() => {
    if (clients && clients.length > 0) {
      // Flatten appointments from all clients
      const flattenAppointments = clients.reduce((acc, client) => {
        return acc.concat(client.appointments);
      }, []);

      // Format dates and times for display
      const formattedAppointments = flattenAppointments.map((appointment) => ({
        ...appointment,
        date: format(new Date(appointment.date), "dd-MM-yyyy"),
        time: format(new Date(appointment.time), "HH:mm a"),
      }));

      // Sort appointments by date in descending order (latest first)
      formattedAppointments.sort({ createdAt: -1 });

      setAllAppointments(formattedAppointments);
    }
  }, [clients]);

  return allAppointments;
};

export default useTodayAppointments;
