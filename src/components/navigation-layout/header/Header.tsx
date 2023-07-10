import React from 'react';
import logo from '../../../assets/img/logo/react-logo.png';
import IconButton from '../../icon-button/IconButton';
import Icon from '../../icon-button/icon/Icon';
import './Header.scss';

interface Header {
  pages?: { name: string; path: string; icon: string }[];
  selectedPagePathName?: string;
  handleNavigationClick?: (pathName: string) => any;
}

const Header: React.FC<Header> = ({
  pages = undefined,
  selectedPagePathName = undefined,
  handleNavigationClick = undefined,
}) => {
  const loadNavigation = () => {
    const isHeaderNavigationDefined =
      pages && selectedPagePathName && handleNavigationClick;

    if (!isHeaderNavigationDefined) {
      return null;
    }

    return pages.map((page) => (
      <div className="header-button-container" key={page.name}>
        <IconButton
          name={page.name}
          className={
            selectedPagePathName === page.path ? 'primary' : 'secondary'
          }
          onClick={() => handleNavigationClick(page.path)}
        />
      </div>
    ));
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-content-left">
          <img className="header-logo" alt="Eigo" src={logo} />
          {loadNavigation()}
        </div>
        <div className="header-content-right">
          <div className="header-button-container">
            <IconButton
              icon={<Icon name="PiUser" size={24} />}
              className="secondary"
              onClick={() => undefined}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
