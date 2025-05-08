// 📁 src/pages/KMeansExplain.jsx
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function KMeansExplain() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeId, setActiveId] = useState('overview');

  useEffect(() => {
    document.title = 'Iris Insights — K-Means Clustering Breakdown';

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const anchors = document.querySelectorAll('section');
      for (const section of anchors) {
        const top = section.getBoundingClientRect().top;
        if (top > 0 && top < window.innerHeight * 0.4) {
          setActiveId(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <p>
          This page introduces how K-Means clustering works. It covers the
          intuition, math-free explanation, and real-world examples with Iris
          data.
        </p>
      ),
    },
    {
      id: 'why-kmeans',
      title: 'Why K-Means?',
      content: (
        <ul className="list-disc pl-6 space-y-1">
          <li>Unsupervised — no labels needed</li>
          <li>Intuitive — based on distance to center</li>
          <li>Useful in compression, grouping, exploration</li>
        </ul>
      ),
    },
    {
      id: 'how-it-works',
      title: 'How It Works',
      content: (
        <ol className="list-decimal pl-6 space-y-1">
          <li>Pick k random centers</li>
          <li>Assign each point to its nearest center</li>
          <li>Move centers to mean of assigned points</li>
          <li>Repeat until centers don't move</li>
        </ol>
      ),
    },
    {
      id: 'intuition',
      title: 'Jellybean Intuition',
      content: (
        <p>
          Imagine jellybeans on a table 🍬. Drop 3 jars. Each jellybean rolls
          to the nearest jar. Move jars to center of their beans. Repeat.
          That’s K-Means.
        </p>
      ),
    },
    {
      id: 'conclusion',
      title: 'Conclusion',
      content: (
        <p>
          K-Means helps discover structure in unlabeled data. In this project,
          it separated Iris flower types using only their petal/sepal sizes.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0219] via-[#120926] to-[#0d051a] text-white px-4 md:px-10 lg:px-24 pt-24 pb-36 relative">

      {/* Top Banner */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: showScrollTop ? 0.15 : 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl mx-auto text-center z-10 px-4 pt-8 md:pt-16"
      >
        <div className="inline-block px-3 py-1 text-xs font-semibold bg-yellow-500/10 text-yellow-300 rounded-full uppercase tracking-wider">
          Built on AI. Powered by Insight.
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold">
          <span className="text-white">The future of </span>
          <span className="text-pink-500">understanding clusters</span>
          <span className="text-white"> is here</span>
        </h1>
        <p className="mt-3 text-gray-300 max-w-xl mx-auto">
          Leverage the power of unsupervised machine learning to discover
          natural groupings in Iris data — visual, interactive, and beautiful.
        </p>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/56/Iris_dataset_scatterplot.svg"
          alt="Iris Dataset Example"
          className="rounded-xl shadow-xl border border-white/10 mt-8 mx-auto max-w-2xl"
        />
      </motion.div>

      {/* Content + Sidebar wrapper */}
      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto pt-24">
        {/* Content */}
        <div className="flex-1 space-y-40 pr-4">
          {sections.map(({ id, title, content }) => (
            <motion.section
              key={id}
              id={id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-32 w-full"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-pink-400 mb-4">
                {title}
              </h2>
              <div className="text-gray-300 text-base md:text-lg leading-relaxed">
                {content}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block w-60 ml-8 sticky top-28 h-fit z-20 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg max-h-[60vh] overflow-y-auto text-sm space-y-2">
          <h3 className="text-xs uppercase font-semibold text-gray-400 mb-2">
            On this page
          </h3>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollTo(section.id)}
                  className={`block w-full text-left transition duration-200 ${
                    activeId === section.id ? 'text-white font-semibold' : 'text-gray-400 hover:text-white hover:translate-x-1'
                  }`}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full shadow-xl"
          >
            ↑ Top
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}