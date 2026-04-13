import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock, Zap, Award, BookOpen, Star, Crown } from 'lucide-react';
import TopicModal from './TopicModal';

const tier1 = [
  { name: 'Arrays & Hashing', level: 'Beginner', tier: 'Bronze' },
  { name: 'Sorting Algorithms', level: 'Beginner', tier: 'Bronze' },
  { name: 'String Manipulation', level: 'Beginner', tier: 'Bronze' },
  { name: 'Math Theory', level: 'Beginner', tier: 'Bronze' }
];

const tier2 = [
  { name: 'Binary Search', level: 'Intermediate', tier: 'Silver' },
  { name: 'Two Pointers', level: 'Intermediate', tier: 'Silver' },
  { name: 'Sliding Window', level: 'Intermediate', tier: 'Silver' },
  { name: 'Greedy Algorithms', level: 'Intermediate', tier: 'Silver' },
  { name: 'Bit Manp.', level: 'Intermediate', tier: 'Silver' },
];

const tier3 = [
  { name: '1D Dynamic Programming', level: 'Intermediate', tier: 'Gold' },
  { name: '2D Dynamic Programming', level: 'Intermediate', tier: 'Gold' },
  { name: 'Knapsack Problems', level: 'Intermediate', tier: 'Gold' },
  { name: 'Graph Basics & BFS/DFS', level: 'Intermediate', tier: 'Gold' },
  { name: 'Union Find (DSU)', level: 'Intermediate', tier: 'Gold' },
  { name: 'Backtracking', level: 'Intermediate', tier: 'Gold' }
];

const tier4 = [
  { name: 'Segment Trees', level: 'Advanced', tier: 'Platinum' },
  { name: 'KMP Algorithm', level: 'Advanced', tier: 'Platinum' },
  { name: 'Tries', level: 'Advanced', tier: 'Platinum' },
  { name: 'Shortest Paths', level: 'Advanced', tier: 'Platinum' },
  { name: 'Minimum Spanning Tree', level: 'Advanced', tier: 'Platinum' },
  { name: 'Topological Sort', level: 'Advanced', tier: 'Platinum' }
];

