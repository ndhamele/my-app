import React, { useState, useEffect } from 'react';
import MediaCard from './MediaCard';
import DallEImage from './DALL_E.png';
import './styles.css';
import ErrorBoundary from './ErrorBoundary';
import { AuthContext } from './AuthContext';

// Define the types for your course and assignments
export interface Assignment {
  id: number;
  name: string;
  dueDate: Date;
}

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

// // Error Boundary Component
// class ErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError(error: Error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     console.error('Uncaught error:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <h1>Something went wrong. Please try again later.</h1>;
//     }
//     return this.props.children;
//   }
// }

// CanvasLMS Component
const CanvasLMS: React.FC<CanvasLMSProps> = ({ dashboardProps }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const { assignments } = dashboardProps;
  const [notifications, setNotifications] = useState<boolean[]>(new Array(assignments.length).fill(false));
  const authContext = React.useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve your token from localStorage
    if (!token) {
      console.error('No token found in storage');
      return;
    }
    const requestOptions = {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    };

    const headers = new Headers({
      'Authorization': `Bearer ${token}`,
    });

    fetch('http://172.20.6.239:3000/api/courses', { headers })
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
             console.log("data.courses", data.courses);
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

  const handleNotificationToggle = (index: number) => {
    const newNotifications = [...notifications];
    newNotifications[index] = !newNotifications[index];
    setNotifications(newNotifications);
  };

  // on click of course show assignments
  const handleCourse = () => {
    console.log('handleCourse');
  };

  return (
    <ErrorBoundary>
    <div className='CanvasLMS'>
      <div className='CanvasLMS-content'>
        <h2 style={{ textAlign: 'left', padding: '50px' }}>Dashboard!</h2>
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

