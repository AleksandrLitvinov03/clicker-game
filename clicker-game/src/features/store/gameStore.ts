import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../../lib/supabase';

interface GameState {
  credits: number;
  duiktcoins: number;
  upgrades: {
    autoClicker: number;
    clickValue: number;
    autoClickerSynergy: number;
    superMode: number;
    luck: number;
  };
  activeSkin: string;
  unlockedSkins: string[];
  activeEffects: {
    superMode: boolean;
    virus: boolean;
    bug: boolean;
    ddos: boolean;
    globalBoost: boolean;
  };
  lastSave: number;
  notifications: string[];
}

interface GameActions {
  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => boolean;
  addDuiktcoins: (amount: number) => void;
  upgrade: (upgradeType: keyof GameState['upgrades']) => void;
  activateSuperMode: () => void;
  applyEffect: (effect: keyof GameState['activeEffects'], duration: number) => void;
  removeEffect: (effect: keyof GameState['activeEffects']) => void;
  unlockSkin: (skinId: string) => void;
  setActiveSkin: (skinId: string) => void;
  resetGame: () => void;
  submitScore: (playerName: string) => Promise<void>;
  addNotification: (message: string) => void;
  removeNotification: (index: number) => void;
}

const INITIAL_STATE: GameState = {
  credits: 0,
  duiktcoins: 0,
  upgrades: {
    autoClicker: 0,
    clickValue: 1,
    autoClickerSynergy: 0,
    superMode: 0,
    luck: 0,
  },
  activeSkin: 'default',
  unlockedSkins: ['default'],
  activeEffects: {
    superMode: false,
    virus: false,
    bug: false,
    ddos: false,
    globalBoost: false,
  },
  lastSave: Date.now(),
  notifications: [],
};

