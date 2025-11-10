import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import Button from "../Button/Button";
import styles from "./KickForm.module.scss";

const KickForm = ({ kick, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: kick?.title || "",
    description: kick?.description || "",
    location: kick?.location || "",
    category: kick?.category || "Travel",
    targetDate: kick?.targetDate ? new Date(kick.targetDate) : null,
    status: kick?.status || "Open",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      targetDate: date,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert date to ISO string for API
    const submitData = {
      ...formData,
      targetDate: formData.targetDate
        ? formData.targetDate.toISOString().split("T")[0]
        : "",
    };
    onSubmit(submitData);
  };

  return (
    <form className={styles.kickForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor='title' className={styles.formLabel}>
          Title <span className={styles.required}>*</span>
        </label>
        <input
          type='text'
          id='title'
          name='title'
          value={formData.title}
          onChange={handleChange}
          className={styles.formInput}
          required
          placeholder='e.g., Visit the Grand Canyon'
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor='description' className={styles.formLabel}>
          Description
        </label>
        <textarea
          id='description'
          name='description'
          value={formData.description}
          onChange={handleChange}
          className={styles.formTextarea}
          rows='4'
          placeholder='Describe your adventure...'
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor='location' className={styles.formLabel}>
            Location
          </label>
          <input
            type='text'
            id='location'
            name='location'
            value={formData.location}
            onChange={handleChange}
            className={styles.formInput}
            placeholder='e.g., Arizona, USA'
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor='category' className={styles.formLabel}>
            Category
          </label>
          <select
            id='category'
            name='category'
            value={formData.category}
            onChange={handleChange}
            className={styles.formSelect}>
            <option value='Travel'>Travel</option>
            <option value='Adventure'>Adventure</option>
            <option value='Skills'>Skills</option>
            <option value='Personal'>Personal</option>
            <option value='Career'>Career</option>
            <option value='Other'>Other</option>
          </select>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor='targetDate' className={styles.formLabel}>
            Target Date
          </label>
          <div className={styles.datePickerWrapper}>
            <Calendar className={styles.calendarIcon} size={20} />
            <DatePicker
              selected={formData.targetDate}
              onChange={handleDateChange}
              minDate={new Date()}
              dateFormat='MMMM d, yyyy'
              placeholderText='Select a target date'
              className={styles.formInput}
              showMonthDropdown
              showYearDropdown
              dropdownMode='select'
              id='targetDate'
            />
          </div>
        </div>

        {kick && (
          <div className={styles.formGroup}>
            <label htmlFor='status' className={styles.formLabel}>
              Status
            </label>
            <select
              id='status'
              name='status'
              value={formData.status}
              onChange={handleChange}
              className={styles.formSelect}>
              <option value='Open'>Open</option>
              <option value='Completed'>Completed</option>
            </select>
          </div>
        )}
      </div>

      <div className={styles.formActions}>
        <Button
          type='button'
          variant='secondary'
          onClick={onCancel}
          disabled={isLoading}>
          Cancel
        </Button>
        <Button type='submit' variant='primary' disabled={isLoading}>
          {isLoading ? "Saving..." : kick ? "Update Kick" : "Create Kick"}
        </Button>
      </div>
    </form>
  );
};

export default KickForm;
