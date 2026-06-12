import React, { useState } from 'react';
import { Star, Trophy, Award, Lock, HelpCircle, Activity, Sparkles, TrendingUp, DollarSign, X } from 'lucide-react';
import { Achievement, HarvestLog, Client } from '../types';

interface StatsViewProps {
  farmerName: string;
  eggPrice: number;
  achievements: Achievement[];
  harvestLogs: HarvestLog[];
  clients: Client[];
}

interface DayStat {
  day: string;
  count: number;
  highlighted?: boolean;
}

export default function StatsView({ farmerName, eggPrice, achievements = [], harvestLogs = [], clients = [] }: StatsViewProps) {
  const [showAllModal, setShowAllModal] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<DayStat | null>(null);

  // Group harvest logs for the past 7 days to show real dynamic production stats
  // Or fall back to premium default baseline values so the chart is never empty
  const getWeeklyStats = (): DayStat[] => {
    // Last 7 days names in Polish
    const daysName = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'];
    const result: DayStat[] = [];
    const today = new Date();

    // Generate 7 days ending today
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const label = daysName[d.getDay()];
      
      // Filter harvests for this calendar day-month
      const dayHash = d.toISOString().split('T')[0];
      const itemsForDay = harvestLogs.filter(log => {
        if (!log.dateKey) return false;
        return log.dateKey === dayHash;
      });
      
      const totalLaid = itemsForDay.reduce((sum: number, item: HarvestLog) => sum + item.count, 0);
      result.push({
        day: label,
        count: totalLaid
      });
    }

    // Highlight the day with the highest production count
    const maxCount = Math.max(...result.map(r => r.count));
    return result.map(r => ({
      ...r,
      highlighted: r.count === maxCount && maxCount > 0
    }));
  };

  const weeklyStats = getWeeklyStats();
  const totalWeekly = weeklyStats.reduce((sum, d) => sum + d.count, 0);

  // Filter out unlocked ones, then sort descending by progress percentage
  // Closeness = progressCurrent / progressMax
  const getClosestAchievements = (): Achievement[] => {
    const locked = achievements.filter(a => !a.unlocked);
    
    const sortedLocked = [...locked].sort((a, b) => {
      const ratioA = a.progressCurrent / Math.max(1, a.progressMax);
      const ratioB = b.progressCurrent / Math.max(1, b.progressMax);
      return ratioB - ratioA; // highest completion first
    });

    const result = [...sortedLocked];
    // If not enough locked ones, append unlocked ones to complete a nice preview of 3
    if (result.length < 3) {
      const unlocked = achievements.filter(a => a.unlocked);
      result.push(...unlocked);
    }
    return result.slice(0, 3);
  };

  const top3Closest = getClosestAchievements();

  // Helper to count unlocked achievements
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="w-full max-w-md mx-auto bg-brand-surface min-h-[85vh] pb-24 px-5 py-5 overflow-hidden rounded-2xl flex flex-col space-y-6 text-left" id="stats-container">
      {/* View Header */}
      <div className="space-y-1 text-center">
        <div className="inline-flex items-center gap-1.5 bg-[#d4fcd0] border border-[#b4fab0] text-brand-secondary text-[10px] font-bold py-1 px-3.5 rounded-full select-none uppercase tracking-wider">
          <Star className="w-3 h-3 fill-current" />
          <span>Ranking Gospodarzy</span>
        </div>
        <h1 className="font-display font-bold text-3xl tracking-tight text-brand-text">
          Rozwój & Statystyki
        </h1>
        <p className="text-xs text-brand-outline font-sans">
          Analiza produkcji i rejestr Twoich osiągnięć, {farmerName}
        </p>
      </div>

      {/* Production Week Card */}
      <div className="bg-[#fff0ee] border border-brand-container-high rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-display font-bold text-lg text-brand-text">Dynamiczny Tydzień</h2>
            <span className="text-[10px] font-bold text-brand-outline font-sans uppercase">Zbiory z ostatnich 7 dni</span>
          </div>
          <div className="text-right">
            <span className="font-display font-black text-3xl text-brand-text leading-none block">
              {totalWeekly}
            </span>
            <span className="text-[10px] text-brand-outline font-sans uppercase font-semibold">jajek łącznie</span>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="h-32 flex items-end justify-between px-1 pt-4 pb-2">
          {weeklyStats.map((stat, idx) => {
            const maxVal = Math.max(...weeklyStats.map(s => s.count), 1);
            const barHeightPct = (stat.count / maxVal) * 100;

            return (
              <div 
                key={idx} 
                className="flex flex-col items-center flex-1 group cursor-pointer relative"
                onMouseEnter={() => setHoveredDay(stat)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Floating tooltip/star */}
                {stat.highlighted && (
                  <div className="absolute -top-6 flex flex-col items-center">
                    <Star className="w-3.5 h-3.5 text-brand-yolk fill-current animate-bounce" />
                    <span className="text-[8px] font-extrabold text-brand-primary">{stat.count}</span>
                  </div>
                )}

                {/* Day height Bar */}
                <div className="w-6 bg-[#ffe4e0] rounded-b-lg rounded-t-xl h-20 flex items-end">
                  <div 
                    style={{ height: `${Math.max(12, barHeightPct)}%` }}
                    className={`w-full rounded-b-lg rounded-t-xl transition-all duration-500 relative ${
                      stat.highlighted 
                        ? 'bg-amber-950 shadow-inner group-hover:bg-amber-900' 
                        : 'bg-brand-yolk/75 group-hover:bg-brand-yolk'
                    }`}
                  >
                    {/* Tiny popup on hover */}
                    {hoveredDay === stat && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-brand-text text-white text-[9px] px-1.5 py-0.5 rounded-md shadow-lg z-10 whitespace-nowrap font-sans font-bold">
                        {stat.count} jaj
                      </div>
                    )}
                  </div>
                </div>

                <span className={`text-[11px] mt-2 font-display font-semibold ${
                  stat.highlighted ? 'text-brand-text font-bold' : 'text-brand-outline'
                }`}>
                  {stat.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly details row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Monthly estimated */}
        <div className="bg-[#e2f9e0] border border-[#d4f3cf] rounded-3xl p-4 flex flex-col justify-between h-28">
          <div className="w-8 h-8 rounded-full bg-[#c2f4bc] flex items-center justify-center text-brand-secondary">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-secondary/80 font-sans block">
              Zysk miesięczny
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display font-extrabold text-lg text-emerald-950">
                {(clients.reduce((sum: number, c: Client) => sum + (c.monthlyDemand || 0), 0) * eggPrice).toFixed(0)} PLN
              </span>
              <span className="text-[9px] font-bold text-emerald-800 font-sans">szac.</span>
            </div>
          </div>
        </div>

        {/* Current global index price */}
        <div className="bg-[#fff9e6] border border-amber-200 rounded-3xl p-4 flex flex-col justify-between h-28">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-900">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-900/85 font-sans block">
              Cena Globalna
            </span>
            <div className="flex flex-col mt-0.5">
              <span className="font-display font-bold text-lg text-brand-text">
                {eggPrice.toFixed(2)} PLN
              </span>
              <span className="text-[8px] text-brand-outline font-sans uppercase font-bold uppercase tracking-wider">
                zarobek za sztukę
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Osiągnięcia (Achievements) Card View */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-brand-text flex items-center gap-2">
            🏆 Najbliższe Osiągnięcia
          </h2>
          <button 
            onClick={() => setShowAllModal(true)}
            className="text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 active:scale-95 transition-transform cursor-pointer"
            id="see-all-achievements-btn"
          >
            Zobacz wszystkie ({unlockedCount}/{achievements.length})
          </button>
        </div>

        <p className="text-xs text-brand-outline font-sans">
          Progres celów kurnika, które są najbliżej odblokowania i Twoich starań:
        </p>

        <div className="space-y-2.5">
          {top3Closest.length === 0 ? (
            <div className="text-center p-6 text-brand-outline text-xs bg-brand-container-low rounded-2xl">
              Rozpocznij hodowlę, aby zobaczyć dostępne cele.
            </div>
          ) : (
            top3Closest.map((ac) => {
              const progressPct = Math.min(100, Math.floor((ac.progressCurrent / Math.max(1, ac.progressMax)) * 100));
              return (
                <div 
                  key={ac.id}
                  className={`bg-white border rounded-2xl p-3.5 flex items-center gap-3.5 shadow-xs transition-shadow hover:shadow`}
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                    ac.unlocked ? 'bg-amber-100 border border-amber-250 animate-pulse' : 'bg-gray-100'
                  }`}>
                    {ac.icon}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-baseline gap-1">
                      <h4 className="font-display font-bold text-sm text-brand-text truncate">
                        {ac.title}
                      </h4>
                      <span className="text-[9px] font-mono text-brand-outline font-bold bg-gray-50 px-1.5 py-0.5 rounded shrink-0">
                        {ac.progressCurrent} / {ac.progressMax}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-outline font-sans truncate">
                      {ac.description}
                    </p>
                    
                    {/* Progress indicator */}
                    <div className="w-full bg-gray-105 h-1.5 rounded-full overflow-hidden mt-1 relative">
                      <div 
                        style={{ width: `${progressPct}%` }}
                        className={`h-full rounded-full transition-all duration-300 ${
                          ac.unlocked ? 'bg-emerald-600' : 'bg-amber-600'
                        }`}
                      />
                    </div>
                    {ac.unlocked ? (
                      <p className="text-[9px] text-emerald-800 font-bold font-sans mt-0.5">
                        ✔️ Odblokowano! Nagroda: {ac.rewardText}
                      </p>
                    ) : (
                      <p className="text-[8px] text-amber-800 font-sans mt-0.5 font-semibold">
                        Postęp: {progressPct}% • Zostało niewiele!
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pro-Tip Box */}
      <div className="bg-[#fff9e6] border border-amber-100 rounded-3xl p-4 flex gap-3 text-amber-950 font-sans">
        <span className="text-xl select-none">💡</span>
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">Złoty Tip Gospodarski</span>
          <p className="text-xs leading-normal italic font-medium">
            "Regularne karmienie i dbałość o niskie ceny jaj pozwalają odblokować kontrakty szybciej i zgarnąć potężne premie do skarbonki!"
          </p>
        </div>
      </div>

      {/* SEE ALL ACHIEVEMENTS MASTER MODAL (ALL 13 LEVELS COOP STATUS) */}
      {showAllModal && (
        <div className="fixed inset-0 bg-brand-text/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-sm bg-brand-surface border border-brand-container-highest p-5 rounded-3xl shadow-2xl space-y-4 animate-scaleUp text-left max-h-[90vh] overflow-y-auto relative my-8">
            <button 
              onClick={() => setShowAllModal(false)}
              className="absolute top-4 right-4 text-brand-outline hover:text-brand-text cursor-pointer p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-left">
              <span className="text-[9px] font-mono text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full uppercase font-bold">
                Księga Praw Kurnika
              </span>
              <h3 className="font-display font-black text-2xl text-brand-text mt-1.5 flex items-center gap-1.5">
                🏆 Wszystkie Osiągnięcia
              </h3>
              <p className="text-xs text-brand-outline font-sans">
                Zbierz wszystkie poziomy hodowcy i odblokuj prestiżowe tytuły dla kurnika.
              </p>
            </div>

            <div className="bg-amber-950 text-amber-50 p-3 rounded-2xl flex items-center justify-between text-xs font-sans">
              <span>Odblokowane statuty:</span>
              <strong className="text-brand-yolk font-mono font-bold text-sm">
                {unlockedCount} / {achievements.length}
              </strong>
            </div>

            {/* List all 13 level accomplishments sequential scrollable block */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {achievements.map((ac) => {
                const progressPct = Math.min(100, Math.floor((ac.progressCurrent / Math.max(1, ac.progressMax)) * 100));
                return (
                  <div 
                    key={ac.id} 
                    className={`p-3 rounded-2xl border flex items-start gap-3 transition-all ${
                      ac.unlocked 
                        ? 'bg-amber-500/5 border-amber-200' 
                        : 'bg-white border-gray-150 opacity-90'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                      ac.unlocked ? 'bg-amber-100 border border-amber-200 shadow-xs' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {ac.unlocked ? ac.icon : '🔒'}
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex justify-between items-baseline gap-1">
                        <h4 className={`font-display font-semibold text-xs ${ac.unlocked ? 'text-brand-text font-bold' : 'text-gray-500'}`}>
                          {ac.title}
                        </h4>
                        <span className="text-[9px] font-mono font-bold text-brand-outline">
                          {ac.progressCurrent} / {ac.progressMax}
                        </span>
                      </div>
                      <p className="text-[10px] text-brand-outline leading-snug font-sans">
                        {ac.description}
                      </p>

                      <div className="w-full bg-gray-100 h-1 rounded-full mt-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            ac.unlocked ? 'bg-emerald-600' : 'bg-amber-600'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>

                      {ac.unlocked ? (
                        <p className="text-[9px] text-amber-900 font-bold font-sans mt-0.5">
                          🎁 Nagroda: {ac.rewardText}
                        </p>
                      ) : (
                        <p className="text-[8px] text-brand-outline font-sans mt-0.5">
                          Postęp: {progressPct}% do celu
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAllModal(false)}
                className="w-full bg-amber-95 w-full bg-amber-950 text-white hover:bg-amber-900 font-sans font-semibold py-2.5 rounded-xl text-center text-xs cursor-pointer active:scale-95 transition-transform"
              >
                Zamknij księgę osiągnięć
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
