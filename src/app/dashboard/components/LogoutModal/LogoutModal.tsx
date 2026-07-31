import { X } from "lucide-react";
import styles from "./LogoutModal.module.scss";

interface LogoutModalProps {
  onClose: () => void;
  onLogout: () => void;
}

export default function LogoutModal({ onClose, onLogout }: LogoutModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={25} />
        </button>
        <h2 className={styles.modalTitle}>Logout</h2>
        <p className={styles.modalDescription}>
          Do you really want to log out?
        </p>
        <div className={styles.modalActions}>
          <button className={styles.modalButton} onClick={onClose}>
            CANCEL
          </button>
          <button
            className={styles.modalButton}
            onClick={() => {
              onClose();
              onLogout();
            }}
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}
