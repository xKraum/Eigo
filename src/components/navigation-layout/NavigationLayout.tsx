import React, { ReactNode, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationRoutes } from '../../constants/navigation';
import Footer from './footer/Footer';
import Header from './header/Header';

interface NavigationLayout {
  isMobile: boolean;
  children: ReactNode;
}

/**
 * Component used to wrap the page content to be displayed together with the Header and Footer components.
 * @param isMobile Boolean attribute to know if the page is rendered in mobile view.
 * @param children Page component to render together with the Header and Footer components.
 * @returns A NavigationLayout with the Header, the Page component and (if mobile) the Footer.
 */
const NavigationLayout: React.FC<NavigationLayout> = ({
  isMobile,
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedPagePathName, setSelectedPagePathName] = useState(
    location.pathname,
  );

  const isValidNavigationPath = (path: string): boolean => {
    return (
      path === NavigationRoutes.home.path ||
      path === NavigationRoutes.exam.path ||
      path === NavigationRoutes.list.path ||
      path === NavigationRoutes.categories.path
    );
  };

  const pages = Object.values(NavigationRoutes).filter((route) =>
    isValidNavigationPath(route.path),
  );

  const handleNavigationClick = (pathName: string) => {
    setSelectedPagePathName(pathName);
    navigate(pathName);
  };

  return (
    <div className="layout-wrapper">
      {isMobile ? (
        <Header />
      ) : (
        <Header
          pages={pages}
          selectedPagePathName={selectedPagePathName}
          handleNavigationClick={handleNavigationClick}
        />
      )}
      {children}
      {isMobile && (
        <Footer
          pages={pages}
          selectedPagePathName={selectedPagePathName}
          handleNavigationClick={handleNavigationClick}
        />
      )}
    </div>
  );
};

export default NavigationLayout;
