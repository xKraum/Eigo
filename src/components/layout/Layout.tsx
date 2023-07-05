import React, { ReactNode } from 'react';
import './Layout.scss';

interface Layout {
  isMobile: boolean;
  children: ReactNode;
}

const Layout: React.FC<Layout> = ({ isMobile, children }) => {
  return (
    <div className="layout-wrapper">
      <header className="header" />
      {children}
      {isMobile && <footer className="footer" />}
    </div>
  );
};

export default Layout;
