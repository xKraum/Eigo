import React, { ReactNode, useState } from 'react';
import Footer from './footer/Footer';
import Header from './header/Header';

interface NavigationLayout {
  isMobile: boolean;
  children: ReactNode;
}

const NavigationLayout: React.FC<NavigationLayout> = ({
  isMobile,
  children,
}) => {
  const [selectedPage, setSelectedPage] = useState(0);

  const handleNavigationClick = (index: number) => {
    setSelectedPage(index);
  };

  const pages = [
    { label: 'Home', path: '/', icon: 'PiHouse' },
    { label: 'Exam', path: '/exam', icon: 'PiNote' },
    { label: 'Dictionary', path: '/dictionary', icon: 'PiBookBookmark' },
    { label: 'Categories', path: '/categories', icon: 'PiTag' },
  ];

  return (
    <div className="layout-wrapper">
      {isMobile ? (
        <Header />
      ) : (
        <Header
          pages={pages}
          selectedPage={selectedPage}
          handleNavigationClick={handleNavigationClick}
        />
      )}
      {children}
      {isMobile && (
        <Footer
          pages={pages}
          selectedPage={selectedPage}
          handleNavigationClick={handleNavigationClick}
        />
      )}
    </div>
  );
};

export default NavigationLayout;
