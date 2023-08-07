import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDictionaryWordsDataCached } from '../cache/cache';
import FilterList from '../components/filter-list/FilterList';
import WordCard from '../components/word-card/WordCard';
import { IWordData } from '../interfaces/user/IUser';
import { RootState } from '../redux/store';
import {
  filterWordDataByText,
  getListSorted,
  getUpdatedUserWords,
  getWordDataEntries,
} from '../utils/objectUtil';
import './ListPage.scss';

const ListPage: React.FC = () => {
  const { words } = useSelector((state: RootState) => state.words);
  const [wordDataList, setWordDataList] = useState<IWordData[]>([]);
  const [filteredWordDataList, setFilteredWordDataList] = useState<IWordData[]>(
    [],
  );
  const [isAlphabetical, setIsAlphabetical] = useState(true);
  const [isAscending, setIsAscending] = useState(true);
  const [searchText, setSearchText] = useState('');

  // Set all the user words in the wordDataList object.
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

      // Get the entries sorted.
      const sortedWordDataEntries = getListSorted(
        wordDataEntries,
        isAlphabetical,
        isAscending,
      );

      setWordDataList(sortedWordDataEntries);
    };

    updateWords();
  }, [words]);

  // Sort wordDataList based on the option selected.
  useEffect(() => {
    const wordDataListCopy = [...wordDataList];
    setWordDataList(
      getListSorted(wordDataListCopy, isAlphabetical, isAscending),
    );
  }, [isAlphabetical, isAscending]);

  // Update the filtered words based on the searchText whenever wordDataList changes.
  useEffect(() => {
    setFilteredWordDataList(
      filterWordDataByText([...wordDataList], searchText),
    );
  }, [wordDataList]);

  // Set filtered words based on the searchText attribute.
  useEffect(() => {
    setFilteredWordDataList(filterWordDataByText(wordDataList, searchText));
  }, [searchText]);

  // NOTE: Speed Dial, Accordion?
  return (
    <div className="list-page">
      <div className="page-title">Word list</div>
      <div className="data-control-panel">
        <InputText
          className="search-input"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          placeholder="Search by word"
          maxLength={20}
        />
        <FilterList
          isAlphabetical={isAlphabetical}
          isAscending={isAscending}
          setIsAlphabetical={setIsAlphabetical}
          setIsAscending={setIsAscending}
        />
      </div>
      {filteredWordDataList.map(
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
