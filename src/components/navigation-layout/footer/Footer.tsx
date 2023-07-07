import React from 'react';
import IconButton from '../../icon-button/IconButton';
import Icon from '../../icon-button/icon/Icon';
import './Footer.scss';

interface Footer {
  pages: { label: string; path?: string; icon: string }[];
  selectedPage: number;
  handleNavigationClick: (index: number) => any;
}

const Footer: React.FC<Footer> = ({
  pages,
  selectedPage,
  handleNavigationClick,
}) => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {pages.map((page, index) => (
          <div key={page.label}>
            <IconButton
              icon={<Icon name={page.icon} size={24} />}
              className={selectedPage === index ? 'primary' : 'secondary'}
              onClick={() => handleNavigationClick(index)}
            />
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
