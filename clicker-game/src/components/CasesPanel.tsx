import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../features/store/gameStore';
import styles from './CasesPanel.module.scss';
import { useState } from 'react';

const CASES = [
  {
    id: 'common',
    name: 'Common Case',
    cost: 100,
    rewards: [
      { min: 30, max: 80 },
      { min: 40, max: 90 },
      { min: 50, max: 100 },
    ],
  },
  {
    id: 'rare',
    name: 'Rare Case',
    cost: 500,
    rewards: [
      { min: 200, max: 400 },
      { min: 250, max: 450 },
      { min: 300, max: 500 },
    ],
  },
  {
    id: 'epic',
    name: 'Epic Case',
    cost: 2000,
    rewards: [
      { min: 1000, max: 1800 },
      { min: 1200, max: 2000 },
      { min: 1500, max: 2200 },
    ],
  },
] as const;

export const CasesPanel = () => {
  const { credits, spendCredits, addCredits, upgrades } = useGameStore();
  const [lastReward, setLastReward] = useState<number | null>(null);

  const openCase = (caseId: string) => {
    const caseData = CASES.find((c) => c.id === caseId);
    if (!caseData) return;

    if (spendCredits(caseData.cost)) {
      // Apply luck upgrade to increase chances of better rewards
      const luckBonus = 1 + upgrades.luck * 0.1;
      
      // Randomly select a reward
      const reward = caseData.rewards[Math.floor(Math.random() * caseData.rewards.length)];
      const amount = Math.floor(
        (reward.min + Math.random() * (reward.max - reward.min)) * luckBonus
      );

      addCredits(amount);
      setLastReward(amount);

      // Clear the reward display after 3 seconds
      setTimeout(() => {
        setLastReward(null);
      }, 3000);
    }
  };

  return (
    <motion.div
      className={styles.casesPanel}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Cases</h2>
      <div className={styles.casesList}>
        {CASES.map((caseData) => {
          const canAfford = credits >= caseData.cost;

          return (
            <motion.div
              key={caseData.id}
              className={`${styles.caseCard} ${!canAfford ? styles.disabled : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3>{caseData.name}</h3>
              <div className={styles.caseInfo}>
                <p>Cost: {caseData.cost} credits</p>
                <p>Possible rewards:</p>
                <ul>
                  {caseData.rewards.map((reward, index) => (
                    <li key={index}>
                      {reward.min}-{reward.max} credits
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => openCase(caseData.id)}
                disabled={!canAfford}
              >
                Open Case
              </button>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {lastReward !== null && (
          <motion.div
            className={styles.rewardDisplay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3>Reward!</h3>
            <p>You won {lastReward} credits!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 