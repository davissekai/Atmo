import { motion } from 'motion/react';
import { Leaf, Cloud, Waves, Thermometer } from 'lucide-react';

export function WelcomeScreen() {
  const suggestions = [
    {
      icon: Thermometer,
      text: "What's causing global temperature rise?",
    },
    {
      icon: Cloud,
      text: 'Explain the greenhouse effect',
    },
    {
      icon: Waves,
      text: 'How are oceans affected by climate change?',
    },
    {
      icon: Leaf,
      text: 'What can I do to reduce my carbon footprint?',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center h-full px-6 py-12"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-4"
      >
        <div className="relative">
          <img
            src="./logo_dark.png"
            alt="Atmo Logo"
            className="w-24 h-auto dark:block hidden transition-all duration-500"
          />
          <img
            src="./logo_light.png"
            alt="Atmo Logo"
            className="w-24 h-auto dark:hidden block transition-all duration-500"
          />
        </div>
      </motion.div>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12 text-center max-w-2xl"
      >
        <p className="text-2xl text-foreground/80">
          How can I help you understand our planet today?
        </p>
      </motion.div>

      {/* Suggestion Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl"
      >
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
              <suggestion.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
              {suggestion.text}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
