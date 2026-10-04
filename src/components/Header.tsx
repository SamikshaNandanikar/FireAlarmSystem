import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { audioManager } from '../audio/AudioManager';

export const Header: React.FC = () => {
  const [isMuted, setIsMuted] = useState(audioManager.getIsMuted());
  const [volume, setVolume] = useState(audioManager.getVolume());

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioManager.setMuted(nextMute);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    audioManager.setVolume(newVol);
    if (isMuted && newVol > 0) {
      setIsMuted(false);
      audioManager.setMuted(false);
    }
  };

  return (
    <header className="glass-panel p-4 md:p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Title & Badge */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-heading flex items-center gap-2">
            <span className="text-3xl animate-bounce">🔥</span>
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-red-500 bg-clip-text text-transparent">
              SMART FIRE ALARM
            </span>
          </h1>
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-1">
            <ShieldAlert size={12} />
            AUTOMATA THEORY PROJECT
          </span>
        </div>
        <p className="text-sm text-slate-400 font-medium">
          DFA-Based Fire Detection & Monitoring System
        </p>
      </div>

      {/* Online Pulse & Audio Controls */}
      <div className="flex items-center flex-wrap gap-4 w-full md:w-auto justify-between md:justify-end">
        {/* System Online Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-semibold text-slate-300">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span>SYSTEM ONLINE</span>
        </div>

        {/* Audio controls */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-medium"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <>
                <VolumeX size={16} className="text-red-400" />
                <span className="hidden sm:inline">Sound OFF</span>
              </>
            ) : (
              <>
                <Volume2 size={16} className="text-emerald-400" />
                <span className="hidden sm:inline">Sound ON</span>
              </>
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            title={`Volume: ${Math.round(volume * 100)}%`}
            aria-label="Volume slider"
          />
        </div>
      </div>
    </header>
  );
};
