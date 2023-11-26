import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";
import CanvasLMS from "./Dashboard";
// import { CanvasLMSProps } from './Dashboard'; // Assuming these are exported from 'canvas_Login'
import Button from "@mui/material/Button";
import "./styles.css";
import { AuthContext } from "./AuthContext";
import Sidebar from "./courseMenu";
import CourseModule from "./Sidebar";
import AssignmentList from "./AssignmentList";
import AssignmentDetail from "./AssignmentDetails";
import ModifyNotification from "./Notification";
import { Notification } from "./Notification";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import EditAssignment from "./Edit_Assignment";
import AddAssignmentForm from "./AddAssignmentForm";
import { PORT } from "./index";

function App() {
  const authContext = useContext(AuthContext);
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const isInstructor = localStorage.getItem("role") === "Instructor";

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch(`${PORT}/notifications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setNotifications(data.notifications);
    };

    // Fetch notifications immediately
    fetchNotifications();

    // Fetch notifications every minute
    const intervalId = setInterval(fetchNotifications, 600000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const oneMinuteFromNow = new Date(now.getTime() + 60000);

      // Check if notifications is an array
      if (Array.isArray(notifications)) {
        notifications.forEach((notification) => {
          const notificationDate = new Date(notification.dateTime);
          // Check if notification.assignment and dueDate are defined
          if (notification.assignment && notification.assignment.dueDate) {
            // Use assignment due date in the alert message
            const dueDate = new Date(notification.assignment.dueDate);
            if (
              notificationDate >= now &&
              notificationDate <= oneMinuteFromNow &&
              notification.enabled
            ) {
              window.alert(
                `Notification: ${
                  notification.assignment.name
                } is due at ${dueDate.toLocaleString()}`
              );
            }
          }
        });
      }
    };

    // Check notifications immediately
    checkNotifications();

    // Check notifications every minute
    const intervalId = setInterval(checkNotifications, 60000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [notifications]);

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
      <div className={`content-container`}>
        {authContext?.isLoggedIn && <Sidebar />}
        <Routes>
          <Route path="/" element={<Registration onRegister={() => {}} />} />
          <Route path="/login" element={<Login />} />{" "}
          {/* Pass handleLogin to Login component */}
          <Route path="/dashboard" element={<CanvasLMS />} />
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
