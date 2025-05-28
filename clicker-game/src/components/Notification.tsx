import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../features/store/gameStore';
import styles from './Notification.module.scss';

const Notification = () => {
  const notifications = useGameStore((state) => state.notifications);
  const removeNotification = useGameStore((state) => state.removeNotification);

  return (
    <div className={styles.notificationContainer}>
      <AnimatePresence>
        {notifications.map((message, index) => (
          <motion.div
            key={index}
            className={styles.notification}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            {message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notification; 