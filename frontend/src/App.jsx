import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Settings, RefreshCcw, Bell } from 'lucide-react';
import axios from 'axios';


// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Roadmap from './components/Roadmap';
import Problems from './components/Problems';
import Contests from './components/Contests';
import PlatformPage from './components/PlatformPage';
import SettingsModal from './components/SettingsModal';

function App() {
  const [handleSettings, setHandleSettings] = useState({
    codeforces: '',
    atcoder: '',
    leetcode: '',
    codechef: ''
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings`);
      setHandleSettings(res.data);
    } catch (err) {
      console.error('Failed to load settings', err);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/sync`, handleSettings);
      window.dispatchEvent(new Event('syncComplete'));
    } catch (err) {
      console.error('Failed to sync', err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Router>
      <div className="flex h-screen bg-[#0E1117] text-gray-200 font-sans overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Top Bar for Sync & Settings */}
          <header className="h-16 flex items-center justify-end px-8 border-b border-gray-800/50">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSync}
                disabled={syncing}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600/20 text-teal-400 hover:bg-teal-600/30 disabled:opacity-50 font-medium rounded-lg transition-colors border border-teal-500/30"
              >
                <RefreshCcw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{syncing ? 'Syncing...' : 'Sync Data'}</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/topics" element={<div className="p-8 text-center text-gray-500">Topics Coming Soon</div>} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/platform/:name" element={<PlatformPage />} />
              <Route path="/contests" element={<Contests />} />
            </Routes>
          </main>
        </div>

        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={handleSettings}
            onSave={(newSettings) => {
              setHandleSettings(newSettings);
              setIsSettingsOpen(false);
            }}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
