import { useEffect } from 'react';
import { useGameStore } from '../features/store/gameStore';

export const useAutoClicker = () => {
  const { upgrades, addCredits } = useGameStore();

  useEffect(() => {
    const baseRate = 1; // Base rate of 1 credit per second
    const autoClickerLevel = upgrades.autoClicker;
    const synergyLevel = upgrades.autoClickerSynergy;
    
    // Calculate total auto-clicker rate
    const totalRate = baseRate * autoClickerLevel * (1 + synergyLevel);
    
    if (totalRate > 0) {
      const interval = setInterval(() => {
        addCredits(totalRate);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [upgrades.autoClicker, upgrades.autoClickerSynergy, addCredits]);
}; 