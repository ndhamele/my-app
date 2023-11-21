import React from 'react';
import { useNavigate } from 'react-router-dom';

type SidebarItemProps = {
  label: string;
  onClick: () => void;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ label, onClick }) => (
  <div style={styles.sidebarItem} onClick={onClick}>
    {label}
  </div>
);

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  // try fetching course data here

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div style={styles.sidebar}>
      <SidebarItem label="Account" onClick={() => handleNavigation('/account')} />
      <SidebarItem label="Dashboard" onClick={() => handleNavigation('/dashboard')} />
      {/* <SidebarItem label="Courses" onClick={() => handleNavigation('/courses')} /> */}
      {/* <SidebarItem label="Groups" onClick={() => handleNavigation('/groups')} /> */}
      <SidebarItem label="Calendar" onClick={() => handleNavigation('/calendar')} />
      <SidebarItem label="Inbox" onClick={() => handleNavigation('/inbox')} />
      {/* <SidebarItem label="History" onClick={() => handleNavigation('/history')} /> */}
      <SidebarItem label="Help" onClick={() => handleNavigation('/help')} />
      {/* Add more items as needed */}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
  },
  sidebar: {
    backgroundColor: '#2c3e50',
    width: '12%',
    height: '100vh',
    padding: '8% 0',
    // Add any other sidebar styling here
  },
  dashboard: {
    flex: '1', // This will make the dashboard take the remaining space
    padding: '20px', // Add padding or styling as needed
  },
  sidebarItem: {
    padding: '10px 15px',
    color: 'white',
    cursor: 'pointer',
  },
};
  

export default Sidebar;
