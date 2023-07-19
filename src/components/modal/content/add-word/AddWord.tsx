import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import React, { useEffect, useRef, useState } from 'react';
import { getDictionaryWordsDataCached } from '../../../../cache/cache';
import { IFormattedWordEntry } from '../../../../interfaces/formattedDictionary/IFormattedDictionary';
import { getClosestWords } from '../../../../utils/levenshteinDistance';
import { generateKey } from '../../../../utils/md5Util';
import './AddWord.scss';
import DescriptionItem from './description-entry/DescriptionOption';

interface AddWordProps {
  words: string[];
}

const AddWord: React.FC<AddWordProps> = ({ words }) => {
  const [closestWords, setClosestWords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [wordEntry, setWordEntry] = useState<IFormattedWordEntry | null>(null);

  const focusElementRef = useRef<AutoComplete>(null);

  // Focus AutoComplete component automatically
  useEffect(() => focusElementRef?.current?.focus(), []);

  const searchClosestWords = (event: AutoCompleteCompleteEvent) => {
    if (words && words.length) {
      const filteredWords = getClosestWords(
        event.query.toLocaleLowerCase(),
        words,
        5,
      );

      setClosestWords(filteredWords);
    }
  };

  /**
   * Handles the selection of a word by the user.
   * Adds the word object with its descriptions and translations.
   * Resets the selectedIndex to indicate no description is selected.
   * @param selectedWord The word selected by the user in the dropdown.
   */
  const handleSelectedWord = async (selectedWord: string) => {
    if (selectedWord) {
      const wordsEntriesResponse = await getDictionaryWordsDataCached([
        selectedWord,
      ]);

      if (wordsEntriesResponse?.length) {
        setWordEntry(wordsEntriesResponse[0]);
      }

      if (selectedIndex !== -1) {
        setSelectedIndex(-1);
      }
    }
  };

  const addWordToUser = () => {
    // TODO: Validations to see if the user have already added that word.
    if (wordEntry) {
      console.log('Adding... ', wordEntry.word, selectedIndex);
    }
  };

  return (
    <div className="add-word-container">
      <AutoComplete
        ref={focusElementRef}
        value={inputValue}
        suggestions={closestWords}
        completeMethod={searchClosestWords}
        onChange={(e) => setInputValue(e.value)}
        onSelect={(e) => handleSelectedWord(e.value)}
      />
      <div className="descriptions-option-container">
        {wordEntry?.entries &&
          wordEntry.entries.map((entry, index) => (
            <div key={generateKey(entry.description || index.toString())}>
              <DescriptionItem
                descriptionEntry={entry}
                index={index}
                selected={selectedIndex === index}
                onSelectDescription={() => setSelectedIndex(index)}
              />
            </div>
          ))}
      </div>
      <Button
        className="add-word-button"
        disabled={selectedIndex === -1}
        onClick={addWordToUser}
        label="Save"
      />
    </div>
  );
};

export default AddWord;
