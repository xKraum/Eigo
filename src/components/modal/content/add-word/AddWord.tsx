import { AxiosError } from 'axios';
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast, ToastMessage } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDictionaryWordsDataCached } from '../../../../cache/cache';
import { IFormattedWordEntry } from '../../../../interfaces/formattedDictionary/IFormattedDictionary';
import { IWord, IWordData } from '../../../../interfaces/user/IUser';
import {
  addWord,
  updateWord,
} from '../../../../redux/features/user/wordsSlice';
import { RootState } from '../../../../redux/store';
import { addWordToUserList } from '../../../../services/api';
import { getClosestWords } from '../../../../utils/levenshteinDistance';
import { generateKey } from '../../../../utils/md5Util';
import './AddWord.scss';
import DescriptionItem from './description-entry/DescriptionOption';

interface AddWordProps {
  words: string[];
}

const AddWord: React.FC<AddWordProps> = ({ words }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const { words: userWords } = useSelector((state: RootState) => state.words);
  const dispatch = useDispatch();

  const [closestWords, setClosestWords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [wordEntry, setWordEntry] = useState<IFormattedWordEntry | null>(null);
  const [isWordBeingAdded, setIsWordBeingAdded] = useState(false);

  const focusElementRef = useRef<AutoComplete>(null);
  const toastRef = useRef<Toast>(null);

  // Focus AutoComplete component automatically
  useEffect(() => focusElementRef?.current?.focus(), []);

  const showToast = (toast: ToastMessage) => {
    if (toastRef?.current) {
      toastRef.current.show(toast);
    }
  };

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

  /**
   * Gets the first occurrence of a word in the userWords array.
   * @param {string} word - The word to search for in the userWords array.
   * @returns {IWord | undefined} The first occurrence of the word in the userWords array, or undefined if not found.
   */
  const getWordAlreadyAdded = (word: string): IWord | undefined => {
    const filteredWords = [...userWords].filter(
      (userWordObject) => userWordObject.word === word,
    );

    return filteredWords?.length ? filteredWords[0] : undefined;
  };

  /**
   * Checks if a given index is already present in the descriptionIndexes of the IWord object entries.
   * @param {IWord} wordObject - The word object to check for the descriptionIndex in its entries.
   * @param {number} index - The index to check.
   * @returns {boolean} True if the index is already present in the wordObject entries, otherwise false.
   */
  const isWordIndexAlreadyAdded = (wordObject: IWord, index: number) => {
    return wordObject.entries.some((wordData) => {
      return wordData.descriptionIndex === index;
    });
  };

  /**
   * Adds a word to the user's word list by adding it to the database and updating the state.
   */
  const handleAddWordToUserList = async () => {
    if (wordEntry && selectedIndex !== -1) {
      setIsWordBeingAdded(true);

      let wordObject = getWordAlreadyAdded(wordEntry.word);
      const isUpdate = !!wordObject;
      if (!!wordObject && isWordIndexAlreadyAdded(wordObject, selectedIndex)) {
        showToast({
          severity: 'error',
          summary: 'Error adding the word',
          detail: `You have already added that entry for the word '${wordEntry.word}' to your list.`,
        });
      } else {
        // Create the wordObject if is a new word.
        if (!wordObject) {
          wordObject = {
            word: wordEntry.word,
            entries: [],
          };
        }

        // Create the new entry.
        const newEntry: IWordData = {
          descriptionIndex: selectedIndex,
          categoryId: null,
          level: 0,
          lastCheckDate: null,
          totalAttempts: null,
          correctAnswersStreak: null,
          averageResponseTime: null,
        };

        // Update the entries in a new object to upload the entire object.
        const updatedWodObject: IWord = {
          ...wordObject,
          entries: [...wordObject.entries, newEntry],
        };

        // Sort the object's entries by index.
        updatedWodObject.entries.sort(
          (entryA, entryB) => entryA.descriptionIndex - entryB.descriptionIndex,
        );

        if (user) {
          // Add the object to the database.
          const { _id: userId } = user;
          const response = await addWordToUserList(userId, updatedWodObject);
          if (response?.status === 200) {
            // If the response is successful add/update the object in Redux.
            if (isUpdate) {
              dispatch(updateWord(updatedWodObject));
            } else {
              dispatch(addWord(updatedWodObject));
            }
            showToast({
              severity: 'success',
              summary: 'Word added successfully',
              detail: `You have successfully added the word '${wordEntry.word}' to your list.`,
            });
          } else {
            const axiosError = response as AxiosError<any>;
            const errorMessage =
              axiosError?.response?.data?.error ||
              'Something went wrong. Please, try again later.';
            showToast({
              severity: 'error',
              summary: 'Error adding the word',
              detail: errorMessage,
            });
          }
        }
      }
    }
    setIsWordBeingAdded(false);
  };

  return (
    <div className="add-word-container">
      <Toast ref={toastRef} />
      {isWordBeingAdded && <ProgressSpinner />}
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
        disabled={selectedIndex === -1 || isWordBeingAdded}
        onClick={handleAddWordToUserList}
        label="Save"
      />
    </div>
  );
};

export default AddWord;
