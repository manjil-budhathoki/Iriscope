// 📁 src/pages/About.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

export default function AboutPage() {
  const [typingDone, setTypingDone] = useState(false);
  const handwritingFont = 'font-[cursive]';

  const paragraphs = [
    "We use K-Means clustering 🧪 and PCA 📊 to break down abstract concepts into interactive visuals 🎨. Whether you love data 📊, design 🎨, or just want to understand how machines group things together 🌿, you're in the right place!",
    "Built with ❤️ by curious minds for curious minds. Explore clusters of iris flowers 🌸, watch simulations in 3D space 🛰️, and feel the joy of seeing structure emerge from randomness. It's data science, but make it ✨ aesthetic ✨.",
    "Want to get involved or peek under the hood? 🔧 We’ve got the code open on GitHub and we’re always happy to connect with other dreamers 🌟.",
  ];

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#0a0219] via-[#120926] to-[#0d051a] px-8 md:px-20 py-24 text-white font-mono text-[1.2rem] md:text-[1.3rem] leading-relaxed overflow-hidden">

      {/* 🪄 Paper Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-5 pointer-events-none z-0" />

      {/* 💫 Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`max-w-7xl mx-auto relative z-10 ${handwritingFont}`}
      >
        {/* Heading */}
        <p className="text-sm uppercase tracking-widest text-fuchsia-500 mb-3">
          IRIS INSIGHTS ✨
        </p>

        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 mb-10">
          About the Project 📚
        </h1>

        {/* ✍️ Typing intro */}
        <TypeAnimation
          sequence={[
            "Hello there! 👋 Welcome to Iris Insights — a visual guide to understanding unsupervised learning 🧠. This site lets you see how machines 🤖 can group things without ever being told what they are — no labels, just patterns.",
            () => setTypingDone(true),
          ]}
          speed={50}
          wrapper="p"
          className="text-white"
        />

        {/* ✨ Rest Paragraphs Fade-in */}
        {typingDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-6 mt-8"
          >
            {paragraphs.map((text, idx) => (
              <p key={idx} className="text-gray-300">
                {text}
              </p>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
