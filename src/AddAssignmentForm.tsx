import React, { useState } from 'react';
import { Assignment } from './AssignmentList';

interface AddAssignmentFormProps {
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
}

const AddAssignmentForm: React.FC<AddAssignmentFormProps> = ({ setAssignments }) => {
  const [assignmentData, setAssignmentData] = useState({
    name: '',
    description: '',
    dueDate: '', // Make sure to handle date input appropriately
    points: 0,
    // Include other necessary fields
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/assignments', { // Use the correct API endpoint provided by your backend team
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assignmentData),
    })
    .then(response => response.json())
    .then(newAssignment => {
      setAssignments(prev => [...prev, newAssignment]);
    })
    .catch(error => console.error('Error adding assignment:', error));
  };

  // Handle changes for each input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAssignmentData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={assignmentData.name}
        onChange={handleChange}
        placeholder="Assignment Name"
        required
      />
      {/* Other input fields here */}
      <button type="submit">Add Assignment</button>
    </form>
  );
};

export default AddAssignmentForm;
