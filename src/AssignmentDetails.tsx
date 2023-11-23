import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Assignment {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  points: number;
  _id: string;
   course: string;
}

const styles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  // justifyContent: 'center',
  padding: '2%',
  border: '1px solid #ddd',
  borderRadius: '5px',
  margin: '2%',
  marginTop: '6%',
  marginBottom: '18%', 
  backgroundColor: '#f9f9f9',
  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
  transition: '0.3s',
  width: '70%',
  marginLeft: 'auto',
  marginRight: 'auto',
  fontFamily: 'Arial, sans-serif',
};

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '2em',
  fontWeight: 'bold',
  color: '#444',
  marginBottom: '5%',
};

const descriptionStyle: React.CSSProperties = {
  fontSize: '1.2em',
  lineHeight: '1.6',
  color: '#666',
};
const buttonStyle: React.CSSProperties = {
  backgroundColor: '#008CBA',
  border: 'none',
  color: 'white',
  padding: '10px 20px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  margin: '4px 2px',
  cursor: 'pointer',
  width: '45%%', // Set a specific width
};

function AssignmentDetail() {
  const { course, id } = useParams();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const token = localStorage.getItem('token');

  const headers = new Headers({
    'Authorization': `Bearer ${token}`,
  });

  useEffect(() => {
    fetch(`http://172.20.6.239:3000/api/assignments/${course}/${id}`, {headers})
    .then(response => {
      console.log("response", response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log("response", response.json);
      return response.json();
    })
      .then(data => {
        console.log("data", data);
        setAssignment(data.assignment);
      })
      .catch(error => console.error('Error fetching assignment:', error));
  }, [course, id]);

  if (!assignment) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles}>
      <h2 style={titleStyle}>{assignment.name}</h2>
      <p style={descriptionStyle}>{assignment.description}</p>
      {/* Display other details here */}
      <div style={buttonContainerStyle}>
        <button style={buttonStyle}>Submit</button>
        <button style={buttonStyle} onClick={() => {/* Handle notification settings here */}}>
          Modify Notification
        </button>
      </div>
    </div>
  );
}

export default AssignmentDetail;