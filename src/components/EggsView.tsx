import React, { useState } from 'react';
import { Minus, Plus, Check, PlusCircle, Calendar, Sparkles } from 'lucide-react';
import { HarvestLog } from '../types';

interface EggsViewProps {
  harvestLogs: HarvestLog[];
  onAddHarvest: (count: number, label: string) => void;
}

const CHICKEN_TIPS = [
  "Kura, która gdacze, najwięcej jajek niesie. Twoje dziś wyjątkowo głośne!",
  "Czysta słoma w gniazdach stymuluje produkcję o 5%. Pamiętaj o uzupełnianiu!",
  "Letni upał rozleniwia. Podaj kurom chłodną wodę z miętą dla ochłody.",
  "Melodia płynąca z radia uspokaja nioski. Zofia najbardziej lubi polski jazz!",
  "Zbilansowane składniki mineralne to grubsza skorupka. Nie żałuj kredy pastewnej!",
  "Częste zbieranie jaj prowokuje kury do znoszenia kolejnych. Dobry gospodarz zbiera rano i pod wieczór."
];

export default function EggsView({ harvestLogs, onAddHarvest }: EggsViewProps) {
  const [tempCount, setTempCount] = useState<number>(10);
  const [collectionLabel, setCollectionLabel] = useState<string>('Poranny');
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [lastSubmittedCount, setLastSubmittedCount] = useState<number | null>(null);

  const increment = () => setTempCount((prev) => prev + 1);
  const decrement = () => setTempCount((prev) => Math.max(0, prev - 1));

  const handleConfirm = () => {
    onAddHarvest(tempCount, collectionLabel || 'Poranny');
    setLastSubmittedCount(tempCount);
    setShowSuccessMsg(true);
    setTimeout(() => {
      setShowSuccessMsg(false);
    }, 4000);
  };

  // Get a random tip based on submitted count or static
  const tipIndex = lastSubmittedCount ? lastSubmittedCount % CHICKEN_TIPS.length : 0;

  return (
    <div className="w-full max-w-md mx-auto bg-brand-surface min-h-[85vh] pb-24 px-5 py-5 overflow-hidden rounded-2xl flex flex-col space-y-6">
      {/* View Header */}
      <div className="space-y-1 text-center">
        <h1 className="font-display font-bold text-3xl tracking-tight text-brand-text">
          Nioski w Akcji
        </h1>
        <p className="text-sm text-brand-outline font-sans">
          Zarządzanie Twoimi pierzastymi pracownikami
        </p>
      </div>

      {/* Main Counter Nest Card */}
      <div className="bg-[#fff0ee] border border-brand-container-high rounded-3xl p-6 shadow-sm space-y-6 relative">
        <h2 className="font-display font-bold text-xl text-center text-brand-text">
          Ile jajek dziś wpadło?
        </h2>

        {/* Counter controls */}
        <div className="flex items-center justify-center gap-6">
          {/* Minus Button */}
          <button
            onClick={decrement}
            className="w-12 h-12 rounded-2xl bg-[#ffd6d0] hover:bg-[#ffbebe] active:scale-90 flex items-center justify-center text-[#93000a] transition-all focus:outline-none"
            aria-label="Dyskredytuj"
            id="egg-minus-btn"
          >
            <Minus className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Large Egg Circle display */}
          <div className="relative group select-none">
            {/* Soft decorative shadow */}
            <div className="absolute inset-0 bg-brand-yolk/20 blur-lg rounded-full group-hover:scale-105 transition-transform"></div>
            
            <div className="relative w-36 h-48 egg-shape bg-brand-yolk flex flex-col items-center justify-center text-brand-text shadow-xl border-4 border-white transform hover:rotate-2 transition-transform">
              <span className="font-display font-bold text-6xl text-white leading-none tracking-tight">
                {tempCount}
              </span>
              <span className="text-[11px] font-sans font-bold uppercase text-brand-primary tracking-wider mt-1.5 opacity-80">
                nowości
              </span>
            </div>
          </div>

          {/* Plus Button */}
          <button
            onClick={increment}
            className="w-12 h-12 rounded-2xl bg-[#d4fcd0] hover:bg-[#b0f5ab] active:scale-90 flex items-center justify-center text-brand-secondary transition-all focus:outline-none"
            aria-label="Zwiększ"
            id="egg-plus-btn"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Dynamic Label selector/input */}
        <div className="space-y-1.5 px-2">
          <label className="text-[11px] font-bold text-brand-outline uppercase tracking-wider font-sans block">
            Pora / Opis zbioru
          </label>
          <div className="flex gap-2">
            {['Poranny', 'Wieczorny'].map((lbl) => (
              <button
                key={lbl}
                onClick={() => setCollectionLabel(lbl)}
                className={`flex-1 text-xs font-sans font-bold py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                  collectionLabel === lbl
                    ? 'bg-amber-950 border-amber-950 text-white shadow-xs'
                    : 'bg-white border-brand-container-highest text-brand-outline hover:bg-white/80'
                }`}
                id={`label-btn-${lbl}`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleConfirm}
          className="w-full bg-amber-950 hover:bg-amber-900 text-white font-sans font-semibold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 transition-all active:scale-98 shadow' md:hover:shadow-lg mt-2 cursor-pointer"
          id="submit-harvest-btn"
        >
          <span>Zatwierdź Zbiór</span>
          <Check className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Success Announcement Overlay */}
        {showSuccessMsg && (
          <div className="absolute inset-0 bg-[#eefdeb]/98 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-3 transition-opacity">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-brand-secondary shadow-inner">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-semibold text-lg text-emerald-950">Zbiór zapisany pomyślnie!</h3>
              <p className="text-xs text-emerald-900 font-sans max-w-[240px]">
                Dodano <strong className="font-bold">{lastSubmittedCount} jajek</strong> jako <strong>{collectionLabel}</strong>. Kury gdaczą z zadowolenia!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Ostatnie logi section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-brand-text">Ostatnie Logi</h2>
          <span className="text-xs text-brand-outline font-medium tracking-tight">Ostatnie 3 dni</span>
        </div>

        <div className="space-y-2">
          {harvestLogs.map((log, index) => (
            <div
              key={log.id}
              className="bg-white border border-[#ffeedd] rounded-2xl p-4 flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-[#d2f3cf] text-brand-secondary' : 'bg-gray-100 text-gray-400'
                }`}>
                  <div className="w-5 h-6 rounded-full border-2 border-current egg-shape opacity-80 flex items-center justify-center font-bold text-[10px]">
                    💧
                  </div>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-sm text-brand-text">
                    {log.time}
                  </h4>
                  <p className="text-xs text-brand-outline font-sans">{log.label}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg text-brand-text">
                  {log.count}
                </span>
                <span className="text-xs text-gray-400 font-sans">szt.</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Polish Chicken Tip */}
      <div className="border border-dashed border-emerald-600/30 bg-emerald-500/5 rounded-2xl p-4 flex gap-3 text-[#1e3f20]">
        <span className="text-2xl pt-0.5 select-none font-display">💡</span>
        <p className="text-xs leading-relaxed italic font-sans">
          &rdquo;{CHICKEN_TIPS[tipIndex]}&rdquo;
        </p>
      </div>
    </div>
  );
}
