import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../features/store/gameStore';
import styles from './SubmitScore.module.scss';

const SubmitScore = () => {
  const { credits, duiktcoins, submitScore } = useGameStore();
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await submitScore(playerName.trim());
      setPlayerName('');
    } catch (err) {
      setError('Failed to submit score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className={styles.submitScore}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Submit Your Score</h3>
      <div className={styles.currentScore}>
        <p>Credits: {credits.toLocaleString()}</p>
        <p>Duiktcoins: {duiktcoins.toLocaleString()}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
          maxLength={20}
          disabled={isSubmitting}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Score'}
        </button>
      </form>
    </motion.div>
  );
};

export default SubmitScore; 