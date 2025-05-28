import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../features/store/gameStore';
import styles from './WheelOfFortune.module.scss';

const WHEEL_OPTIONS = [
  { type: 'effect', value: 'globalBoost', label: '2x Income (30s)' },
  { type: 'effect', value: 'globalBoost', label: '2x Income (45s)' },
  { type: 'effect', value: 'globalBoost', label: '2x Income (60s)' },
  { type: 'effect', value: 'virus', label: 'Virus (-50% Income)' },
  { type: 'effect', value: 'bug', label: 'Bug (30% Click Fail)' },
  { type: 'effect', value: 'ddos', label: 'DDoS (No Income)' },
  { type: 'nothing', value: 0, label: 'Try Again' },
  { type: 'nothing', value: 0, label: 'Try Again' },
] as const;

export const WheelOfFortune = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<typeof WHEEL_OPTIONS[number] | null>(null);
  const { credits, spendCredits, applyEffect, upgrades } = useGameStore();

  const spinCost = 50;
  const canAfford = credits >= spinCost;

  const handleSpin = () => {
    if (!canAfford || isSpinning) return;

    setIsSpinning(true);
    spendCredits(spinCost);

    // Apply luck upgrade to reduce chance of negative effects
    const luckBonus = 1 + upgrades.luck * 0.1;
    const randomIndex = Math.floor(Math.random() * WHEEL_OPTIONS.length);
    const selectedOption = WHEEL_OPTIONS[randomIndex];

    // Simulate spinning animation
    setTimeout(() => {
      setResult(selectedOption);
      setIsSpinning(false);

      // Apply the effect
      if (selectedOption.type === 'effect') {
        const duration = selectedOption.value === 'globalBoost' ? 
          (selectedOption.label.includes('45s') ? 45 : 
           selectedOption.label.includes('60s') ? 60 : 30) : 20;
        applyEffect(selectedOption.value, duration);
      }
    }, 2000);
  };

  return (
    <motion.div
      className={styles.wheelOfFortune}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Wheel of Fortune</h2>
      <div className={styles.wheelContainer}>
        <motion.button
          className={styles.spinButton}
          onClick={handleSpin}
          disabled={!canAfford || isSpinning}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            rotate: isSpinning ? 360 : 0,
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
        >
          {isSpinning ? 'Spinning...' : `Spin (${spinCost} credits)`}
        </motion.button>

        <AnimatePresence>
          {result && (
            <motion.div
              className={styles.result}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3>Result:</h3>
              <p>{result.label}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}; 