const CASE_REWARDS = {
  common: {
    credits: {
      min: 5,
      max: 15,
      chance: 0.7,
    },
    duiktcoins: {
      min: 0,
      max: 1,
      chance: 0.3,
    },
    jackpot: {
      credits: 100,
      duiktcoins: 5,
      chance: 0.05,
    },
  },
  rare: {
    credits: {
      min: 15,
      max: 40,
      chance: 0.7,
    },
    duiktcoins: {
      min: 1,
      max: 3,
      chance: 0.3,
    },
    jackpot: {
      credits: 300,
      duiktcoins: 10,
      chance: 0.05,
    },
  },
  epic: {
    credits: {
      min: 40,
      max: 100,
      chance: 0.7,
    },
    duiktcoins: {
      min: 2,
      max: 5,
      chance: 0.3,
    },
    jackpot: {
      credits: 1000,
      duiktcoins: 20,
      chance: 0.05,
    },
  },
  legendary: {
    credits: {
      min: 100,
      max: 250,
      chance: 0.7,
    },
    duiktcoins: {
      min: 5,
      max: 10,
      chance: 0.3,
    },
    jackpot: {
      credits: 2500,
      duiktcoins: 50,
      chance: 0.05,
    },
  },
} as const;

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      addCredits: (amount) => {
        try {
          // Validate input
          if (typeof amount !== 'number' || isNaN(amount)) {
            console.log('Invalid amount received:', amount);
            amount = 1;
          }

          const state = get();
          const { activeEffects, upgrades, duiktcoins } = state;
          
          // Ensure all values are valid numbers
          const superModeLevel = typeof upgrades.superMode === 'number' ? upgrades.superMode : 0;
          
          // Calculate base amount
          let finalAmount = Math.max(1, amount);

          // Apply prestige bonus (each duiktcoin adds 1 credit per click)
          const prestigeBonus = duiktcoins;
          finalAmount += prestigeBonus;

          // Apply effects
          if (activeEffects.ddos) {
            console.log('DDoS active, setting amount to 0');
            finalAmount = 0;
          } else {
            if (activeEffects.superMode) {
              // Super Mode now gives 2x base multiplier + 0.5x per level
              const multiplier = 2 + (superModeLevel * 0.5);
              finalAmount = Math.floor(finalAmount * multiplier);
              console.log('Super Mode active, multiplier:', multiplier, 'new amount:', finalAmount);
            }
            if (activeEffects.globalBoost) {
              finalAmount = Math.floor(finalAmount * 2);
              console.log('Global Boost active, new amount:', finalAmount);
            }
            if (activeEffects.virus) {
              finalAmount = Math.floor(finalAmount / 2);
              console.log('Virus active, new amount:', finalAmount);
            }
            if (activeEffects.bug && Math.random() < 0.3) {
              finalAmount = 0;
              console.log('Bug triggered, setting amount to 0');
            }
          }

          // Ensure finalAmount is a valid number
          if (typeof finalAmount !== 'number' || isNaN(finalAmount)) {
            console.log('Invalid finalAmount, resetting to 1');
            finalAmount = 1;
          }

          // Update credits
          set((state) => {
            const currentCredits = typeof state.credits === 'number' && !isNaN(state.credits) ? state.credits : 0;
            const newCredits = currentCredits + finalAmount;
            
            // Final validation of new credits
            const validNewCredits = typeof newCredits === 'number' && !isNaN(newCredits) ? newCredits : currentCredits;
            
            return { credits: Math.max(0, validNewCredits) };
          });
        } catch (error) {
          console.error('Error in addCredits:', error);
          // Reset credits to 0 if something goes wrong
          set({ credits: 0 });
        }
      },

      spendCredits: (amount) => {
        try {
          if (typeof amount !== 'number' || isNaN(amount)) {
            return false;
          }

          const state = get();
          const currentCredits = typeof state.credits === 'number' && !isNaN(state.credits) ? state.credits : 0;

          if (currentCredits >= amount) {
            set((state) => ({
              credits: Math.max(0, state.credits - amount)
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error('Error in spendCredits:', error);
          return false;
        }
      },

      addDuiktcoins: (amount) => {
        try {
          if (typeof amount !== 'number' || isNaN(amount)) {
            return;
          }
          set((state) => ({
            duiktcoins: state.duiktcoins + amount
          }));
        } catch (error) {
          console.error('Error in addDuiktcoins:', error);
        }
      },

      upgrade: (upgradeType) => {
        try {
          const state = get();
          const currentLevel = state.upgrades[upgradeType] || 0;
          const baseCost = 10 * Math.pow(2, currentLevel);
          const discount = Math.floor(state.duiktcoins * 0.1 * baseCost);
          const cost = Math.max(1, baseCost - discount);

          if (state.credits >= cost) {
            set((state) => ({
              credits: state.credits - cost,
              upgrades: {
                ...state.upgrades,
                [upgradeType]: currentLevel + 1
              }
            }));
          }
        } catch (error) {
          console.error('Error in upgrade:', error);
        }
      },

      activateSuperMode: () => {
        try {
          const { activeEffects, upgrades } = get();
          const superModeLevel = upgrades.superMode;
          
          // Only activate if not already active
          if (!activeEffects.superMode) {
            // Calculate duration based on level (30 seconds base + 15 seconds per level)
            const duration = (30 + (superModeLevel * 15)) * 1000;
            
            // Activate Super Mode
            set((state) => ({
              activeEffects: { ...state.activeEffects, superMode: true },
            }));

            // Set timeout to deactivate Super Mode
            const timeoutId = setTimeout(() => {
              set((state) => ({
                activeEffects: { ...state.activeEffects, superMode: false },
              }));
            }, duration);

            // Store the timeout ID to clear it if needed
            return () => clearTimeout(timeoutId);
          }
        } catch (error) {
          console.error('Error in activateSuperMode:', error);
        }
      },

      applyEffect: (effect, duration) => {
        try {
          const effectDuration = effect === 'ddos' ? 20 : duration;
          
          set((state) => ({
            activeEffects: { ...state.activeEffects, [effect]: true },
          }));
          
          setTimeout(() => {
            set((state) => ({
              activeEffects: { ...state.activeEffects, [effect]: false },
            }));
          }, effectDuration * 1000);
        } catch (error) {
          console.error('Error in applyEffect:', error);
        }
      },

      removeEffect: (effect) => {
        try {
          set((state) => ({
            activeEffects: { ...state.activeEffects, [effect]: false },
          }));
        } catch (error) {
          console.error('Error in removeEffect:', error);
        }
      },

      unlockSkin: (skinId) => {
        try {
          set((state) => ({
            unlockedSkins: [...state.unlockedSkins, skinId],
          }));
        } catch (error) {
          console.error('Error in unlockSkin:', error);
        }
      },

      setActiveSkin: (skinId) => {
        try {
          set({ activeSkin: skinId });
        } catch (error) {
          console.error('Error in setActiveSkin:', error);
        }
      },

      resetGame: () => {
        try {
          const { credits, duiktcoins } = get();
          if (credits >= 1000) {
            const newDuiktcoins = Math.floor(credits / 1000);
            set({
              ...INITIAL_STATE,
              duiktcoins: duiktcoins + newDuiktcoins,
            });
          }
        } catch (error) {
          console.error('Error in resetGame:', error);
          set(INITIAL_STATE);
        }
      },

      openCase: (caseType: keyof typeof CASE_REWARDS) => {
        const caseCost = CASE_COSTS[caseType];
        if (credits < caseCost) return;

        spendCredits(caseCost);

        const rewards = CASE_REWARDS[caseType];
        let rewardCredits = 0;
        let rewardDuiktcoins = 0;

        // Check for jackpot first
        if (Math.random() < rewards.jackpot.chance) {
          rewardCredits = rewards.jackpot.credits;
          rewardDuiktcoins = rewards.jackpot.duiktcoins;
        } else {
          // Regular rewards
          if (Math.random() < rewards.credits.chance) {
            rewardCredits = Math.floor(
              Math.random() * (rewards.credits.max - rewards.credits.min + 1) + rewards.credits.min
            );
          }
          if (Math.random() < rewards.duiktcoins.chance) {
            rewardDuiktcoins = Math.floor(
              Math.random() * (rewards.duiktcoins.max - rewards.duiktcoins.min + 1) + rewards.duiktcoins.min
            );
          }
        }

        // Add rewards
        if (rewardCredits > 0) {
          addCredits(rewardCredits);
        }
        if (rewardDuiktcoins > 0) {
          setDuiktcoins(duiktcoins + rewardDuiktcoins);
        }

        // Show reward notification
        setNotification({
          type: 'success',
          message: `You got ${rewardCredits} credits${rewardDuiktcoins > 0 ? ` and ${rewardDuiktcoins} Duiktcoins` : ''}!`,
        });
      },

      submitScore: async (playerName: string) => {
        try {
          const { credits, duiktcoins } = get();
          
          const { error } = await supabase
            .from('leaderboard')
            .insert([
              {
                player_name: playerName,
                credits,
                duiktcoins,
              },
            ]);

          if (error) throw error;

          set((state) => ({
            notifications: [...state.notifications, 'Score submitted successfully!'],
          }));

          // Remove the success notification after 3 seconds
          setTimeout(() => {
            set((state) => ({
              notifications: state.notifications.filter(
                (_, index) => index !== state.notifications.length - 1
              ),
            }));
          }, 3000);
        } catch (error) {
          console.error('Error submitting score:', error);
          set((state) => ({
            notifications: [...state.notifications, 'Failed to submit score. Please try again.'],
          }));

          // Remove the error notification after 3 seconds
          setTimeout(() => {
            set((state) => ({
              notifications: state.notifications.filter(
                (_, index) => index !== state.notifications.length - 1
              ),
            }));
          }, 3000);
        }
      },

      addNotification: (message: string) => {
        set((state) => ({
          notifications: [...state.notifications, message],
        }));
      },

      removeNotification: (index: number) => {
        set((state) => ({
          notifications: state.notifications.filter((_, i) => i !== index),
        }));
      },
    }),
    {
      name: 'clicker-game-storage',
    }
  )
); 