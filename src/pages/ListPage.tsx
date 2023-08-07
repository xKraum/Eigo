import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDictionaryWordsDataCached } from '../cache/cache';
import FilterList from '../components/filter-list/FilterList';
import WordCard from '../components/word-card/WordCard';
import { IWord, IWordData } from '../interfaces/user/IUser';
import { RootState } from '../redux/store';
import { getUpdatedUserWords, sortByWordName } from '../utils/objectUtil';
import './ListPage.scss';

const ListPage: React.FC = () => {
  const { words } = useSelector((state: RootState) => state.words);
  const [wordList, setWordList] = useState<IWord[]>([]);
  const [isAscending, setIsAscending] = useState(true);

  useEffect(() => {
    const updateWords = async () => {
      const wordNames = words.map(({ word }) => word);
      const dictionaryUserWords = await getDictionaryWordsDataCached(wordNames);
      const updatedUserWords = await getUpdatedUserWords(
        words,
        dictionaryUserWords,
      );

      setWordList(sortByWordName(updatedUserWords, isAscending));
    };

    updateWords();
  }, [words]);

  useEffect(() => {
    const wordListCopy = [...wordList];
    setWordList(sortByWordName(wordListCopy, isAscending));
  }, [isAscending]);

  // NOTE: Speed Dial, Accordion?
  return (
    <div className="list-page">
      <div className="page-title">Word list</div>
      <FilterList
        isAscending={isAscending}
        onIsAscendingChange={setIsAscending}
      />
      {wordList.map(({ word, entries }: IWord) => {
        return entries.map((entry: IWordData) => {
          return (
            <WordCard key={word + entry.descriptionIndex} wordData={entry} />
          );
        });
      })}
    </div>
  );
};

export default ListPage;
