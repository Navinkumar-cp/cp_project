import React from 'react';
import { X, PlayCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function TopicModal({ isOpen, onClose, topicData }) {
  if (!isOpen || !topicData) return null;

  const totalProbs = topicData.problems?.length || 0;
  const solvedProbs = topicData.problems?.filter(p => p.isSolved).length || 0;
  const isComplete = totalProbs > 0 && totalProbs === solvedProbs;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" 
        onClick={onClose}
      ></div>
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#090b0e] border-l border-gray-800 z-50 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        
        {/* Header Block */}
        <div className="p-6 border-b border-gray-800/50 relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-1.5 text-gray-400 hover:text-white border border-transparent hover:border-gray-700 bg-gray-900/50 rounded-md transition"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex gap-2 mb-4">
             <span className="text-[11px] font-bold px-2 py-0.5 rounded border border-orange-900/50 text-orange-400 bg-orange-950/30 uppercase tracking-wider">
               {topicData.tier?.toUpperCase() || 'BRONZE'}
             </span>
             <span className="text-[11px] font-bold px-2 py-0.5 rounded border border-gray-800 text-gray-400 bg-gray-900 uppercase tracking-wider">
               {topicData.level || 'Beginner'}
             </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">{topicData.name}</h2>
        </div>

        {/* Global Action Block */}
        <div className="px-6 py-5 border-b border-gray-800/50 bg-[#0c0e12]">
          <div className="border border-orange-900/40 bg-orange-950/10 p-5 rounded-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className={`h-4 w-4 rounded-full border-2 ${isComplete ? 'border-orange-500 bg-orange-500' : 'border-gray-600 bg-transparent'}`}></div>
              <span className={`font-mono text-sm uppercase ${isComplete ? 'text-orange-400' : 'text-orange-500/80 font-semibold'}`}>
                {isComplete ? 'Mastery Achieved' : 'Not Started'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                disabled={isComplete}
                className={cn(
                  "flex justify-center items-center gap-2 py-2.5 rounded-lg border font-bold text-sm transition-all",
                  isComplete 
                    ? "bg-orange-600/20 text-orange-400 border-orange-500/30 cursor-not-allowed" 
                    : "bg-orange-600 hover:bg-orange-500 border-orange-500 text-white"
                )}
              >
                <CheckCircle className="h-4 w-4" /> 
                {isComplete ? 'Completed' : 'Mark Complete'}
              </button>
              <button 
                className="flex justify-center items-center gap-2 py-2.5 rounded-lg border border-gray-700 bg-gray-900 hover:bg-gray-800 hover:border-gray-600 text-gray-200 font-bold text-sm transition-all"
              >
                <PlayCircle className="h-4 w-4 text-gray-400" /> Start
              </button>
            </div>
          </div>
        </div>

        {/* Practice List */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#090b0e]">
          <h3 className="text-[11px] font-extrabold text-gray-500 uppercase tracking-[0.2em] mb-4">Practice</h3>
          
          <div className="space-y-3">
            {totalProbs === 0 ? (
              <div className="p-8 border border-gray-800 rounded-xl bg-gray-900/30 text-center">
                 <p className="text-sm text-gray-500 font-medium">No problems linked yet.</p>
              </div>
            ) : (
              topicData.problems.map((prob) => (
                <div key={prob.id} className="p-4 border border-gray-800 bg-gray-900 hover:border-gray-700 rounded-xl transition flex justify-between items-center group">
                   <div className="flex gap-3 items-center">
                     {prob.isSolved ? (
                        <CheckCircle className="h-5 w-5 text-teal-500" />
                     ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-600 ml-0.5"></div>
                     )}
                     <div>
                       <h4 className={cn("font-semibold text-sm", prob.isSolved ? "text-gray-400 line-through" : "text-gray-200")}>
                         {prob.title}
                       </h4>
                       <p className="text-xs text-gray-500 uppercase flex gap-2">
                         <span className="font-bold">{prob.platform}</span>
                         <span>{prob.difficulty}</span>
                       </p>
                     </div>
                   </div>
                   <a 
                     href={prob.url} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="p-2 text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-md transition opacity-0 group-hover:opacity-100"
                   >
                     <ExternalLink className="h-4 w-4" />
                   </a>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </>
  );
}
