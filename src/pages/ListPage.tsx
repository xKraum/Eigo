import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDictionaryWordsDataCached } from '../cache/cache';
import FilterList from '../components/filter-list/FilterList';
import WordCard from '../components/word-card/WordCard';
import { IWordData } from '../interfaces/user/IUser';
import { RootState } from '../redux/store';
import {
  getListSorted,
  getUpdatedUserWords,
  getWordDataEntries,
} from '../utils/objectUtil';
import './ListPage.scss';

const ListPage: React.FC = () => {
  const { words } = useSelector((state: RootState) => state.words);
  const [wordDataList, setWordDataList] = useState<IWordData[]>([]);
  const [isAlphabetical, setIsAlphabetical] = useState(true);
  const [isAscending, setIsAscending] = useState(true);

  useEffect(() => {
    const updateWords = async () => {
      // Get a word name array from the user words.
      const wordNames = words.map(({ word }) => word);

      // Get the dictionary words (with descriptions and translations) from the dictionary, based on the user words.
      const dictionaryUserWords = await getDictionaryWordsDataCached(wordNames);

      // Get an updated user word list (adding the missing attributes with the dictionary ones).
      const updatedUserWords = await getUpdatedUserWords(
        words,
        dictionaryUserWords,
      );

      // Get the entries (IWordData) from the IWord objects.
      const wordDataEntries = getWordDataEntries(updatedUserWords);

      // Set the word entries sorted.
      setWordDataList(
        getListSorted(wordDataEntries, isAlphabetical, isAscending),
      );
    };

    updateWords();
  }, [words]);

  useEffect(() => {
    const wordDataListCopy = [...wordDataList];
    setWordDataList(
      getListSorted(wordDataListCopy, isAlphabetical, isAscending),
    );
  }, [isAlphabetical, isAscending]);

  // NOTE: Speed Dial, Accordion?
  return (
    <div className="list-page">
      <div className="page-title">Word list</div>
      <div className="data-control-panel">
        <FilterList
          isAlphabetical={isAlphabetical}
          isAscending={isAscending}
          setIsAlphabetical={setIsAlphabetical}
          setIsAscending={setIsAscending}
        />
      </div>
      {wordDataList.map(
        (entry: IWordData) =>
          entry.word && (
            <WordCard
              key={entry.word + entry.descriptionIndex}
              wordData={entry}
            />
          ),
      )}
    </div>
  );
};

export default ListPage;
