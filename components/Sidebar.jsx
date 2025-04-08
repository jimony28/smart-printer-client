// src/components/Sidebar.jsx
import { Home, Upload, FileText, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', icon: <Home size={18} />, path: '/dashboard' },
  { name: 'Uploads', icon: <Upload size={18} />, path: '/uploads' },
  { name: 'Orders', icon: <FileText size={18} />, path: '/orders' },
  { name: 'Settings', icon: <Settings size={18} />, path: '/settings' },
];

const Sidebar = () => {
  return (
    <aside className="w-60 h-screen bg-white dark:bg-zinc-900 border-r dark:border-zinc-800 p-4 fixed top-0 left-0 z-20">
      <div className="text-xl font-bold mb-8 text-zinc-800 dark:text-zinc-100">SmartPrint</div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
