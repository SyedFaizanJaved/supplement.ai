import React from "react";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../components/ui/tooltip";
import styles from "./FamilyPlanPage.module.css";

const FamilyPlanPage = ({
  familyMembers,
  onAddFamilyMember,
  onUpdateFamilyMember,
  onRemoveFamilyMember,
}) => {
  const generateNewMember = () => ({
    id:
      Date.now().toString(36) +
      Math.random().toString(36).substring(2, 5),
    first_name: "",
    last_name: "",
    email: "",
    status: "Unregistered",
    joined_at: null,
  });

  const addFamilyMember = () => {
    onAddFamilyMember(generateNewMember());
  };

  const updateFamilyMember = (id, field, value) => {
    const updatedMember = familyMembers.find((member) => member.id === id);
    if (updatedMember) {
      onUpdateFamilyMember({ ...updatedMember, [field]: value });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h3>Want to help your family too?</h3>
        <div className={styles.mainSection}>
          <div className={styles.headerContainer}>
            <h1 className={styles.pageTitle}>
              Family Health Plan
              {/* Wrap your tooltip inside the provider */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {/* This button is the hover target */}
                    <button
                      className={styles.helpButton}
                      aria-label="Help Information"
                    >
                      <HelpCircle className={styles.helpIcon} />
                    </button>
                  </TooltipTrigger>
                  {/* This content is shown when the trigger is hovered */}
                  <TooltipContent className={styles.tooltipContent} sideOffset={2}>
                    <p>
                      After you input your health metrics, invite at least two
                      other family members to join and pay at a new rate of
                      $15/month for each member. They will get a sign up
                      confirmation link after payment.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h1>
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
                      onClick={() => onRemoveFamilyMember(member.id)}
                    >
                      <Trash2 className={styles.removeIcon} />
                    </button>
                  )}
                </div>
                <div className={styles.memberInputs}>
                  <div className={styles.nameInputGroup}>
                    <div>
                      <label htmlFor={`firstName-${member.id}`}>
                        First Name
                      </label>
                      <input
                        id={`firstName-${member.id}`}
                        value={member.first_name}
                        onChange={(e) =>
                          updateFamilyMember(
                            member.id,
                            "first_name",
                            e.target.value
                          )
                        }
                        placeholder="Enter first name"
                        className={styles.input}
                      />
                    </div>
                    <div>
                      <label htmlFor={`lastName-${member.id}`}>
                        Last Name
                      </label>
                      <input
                        id={`lastName-${member.id}`}
                        value={member.last_name}
                        onChange={(e) =>
                          updateFamilyMember(
                            member.id,
                            "last_name",
                            e.target.value
                          )
                        }
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
                      onChange={(e) =>
                        updateFamilyMember(member.id, "email", e.target.value)
                      }
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyPlanPage;