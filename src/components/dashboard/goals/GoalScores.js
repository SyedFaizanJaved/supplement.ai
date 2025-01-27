import React, { useState, useEffect } from "react";
import { supabase } from "../../integrations/supabase/client";
import { addGoalScore } from "../../../api/healthGoalsApi";
import { Trophy, TrendingUp, History } from "lucide-react";
import styles from './GoalScores.module.css';

export const GoalScores = ({ goalId }) => {
  const [scores, setScores] = useState([]);
  const [newScore, setNewScore] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchScores = async () => {
    const { data, error } = await supabase
      .from('goal_scores')
      .select('*')
      .eq('goal_id', goalId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching scores:', error);
      return;
    }

    setScores(data || []);
  };

  useEffect(() => {
    fetchScores();

    const channel = supabase
      .channel('goal_scores_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'goal_scores',
          filter: `goal_id=eq.${goalId}`
        },
        () => {
          fetchScores();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [goalId]);

  const showToast = (title, description, variant = 'default') => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddScore = async () => {
    if (!newScore || isNaN(Number(newScore))) {
      showToast("Invalid score", "Please enter a valid number between 0 and 100", "destructive");
      return;
    }

    const scoreValue = Number(newScore);
    if (scoreValue < 0 || scoreValue > 100) {
      showToast("Invalid score range", "Score must be between 0 and 100", "destructive");
      return;
    }

    setIsLoading(true);
    try {
      await addGoalScore(goalId, scoreValue);
      setNewScore("");
      showToast("Score added", "Your progress has been recorded successfully.");
    } catch (error) {
      console.error('Error adding score:', error);
      showToast("Error", "Failed to add score. Please try again.", "destructive");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCurrentScore = () => {
    return scores.length > 0 ? scores[0].score : 0;
  };

  return (
    <div className={styles.container}>
      {/* Current Score Section */}
      <div className={styles.currentScoreSection}>
        <div className={styles.currentScoreHeader}>
          <Trophy className={styles.trophyIcon} />
          <span className={styles.currentScoreTitle}>Current Score</span>
        </div>
        <div className={styles.currentScoreContent}>
          <span className={styles.currentScoreValue}>{getCurrentScore()}</span>
          <span className={styles.currentScoreMax}>/100</span>
        </div>
        <div className={styles.progressBar} style={{width: `${getCurrentScore()}%`}}></div>
      </div>

      {/* Add New Score Section */}
      <div className={styles.addScoreSection}>
        <TrendingUp className={styles.trendingIcon} />
        <input
          type="number"
          value={newScore}
          onChange={(e) => setNewScore(e.target.value)}
          placeholder="Enter score (0-100)"
          className={styles.scoreInput}
          min="0"
          max="100"
        />
        <button 
          onClick={handleAddScore} 
          disabled={isLoading}
          className={styles.addScoreButton}
        >
          Add Score
        </button>
      </div>

      {/* Score History Section */}
      <div className={styles.historySection}>
        <div className={styles.historyHeader}>
          <History className={styles.historyIcon} />
          <h5 className={styles.historyTitle}>Score History</h5>
        </div>
        <div className={styles.historyList}>
          {scores.map((score) => (
            <div 
              key={score.id}
              className={styles.historyItem}
            >
              <div className={styles.historyItemContent}>
                <div className={styles.scoreBadge}>{score.score}</div>
                <span className={styles.scoreDate}>
                  {formatDate(score.created_at)}
                </span>
              </div>
              <div 
                className={styles.historyItemProgress} 
                style={{width: `${score.score}%`}}
              ></div>
            </div>
          ))}
          {scores.length === 0 && (
            <p className={styles.noScoresMessage}>
              No scores recorded yet
            </p>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`${styles.toast} ${styles[`toast-${toast.variant}`]}`}>
          <div className={styles.toastTitle}>{toast.title}</div>
          <div className={styles.toastDescription}>{toast.description}</div>
        </div>
      )}
    </div>
  );
};