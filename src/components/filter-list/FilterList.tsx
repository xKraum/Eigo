import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { RadioButton } from 'primereact/radiobutton';
import React, { useRef } from 'react';
import Icon from '../icon/Icon';
import './FilterList.scss';

interface FilterListProps {
  isAlphabetical: boolean;
  isAscending: boolean;
  setIsAlphabetical: (isAlphabeticalSorting: boolean) => void;
  setIsAscending: (isAscending: boolean) => void;
}
const FilterList: React.FC<FilterListProps> = ({
  isAlphabetical,
  isAscending,
  setIsAlphabetical,
  setIsAscending,
}) => {
  const menuElement = useRef<Menu>(null);

  const handleSortingChange = (alphabetical: boolean, ascending: boolean) => {
    setIsAlphabetical(alphabetical);
    setIsAscending(ascending);
  };

  const sortingOptions = [
    {
      template: (
        <div>
          <div className="radio-option">
            <label htmlFor="alphabeticalAsc">{'Alphabetical (A > Z)'}</label>
            <RadioButton
              inputId="alphabeticalAsc"
              onChange={() => handleSortingChange(true, true)}
              checked={isAlphabetical && isAscending}
            />
          </div>
          <div className="radio-option">
            <label htmlFor="alphabeticalDesc">{'Alphabetical (Z > A)'}</label>
            <RadioButton
              inputId="alphabeticalDesc"
              onChange={() => handleSortingChange(true, false)}
              checked={isAlphabetical && !isAscending}
            />
          </div>
          <div className="radio-option">
            <label htmlFor="levelAsc">Level (Higher first)</label>
            <RadioButton
              inputId="levelAsc"
              onChange={() => handleSortingChange(false, true)}
              checked={!isAlphabetical && isAscending}
            />
          </div>
          <div className="radio-option">
            <label htmlFor="levelDesc">Level (Lower first)</label>
            <RadioButton
              inputId="levelDesc"
              onChange={() => handleSortingChange(false, false)}
              checked={!isAlphabetical && !isAscending}
            />
          </div>
        </div>
      ),
    },
    // NOTE: Separator: <li class="p-menu-separator" role="separator" data-pc-section="separator"></li>
  ];

  return (
    <div className="filter-list">
      <Menu
        ref={menuElement}
        model={sortingOptions}
        popup
        popupAlignment="right"
      />
      <Button
        text
        raised
        icon={<Icon name="PiSlidersBold" size={24} rotate={90} />}
        onClick={(event) => {
          if (menuElement?.current) {
            menuElement.current.toggle(event);
          }
        }}
      />
    </div>
  );
};

export default FilterList;
