import { useState, useEffect } from "react";
import { format, parse } from "date-fns";

const useTodayAppointments = (clients) => {
  const [allAppointments, setAllAppointments] = useState([]);

  useEffect(() => {
    if (clients && clients.length > 0) {
      const flattenAppointments = clients.reduce((acc, client) => {
        return acc.concat(client.appointments);
      }, []);

      const formattedAppointments = flattenAppointments.map((appointment) => ({
        ...appointment,
        date: format(new Date(appointment.date), "dd-MM-yyyy"),
        time: format(new Date(appointment.time), "HH:mm a"),
        monthName: format(parse(appointment.date, "dd-MM-yyyy", new Date()), "MMMM"),
      }));

      setAllAppointments(formattedAppointments);
    }
  }, [clients]);

  return allAppointments;
};

export default useTodayAppointments;
