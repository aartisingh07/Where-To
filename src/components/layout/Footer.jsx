import { Link } from 'react-router-dom';
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter, FaReddit } from 'react-icons/fa6';
import { FiBookOpen } from 'react-icons/fi';
import Logo from './Logo';

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/aartisingh07',
    icon: <FaGithub size={20} />,
    color: 'hover:text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/10 hover:shadow-glow-purple-sm',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/sturartii.x_',
    icon: <FaInstagram size={20} />,
    color: 'hover:text-pink-400 hover:border-pink-500/50 hover:bg-pink-500/10 hover:shadow-glow-pink-sm',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/aarti-singh-555ab827b/',
    icon: <FaLinkedinIn size={20} />,
    color: 'hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10 hover:shadow-glow-cyan-sm',
  },
  {
    name: 'X',
    url: 'https://x.com/sturartii_x',
    icon: <FaXTwitter size={20} />,
    color: 'hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/50 hover:bg-white/10',
  },
  {
    name: 'Reddit',
    url: 'https://www.reddit.com/user/ZealousidealOne1484/',
    icon: <FaReddit size={20} />,
    color: 'hover:text-orange-500 hover:border-orange-500/50 hover:bg-orange-500/10',
  },
];

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-white/10 bg-white/80 dark:bg-dark-900/90 backdrop-blur-md py-6 px-4 mt-auto relative z-30">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Tagline */}
        <div className="flex flex-wrap items-center gap-3">
          <Logo className="w-6 h-6" />
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-gradient text-lg">Where To?</span>
            <span className="text-slate-400 dark:text-white/20">·</span>
            <span className="text-slate-600 dark:text-white/50 text-xs font-medium">Stop asking. Start going.</span>
          </div>
          <span className="text-slate-400 dark:text-white/20 hidden sm:inline">·</span>
          <Link
            to="/guide"
            className="flex items-center gap-1.5 text-xs text-primary-500 dark:text-primary-400 font-semibold hover:underline"
          >
            <FiBookOpen size={14} /> User Guide
          </Link>
        </div>

        {/* Right: Social Media Icons ONLY (No text written) */}
        <div className="flex items-center gap-2.5">
          {socialLinks.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              title={s.name}
              aria-label={s.name}
              className={`p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 transition-all duration-300 transform hover:-translate-y-1 ${s.color} cursor-pointer flex items-center justify-center`}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
