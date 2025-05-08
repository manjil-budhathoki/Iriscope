import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  LineChart,
  Brain,
  Rocket,
  Info,
} from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { to: '/', icon: <Home size={22} />, label: 'Home' },
    { to: '/clusters', icon: <LineChart size={22} />, label: 'Clusters' },
    { to: '/explain', icon: <Brain size={22} />, label: 'Explain' },
    { to: '/simulate', icon: <Rocket size={22} />, label: 'Simulate' },
    { to: '/about', icon: <Info size={22} />, label: 'About' },
  ];

  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-xl flex gap-6">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`flex flex-col items-center justify-center text-xs transition hover:text-pink-400 ${
            pathname === link.to ? 'text-pink-400 font-bold' : 'text-white'
          }`}
        >
          {link.icon}
        </Link>
      ))}
    </nav>
  );
}
