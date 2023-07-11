import { Dialog } from 'primereact/dialog';
import React, { ReactNode, useEffect } from 'react';

interface ModalProps {
  visible: boolean;
  onHideModal: () => void;
  closeOnMaskClick: boolean;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  onHideModal,
  closeOnMaskClick,
  children,
}) => {
  // NOTE: Close modal by clicking they grey background area (p-dialog-mask).
  useEffect(() => {
    if (closeOnMaskClick) {
      const handleDialogMaskClick = (event: MouseEvent) => {
        const modalMask = document.getElementsByClassName('p-dialog-mask')[0];
        if (modalMask && event.target === modalMask) {
          onHideModal();
        }
      };

      if (visible) {
        document.addEventListener('click', handleDialogMaskClick);
      }

      return () => document.removeEventListener('click', handleDialogMaskClick);
    }

    return undefined;
  }, [visible, closeOnMaskClick, onHideModal]);

  return (
    <div>
      {/* TODO: Implement rest props */}
      <Dialog
        header="Header"
        visible={visible}
        resizable={false}
        onHide={() => onHideModal()}
      >
        {children}
      </Dialog>
    </div>
  );
};

export default Modal;
