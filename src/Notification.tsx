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

function toLocalDateTimeString(date : any) {
  if (!date) return "";

  const pad = (num :any) => num.toString().padStart(2, "0");

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
    dateTime: new Date(), // Assuming you want to set the current date and time for the notification
    // Add other notification properties as required by your schema
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
        // Update the local state to reflect the change
        // You'll need to determine how you want to handle the state update based on your application's needs.
        // For example, you might toggle a flag in the assignment object indicating whether a notification is active.
        console.log("data", data);
        setNotifications(data.notifications);
      })
      .catch((error) => console.error("Error modifying notification:", error));
  }, []); // Empty array ensures this runs only on mount and not on updates

  //   if toogle is enable make notification enable and post to database

  // Function to open modal with the notification data
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
        // Check if prev is not null
        return {
          ...prev,
          [event.target.name]:
            event.target.type === "checkbox"
              ? event.target.checked
              : event.target.value,
        };
      }
      return prev; // Return prev as is if it's null
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
        .then((response) => response.json())
        .then((data) => {
          setNotifications((prev) =>
            prev.map((notif) =>
              notif._id === editingNotificationId
                ? { ...notif, ...editableNotification }
                : notif
            )
          );
          setEditingNotificationId(null);
          closeModal();
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
    <div className="notificationDiv">
        <div
          style={{
              transition: "all 0.5s ease",
            }}
            >
          <input
            type="checkbox"
            name="enabled"
            checked={newNotification.enabled}
            onChange={handleToggle}
          />
          <input
            type="datetime-local"
            name="dateTime"
            value={newNotification.dateTime}
            onChange={handleDateChange}
            />
          <button onClick={handleSubmit} style={{ cursor: "pointer" }}>
            Submit New Notification
          </button>
        </div>
        
          {notifications.map((notification, index) => (
            <div
              key={notification._id}
              className="notificationCard"
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "5px",
              }}
            >
              <p className="notificationCardItems">Notification {index + 1}</p>
              <p className="notificationCardItems">
                Date: {new Date(notification.dateTime).toLocaleString()}
              </p>
              <button
                type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
                onClick={() => handleEditClick(notification)}
                // className="notificationCardItems"
                // style={{
                //   cursor: "pointer",
                // //   padding: "5px 10px",
                //   backgroundColor: "#007BFF",
                //   color: "#fff",
                //   border: "none",
                //   borderRadius: "5px",
                // }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteNotification(notification)}
                style={{
                  cursor: "pointer",
                //   padding: "5px 10px",
                  backgroundColor: "#FF0000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                }}
                className="notificationCardItems"
              >
                Delete
              </button>
            </div>
          ))}

      {/* Modal for editing a notification */}
      {isModalOpen && editableNotification && (
        <div
          className="modal"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Modal content */}
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "80%",
              maxWidth: "500px",
            }}
          >
            <span
              className="close"
              onClick={closeModal}
              style={{ float: "right", cursor: "pointer" }}
            >
              &times;
            </span>
            <h2>Edit Notification</h2>
            <div>
              <input
                type="checkbox"
                name="enabled"
                checked={editableNotification?.enabled || false}
                onChange={handleNotificationChange}
              />
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
              <button
                onClick={handleUpdateNotification}
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifyNotification;