export default function Roadmap() {
  const [data, setData] = useState({ problems: {}, solved: {} });
  const [selectedTopic, setSelectedTopic] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/problems');
      setData(res.data);
    } catch (err) { }
  };

  useEffect(() => {
    fetchStats();
    window.addEventListener('syncComplete', fetchStats);
    return () => window.removeEventListener('syncComplete', fetchStats);
  }, []);

  // Helper to extract problems for a topic
  const getTopicProblems = (topicName) => {
    let result = [];
    Object.keys(data.problems).forEach(platform => {
      data.problems[platform].forEach(p => {
        if (p.topic === topicName) {
           result.push({
             ...p,
             platform,
             isSolved: data.solved[platform]?.includes(p.id) || false
           });
        }
      });
    });
    return result;
  };

  // Calculate Tier 1
  const t1Stats = tier1.map(t => {
     const probs = getTopicProblems(t.name);
     const complete = probs.length > 0 && probs.every(p => p.isSolved);
     return complete ? 1 : 0;
  });
  const t1Completed = t1Stats.reduce((a,b)=>a+b, 0);
  const t1Total = tier1.length;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-20 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-teal-400 mb-2">Skill_Tree</h1>
          <p className="text-gray-400 text-sm">Complete each tier to unlock the next levels of complexity.</p>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <span className="text-xs font-mono text-gray-500">{t1Completed}/{t1Total} basic blocks</span>
          <div className="w-48 bg-gray-900 rounded-full h-1 border border-gray-800 overflow-hidden">
             <div className="bg-teal-500 h-1 transition-all" style={{width: `${(t1Completed/t1Total)*100}%`}}></div>
          </div>
        </div>
      </div>

      <div className="space-y-10 relative">
        {/* Tier 1 Box */}
        <div className="relative">
          <div className="border border-orange-500/50 rounded-2xl p-6 bg-gradient-to-r from-orange-950/20 to-transparent relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
               <div className="flex gap-4 items-start">
                  <div className="bg-orange-900/40 p-3 rounded-lg border border-orange-800/50 shrink-0">
                     <Zap className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-orange-500 font-bold text-xs tracking-widest uppercase mb-1">Bronze Tier</p>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-100">Tier I - The Foundation</h2>
                    <p className="text-gray-400 mt-2 text-sm flex items-center gap-2"><Award className="h-4 w-4 text-orange-400 shrink-0"/> Solve A & B problems on Codeforces</p>
                  </div>
               </div>
               <div className="text-left sm:text-right">
                  <p className="text-orange-500 font-bold text-xl">{Math.round((t1Completed/t1Total)*100)}%</p>
                  <p className="text-xs text-gray-500 font-mono">{t1Completed}/{t1Total} done</p>
               </div>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-1 mt-6 border border-gray-800 overflow-hidden">
              <div className="bg-orange-500 h-1 rounded-full transition-all" style={{width: `${(t1Completed/t1Total)*100}%`}}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {tier1.map((topic) => {
               const p = getTopicProblems(topic.name);
               const done = p.length > 0 && p.every(x => x.isSolved);
               return (
               <div key={topic.name} onClick={() => setSelectedTopic({ ...topic, problems: p })} className={`border bg-gray-900 p-5 rounded-xl transition cursor-pointer relative group flex flex-col justify-between ${done ? 'border-orange-500/80 bg-orange-950/10' : 'border-orange-500/30 hover:border-orange-500/60'}`}>
                  <div className={`absolute top-3 right-3 h-2.5 w-2.5 rounded-full border-2 ${done ? 'bg-orange-500 border-orange-500' : 'border-gray-700 bg-gray-800 group-hover:border-orange-500'}`}></div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-orange-900/50 text-orange-400 bg-orange-950/30 uppercase tracking-wider mb-4 self-start">
                    {topic.level}
                  </span>
                  <h3 className={`font-bold transition ${done ? 'text-orange-400' : 'text-gray-200 group-hover:text-white'}`}>{topic.name}</h3>
               </div>
               )
            })}
          </div>
        </div>

        {/* Tier 2 Locked Box */}
        <div className="relative pt-6">
           <div className="absolute top-0 left-8 bottom-0 w-px bg-gray-800/50 -z-10"></div>
           
           <div className="flex items-start gap-4 mb-6 pl-2 sm:pl-4 opacity-50">
               <div className="bg-gray-900 p-2.5 rounded-lg border border-gray-800 shrink-0 mt-1">
                 <Lock className="h-5 w-5 text-gray-500" />
               </div>
               <div>
                  <p className="text-gray-500 font-bold text-xs tracking-widest uppercase mb-1">Locked</p>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-300 italic">Tier II - The Logic Builder</h2>
                  <p className="text-gray-500 mt-1 text-sm flex items-center gap-2"><Award className="h-4 w-4 shrink-0" /> Unlock by clearing standard mechanics</p>
               </div>
           </div>
           
           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
               {tier2.map((topic) => (
                 <div key={topic.name} onClick={() => setSelectedTopic({ ...topic, problems: getTopicProblems(topic.name) })} className="border border-gray-800 bg-gray-950/50 p-5 rounded-xl relative opacity-40 select-none cursor-not-allowed">
                    <Lock className="absolute top-3 right-3 h-3 w-3 text-gray-600" />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-gray-800 text-gray-500 bg-gray-900 uppercase tracking-wider mb-4 self-start inline-block">
                      {topic.level}
                    </span>
                    <h3 className="text-gray-500 font-bold">{topic.name}</h3>
                 </div>
               ))}
           </div>
        </div>

        {/* Tier 3 Locked Box */}
        <div className="relative pt-6">
           <div className="absolute top-0 left-8 bottom-0 w-px bg-gray-800/50 -z-10"></div>
           
           <div className="flex items-start gap-4 mb-6 pl-2 sm:pl-4 opacity-50">
               <div className="bg-gray-900 p-2.5 rounded-lg border border-gray-800 shrink-0 mt-1">
                 <Lock className="h-5 w-5 text-gray-500" />
               </div>
               <div>
                  <p className="text-gray-500 font-bold text-xs tracking-widest uppercase mb-1">Locked</p>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-300 italic">Tier III - The Optimizer</h2>
                  <p className="text-gray-500 mt-1 text-sm flex items-center gap-2"><Star className="h-4 w-4 shrink-0" /> Handle Codeforces C & D problems</p>
               </div>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:pr-32">
               {tier3.map((topic) => (
                 <div key={topic.name} onClick={() => setSelectedTopic({ ...topic, problems: getTopicProblems(topic.name) })} className="border border-gray-800 bg-gray-950/50 p-5 rounded-xl relative opacity-40 select-none cursor-not-allowed">
                    <Lock className="absolute top-3 right-3 h-3 w-3 text-gray-600" />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-gray-800 text-gray-500 bg-gray-900 uppercase tracking-wider mb-4 self-start inline-block">
                      {topic.level}
                    </span>
                    <h3 className="text-gray-500 font-bold">{topic.name}</h3>
                 </div>
               ))}
           </div>
        </div>

        {/* Tier 4 Locked Box */}
        <div className="relative pt-6">
           <div className="absolute top-0 left-8 bottom-12 w-px bg-gray-800/50 -z-10"></div>
           
           <div className="flex items-start gap-4 mb-6 pl-2 sm:pl-4 opacity-50">
               <div className="bg-gray-900 p-2.5 rounded-lg border border-gray-800 shrink-0 mt-1">
                 <Lock className="h-5 w-5 text-gray-500" />
               </div>
               <div>
                  <p className="text-gray-500 font-bold text-xs tracking-widest uppercase mb-1">Locked</p>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-300 italic">Tier IV - The Specialist</h2>
                  <p className="text-gray-500 mt-1 text-sm flex items-center gap-2"><Crown className="h-4 w-4 shrink-0" /> ICPC Regionals and high-level contests</p>
               </div>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {tier4.map((topic) => (
                 <div key={topic.name} onClick={() => setSelectedTopic({ ...topic, problems: getTopicProblems(topic.name) })} className="border border-gray-800 bg-gray-950/50 p-5 rounded-xl relative opacity-40 select-none cursor-not-allowed">
                    <Lock className="absolute top-3 right-3 h-3 w-3 text-gray-600" />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-gray-800 text-gray-500 bg-gray-900 uppercase tracking-wider mb-4 self-start inline-block">
                      {topic.level}
                    </span>
                    <h3 className="text-gray-500 font-bold">{topic.name}</h3>
                 </div>
               ))}
           </div>
        </div>
      </div>

      {selectedTopic && (
        <TopicModal 
          isOpen={!!selectedTopic} 
          onClose={() => setSelectedTopic(null)} 
          topicData={selectedTopic} 
        />
      )}
    </div>
  );
}
