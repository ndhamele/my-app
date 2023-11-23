import { FitScreen } from "@mui/icons-material";
import { AuthContext } from "./AuthContext";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Notification {
  assignmentId: string;
  dateTime: Date;
  _id: string;
  enabled: boolean;
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
  const authContext = React.useContext(AuthContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const token = localStorage.getItem("token");
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [dateTime, setDateTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [newNotification, setNewNotification] = useState({
    enabled: false,
    dateTime: new Date().toISOString().slice(0, 16),
  });
  const [editingNotificationId, setEditingNotificationId] = useState<
    string | null
  >(null);
  const [editableNotification, setEditableNotification] =
    useState<Notification | null>(null);
  const requestData = {
    assignment: assignmentId,
    dateTime: new Date(),
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [enabled, setEnabled] = useState(false);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewNotification({
      ...newNotification,
      enabled: event.target.checked,
    });
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewNotification({
      ...newNotification,
      dateTime: event.target.value,
    });
  };
  useEffect(() => {
    fetch(`http://172.20.6.239:3000/api/notifications/${assignmentId}`, {
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
    console.log("notification._id", notification._id);
    console.log("notification", notification);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNotificationId(null);
  };

  const handleNotificationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditableNotification((prev) => {
      if (prev) {
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

    fetch(`http://172.20.6.239:3000/api/notifications/${assignmentId}`, {
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
      const updateData = {
        ...editableNotification,
        dateTime: new Date(editableNotification.dateTime),
      };
      fetch(
        `http://172.20.6.239:3000/api/notifications/${editingNotificationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editableNotification),
        }
      )
        .then((response) => {
          response.json();
          if (response.ok) {
            window.alert("Notification updated successfully");
          } else {
            window.alert("Error updating notification");
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
    fetch(`http://172.20.6.239:3000/api/notifications/${notification._id}`, {
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
        closeModal();
        window.alert(data.message);
        window.location.reload();
      })
      .catch((error) => console.error("Error updating notification:", error));
  };

  return (
    <div className="row notificationDiv" style={{ marginTop:70}}>
      {}
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
                  Date: {new Date(notification.dateTime).toLocaleString()}
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
    </div>
  );
};

export default ModifyNotification;
