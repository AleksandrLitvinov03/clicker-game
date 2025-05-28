import { motion } from 'framer-motion';
import { useGameStore } from '../features/store/gameStore';
import styles from './UpgradesPanel.module.scss';

const UPGRADES = [
  {
    id: 'autoClicker',
    name: 'Auto Clicker',
    description: 'Automatically generates 1 credit per second per level',
    baseCost: 10,
  },
  {
    id: 'clickValue',
    name: 'Click Value',
    description: 'Increases credits earned per click by 1 per level',
    baseCost: 10,
  },
  {
    id: 'autoClickerSynergy',
    name: 'Auto Clicker Synergy',
    description: 'Each level doubles auto-clicker effectiveness',
    baseCost: 15,
  },
  {
    id: 'superMode',
    name: 'Super Mode',
    description: 'Temporarily doubles click value (duration increases with level)',
    baseCost: 50,
  },
  {
    id: 'luck',
    name: 'Luck',
    description: 'Increases chance of positive events and decreases negative ones',
    baseCost: 20,
  },
] as const;

export const UpgradesPanel = () => {
  const { upgrades, credits, upgrade } = useGameStore();

  const getUpgradeCost = (baseCost: number, level: number) => {
    // Simple exponential cost scaling
    return Math.floor(baseCost * Math.pow(1.5, level));
  };

  return (
    <motion.div
      className={styles.upgradesPanel}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Upgrades</h2>
      <div className={styles.upgradesList}>
        {UPGRADES.map((upgradeInfo) => {
          const level = upgrades[upgradeInfo.id] || 0;
          const cost = getUpgradeCost(upgradeInfo.baseCost, level);
          const canAfford = credits >= cost;

          return (
            <motion.div
              key={upgradeInfo.id}
              className={`${styles.upgradeCard} ${!canAfford ? styles.disabled : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3>{upgradeInfo.name} (Level {level})</h3>
              <p>{upgradeInfo.description}</p>
              <div className={styles.upgradeFooter}>
                <span className={styles.cost}>{cost} credits</span>
                <button
                  onClick={() => upgrade(upgradeInfo.id as keyof typeof upgrades)}
                  disabled={!canAfford}
                >
                  Upgrade
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}; 