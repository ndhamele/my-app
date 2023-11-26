import React, { useState, useEffect } from 'react';
import MediaCard from './MediaCard';
import DallEImage from './DALL_E.png';
import './styles.css';
import ErrorBoundary from './ErrorBoundary';
import { Assignment } from './AssignmentList';
import { PORT } from './index';


interface DashboardProps {
  assignments: Assignment[];
  courseName: string;
}

export interface CanvasLMSProps {
  dashboardProps: DashboardProps;
  location: string;
  match: {
    path: string;
  };
}

type Course = {
  id: number;
  name: string;
  description: string;
  courseCode: string;
  instructor: string;
};

// CanvasLMS Component
const CanvasLMS: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  // const authContext = React.useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve your token from localStorage
    if (!token) {
      console.error('No token found in storage');
      return;
    }
    const headers = new Headers({
      'Authorization': `Bearer ${token}`,
    });

    fetch(`${PORT}/courses`, { headers })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
            // Maybe the data is in a property of the returned object?
            // e.g., if the API returns { courses: [...courses] }
            if (data.courses && Array.isArray(data.courses)) {
              setCourses(data.courses);
            } else {
              // Handle the error appropriately
              console.error('Data received is not an array:', data);
              // Set to an empty array or handle however you'd like
              setCourses([]);
            }
          } else {
            setCourses(data);
          }
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  return (
    <ErrorBoundary>
    <div className='container-fluid d-flex flex-row p-2'>
      <div>
        {/* use MediaCard to display courses */}
        {courses.map(course => (
          <MediaCard
            key={course.id}
            title={course.name}
            image={[DallEImage]} // You might want to replace this with an actual image from the course data
            description={course.description}
            courseCode={course.courseCode}
            instructor={course.instructor}
          />
        ))}
      </div>
    </div>
    </ErrorBoundary>
  );
};

export default CanvasLMS;

