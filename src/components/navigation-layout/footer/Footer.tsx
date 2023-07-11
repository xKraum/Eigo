import React from 'react';
import Icon from '../../icon/Icon';
import NavigationButton from '../../navigation-button/NavigationButton';
import './Footer.scss';

interface Footer {
  pages: { name: string; path: string; icon: string }[];
  selectedPagePathName: string;
  handleNavigationClick: (pathName: string) => any;
}

const Footer: React.FC<Footer> = ({
  pages,
  selectedPagePathName,
  handleNavigationClick,
}) => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {pages.map((page) => (
          <NavigationButton
            key={page.name}
            icon={<Icon name={page.icon} size={24} />}
            name={page.name}
            className={
              selectedPagePathName === page.path ? 'primary' : 'secondary'
            }
            onClick={() => handleNavigationClick(page.path)}
          />
        ))}
      </div>
    </footer>
  );
};

export default Footer;
