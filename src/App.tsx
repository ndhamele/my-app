import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import Login from './Login';
import Registration from './Registration';
import CanvasLMS from './Dashboard';
import { CanvasLMSProps, Assignment } from './Dashboard'; // Assuming these are exported from 'canvas_Login'
import Button from '@mui/material/Button';
import './styles.css';
import { AuthContext } from './AuthContext';
import Sidebar from './courseMenu';
import CourseModule from './Sidebar';
import AssignmentList from './AssignmentList';
import AssignmentDetail from './AssignmentDetails';
import ModifyNotification from './Notification';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import EditAssignment from './Edit_Assignment';
import AddAssignmentForm from './AddAssignmentForm';

function App() {
  const authContext = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const courseCode =useParams<{ courseCode: string }>();
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const navigate = useNavigate();

  const isInstructor = localStorage.getItem("role") === "Instructor";

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
    <div className="container-fluid">
      <nav className="navbar bg-primary" data-bs-theme="dark">
        <div className="container-fluid">
          {!authContext?.isLoggedIn && (
            <a className="navbar-brand" onClick={() => navigate("/")}>
            Canvas LMS
          </a>
          )}
          {authContext?.isLoggedIn && (
            <a className="navbar-brand" onClick={() => navigate("/dashboard")}>
              Canvas LMS
            </a>
          )}
          {authContext?.isLoggedIn ? (
            <Button color="inherit" onClick={authContext.logout}>
              Logout
            </Button>
          ) : (
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button color="inherit">Login</Button>
            </Link>
          )}
        </div>
      </nav>
      <div
        className={`content-container ${
          sidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        {authContext?.isLoggedIn && <Sidebar />}
        <Routes>
          <Route path="/" element={<Registration onRegister={() => {}} />} />
          <Route path="/login" element={<Login />} />{" "}
          {/* Pass handleLogin to Login component */}
          <Route
            path="/dashboard"
            element={<CanvasLMS {...canvasLMSProps} />}
          />
          <Route path="/course" element={<CourseModule />} />
          <Route
            path="/assignments/:courseCode"
            element={<AssignmentList isInstructor={isInstructor} />}
          />
          <Route
            path="/assignments/:course/:id"
            element={<AssignmentDetail />}
          />
          <Route
            path="assignments/:courseCode/:assignmentId/notifications/"
            element={<ModifyNotification />}
          />
          <Route
            path="/assignments/:courseCode/:assignmentId/edit"
            element={<EditAssignment />}
          />
          <Route
            path="/assignments/:courseCode/add"
            element={<AddAssignmentForm />}
          />
          {isInstructor && (
            <Route
              path="/assignments/:courseCode/new"
              element={<AssignmentList isInstructor={isInstructor} />}
            />
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
