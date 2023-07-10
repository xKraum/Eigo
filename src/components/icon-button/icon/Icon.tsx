import React from 'react';
import * as PiIcons from 'react-icons/pi';
import { VscBlank } from 'react-icons/vsc';

interface Icon {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  title?: string;
}

/**
 * Wraps the React-Icons to get an icon from 'Phosphor Icons' based on its icon name.
 * @param name Icon name.
 * @returns A Phosphor Icon or an empty icon if the name is not found.
 */
const Icon: React.FC<Icon> = ({
  name,
  size = 24,
  color = undefined,
  className = undefined,
  title = '',
}) => {
  const PiIcon = PiIcons[name as keyof typeof PiIcons];
  return PiIcon ? (
    <PiIcon size={size} color={color} title={title} className={className} />
  ) : (
    <VscBlank size={size} title={title} className={className} />
  );
};

export default Icon;
