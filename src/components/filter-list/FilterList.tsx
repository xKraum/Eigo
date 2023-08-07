import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { RadioButton } from 'primereact/radiobutton';
import React, { useRef } from 'react';
import Icon from '../icon/Icon';
import './FilterList.scss';

interface FilterListProps {
  isAscending: boolean;
  onIsAscendingChange: (isAscending: boolean) => void;
}
const FilterList: React.FC<FilterListProps> = ({
  isAscending,
  onIsAscendingChange,
}) => {
  const menuElement = useRef<Menu>(null);

  const alphabeticalSortingItems = [
    {
      template: (
        <div>
          <div className="radio-option">
            <label htmlFor="alphabeticalAsc">Ascending</label>
            <RadioButton
              inputId="alphabeticalAsc"
              onChange={() => onIsAscendingChange(true)}
              checked={isAscending}
            />
          </div>
          <div className="radio-option">
            <label htmlFor="alphabeticalDesc">Descending</label>
            <RadioButton
              inputId="alphabeticalDesc"
              onChange={() => onIsAscendingChange(false)}
              checked={!isAscending}
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
        model={alphabeticalSortingItems}
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
