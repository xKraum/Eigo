import React from 'react';
import Icon from '../icon/Icon';
import './IconButton.scss';
import IconButtonProps from './IconButtonProps';

/**
 * React component that wraps an `Icon` within a button providing a clickable interface for icon actions.
 *
 *
 * @param icon The `Icon` to wrap.
 * @param iconName The name for the icon, displayed below it.
 * @param showIconName Determines whether to display the icon name.
 * @param visible Controls the visibility of the button.
 *
 * @returns The rendered IconButton component.
 */
const IconButton: React.FC<IconButtonProps> = ({
  icon,
  iconName = '',
  showIconName,
  visible,
}) => {
  const buttonClassName = `category-button ${visible ? '' : 'hide'}`;
  return (
    <button type="button" className={buttonClassName}>
      <Icon name={icon.name} size={icon.size} color={icon.color} />
      {showIconName && iconName && <span>{iconName}</span>}
    </button>
  );
};

export default IconButton;
