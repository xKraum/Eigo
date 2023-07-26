import { AxiosError } from 'axios';
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Toast, ToastMessage } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDictionaryWordsDataCached } from '../../../../cache/cache';
import { IFormattedWordEntry } from '../../../../interfaces/formattedDictionary/IFormattedDictionary';
import { addWord } from '../../../../redux/features/user/wordsSlice';
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
   * Checks if a word and its description entry is already added in the user's word list.
   *
   * @param word - The word to check if it is already added.
   * @param index - The index of the description for the word.
   * @returns True if the word is already added with the same description index; otherwise, false.
   */
  const isWordAlreadyAdded = (word: string, index: number) => {
    return userWords.some((userWordObject) => {
      const { word: userWord, descriptionIndex } = userWordObject;
      return userWord === word && descriptionIndex === index;
    });
  };

  /**
   * Adds a word to the user's word list by adding it to the database and updating the state.
   */
  const handleAddWordToUserList = async () => {
    if (wordEntry && selectedIndex !== -1) {
      setIsWordBeingAdded(true);

      if (isWordAlreadyAdded(wordEntry.word, selectedIndex)) {
        showToast({
          severity: 'error',
          summary: 'Error adding the word',
          detail: `You have already added that entry for the word '${wordEntry.word}' to your list.`,
        });
      } else {
        const wordObject = {
          word: wordEntry.word,
          descriptionIndex: selectedIndex,
          categoryId: null,
          level: 0,
          lastCheckDate: null,
          totalAttempts: null,
          correctAnswersStreak: null,
          averageResponseTime: null,
        };

        if (user) {
          const { _id: userId } = user;
          const response = await addWordToUserList(userId, wordObject);
          if (response?.status === 200) {
            dispatch(addWord(wordObject));
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
