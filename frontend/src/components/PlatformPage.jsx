import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ExternalLink, CheckCircle2, Circle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function PlatformPage() {
  const { name } = useParams();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProblems = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/problems`);
      // res.data should have shape { [platform]: [problems], solved: { [platform]: [ids] } }
      const platformData = res.data.problems[name] || [];
      const solvedList = res.data.solved[name] || [];

      const mapped = platformData.map(p => ({
        ...p,
        isSolved: solvedList.includes(p.id)
      }));
      setProblems(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
    const handleSync = () => fetchProblems();
    window.addEventListener('syncComplete', handleSync);
    return () => window.removeEventListener('syncComplete', handleSync);
  }, [name]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold capitalize text-white flex items-center gap-3">
          {name} Problems
        </h1>
        <span className="bg-gray-800 px-3 py-1 rounded-full text-sm font-medium text-gray-300">
          {problems.filter(p => p.isSolved).length} / {problems.length} Solved
        </span>
      </div>

      <div className="grid gap-4">
        {problems.map(problem => (
          <div key={problem.id} className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition duration-200 group">
            <div className="flex items-center gap-4">
              {problem.isSolved ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <Circle className="h-6 w-6 text-gray-600 group-hover:text-gray-500" />
              )}
              <div>
                <h3 className={cn("text-lg font-medium", problem.isSolved ? "text-gray-400 line-through decoration-gray-600" : "text-gray-100")}>
                  {problem.title}
                </h3>
                <p className="text-sm text-gray-500">{problem.difficulty || 'Standard'} • ID: {problem.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {problem.isSolved ? (
                <div className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Solved
                </div>
              ) : (
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition"
                >
                  Solve <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
        {problems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No problems mapped for this platform yet.
          </div>
        )}
      </div>
    </div>
  );
}
