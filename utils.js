// utils.js
export const calculateTotalAmount = (appointments) => {
    return appointments
      .map(appointment => appointment.amount)
      .reduce((sum, current) => sum + current, 0);
  };
  