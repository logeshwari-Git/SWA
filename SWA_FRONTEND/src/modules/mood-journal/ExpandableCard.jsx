import { motion } from "framer-motion";

function ExpandableCard({ title, children }) {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      className="card"
    >
      <motion.h3 layout>{title}</motion.h3>
      <motion.div layout>{children}</motion.div>
    </motion.div>
  );
}

export default ExpandableCard;
