import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, ExternalLink } from 'lucide-react';

export default function Contests() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await axios.get('/api/contests');
        setContests(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m > 0 ? m + 'm' : ''}`;
  };

  const getSiteColor = (site) => {
    if (site.toLowerCase().includes('codeforces')) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    if (site.toLowerCase().includes('atcoder')) return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    if (site.toLowerCase().includes('leetcode')) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    if (site.toLowerCase().includes('codechef')) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    return 'text-teal-500 bg-teal-500/10 border-teal-500/20';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-48"><div className="animate-spin h-8 w-8 border-b-2 border-teal-500 rounded-full"></div></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
       <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Upcoming Contests</h1>
        <p className="text-gray-400">Never miss a competition. Mark your calendar for these global contest events.</p>
      </div>

      <div className="grid gap-4">
        {contests.length === 0 ? (
           <div className="text-center p-12 bg-gray-900 border border-gray-800 rounded-xl">
             <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-gray-400">No upcoming contests found.</h3>
           </div>
        ) : (
          contests.map((contest, i) => (
            <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-gray-900 border border-gray-800 rounded-xl hover:border-teal-500/50 transition">
              <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getSiteColor(contest.site)} uppercase tracking-wider`}>
                      {contest.site}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-950 px-2 py-1 rounded-md border border-gray-800">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(contest.duration)}
                    </span>
                 </div>
                 <h2 className="text-xl font-bold text-gray-100">{contest.name}</h2>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col md:items-end w-full md:w-auto">
                 <p className="text-gray-300 font-medium whitespace-nowrap mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-500" />
                    {new Date(contest.start_time).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'})}
                 </p>
                 <a 
                   href={contest.url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="mt-3 md:mt-1 inline-flex items-center gap-2 text-sm text-teal-400 font-medium hover:text-teal-300 transition"
                 >
                   Register / View Details <ExternalLink className="w-3.5 h-3.5" />
                 </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
