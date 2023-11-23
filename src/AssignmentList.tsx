import React, { useState, useEffect, useContext } from "react";
import AddAssignmentForm from "./AddAssignmentForm"; // Make sure the path is correct
import CanvasLMS from "./canvas_Login";
import { AuthContext } from "./AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import { Link } from "react-router-dom";
import "./styles.css";
import modifyNotification from "./Notification";


export interface Assignment {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  points: number;
  _id: string;
  course: string;
  // Add other fields as per your schema
}

interface AssignmentListProps {
  isInstructor: boolean;
  courseCode?: string;
}

const AssignmentList: React.FC<AssignmentListProps> = ({ isInstructor }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const authContext = useContext(AuthContext);
  const isInst = authContext?.isInstructor;
  const token = localStorage.getItem("token");
  const { courseCode } = useParams();
  const navigate = useNavigate();

  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });

  useEffect(() => {
    fetch(`http://172.20.6.239:3000/api/assignments/${courseCode}`, { headers }) // Use the correct API endpoint provided by your backend team
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          // Maybe the data is in a property of the returned object?
          // e.g., if the API returns { courses: [...courses] }
          if (data.assignments && Array.isArray(data.assignments)) {
            setAssignments(data.assignments);
            console.log("data", data);
            console.log("data.assignments", data.assignments);
          } else {
            // Handle the error appropriately
            console.error("Data received is not an array:", data);
            // Set to an empty array or handle however you'd like
            setAssignments(data.assignments);
          }
        } else {
          setAssignments(data);
        }
      })
      .catch((error) => console.error("Error fetching assignments:", error));
  }, [courseCode]);

  if (!assignments) {
    return <div>Loading...</div>;
  }
  
  const modifyNotification = (assignmentId: string) => {
    console.log("assignmentId notificationnnnn", assignmentId);
    navigate(`/notifications/${assignmentId}`);
  };


  return (
    <div className="assignment-list">
      {isInstructor && <AddAssignmentForm setAssignments={setAssignments} />}
      <h2 style={{ marginTop: "-20%" }}>Assignments</h2>
      <table className="table">
        <thead>
          <tr>
            <th className="table name-column">Name</th>
            <th className="table description-column">Description</th>
            <th className="table due-date-column">Due Date</th>
            <th className="table points-column">Points</th>
            <th className="table button-column"></th>{" "}
            {/* This is for the button */}
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr className="" key={assignment._id}>
              <td className="name-column">
                <Link
                  to={`/assignments/${assignment.course}/${assignment._id}`}
                  className="assignment-title"
                >
                  {assignment.name}
                </Link>
              </td>
              <td className="description-column">{assignment.description}</td>
              <td className="due-date-column">
                {new Date(assignment.dueDate).toLocaleDateString()}
              </td>
              <td className="points-column">{assignment.points}</td>
              <td className="button-column">
                <button
                  className="modify-notification-button"
                  onClick={() =>
                    modifyNotification(assignment._id)}>
                  Modify Notification
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentList;
