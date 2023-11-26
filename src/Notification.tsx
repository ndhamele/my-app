// import { FitScreen } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Assignment } from "./AssignmentList";
import { PORT } from "./index";

export interface Notification {
  assignmentId: string;
  dateTime: Date;
  _id: string;
  enabled: boolean;
  assignment?: Assignment;
  // Add other fields as per your schema
}

function toLocalDateTimeString(date: any) {
  if (!date) return "";

  const pad = (num: any) => num.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // getMonth() returns 0-11
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const ModifyNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const token = localStorage.getItem("token");
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [dateTime, setDateTime] = useState(toLocalDateTimeString(new Date()));
  const [newNotification, setNewNotification] = useState({
    enabled: false,
    dateTime: toLocalDateTimeString(new Date()),
  });
  const [editingNotificationId, setEditingNotificationId] = useState<
    string | null
  >(null);
  const [editableNotification, setEditableNotification] =
    useState<Notification | null>(null);
  const dueDate = useParams<{ dueDate: string }>();
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const [enabled, setEnabled] = useState(false);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnabled(event.target.checked);
    setNewNotification({
      ...newNotification,
      enabled: event.target.checked,
    });
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // check if date is valid
    const newDate = new Date(event.target.value);
    // Check if date is valid
    if (isNaN(newDate.getTime())) {
      window.alert("Please enter a valid date");
      return;
    } else {
      setDateTime(event.target.value);
      setNewNotification({
        ...newNotification,
        dateTime: event.target.value,
      });
    }
  };

  useEffect(() => {
    fetch(`${PORT}/notifications/${assignmentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("data", data);
        setNotifications(data.notifications);
      })
      .catch((error) => console.error("Error modifying notification:", error));
  }, []);
  const handleEditClick = (notification: Notification) => {
    setEditableNotification({ ...notification });
    setEditingNotificationId(notification._id);
  };

  const handleNotificationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditableNotification((prev) => {
      if (prev) {
        // If the input is a date, check if it's valid
        if (event.target.name === "dateTime") {
          const newDate = new Date(event.target.value);
          if (isNaN(newDate.getTime()) || event.target.value > dueDate) {
            window.alert("Please enter a valid date");
            return prev; // Return the previous state without changes
          }
        }

        return {
          ...prev,
          [event.target.name]:
            event.target.type === "checkbox"
              ? event.target.checked
              : event.target.value,
        };
      }
      return prev;
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const requestData = {
      assignment: assignmentId,
      dateTime: new Date(newNotification.dateTime),
      enabled: newNotification.enabled,
    };

    fetch(`${PORT}/notifications/${assignmentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...requestData,
        enabled: enabled,
        dateTime: new Date(dateTime),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          window.alert("Enter a valid Date and Time!");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("chekkkkkdata", data);
        window.alert(data.message);
        window.location.reload();
      })
      .catch((error) => console.error("Error modifying notification:", error));
  };

  const handleUpdateNotification = (event: React.FormEvent) => {
    event.preventDefault();
    if (editableNotification && editingNotificationId) {
      fetch(`${PORT}/notifications/${editingNotificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editableNotification),
      })
        .then((response) => {
          response.json();
          if (response.ok) {
            window.alert("Notification updated successfully");
          } else {
            window.alert("Enter a valid Date and Time!");
          }
        })
        .then((data) => {
          setNotifications((prev) =>
            prev.map((notif) =>
              notif._id === editingNotificationId
                ? { ...notif, ...editableNotification }
                : notif
            )
          );
          setEditingNotificationId(null);
          // window.location.reload();
        })
        .catch((error) => console.error("Error updating notification:", error));
    }
  };

  const handleDeleteNotification = (notification: Notification) => {
    // event.preventDefault();
    fetch(`${PORT}/notifications/${notification._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNotifications((prev) =>
          prev.filter((notif) => notif._id !== editingNotificationId)
        );
        setEditingNotificationId(null);
        window.alert(data.message);
        window.location.reload();
      })
      .catch((error) => console.error("Error updating notification:", error));
  };

  return (
    <div className="row notificationDiv" style={{ marginTop: 70 }}>
      {notifications.map((notification, index) => (
        <div className="col-sm-6 mb-3 mb-sm-0 notificationCard">
          <div className="card">
            <div className="card-body">
              <div
                className={`rounded-pill mb-2 ${
                  notification.enabled ? "text-bg-success" : "text-bg-danger"
                }`}
              >
                <h5 className="p-2 card-title">Notification {index + 1}</h5>
                <p className="p-2 card-text">
                  Date:{" "}
                  {new Date(notification.dateTime).toLocaleString("en-US", {
                    timeZone: "America/New_York",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary me-3"
                data-bs-toggle="modal"
                data-bs-target="#editModal"
                onClick={() => handleEditClick(notification)}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDeleteNotification(notification)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
      {
        <div
          className="modal fade"
          id="editModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Edit Notification
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    name="enabled"
                    type="checkbox"
                    checked={editableNotification?.enabled || false}
                    id="flexCheckDefault"
                    onChange={handleNotificationChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    {editableNotification?.enabled ? "Enabled" : "Disabled"}
                  </label>
                </div>
                <div>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    value={
                      editableNotification
                        ? toLocalDateTimeString(
                            new Date(editableNotification.dateTime)
                          )
                        : ""
                    }
                    onChange={handleNotificationChange}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleUpdateNotification}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      ;
      <div
        style={{
          display: "flex",
          justifyContent: "flex-center",
          padding: "1rem",
          width: "100%",
          height: "90px",
        }}
      >
        <button
          type="button"
          className="btn btn-outline-primary"
          data-bs-toggle="modal"
          data-bs-target="#addNotificationModal"
          style={{ fontSize: "1rem" }}
        >
          Add Notification
        </button>
      </div>
      <div
        className="modal fade"
        id="addNotificationModal"
        tabIndex={-1}
        aria-labelledby="addNotificationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addNotificationModalLabel">
                Add Notification
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="datetime-local"
                name="dateTime"
                value={dateTime}
                onChange={handleDateChange}
              />
              <input
                type="checkbox"
                name="enabled"
                checked={enabled}
                onChange={handleToggle}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyNotification;
