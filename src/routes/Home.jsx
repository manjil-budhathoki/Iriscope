import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="relative overflow-hidden text-white min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#0e0e0e]">
      {/* Floating soft blurred orbs */}
      <div className="absolute -top-40 -left-20 w-[700px] h-[700px] bg-gradient-to-br from-pink-500/20 to-purple-700/10 rounded-full blur-[160px] z-0" />
      <div className="absolute -bottom-20 -right-32 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/10 via-sky-400/10 to-purple-600/10 rounded-full blur-[160px] z-0" />

      <div className="relative z-10 flex flex-col items-center space-y-6 max-w-2xl mt-16">
        <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold uppercase px-3 py-1 rounded-full tracking-widest">
          Built on AI. Powered by Insight.
        </span>

        <motion.h1
          className="text-5xl md:text-6xl font-extrabold leading-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          The future of <span className="text-pink-500">understanding clusters</span> is here
        </motion.h1>

        <motion.p
          className="text-lg text-gray-300 max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Leverage the power of unsupervised machine learning to discover natural groupings in Iris data — visual, interactive, and beautiful.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <Link
            to="/clusters"
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-full text-sm font-bold shadow-lg transition-all"
          >
            Explore Clusters →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
