import React from 'react';
import IconButton from '../../icon-button/IconButton';
import Icon from '../../icon-button/icon/Icon';
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
          <div key={page.name}>
            <IconButton
              icon={<Icon name={page.icon} size={24} />}
              className={
                selectedPagePathName === page.path ? 'primary' : 'secondary'
              }
              onClick={() => handleNavigationClick(page.path)}
            />
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
