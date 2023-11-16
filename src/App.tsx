import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Registration from './Registration';
import CanvasLMS from './canvas_Login';
import { CanvasLMSProps } from './canvas_Login';
import { Assignment } from './canvas_Login';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import './styles.css';

function App() {
  const handleLogin = (username: string, password: string) => {
    window.location.href = '/login/dashboard';
    // Your login logic goes here
    console.log(`Logging in with username: ${username} and password: ${password}`);
    // Replace the console.log with your actual login logic
  };

  const newAssignment: Assignment = {
    id: 1,
    name: "New Assignment",
    dueDate: new Date(),
};

// add new assignment to assignments array
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
  // const location = useLocation();
  const path = window.location.pathname;

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
      <AppBar >
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          > */}
            {/* <MenuIcon /> */}
          {/* </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Canvas LMS
          </Typography>
          {path === '/login/dashboard' ? (
              <Button color="inherit">Logout</Button>
            ) : (
              <Button color="inherit">Login</Button>
            )}
        </Toolbar>
      </AppBar>
    </Box>
      <Router>
        <Routes>
        <Route path="/" element={<Registration onRegister={() => {}}/>} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path ="/login/dashboard" element={<CanvasLMS {...canvasLMSProps}/>} />
        <Route path="/login/dashboard/assignments" element={<CanvasLMS {...canvasLMSProps}/>} />
        </Routes>
      </Router>
      {/* <Registration onRegister={() => {}} /> */}
    </div>
  );
}

export default App;

