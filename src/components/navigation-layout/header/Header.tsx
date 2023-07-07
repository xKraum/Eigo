import React from 'react';
import logo from '../../../assets/img/logo/react-logo.png';
import IconButton from '../../icon-button/IconButton';
import Icon from '../../icon-button/icon/Icon';
import './Header.scss';

interface Header {
  pages?: { label: string; path?: string; icon: string }[];
  selectedPage?: number;
  handleNavigationClick?: (index: number) => any;
}

const Header: React.FC<Header> = ({
  pages = undefined,
  selectedPage = undefined,
  handleNavigationClick = undefined,
}) => {
  const loadNavigation = () => {
    const isHeaderNavigationDefined =
      pages && selectedPage !== undefined && handleNavigationClick;

    if (!isHeaderNavigationDefined) {
      return null;
    }

    return pages.map((page, index) => (
      <div className="header-button-container" key={page.label}>
        <IconButton
          name={page.label}
          className={selectedPage === index ? 'primary' : 'secondary'}
          onClick={() => handleNavigationClick(index)}
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
