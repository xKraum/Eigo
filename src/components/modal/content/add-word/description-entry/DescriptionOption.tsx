import React from 'react';
import { IFormattedDescriptionEntry } from '../../../../../interfaces/formattedDictionary/IFormattedDictionary';
import './DescriptionOption.scss';

interface DescriptionItemProps {
  descriptionEntry: IFormattedDescriptionEntry;
  index: number;
  selected: boolean;
  onSelectDescription: () => void;
}

const DescriptionItem: React.FC<DescriptionItemProps> = ({
  descriptionEntry,
  index,
  selected,
  onSelectDescription,
}) => {
  const { description, translations } = descriptionEntry;

  const formattedDescription = description
    ? `${index + 1}. ${description}`
    : `${index + 1}.`;

  return (
    <div
      className={
        selected
          ? 'description-option-container selected'
          : 'description-option-container'
      }
      onClick={onSelectDescription}
    >
      <div className="description-container">{formattedDescription}</div>
      {translations && (
        <div className="translations-container">{translations.join(', ')}</div>
      )}
    </div>
  );
};

export default DescriptionItem;
