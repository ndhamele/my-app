import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles.css";

type SidebarItemProps = {
  label: string;
  onClick: () => void;
};

type courseModuleProps = {
  courseCode: string;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ label, onClick }) => (
  <div className="sidebarItem" onClick={onClick}>
    {label}
  </div>
);

const CourseModule = () => {
  // You can fetch the course content data here if needed
  const navigate = useNavigate();
  const { courseCode } = useParams<courseModuleProps>();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="course-sidebar">
      <SidebarItem
        label="Assignment"
        onClick={() => handleNavigation(`/assignments/${courseCode}`)}
      />
      <SidebarItem
        label="Discussion"
        onClick={() => handleNavigation("/course/Discussion")}
      />
      <SidebarItem
        label="Quiz"
        onClick={() => handleNavigation("/course/Quiz")}
      />
      <SidebarItem
        label="Files"
        onClick={() => handleNavigation("/course/Files")}
      />
      <SidebarItem
        label="Pages"
        onClick={() => handleNavigation("/course/Pages")}
      />
      <SidebarItem
        label="People"
        onClick={() => handleNavigation("/course/People")}
      />
      <SidebarItem
        label="Grades"
        onClick={() => handleNavigation("/course/Grades")}
      />
      <SidebarItem
        label="Syllabus"
        onClick={() => handleNavigation("/course/Syllabus")}
      />
      <SidebarItem
        label="Modules"
        onClick={() => handleNavigation("/course/Modules")}
      />
      <SidebarItem
        label="Outcomes"
        onClick={() => handleNavigation("/course/Outcomes")}
      />
      <SidebarItem
        label="Conferences"
        onClick={() => handleNavigation("/course/Conferences")}
      />
      <SidebarItem
        label="Collaborations"
        onClick={() => handleNavigation("/course/Collaborations")}
      />
      <SidebarItem
        label="Attendance"
        onClick={() => handleNavigation("/course/Attendance")}
      />
      <SidebarItem
        label="Settings"
        onClick={() => handleNavigation("/course/Settings")}
      />
      <SidebarItem
        label="Notifications"
        onClick={() => handleNavigation("/course/Notifications")}
      />
      <SidebarItem
        label="View Course"
        onClick={() => handleNavigation("/course/ViewCourse")}
      />
    </div>
  );
};

export default CourseModule;
