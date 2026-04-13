import React from 'react';
import { Code2, Trophy, Flame, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const platforms = [
  { id: 'codeforces', name: 'Codeforces', color: 'from-blue-500 to-indigo-600', icon: Trophy, desc: 'Master competitive programming.' },
  { id: 'leetcode', name: 'LeetCode', color: 'from-orange-400 to-yellow-600', icon: Code2, desc: 'Excel in technical interviews.' },
  { id: 'codechef', name: 'CodeChef', color: 'from-amber-600 to-orange-800', icon: Flame, desc: 'Compete in intense contests.' },
  { id: 'atcoder', name: 'AtCoder', color: 'from-purple-500 to-pink-600', icon: PlayCircle, desc: 'Solve high-quality problems.' },
];

export default function Problems() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Platform Problems</h1>
        <p className="text-gray-400 text-lg">
          Select a platform to view curated problem sets and check your completion status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <Link
              key={platform.id}
              to={`/platform/${platform.id}`}
              className="group relative flex flex-col items-center p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className={`p-4 rounded-full bg-gray-800 mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-8 h-8 text-gray-300 group-hover:text-white`} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{platform.name}</h2>
              <p className="text-center text-sm text-gray-400">{platform.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
