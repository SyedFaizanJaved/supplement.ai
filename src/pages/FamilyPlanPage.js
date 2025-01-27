import React, { useState } from 'react';
import { ChevronLeft, Plus, Trash2, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './FamilyPlanPage.module.css';

const FamilyPlanPage = () => {
  const navigate = useNavigate();
  const [familyMembers, setFamilyMembers] = useState([
    { id: '1', firstName: '', lastName: '', email: '' },
    { id: '2', firstName: '', lastName: '', email: '' }
  ]);

  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      { 
        id: Math.random().toString(36).substr(2, 9),
        firstName: '',
        lastName: '',
        email: ''
      }
    ]);
  };

  const removeFamilyMember = (id) => {
    if (familyMembers.length <= 2) return;
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
  };

  const updateFamilyMember = (id, field, value) => {
    setFamilyMembers(familyMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleContinueToPayment = () => {
    const primaryEmail = familyMembers[0].email;
    navigate(`/payment?email=${encodeURIComponent(primaryEmail)}&plan=family`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <button 
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className={styles.backIcon} />
          Back
        </button>
        
        <div className={styles.mainSection}>
          <div className={styles.headerContainer}>
            <h1 className={styles.pageTitle}>
              Family Health Plan
              <button 
                className={styles.helpButton}
                aria-label="Help Information"
              >
                <HelpCircle className={styles.helpIcon} />
              </button>
            </h1>
            <div className={styles.helpContent}>
              <p>
                After you input your health metrics, invite at least two other family members to join and pay at a new rate of $15/month for each member. They will get a sign up confirmation link after payment.
              </p>
            </div>
            <p className={styles.subtitle}>
              Bring Wellness to your Whole Family!
            </p>
          </div>

          <div className={styles.familyMembersContainer}>
            {familyMembers.map((member, index) => (
              <div key={member.id} className={styles.memberCard}>
                <div className={styles.memberHeader}>
                  <h3>Family Member {index + 1}</h3>
                  {familyMembers.length > 2 && (
                    <button 
                      className={styles.removeMemberButton}
                      onClick={() => removeFamilyMember(member.id)}
                    >
                      <Trash2 className={styles.removeIcon} />
                    </button>
                  )}
                </div>
                <div className={styles.memberInputs}>
                  <div className={styles.nameInputGroup}>
                    <div>
                      <label htmlFor={`firstName-${member.id}`}>First Name</label>
                      <input
                        id={`firstName-${member.id}`}
                        value={member.firstName}
                        onChange={(e) => updateFamilyMember(member.id, 'firstName', e.target.value)}
                        placeholder="Enter first name"
                        className={styles.input}
                      />
                    </div>
                    <div>
                      <label htmlFor={`lastName-${member.id}`}>Last Name</label>
                      <input
                        id={`lastName-${member.id}`}
                        value={member.lastName}
                        onChange={(e) => updateFamilyMember(member.id, 'lastName', e.target.value)}
                        placeholder="Enter last name"
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`email-${member.id}`}>Email</label>
                    <input
                      id={`email-${member.id}`}
                      type="email"
                      value={member.email}
                      onChange={(e) => updateFamilyMember(member.id, 'email', e.target.value)}
                      placeholder="Enter email address"
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button 
              className={styles.addMemberButton}
              onClick={addFamilyMember}
            >
              <Plus className={styles.addIcon} />
              Add Family Member
            </button>

            <button 
              className={styles.continueButton}
              onClick={handleContinueToPayment}
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyPlanPage;