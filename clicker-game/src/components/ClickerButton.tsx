import { motion } from 'framer-motion';
import { useGameStore } from '../features/store/gameStore';
import styles from './ClickerButton.module.scss';

export const ClickerButton = () => {
  const { addCredits, upgrades } = useGameStore();

  const handleClick = () => {
    // Ensure we're adding a whole number
    const clickValue = Math.max(1, upgrades.clickValue);
    addCredits(clickValue);
  };

  return (
    <motion.button
      className={styles.clickerButton}
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      initial={{ scale: 1 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 10
      }}
    >
      Click Me!
    </motion.button>
  );
}; 