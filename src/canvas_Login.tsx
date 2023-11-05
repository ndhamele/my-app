import React, { useState } from 'react';
import { RouteProps  } from 'react-router-dom';
import MediaCard from './MediaCard';



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
    location: string; // Define location and other route props as needed
    match: {
      path: string;
    };
  }

const CanvasLMS: React.FC<CanvasLMSProps> = ({ dashboardProps }) => {
    const { assignments, courseName } = dashboardProps;
    const [notifications, setNotifications] = useState<boolean[]>(new Array(assignments.length).fill(false));

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
        <div className='CanvasLMS'>
            <div className='CanvasLMS-content'>
            <h2 style={{ textAlign: 'left', padding:'50px' }}>Welcome to {courseName} on Canvas LMS!</h2>
            {/* use mediacard to display courses */}
            <div style={{ flex: '1 0 25%', padding: 'none', left: 'none', flexWrap: 'wrap', marginLeft: '-350px' }} className="card__container">
                <MediaCard title="Sample Course" image={["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpRn0N2ODFLEUmIkQVjO4tBk5GC6Ifxqyw4w&usqp=CAU"]} description="Sample Description"  />
                <MediaCard title="Sample Course" image={["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpRn0N2ODFLEUmIkQVjO4tBk5GC6Ifxqyw4w&usqp=CAU"]} description="Sample Description" />
            </div>
            {/* <h2>Assignments:</h2> */}
            {/* <ul className="Assignments">
                {assignments.map((assignment, index) => (
                    <li key={assignment.id}>
                        {assignment.name} - Due: {assignment.dueDate.toLocaleDateString()}
                        <label>
                            <input type="checkbox" checked={notifications[index]} onChange={() => handleNotificationToggle(index)} />
                            Notify me when this assignment is due
                        </label>
                    </li>
                ))}
            </ul> */}
            </div>
        </div>
    );
};

export default CanvasLMS;
