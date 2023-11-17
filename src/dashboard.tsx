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
    sidebar: {
      backgroundColor: '#2c3e50',
      width: '250px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column' as 'column', // Explicitly cast the type
      padding: '10px',
    },
    sidebarItem: {
      padding: '10px 15px',
      color: 'white',
      cursor: 'pointer',
    }
  };
  

export default Sidebar;
