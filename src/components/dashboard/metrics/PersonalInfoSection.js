import { Input } from "../../ui/input";
import styles from './PersonalInfoSection.module.css';

export const PersonalInfoSection = ({
  isEditing,
  personalInfo,
  setPersonalInfo,
}) => {
  const handleSelectChange = (event) => {
    setPersonalInfo({ ...personalInfo, gender: event.target.value });
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Personal Information</h3>
      <div className={styles.fieldContainer}>
        <div className={styles.field}>
          <label className={styles.label}>Age</label>
          {isEditing ? (
            <Input
              value={personalInfo.age}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, age: e.target.value })
              }
              className={styles.input}
            />
          ) : (
            <p className={styles.value}>{personalInfo.age} years</p>
          )}
        </div>
        
        <div className={styles.field}>
          <label className={styles.label}>Gender</label>
          {isEditing ? (
            <select
              value={personalInfo.gender}
              onChange={handleSelectChange}
              className={styles.select}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          ) : (
            <p className={styles.value}>
              {personalInfo.gender.charAt(0).toUpperCase() + personalInfo.gender.slice(1)}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Height (feet' inches'')</label>
          {isEditing ? (
            <Input
              value={personalInfo.height}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, height: e.target.value })
              }
              className={styles.input}
            />
          ) : (
            <p className={styles.value}>{personalInfo.height}</p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Weight (lbs)</label>
          {isEditing ? (
            <Input
              value={personalInfo.weight}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, weight: e.target.value })
              }
              className={styles.input}
            />
          ) : (
            <p className={styles.value}>{personalInfo.weight}</p>
          )}
        </div>
      </div>
    </div>
  );
};