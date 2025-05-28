import { motion } from 'framer-motion';
import { useGameStore } from './features/store/gameStore';
import { ClickerButton } from './components/ClickerButton';
import { UpgradesPanel } from './components/UpgradesPanel';
import { CasesPanel } from './components/CasesPanel';
import { PrestigePanel } from './components/PrestigePanel';
import { SkinsPanel } from './components/SkinsPanel';
import { SuperModeButton } from './components/SuperModeButton';
import { WheelOfFortune } from './components/WheelOfFortune';
import { Leaderboard } from './components/Leaderboard';
import SubmitScore from './components/SubmitScore';
import Notification from './components/Notification';
import styles from './App.module.scss';
import { useEffect } from 'react';

const App = () => {
  const { credits, duiktcoins, activeEffects, addCredits } = useGameStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        addCredits(1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [addCredits]);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Clicker Game</h1>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span>Credits: {credits.toLocaleString()}</span>
          </div>
          <div className={styles.stat}>
            <span>Duiktcoins: {duiktcoins.toLocaleString()}</span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.leftPanel}>
          <div className={styles.clickerSection}>
            <ClickerButton />
            <SuperModeButton />
          </div>
          <div className={styles.upgradesSection}>
            <UpgradesPanel />
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.casesSection}>
            <CasesPanel />
          </div>
          <div className={styles.wheelSection}>
            <WheelOfFortune />
          </div>
          <div className={styles.leaderboardSection}>
            <Leaderboard />
          </div>
          <div className={styles.prestigeSection}>
            <PrestigePanel />
          </div>
          <div className={styles.skinsSection}>
            <SkinsPanel />
          </div>
          <div className={styles.submitScoreSection}>
            <SubmitScore />
          </div>
        </div>
      </main>
      <Notification />
    </div>
  );
};

export default App; 