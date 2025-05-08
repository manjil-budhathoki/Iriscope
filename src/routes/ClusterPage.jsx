import ClusterChart from '../components/ClusterChart';
import { motion } from 'framer-motion';

export default function ClusterPage() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-36 bg-[#0e0e0e] text-white text-center overflow-hidden">
      {/* Glowing Gradient Blobs */}
      <div className="absolute -top-40 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-pink-500/20 to-purple-500/10 blur-[160px] rounded-full z-0" />
      <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-gradient-to-tr from-sky-400/10 via-purple-600/10 to-indigo-800/10 blur-[160px] rounded-full z-0" />

      <motion.h2
        className="text-5xl font-extrabold mb-4 z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-pink-400">🌸</span> Iris Clusters
      </motion.h2>

      <motion.p
        className="text-gray-300 mb-10 z-10 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Visualized via <span className="text-white font-semibold">K-Means</span> + <span className="text-white font-semibold">PCA</span>
      </motion.p>

      <div className="relative z-10 w-full max-w-5xl px-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg">
          <ClusterChart />
        </div>
      </div>
    </section>
  );
}
