import React from 'react';
import { IWordData } from '../../interfaces/user/IUser';
import './WordCard.scss';

interface WordCardProps {
  wordData: IWordData;
}

const WordCard: React.FC<WordCardProps> = ({ wordData }) => {
  const {
    word = '',
    description = '',
    descriptionIndex,
    translations = [],
    level = 0,
  } = wordData;

  const translationsClassNames =
    description && translations?.length
      ? 'translations spaced'
      : 'translations';

  // NOTE: Use Fieldset?
  return (
    <div key={word + descriptionIndex} className="word-card">
      <div className="word-card__data">
        <div className="word">{word}</div>
        <div className="meaning">
          <div className="description">{description || '-'}</div>
          <div className={translationsClassNames}>
            {translations?.length ? translations.join(', ') : '-'}
          </div>
        </div>
      </div>
      <div className="word-card__level">{level}</div>
    </div>
  );
};

export default WordCard;
