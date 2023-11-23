import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import Registration from './Registration';
import CanvasLMS from './canvas_Login';
import { CanvasLMSProps, Assignment } from './canvas_Login'; // Assuming these are exported from 'canvas_Login'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import './styles.css';
import { AuthContext } from './AuthContext';
import Sidebar from './dashboard_Sidebar';
import CourseModule from './course_Module';
import AssignmentList from './AssignmentList';
import AssignmentDetail from './AssignmentDetails';
import ModifyNotification from './Notification';

function App() {
  const authContext = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const navigate = useNavigate();

  // get is Instructor and course Code
  const isInstructor = localStorage.getItem('role') === 'Instructor';
  
  // useEffect(() => {
  //   if (authContext && !authContext.isLoggedIn) {
  //     // If not logged in, redirect to login page
  //     navigate('/login');
  //   }
  // }, [authContext, authContext?.isLoggedIn, navigate]);
  const newAssignment: Assignment = {
    id: 1,
    name: "New Assignment",
    dueDate: new Date(),
  };

  const newAssignments: Assignment[] = [newAssignment];

  const dashboardProps = {
    assignments: newAssignments,
    courseName: "Sample Course",
  };

  const canvasLMSProps: CanvasLMSProps = {
    dashboardProps: dashboardProps,
    location: "Sample Location",
    match: { path: "Sample Path" },
  };

  return (
      <div className="App">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Canvas LMS
              </Typography>
              {authContext?.isLoggedIn ? (
                <Button color="inherit" onClick={authContext.logout}>Logout</Button>
              ) : (
                <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Button color="inherit">Login</Button>
                </Link>
              )}
            </Toolbar>
          </AppBar>
        </Box>
        <div className={`content-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {authContext?.isLoggedIn && (
          <Sidebar />
          )}
        <Routes>
          <Route path="/" element={<Registration onRegister={() => {}}/>} />
          <Route path="/login" element={<Login />} /> {/* Pass handleLogin to Login component */}
          <Route path="/dashboard" element={<CanvasLMS {...canvasLMSProps}/>} />
          {/* <Route path="/course" element={<CourseModule />} /> */}
          <Route path="/assignments/:courseCode" element={<AssignmentList isInstructor={isInstructor} />} />
          <Route path="/assignments/:course/:id" element={<AssignmentDetail />} />
          <Route path="/notifications/:assignmentId" element={<ModifyNotification/>} />
          {isInstructor && (
            <Route path="/assignments/:courseCode/new" element={<AssignmentList isInstructor={isInstructor} />} />
          )}
        </Routes>
      </div>
      </div>
  );
}

export default App;
