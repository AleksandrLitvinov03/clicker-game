import { motion } from 'framer-motion';
import { useGameStore } from '../features/store/gameStore';
import styles from './PrestigePanel.module.scss';

export const PrestigePanel = () => {
  const { credits, duiktcoins, resetGame } = useGameStore();
  const canPrestige = credits >= 1000;
  const prestigeAmount = Math.floor(credits / 1000);

  return (
    <motion.div
      className={styles.prestigePanel}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Prestige</h2>
      <div className={styles.prestigeInfo}>
        <p>Current Duiktcoins: {duiktcoins}</p>
        <p>Prestige Bonus: {Math.floor(duiktcoins / 3)}x base upgrade effectiveness</p>
        {canPrestige && (
          <p className={styles.prestigeAvailable}>
            You can prestige for {prestigeAmount} Duiktcoins!
          </p>
        )}
      </div>
      <motion.button
        className={styles.prestigeButton}
        onClick={resetGame}
        disabled={!canPrestige}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Prestige
      </motion.button>
    </motion.div>
  );
}; 