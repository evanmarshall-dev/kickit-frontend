import {
  MapPin,
  Calendar,
  Edit2,
  Trash2,
  Check,
  Circle,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import styles from "./KickCard.module.scss";

const KickCard = ({ kick, onEdit, onDelete, onToggleStatus }) => {
  const navigate = useNavigate();
  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return styles.statusOpen;
      case "Completed":
        return styles.statusCompleted;
      default:
        return styles.statusOpen;
    }
  };

  const getNextStatus = (currentStatus) => {
    return currentStatus === "Open" ? "Completed" : "Open";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Open":
        return <Circle size={18} />;
      case "Completed":
        return <Check size={18} />;
      default:
        return <Circle size={18} />;
    }
  };

  const getStatusButtonTitle = (status) => {
    return status === "Open" ? "Mark as Completed" : "Reopen";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No target date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={styles.kickCard}>
      <div className={styles.kickCard__header}>
        <h3 className={styles.kickCard__title}>{kick.title}</h3>
        <span
          className={`${styles.kickCard__status} ${getStatusColor(
            kick.status
          )}`}>
          {kick.status}
        </span>
      </div>

      {kick.description && (
        <p className={styles.kickCard__description}>{kick.description}</p>
      )}

      <div className={styles.kickCard__meta}>
        {kick.location && (
          <div className={styles.kickCard__metaItem}>
            <MapPin size={16} />
            <span>{kick.location}</span>
          </div>
        )}
        {kick.targetDate && (
          <div className={styles.kickCard__metaItem}>
            <Calendar size={16} />
            <span>{formatDate(kick.targetDate)}</span>
          </div>
        )}
        {kick.category && (
          <div className={styles.kickCard__category}>{kick.category}</div>
        )}
      </div>

      <div className={styles.kickCard__actions}>
        <button
          className={styles.kickCard__actionBtn}
          onClick={() => navigate(`/kicks/${kick._id}`)}
          title='View Details'>
          <ExternalLink size={18} />
        </button>
        <button
          className={styles.kickCard__actionBtn}
          onClick={() => onToggleStatus(kick._id, getNextStatus(kick.status))}
          title={getStatusButtonTitle(kick.status)}>
          {getStatusIcon(kick.status)}
        </button>
        <button
          className={styles.kickCard__actionBtn}
          onClick={() => onEdit(kick)}
          title='Edit'>
          <Edit2 size={18} />
        </button>
        <button
          className={`${styles.kickCard__actionBtn} ${styles.kickCard__actionBtnDanger}`}
          onClick={() => onDelete(kick._id)}
          title='Delete'>
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default KickCard;
