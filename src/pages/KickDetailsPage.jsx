import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  User,
  Clock,
  Edit2,
  Trash2,
  MessageCircle,
  Send,
} from "lucide-react";
import { kickService } from "../services/kickService";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button/Button";
import Navbar from "../components/Navbar/Navbar";
import styles from "./KickDetailsPage.module.scss";

const KickDetailsPage = () => {
  const { kickId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [kick, setKick] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const fetchKickDetails = async () => {
    try {
      setLoading(true);
      const data = await kickService.fetchKickById(kickId);
      setKick(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching kick details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKickDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kickId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);
      await kickService.addComment(kickId, commentText);
      setCommentText("");
      await fetchKickDetails(); // Refresh to get updated comments
    } catch (err) {
      setError(err.message);
      console.error("Error adding comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await kickService.deleteComment(kickId, commentId);
      await fetchKickDetails(); // Refresh to get updated comments
    } catch (err) {
      setError(err.message);
      console.error("Error deleting comment:", err);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

  const handleUpdateComment = async (commentId) => {
    if (!editCommentText.trim()) return;

    try {
      await kickService.updateComment(kickId, commentId, editCommentText);
      setEditingCommentId(null);
      setEditCommentText("");
      await fetchKickDetails(); // Refresh to get updated comments
    } catch (err) {
      setError(err.message);
      console.error("Error updating comment:", err);
    }
  };

  const handleEdit = () => {
    navigate(`/dashboard`, { state: { editKick: kick } });
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this adventure? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await kickService.deleteKick(kickId);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      console.error("Error deleting kick:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    return status === "Completed" ? styles.statusCompleted : styles.statusOpen;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading adventure details...</p>
      </div>
    );
  }

  if (error || !kick) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error || "Kick not found"}</p>
        <Link to='/dashboard'>
          <Button variant='primary'>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isOwner = user && kick.author && user._id === kick.author._id;

  return (
    <div className={styles.detailsPage}>
      <Navbar />
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Link to='/dashboard' className={styles.backLink}>
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>

          {isOwner && (
            <div className={styles.actions}>
              <button onClick={handleEdit} className={styles.editBtn}>
                <Edit2 size={18} />
                <span>Edit</span>
              </button>
              <button onClick={handleDelete} className={styles.deleteBtn}>
                <Trash2 size={18} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {/* Kick Details Card */}
          <div className={styles.kickCard}>
            <div className={styles.kickHeader}>
              <div>
                <h1 className={styles.title}>{kick.title}</h1>
                <span
                  className={`${styles.status} ${getStatusColor(kick.status)}`}>
                  {kick.status}
                </span>
              </div>
            </div>

            {kick.description && (
              <div className={styles.section}>
                <p className={styles.description}>{kick.description}</p>
              </div>
            )}

            {/* Metadata Grid */}
            <div className={styles.metaGrid}>
              {kick.location && (
                <div className={styles.metaItem}>
                  <MapPin size={20} className={styles.metaIcon} />
                  <div>
                    <p className={styles.metaLabel}>Location</p>
                    <p className={styles.metaValue}>{kick.location}</p>
                  </div>
                </div>
              )}

              {kick.category && (
                <div className={styles.metaItem}>
                  <Tag size={20} className={styles.metaIcon} />
                  <div>
                    <p className={styles.metaLabel}>Category</p>
                    <p className={styles.metaValue}>{kick.category}</p>
                  </div>
                </div>
              )}

              {kick.targetDate && (
                <div className={styles.metaItem}>
                  <Calendar size={20} className={styles.metaIcon} />
                  <div>
                    <p className={styles.metaLabel}>Target Date</p>
                    <p className={styles.metaValue}>
                      {formatDate(kick.targetDate)}
                    </p>
                  </div>
                </div>
              )}

              {kick.author && (
                <div className={styles.metaItem}>
                  <User size={20} className={styles.metaIcon} />
                  <div>
                    <p className={styles.metaLabel}>Created By</p>
                    <p className={styles.metaValue}>
                      {kick.author.username || kick.author.name || "Unknown"}
                    </p>
                  </div>
                </div>
              )}

              {kick.createdAt && (
                <div className={styles.metaItem}>
                  <Clock size={20} className={styles.metaIcon} />
                  <div>
                    <p className={styles.metaLabel}>Created On</p>
                    <p className={styles.metaValue}>
                      {formatDateTime(kick.createdAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className={styles.commentsCard}>
            <div className={styles.commentsHeader}>
              <h2 className={styles.commentsTitle}>
                <MessageCircle size={24} />
                Comments ({kick.comments?.length || 0})
              </h2>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className={styles.commentForm}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder='Add a comment...'
                className={styles.commentInput}
                rows='3'
                disabled={submittingComment}
              />
              <Button
                type='submit'
                variant='primary'
                disabled={submittingComment || !commentText.trim()}>
                <Send size={16} />
                {submittingComment ? "Posting..." : "Post Comment"}
              </Button>
            </form>

            {/* Comments List */}
            <div className={styles.commentsList}>
              {kick.comments && kick.comments.length > 0 ? (
                kick.comments.map((comment) => {
                  const isCommentOwner =
                    user && comment.author && user._id === comment.author._id;
                  const isEditing = editingCommentId === comment._id;

                  return (
                    <div key={comment._id} className={styles.comment}>
                      <div className={styles.commentHeader}>
                        <div className={styles.commentAuthor}>
                          <User size={16} />
                          <span>
                            {comment.author?.username ||
                              comment.author?.name ||
                              "Unknown User"}
                          </span>
                        </div>
                        <div className={styles.commentMeta}>
                          <span className={styles.commentDate}>
                            {formatDateTime(comment.createdAt)}
                          </span>
                          {isCommentOwner && !isEditing && (
                            <>
                              <button
                                onClick={() => handleEditComment(comment)}
                                className={styles.editCommentBtn}
                                title='Edit comment'>
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className={styles.deleteCommentBtn}
                                title='Delete comment'>
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {isEditing ? (
                        <div className={styles.editCommentForm}>
                          <textarea
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className={styles.commentInput}
                            rows='3'
                          />
                          <div className={styles.editCommentActions}>
                            <Button
                              type='button'
                              variant='secondary'
                              onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                            <Button
                              type='button'
                              variant='primary'
                              onClick={() => handleUpdateComment(comment._id)}
                              disabled={!editCommentText.trim()}>
                              Update
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className={styles.commentText}>{comment.text}</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className={styles.noComments}>
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KickDetailsPage;
