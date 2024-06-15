// app/patient-detail/[pid]/page.jsx
import React from 'react';

// Mock static data for demonstration
const patients = {
  '43534343': { id: '43534343', name: 'John Doe', age: 30, condition: 'Healthy' },
  '12345678': { id: '12345678', name: 'Jane Smith', age: 45, condition: 'Recovering' },
  // Add more patient data as needed
};

async function getPatientData(pid) {
  // Simulate fetching data based on pid
  return patients[pid] || null;
}

const PatientDetailPage = async ({ params }) => {
  const { pid } = params;
  const data = await getPatientData(pid);

  // If no data found, you can throw an error or return a not found component
  if (!data) {
    // You can also return a 404 page component here
    return <div>404: Patient not found</div>;
  }

  return (
    <div>
      <h1>Patient Detail for ID: {data.id}</h1>
      <p>Name: {data.name}</p>
      <p>Age: {data.age}</p>
      <p>Condition: {data.condition}</p>
    </div>
  );
};

export default PatientDetailPage;
