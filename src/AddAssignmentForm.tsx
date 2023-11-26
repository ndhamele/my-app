import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PORT } from "./index";

interface Assignment {
  name: string;
  description: string;
  dueDate: Date;
  points: number;
  // Add other fields as per your schema
}

const AddAssignmentForm: React.FC = () => {
  const { courseCode } = useParams<{ courseCode: string }>();
  const token = localStorage.getItem("token");
  const [assignmentData, setAssignmentData] = useState<Assignment>({
    name: "",
    description: "",
    dueDate: new Date(), // Initial date can be set to current date or left blank
    points: 0,
  });

  const formatDate = (date: Date) => {
    return date.toISOString().split(".")[0];
  };
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("assignmentData", assignmentData);
    console.log("courseCode", courseCode);
    fetch(`${PORT}/assignments/${courseCode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(assignmentData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("dataAdd", data);
        navigate(`/assignments/${courseCode}`);
      });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setAssignmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssignmentData({
      ...assignmentData,
      dueDate: new Date(e.target.value),
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Add Assignment</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Assignment Name:
          </label>
          <input
            type="text"
            name="name"
            value={assignmentData.name || ""}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description:
          </label>
          <textarea
            name="description"
            value={assignmentData.description || ""}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="dueDate" className="form-label">
            Due Date:
          </label>
          <input
            type="dateTime-local"
            name="dueDate"
            value={formatDate(assignmentData.dueDate)}
            onChange={handleDateChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="points" className="form-label">
            Points:
          </label>
          <input
            type="number"
            name="points"
            value={assignmentData.points || 0}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add Assignment
        </button>
      </form>
    </div>
  );
};

export default AddAssignmentForm;
