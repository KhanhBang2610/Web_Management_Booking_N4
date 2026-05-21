import React from 'react';
import './Sidebar.css';

const Sidebar = ({ user, links = [], onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Dashboard</h2>
      </div>
      <nav>
        <ul className="sidebar-menu">
          {links.map((link) => (
            <li key={link.path} className="sidebar-menu-item">
              <a className="sidebar-menu-link" href={link.path}>
                <span className="sidebar-menu-icon">{link.icon}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {user && (
        <div className="sidebar-footer">
          <div className="sidebar-user">
            {user.avatar ? (
              <img className="sidebar-user-avatar" src={user.avatar} alt={user.fullName} />
            ) : (
              <div className="sidebar-user-avatar" />
            )}
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{user.fullName}</p>
              <p className="sidebar-user-role">{user.role}</p>
            </div>
          </div>
          {onLogout && (
            <button className="btn-delete" onClick={onLogout}>
              Đăng xuất
            </button>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
