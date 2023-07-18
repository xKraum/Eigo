import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from 'primereact/autocomplete';
import React, { useEffect, useRef, useState } from 'react';
import { getClosestWords } from '../../../../utils/levenshteinDistance';

interface AddWordProps {
  words: string[];
}

const AddWord: React.FC<AddWordProps> = ({ words }) => {
  const [closestWords, setClosestWords] = useState<string[]>([]);
  const [value, setValue] = useState('');

  const focusElementRef = useRef<AutoComplete>(null);

  useEffect(() => {
    focusElementRef?.current?.focus();
  }, []);

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

  return (
    <div>
      <AutoComplete
        ref={focusElementRef}
        value={value}
        suggestions={closestWords}
        completeMethod={searchClosestWords}
        onChange={(e) => setValue(e.value)}
      />
    </div>
  );
};

export default AddWord;
