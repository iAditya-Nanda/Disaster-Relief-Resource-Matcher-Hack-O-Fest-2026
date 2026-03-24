import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
