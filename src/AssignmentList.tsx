import React, { useState, useEffect, useContext } from "react";
// import AddAssignmentForm from "./AddAssignmentForm"; // Make sure the path is correct
import { AuthContext } from "./AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./styles.css";
import CourseModule from "./Sidebar";
import { PORT } from "./index";

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
    fetch(`${PORT}/assignments/${courseCode}`, { headers }) // Use the correct API endpoint provided by your backend team
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

  const modifyNotification = (assignment: Assignment) => {
    navigate(`/assignments/${courseCode}/${assignment._id}/notifications`, {
      state: { assignment },
    });
  };

  const handleEdit = (assignment: Assignment) => {
    navigate(`/assignments/${courseCode}/${assignment._id}/edit`, {
      state: { assignment },
    });
  };

  return (
    <div
      className="container-fluid d-flex justify-content-start"
      style={{ marginTop: "2%" }}
    >
      <div className="d-inline">
        <CourseModule />
      </div>
      <div className="d-inline container-fluid ms-2">
        {/* {isInstructor && <AddAssignmentForm Assignments={Assignments} />} */}
        {isInst && (
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/assignments/${courseCode}/add`)}
          >
            Add Assignment
          </button>
        )}
        {/* <h2 style={{ marginTop: "-20%" }}>Assignments</h2> */}
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Due Date</th>
              <th scope="col">Points</th>
              <th scope="col"></th> {/* This is for the button */}
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
                  {<td>{new Date(assignment.dueDate).toLocaleString('en-US', { timeZone:'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>}
                </td>
                <td className="points-column">{assignment.points}</td>
                <td className="button-column">
                  {isInst && (
                    <button
                      className="btn btn-primary"
                      style={{ marginRight: "2%" }}
                      onClick={() => handleEdit(assignment)}
                    >
                      Edit
                    </button>
                  )}
                  {!isInst && (
                  <button
                    className="btn btn-primary"
                    onClick={() => modifyNotification(assignment)}
                  >
                    Modify Notification
                  </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentList;
