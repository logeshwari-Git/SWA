import React, { useContext } from "react";
import { StreakContext } from "../context/StreakContext";
import { motion, AnimatePresence } from "framer-motion";

const StreakHeader = () => {
  const { streak, broken } = useContext(StreakContext);
  const today = new Date().toLocaleDateString();

  return (
    <div className="streak-header">
      <AnimatePresence>
        {broken && (
          <motion.div
            className="streak-broken"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            💔 Streak broken — start fresh today
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={streak}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        🔥 {streak || 0} day{streak === 1 ? "" : "s"} streak · {today}
      </motion.div>
    </div>
  );
};

export default StreakHeader;
