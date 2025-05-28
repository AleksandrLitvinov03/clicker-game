import { motion } from 'framer-motion';
import { useGameStore } from '../features/store/gameStore';
import styles from './SuperModeButton.module.scss';

export const SuperModeButton = () => {
  const { upgrades, activeEffects, activateSuperMode } = useGameStore();
  const superModeLevel = upgrades.superMode;
  const isActive = activeEffects.superMode;

  if (superModeLevel === 0) return null;

  return (
    <motion.button
      className={`${styles.superModeButton} ${isActive ? styles.active : ''}`}
      onClick={activateSuperMode}
      disabled={isActive}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isActive ? 'Super Mode Active!' : 'Activate Super Mode'}
    </motion.button>
  );
}; 