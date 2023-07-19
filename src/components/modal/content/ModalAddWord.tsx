import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import { getDictionaryWordsCached } from '../../../cache/cache';
import Icon from '../../icon/Icon';
import Modal from '../Modal';
import './ModalAddWord.scss';
import AddWord from './add-word/AddWord';

const ModalAddWord: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    const fetchWords = async () => {
      const dictionaryWords = await getDictionaryWordsCached();
      setWords(dictionaryWords);
    };

    fetchWords();
  }, []);

  const setModalState = (isModalVisible: boolean) => {
    setVisible(isModalVisible);
    setDisabled(isModalVisible);
  };

  const dialogSpecificProps = {
    header: 'Add a word',
    resizable: false,
  };

  return (
    <>
      <Button
        rounded
        text
        raised
        disabled={disabled}
        icon={<Icon name="PiPlusBold" size={18} />}
        className="add-button"
        onClick={() => setModalState(true)}
      />
      <Modal
        visible={visible}
        onHideModal={() => setModalState(false)}
        closeOnMaskClick={false}
        {...dialogSpecificProps}
      >
        <AddWord words={words} />
      </Modal>
    </>
  );
};

export default ModalAddWord;
