import { motion } from 'framer-motion';
import { useGameStore } from '../features/store/gameStore';
import styles from './SkinsPanel.module.scss';

const SKINS = [
  {
    id: 'default',
    name: 'Default',
    cost: 0,
    colors: {
      primary: '#2196f3',
      secondary: '#4caf50',
      background: 'linear-gradient(45deg, #2196f3, #4caf50)',
      text: '#ffffff',
    },
  },
  {
    id: 'dark',
    name: 'Dark Theme',
    cost: 10,
    colors: {
      primary: '#bb86fc',
      secondary: '#03dac6',
      background: 'linear-gradient(45deg, #121212, #1e1e1e)',
      text: '#ffffff',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    cost: 10,
    colors: {
      primary: '#ff6b6b',
      secondary: '#ffd93d',
      background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)',
      text: '#ffffff',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    cost: 10,
    colors: {
      primary: '#00b4d8',
      secondary: '#0077b6',
      background: 'linear-gradient(45deg, #00b4d8, #0077b6)',
      text: '#ffffff',
    },
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    cost: 20,
    colors: {
      primary: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)',
      secondary: 'linear-gradient(45deg, #8b00ff, #4b0082, #0000ff, #00ff00, #ffff00, #ff7f00, #ff0000)',
      background: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)',
      text: '#ffffff',
    },
  },
] as const;

export const SkinsPanel = () => {
  const { duiktcoins, activeSkin, unlockedSkins, setActiveSkin, unlockSkin } = useGameStore();

  const handleSkinSelect = (skinId: string) => {
    if (unlockedSkins.includes(skinId)) {
      setActiveSkin(skinId);
      // Apply theme colors
      const skin = SKINS.find(s => s.id === skinId);
      if (skin) {
        document.documentElement.style.setProperty('--primary-color', skin.colors.primary);
        document.documentElement.style.setProperty('--secondary-color', skin.colors.secondary);
        document.documentElement.style.setProperty('--background-gradient', skin.colors.background);
        document.documentElement.style.setProperty('--text-color', skin.colors.text);
      }
    } else if (duiktcoins >= 10) {
      unlockSkin(skinId);
      setActiveSkin(skinId);
      // Apply theme colors
      const skin = SKINS.find(s => s.id === skinId);
      if (skin) {
        document.documentElement.style.setProperty('--primary-color', skin.colors.primary);
        document.documentElement.style.setProperty('--secondary-color', skin.colors.secondary);
        document.documentElement.style.setProperty('--background-gradient', skin.colors.background);
        document.documentElement.style.setProperty('--text-color', skin.colors.text);
      }
    }
  };

  return (
    <motion.div
      className={styles.skinsPanel}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Skins</h2>
      <div className={styles.skinsList}>
        {SKINS.map((skin) => {
          const isUnlocked = unlockedSkins.includes(skin.id);
          const isActive = activeSkin === skin.id;
          const canAfford = duiktcoins >= skin.cost;

          return (
            <motion.div
              key={skin.id}
              className={`${styles.skinCard} ${isActive ? styles.active : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSkinSelect(skin.id)}
            >
              <div
                className={styles.skinPreview}
                style={{
                  background: skin.colors.background,
                  borderColor: typeof skin.colors.primary === 'string' ? skin.colors.primary : '#ffffff',
                }}
              >
                <div
                  className={styles.colorSample}
                  style={{ background: skin.colors.primary }}
                />
                <div
                  className={styles.colorSample}
                  style={{ background: skin.colors.secondary }}
                />
              </div>
              <h3>{skin.name}</h3>
              {!isUnlocked && (
                <p className={styles.cost}>
                  {canAfford ? `Unlock for ${skin.cost} Duiktcoins` : 'Not enough Duiktcoins'}
                </p>
              )}
              {isActive && <span className={styles.activeLabel}>Active</span>}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}; 