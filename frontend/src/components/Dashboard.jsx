import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Trophy, Info, Code2, Activity } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState({ problems: {}, solved: {} });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/problems');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    window.addEventListener('syncComplete', fetchStats);
    return () => window.removeEventListener('syncComplete', fetchStats);
  }, []);

  const totalProblems = Object.values(data.problems).flat().length;
  const totalSolved = Object.values(data.solved).flat().length;
  const solvePercent = totalProblems === 0 ? 0 : Math.round((totalSolved / totalProblems) * 100);

  // Dynamic Difficulty Calculation
  let easySolved = 0, medSolved = 0, hardSolved = 0;
  let easyTotal = 0, medTotal = 0, hardTotal = 0;

  Object.keys(data.problems).forEach((platform) => {
    data.problems[platform].forEach((prob) => {
      const isSolved = data.solved[platform]?.includes(prob.id);
      const diff = (prob.difficulty || '').toString().toLowerCase();

      let level = 'medium';
      if (diff.includes('easy') || diff.includes('beginner') || diff === '800' || diff === '1000') {
        level = 'easy';
      } else if (diff.includes('hard') || parseInt(diff) >= 1600) {
        level = 'hard';
      }

      if (level === 'easy') { easyTotal++; if (isSolved) easySolved++; }
      if (level === 'medium') { medTotal++; if (isSolved) medSolved++; }
      if (level === 'hard') { hardTotal++; if (isSolved) hardSolved++; }
    });
  });

  const platformStats = Object.keys(data.problems).map((hw) => ({
    name: hw,
    total: data.problems[hw].length,
    solved: data.solved[hw] ? data.solved[hw].length : 0
  }));

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="animate-spin h-8 w-8 border-b-2 border-teal-500 rounded-full"></div></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-6xl mx-auto pb-10 shadow-none outline-none">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
        <p className="text-gray-400 mt-1">Real-time statistics based on your mapped problems.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main Progress Card */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
             <div>
               <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Overall Progress</p>
               <h2 className="text-5xl font-extrabold text-white">{totalSolved} <span className="text-xl text-gray-500 font-medium">/ {totalProblems}</span></h2>
             </div>
             <div className="p-3 bg-teal-500/10 rounded-xl">
               <Target className="h-6 w-6 text-teal-400" />
             </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2 text-teal-400 font-medium">
               <span>Completion</span>
               <span>{solvePercent}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-teal-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${solvePercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Dynamic Difficulty Breakdown */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col justify-between">
           <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-purple-500/10 rounded-lg">
               <Activity className="h-5 w-5 text-purple-400" />
             </div>
             <h3 className="text-lg font-bold text-white text-md">Difficulty Spread</h3>
           </div>

           <div className="space-y-4">
              <div>
                 <div className="flex justify-between text-xs font-semibold mb-1 uppercase tracking-wider">
                   <span className="text-green-400">Beginner / Easy</span>
                   <span className="text-gray-300">{easySolved} / {easyTotal}</span>
                 </div>
                 <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-green-400 h-1.5 rounded-full" style={{ width: `${easyTotal ? (easySolved/easyTotal)*100 : 0}%` }}></div></div>
              </div>
              <div>
                 <div className="flex justify-between text-xs font-semibold mb-1 uppercase tracking-wider">
                   <span className="text-yellow-400">Intermediate / Med</span>
                   <span className="text-gray-300">{medSolved} / {medTotal}</span>
                 </div>
                 <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${medTotal ? (medSolved/medTotal)*100 : 0}%` }}></div></div>
              </div>
              <div>
                 <div className="flex justify-between text-xs font-semibold mb-1 uppercase tracking-wider">
                   <span className="text-red-400">Advanced / Hard</span>
                   <span className="text-gray-300">{hardSolved} / {hardTotal}</span>
                 </div>
                 <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${hardTotal ? (hardSolved/hardTotal)*100 : 0}%` }}></div></div>
              </div>
           </div>
        </div>

        {/* Global Stats / Quick Info */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-start gap-4 h-full flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-orange-400" />
                <h3 className="text-lg font-bold text-white text-md">Platform Ranking</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your primary active platform is currently <span className="text-gray-200 font-semibold">{platformStats.sort((a,b)=>b.solved-a.solved)[0]?.name || 'None'}</span> based on tracked submissions.
              </p>
            </div>
            <div className="w-full p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center gap-3">
               <Info className="h-5 w-5 text-indigo-400" />
               <p className="text-xs text-indigo-300 font-medium">Contest rankings and live streaks are dependent on platform Webhooks.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Platform Breakdown Wrapper */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Code2 className="h-5 w-5 text-gray-400" /> Platform Breakdown</h3>
          <div className="space-y-6">
            {platformStats.map((stat) => (
               <div key={stat.name} className="flex flex-col gap-2">
                 <div className="flex justify-between items-end">
                   <span className="text-sm text-gray-300 capitalize font-semibold tracking-wide">
                     {stat.name}
                   </span>
                   <span className="text-xs text-gray-400 font-mono">{stat.solved} / {stat.total}</span>
                 </div>
                 <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden">
                   <div 
                     className="bg-teal-500 h-1 rounded-full transition-all duration-1000" 
                     style={{ width: `${stat.total ? Math.round((stat.solved / stat.total) * 100) : 0}%` }}
                   ></div>
                 </div>
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
