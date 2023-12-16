import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import IconButton from '../components/icon-button/IconButton';
import IconButtonProps from '../components/icon-button/IconButtonProps';
import IconProps from '../components/icon/IconProps';
import './CategoriesPage.scss';

interface CategoriesPageProps {
  icons: IconProps[];
}

const initializeIconButtons = (icons: IconProps[]): IconButtonProps[] => {
  if (icons) {
    return icons.map((icon): IconButtonProps => {
      return {
        icon,
        iconName: icon.name,
        visible: true,
      };
    });
  }

  return [];
};

const CategoriesPage: React.FC<CategoriesPageProps> = ({ icons }) => {
  const [searchText, setSearchText] = useState('');
  const [iconButtons, setIconButtons] = useState<IconButtonProps[]>(() =>
    initializeIconButtons(icons),
  );

  // TODO: Add a delay to change the icons visibility?
  const onSearch = (searchValue: string) => {
    const isSubstringIncludedInString = (string: string, substring: string) =>
      string.toLowerCase().includes(substring.toLowerCase());

    if (searchValue && searchValue.length > 2) {
      const formattedIconButtons = iconButtons.map((iconButton) => {
        const iconName = iconButton?.iconName || '';
        const isVisible = isSubstringIncludedInString(iconName, searchValue);
        return { ...iconButton, visible: isVisible };
      });

      setIconButtons(formattedIconButtons);
    } else {
      setIconButtons(
        iconButtons.map((iconButton) => ({ ...iconButton, visible: true })),
      );
    }

    setSearchText(searchValue);
  };

  return (
    <div className="categories-page">
      <h1 className="categories-page__page-title">Your Categories</h1>

      <h1 className="categories-page__page-title">All Categories</h1>
      <InputText
        className="search-input"
        value={searchText}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by word"
        maxLength={20}
      />
      <div className="categories-page__categories-container">
        {iconButtons.map(({ icon, iconName, visible }) => (
          <IconButton
            key={iconName}
            icon={icon}
            iconName={iconName}
            visible={visible}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
