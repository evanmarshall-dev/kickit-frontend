import { useState, useEffect } from "react";
import { Plus, Target } from "lucide-react";
import { kickService } from "../services/kickService";
import KickCard from "../components/KickCard/KickCard";
import Modal from "../components/Modal/Modal";
import KickForm from "../components/KickForm/KickForm";
import Button from "../components/Button/Button";
import Navbar from "../components/Navbar/Navbar";
import styles from "./DashboardPage.module.scss";

const DashboardPage = () => {
  const [kicks, setKicks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKick, setEditingKick] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchKicks();
  }, []);

  const fetchKicks = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await kickService.fetchKicks();
      console.log("Fetched kicks:", data);
      setKicks(data);
    } catch (err) {
      console.error("Error fetching kicks:", err);
      setError(err.message || "Failed to load kicks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKick = async (formData) => {
    try {
      setIsSubmitting(true);
      await kickService.createKick(formData);
      await fetchKicks();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message || "Failed to create kick");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateKick = async (formData) => {
    try {
      setIsSubmitting(true);
      await kickService.updateKick(editingKick._id, formData);
      await fetchKicks();
      setIsModalOpen(false);
      setEditingKick(null);
    } catch (err) {
      setError(err.message || "Failed to update kick");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteKick = async (kickId) => {
    try {
      await kickService.deleteKick(kickId);
      await fetchKicks();
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message || "Failed to delete kick");
    }
  };

  const handleToggleStatus = async (kickId, newStatus) => {
    try {
      await kickService.toggleStatus(kickId, newStatus);
      await fetchKicks();
    } catch (err) {
      setError(err.message || "Failed to update status");
    }
  };

  const openCreateModal = () => {
    setEditingKick(null);
    setIsModalOpen(true);
  };

  const openEditModal = (kick) => {
    setEditingKick(kick);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingKick(null);
  };

  return (
    <div className={styles.dashboard}>
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className={styles.dashboard__main}>
        <div className={styles.dashboard__header}>
          <div>
            <h1 className={styles.dashboard__title}>Your Kicks</h1>
            <p className={styles.dashboard__subtitle}>
              Track and manage your bucket list items
            </p>
          </div>
          <Button
            variant='primary'
            size='large'
            onClick={openCreateModal}
            className={styles.dashboard__createBtn}>
            <Plus size={20} />
            <span>Add Kick</span>
          </Button>
        </div>

        {error && (
          <div className={styles.dashboard__error}>
            {error}
            <button onClick={() => setError("")}>✕</button>
          </div>
        )}

        {isLoading ? (
          <div className={styles.dashboard__loading}>
            <div className={styles.spinner}></div>
            <p>Loading your kicks...</p>
          </div>
        ) : kicks.length === 0 ? (
          <div className={styles.dashboard__empty}>
            <Target size={64} className={styles.dashboard__emptyIcon} />
            <h2>No Kicks Yet</h2>
            <p>Start your journey by creating your first kick!</p>
            <Button variant='primary' size='large' onClick={openCreateModal}>
              <Plus size={20} />
              <span>Create Your First Kick</span>
            </Button>
          </div>
        ) : (
          <div className={styles.dashboard__grid}>
            {kicks.map((kick) => (
              <KickCard
                key={kick._id}
                kick={kick}
                onEdit={openEditModal}
                onDelete={(kickId) => setDeleteConfirm(kickId)}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingKick ? "Edit Kick" : "Create New Kick"}>
        <KickForm
          kick={editingKick}
          onSubmit={editingKick ? handleUpdateKick : handleCreateKick}
          onCancel={closeModal}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title='Delete Kick'>
        <div className={styles.confirmDialog}>
          <p>Are you sure you want to delete this kick?</p>
          <p className={styles.confirmDialog__warning}>
            This action cannot be undone.
          </p>
          <div className={styles.confirmDialog__actions}>
            <Button variant='secondary' onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={() => handleDeleteKick(deleteConfirm)}
              className={styles.confirmDialog__deleteBtn}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
