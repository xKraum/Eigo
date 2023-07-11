import React, { ReactNode } from 'react';
import './NavigationButton.scss';

interface BaseNavigationButton {
  className?: string;
  onClick: () => void;
}

interface IconNavigationButton extends BaseNavigationButton {
  icon: ReactNode;
  name?: string;
}

interface NameNavigationButton extends BaseNavigationButton {
  icon?: ReactNode;
  name: string;
}

type NavigationButton = IconNavigationButton | NameNavigationButton;

const NavigationButton: React.FC<NavigationButton> = ({
  icon = undefined,
  name = undefined,
  className = undefined,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`navigation-button ${className}`}
      onClick={onClick}
    >
      {icon}
      {name}
    </button>
  );
};

export default NavigationButton;
