import { Button } from 'primereact/button';
import React, { ReactNode } from 'react';
import './IconButton.scss';

interface IconButton {
  icon?: ReactNode;
  name?: string;
  className?: string;
  onClick: () => void;
}

const IconButton: React.FC<IconButton> = ({
  icon = undefined,
  name = undefined,
  className = undefined,
  onClick,
}) => {
  const isLabel = name ? '' : 'no-label';

  return (
    <Button
      className={`icon-button ${className} ${isLabel}`}
      type="button"
      label={name}
      icon={icon}
      onClick={onClick}
    />
  );
};

export default IconButton;
