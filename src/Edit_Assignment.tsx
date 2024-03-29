import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { PORT } from "./index";
// import { format } from 'date-fns';

const EditAssignment: React.FC = () => {
  const location = useLocation();
  const assignment = location.state.assignment;
  const [name, setName] = useState(assignment.name);
  const [description, setDescription] = useState(assignment.description);
  const [dueDate, setDueDate] = useState(assignment.dueDate);
  const [points, setPoints] = useState(assignment.points);
  // const formattedDueDate = dueDate ? format(new Date(dueDate), 'yyyy-MM-dd') : '';
  const { courseCode } = useParams<{ courseCode: string }>();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  function toLocalDateTimeString(date: any) {
    if (!date) return "";
  
    const pad = (num: any) => num.toString().padStart(2, "0");
  
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // getMonth() returns 0-11
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleDueDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(event.target.value);
  };
  const handlePointsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPoints(parseInt(event.target.value));
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission and update assignment details
    // You can make an API call here to update the assignment details on the server
    fetch(`${PORT}/assignments/${assignment._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        description: description,
        dueDate: dueDate,
        points: points,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })

      .then((data) => {
        console.log("data", data);
        navigate(`/assignments/${courseCode}`);
      });
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <div className="row">
        <h1 className="mb-4">Edit Assignment</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleTitleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="dueDate" className="form-label">
              Due Date:
            </label>
            <input
              type="dateTime-local"
              id="dueDate"
              value={toLocalDateTimeString(new Date(dueDate))}
              onChange={handleDueDateChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="points" className="form-label">
              Points:
            </label>
            <input
              type="number"
              id="points"
              value={points}
              onChange={handlePointsChange}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAssignment;
