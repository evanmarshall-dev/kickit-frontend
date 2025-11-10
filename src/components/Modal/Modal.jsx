import { X } from "lucide-react";
import styles from "./Modal.module.scss";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.modal__header}>
          <h2 className={styles.modal__title}>{title}</h2>
          <button className={styles.modal__closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className={styles.modal__content}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
