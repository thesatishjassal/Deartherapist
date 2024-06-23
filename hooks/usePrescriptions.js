const getAppointmentsPrescriptions = async (clientId, appointmentId) => {
    const url = `http://93.127.199.158/api/clients/${clientId}/appointments/${appointmentId}/prescriptions/`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const prescriptions = await response.json();
        return prescriptions;
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        return null;
    }
};

// Example usage:
const clientId = '666d8b02a0f3f0df132e4d7c';
const appointmentId = '666eda7c0a3f7e83ac127fd4';

getAppointmentsPrescriptions(clientId, appointmentId)
    .then(prescriptions => {
        if (prescriptions) {
            console.log('Prescriptions:', prescriptions);
            // Process prescriptions here
        } else {
            console.log('No prescriptions found.');
        }
    });
