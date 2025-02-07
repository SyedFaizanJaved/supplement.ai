import styles from './HealthStatusSection.module.css';

export const HealthStatusSection = ({
  isEditing,
  personalInfo,
  setPersonalInfo,
}) => {
  const handleSelectChange = (event) => {
    setPersonalInfo({ ...personalInfo, exerciseLevel: event.target.value });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Health Status</h3>
      </div>

      <div className={styles.content}>
        <div className={styles.field}>
          <label className={styles.label}>Exercise Level</label>
          {isEditing ? (
            <select
              value={personalInfo.exerciseLevel}
              onChange={handleSelectChange}
              className={styles.select}
            >
              <option value="">Select exercise level</option>
              <option value="Sedentary">Sedentary</option>
              <option value="Moderately Active">Moderately Active</option>
              <option value="Active">Active</option>
              <option value="Very Active">Very Active</option>
            </select>
          ) : (
            <p className={styles.value}>
              {personalInfo.exerciseLevel.charAt(0).toUpperCase() + 
               personalInfo.exerciseLevel.slice(1)}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Current Medications</label>
          {isEditing ? (
            <textarea
              className={styles.textarea}
              value={personalInfo.medications}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, medications: e.target.value })
              }
              placeholder="List your current medications..."
            />
          ) : (
            <div className={styles.preformatted}>
              <pre className={styles.pre}>
                {personalInfo.medications}
              </pre>
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Existing Conditions</label>
          {isEditing ? (
            <textarea
              className={styles.textarea}
              value={personalInfo.conditions}
              onChange={(e) =>
                setPersonalInfo({...personalInfo, conditions: e.target.value })
              }
              placeholder="List any existing medical conditions..."
            />
          ) : (
            <div className={styles.preformatted}>
              <pre className={styles.pre}>
                {personalInfo.conditions}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};