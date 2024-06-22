import { useState, useEffect } from "react";
import { format } from "date-fns";

const useTodayAppointments = (clients) => {
  const [allAppointments, setAllAppointments] = useState([]);

  useEffect(() => {
    if (clients && clients.length > 0) {
      const flattenAppointments = clients.reduce((acc, client) => {
        return acc.concat(client.appointments);
      }, []);
      const formattedAppointments = flattenAppointments.map((appointment) => {
        if (appointment.facilitatedBy === "Counselor") {
          return {
            ...appointment,
            date: format(new Date(appointment.date), "dd-MM-yyyy"),
            time: format(new Date(appointment.time), "HH:mm a"),
          };
        } else {
          return null; // or undefined or {}
        }
      }).filter(appointment => appointment !== null); // Filter out appointments that are null
      setAllAppointments(formattedAppointments);
    }
  }, [clients]);

  return allAppointments;
};

export default useTodayAppointments;
