import React from 'react';
import { NavLink } from 'react-router-dom';
import { Terminal, LayoutDashboard, Map, BookOpen, Code2, Trophy } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Roadmap', path: '/roadmap', icon: Map },
  { name: 'Topics', path: '/topics', icon: BookOpen },
  { name: 'Problems', path: '/problems', icon: Code2 },
  { name: 'Contests', path: '/contests', icon: Trophy },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col h-full flex-shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-gray-900">
        <div className="bg-teal-900/30 p-2 rounded-lg border border-teal-800">
          <Terminal className="h-6 w-6 text-teal-400" />
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">
          AlgoHub_
        </h1>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group text-lg",
                isActive 
                  ? "bg-teal-900/10 text-teal-400 font-semibold"
                  : "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
              )}
            >
              <Icon className={cn("h-6 w-6", "transition-colors")} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-900 text-center">
        <span className="text-xs text-gray-500 font-mono">v1.2.0 • Online</span>
      </div>
    </div>
  );
}
