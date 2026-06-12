import React, { useState } from 'react';
import { Star, Plus, ShieldAlert, X, Check, Activity, Award } from 'lucide-react';
import { Chicken } from '../types';
import { CHICKEN_AVATAR_PRESETS, handleChickenAvatarError } from '../utils';

interface ChickensViewProps {
  chickens: Chicken[];
  onAddChicken: (name: string, description: string, rating: number, avatar: string, price: number) => void;
  onRemoveChicken: (chickenId: string) => void;
  farmCash: number;
}

export default function ChickensView({
  chickens,
  onAddChicken,
  onRemoveChicken,
  farmCash,
}: ChickensViewProps) {
  // Add Chicken Modal
  const [showAddChickenModal, setShowAddChickenModal] = useState(false);
  const [newChickenName, setNewChickenName] = useState('');
  const [newChickenDesc, setNewChickenDesc] = useState('');
  const [newChickenRating, setNewChickenRating] = useState(5);
  const [newChickenAvatar, setNewChickenAvatar] = useState(CHICKEN_AVATAR_PRESETS[0]);
  const [newChickenPrice, setNewChickenPrice] = useState<number>(25);

  // Sorting mode: 'seniority' (days in coop) or 'rating' (star rating)
  const [chickenSortMode, setChickenSortMode] = useState<'seniority' | 'rating'>('seniority');

  // Map default days if not defined (to make seniority interesting)
  const getDaysInCoop = (ch: Chicken): number => {
    // Determine days in coop based on ID or precalculated fields
    if (ch.daysInCoop !== undefined) return ch.daysInCoop;
    // Fallback logic
    if (ch.id === '1') return 120;
    if (ch.id === '2') return 98;
    if (ch.id === '3') return 84;
    if (ch.id === '4') return 60;
    if (ch.id === '5') return 45;
    if (ch.id === '6') return 30;
    // Random fallback for new chickens based on their creation time
    const idNum = parseInt(ch.id) || Date.now();
    return Math.floor(((Date.now() - idNum) / (1000 * 60 * 60 * 24))) || 1;
  };

  const getSeniorityLabel = (days: number): string => {
    if (days >= 100) return 'Stara Gwardia 👑';
    if (days >= 60) return 'Doświadczona Nioska 🎖️';
    if (days >= 30) return 'Stała Rezydentka 🏡';
    return 'Młoda Rekrutka 🌱';
  };

  // Sort chickens
  const sortedChickens = [...chickens].sort((a, b) => {
    if (chickenSortMode === 'rating') {
      const ratingDiff = b.rating - a.rating;
      if (ratingDiff !== 0) return ratingDiff;
    }
    // Default or fallback to seniority
    return getDaysInCoop(b) - getDaysInCoop(a);
  });

  // Podium
  const rank1 = sortedChickens[0];
  const rank2 = sortedChickens[1];
  const rank3 = sortedChickens[2];
  const remainingChickens = sortedChickens.slice(3);

  const handleCreateChicken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChickenName.trim()) return;

    onAddChicken(
      newChickenName.trim(),
      newChickenDesc.trim() || '"Młoda obiecująca nioska"',
      newChickenRating,
      newChickenAvatar,
      newChickenPrice
    );

    // Reset Form
    setNewChickenName('');
    setNewChickenDesc('');
    setNewChickenRating(5);
    setNewChickenAvatar(CHICKEN_AVATAR_PRESETS[0]);
    setNewChickenPrice(25);
    setShowAddChickenModal(false);
  };

  return (
    <div className="px-5 py-4 flex-1 flex flex-col space-y-4 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-brand-text">Grono Naszych Niosek</h1>
          <p className="text-[11px] text-brand-outline">Zarządzanie stadem, staż w kurniku oraz alarm przed lisem</p>
        </div>
        <div className="bg-[#fff3e0] border border-amber-200 px-3 py-1.5 rounded-2xl flex items-center gap-1.5">
          <span className="text-sm">🐔</span>
          <span className="font-display font-black text-sm text-amber-950">{chickens.length} szt.</span>
        </div>
      </div>

      {/* Sorting Control */}
      <div className="bg-[#fff9f6] border border-brand-container p-1 rounded-2xl flex gap-1 shadow-2xs">
        <button
          onClick={() => setChickenSortMode('seniority')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            chickenSortMode === 'seniority'
              ? 'bg-amber-950 text-white shadow-xs'
              : 'text-brand-outline hover:text-brand-text'
          }`}
        >
          🕰️ Sortuj: Staż w Stadzie
        </button>
        <button
          onClick={() => setChickenSortMode('rating')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            chickenSortMode === 'rating'
              ? 'bg-amber-950 text-white shadow-xs'
              : 'text-brand-outline hover:text-brand-text'
          }`}
        >
          ⭐ Sortuj: Klasa/Ocena
        </button>
      </div>

      {/* PODIUM OF SENIORS */}
      {chickens.length > 0 && (
        <div className="bg-gradient-to-b from-[#fffaf3] to-[#fff4e3] border border-amber-200 rounded-3xl p-4 shadow-sm space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-yolk/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="text-center space-y-0.5">
            <span className="text-[10px] bg-amber-950 text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {chickenSortMode === 'rating' ? '👑 Klasowe Autorytety Kurnika' : '👑 Podium Starszeństwa Kurnika'}
            </span>
            <p className="text-[10px] text-brand-outline">
              {chickenSortMode === 'rating' ? 'Najwyżej oceniane nioski o wielkim prestiżu' : 'Kury z najdłuższym stażem i mianem autorytetu stada'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-3.5 pb-2 border-b border-brand-container">
            {/* RANK #2 */}
            {rank2 ? (
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="relative">
                  <img 
                    src={rank2.avatar} 
                    alt={rank2.name} 
                    onError={handleChickenAvatarError}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full border-2 border-gray-400 object-cover shadow-xs"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-400 border border-white flex items-center justify-center font-display font-bold text-[10px] text-white">
                    2
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-display font-bold text-xs text-brand-text truncate max-w-[85px]">{rank2.name}</h3>
                  <p className="text-[9px] text-[#553c00] font-black font-mono bg-[#fffde6] border border-amber-200 px-1 rounded-sm">
                    {chickenSortMode === 'rating' ? `⭐ ${rank2.rating} / 5` : `🕰️ ${getDaysInCoop(rank2)} dni`}
                  </p>
                  <button 
                    type="button"
                    onClick={() => onRemoveChicken(rank2.id)}
                    className="mt-1 text-[8px] font-bold text-red-900 bg-red-50 hover:bg-red-100 border border-red-200 px-1.5 py-0.5 rounded-full cursor-pointer transition-transform active:scale-95 whitespace-nowrap"
                    title="Lis porwał kurę!"
                  >
                    🦊 Lis!
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-10" />
            )}

            {/* RANK #1 (Nestor) */}
            {rank1 ? (
              <div className="flex flex-col items-center text-center space-y-1 -mt-2">
                <div className="relative scale-110">
                  <img 
                    src={rank1.avatar} 
                    alt={rank1.name} 
                    onError={handleChickenAvatarError}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-full border-2 border-brand-yolk object-cover shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-full bg-brand-yolk border-2 border-white flex items-center justify-center font-display font-black text-xs text-amber-950 shadow-md">
                    👑
                  </div>
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <h3 className="font-display font-black text-xs text-brand-text truncate max-w-[95px]">{rank1.name}</h3>
                  <p className="text-[10px] text-amber-950 font-black font-mono bg-brand-yolk border border-brand-yolk/30 px-1.5 rounded-sm">
                    {chickenSortMode === 'rating' ? `⭐ ${rank1.rating} / 5` : `🕰️ ${getDaysInCoop(rank1)} dni`}
                  </p>
                  <button 
                    type="button"
                    onClick={() => onRemoveChicken(rank1.id)}
                    className="mt-1 text-[8px] font-bold text-red-900 bg-red-100 hover:bg-red-200 border border-red-300 px-2 py-0.5 rounded-full cursor-pointer transition-transform active:scale-95 whitespace-nowrap shadow-xs"
                    title="Lis porwał kurę!"
                  >
                    🦊 Lis!
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-10 animate-pulse bg-amber-100/30 rounded-full" />
            )}

            {/* RANK #3 */}
            {rank3 ? (
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="relative">
                  <img 
                    src={rank3.avatar} 
                    alt={rank3.name} 
                    onError={handleChickenAvatarError}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full border-2 border-amber-600/60 object-cover shadow-xs"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-600 border border-white flex items-center justify-center font-display font-bold text-[10px] text-white">
                    3
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-display font-bold text-xs text-brand-text truncate max-w-[85px]">{rank3.name}</h3>
                  <p className="text-[9px] text-[#553c00] font-black font-mono bg-[#fffde6] border border-amber-200 px-1 rounded-sm">
                    {chickenSortMode === 'rating' ? `⭐ ${rank3.rating} / 5` : `🕰️ ${getDaysInCoop(rank3)} dni`}
                  </p>
                  <button 
                    type="button"
                    onClick={() => onRemoveChicken(rank3.id)}
                    className="mt-1 text-[8px] font-bold text-red-900 bg-red-50 hover:bg-red-100 border border-red-200 px-1.5 py-0.5 rounded-full cursor-pointer transition-transform active:scale-95 whitespace-nowrap"
                    title="Lis porwał kurę!"
                  >
                    🦊 Lis!
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-10" />
            )}
          </div>
        </div>
      )}

      {/* POZOSTAŁE NIOSKI W STADZIE */}
      <div className="space-y-2.5 flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full pr-1">
        <h2 className="font-display font-bold text-lg text-brand-text">Pozycje i Pozostałe Nioski ({remainingChickens.length})</h2>

        {remainingChickens.length === 0 ? (
          <div className="text-center p-6 text-brand-outline text-xs bg-amber-50/20 rounded-2xl border border-dashed border-amber-200">
            Wszystkie pozostałe nioski mieszczą się na Twoim podium starszeństwa! Kup więcej kur lub zrekrutuj nowe.
          </div>
        ) : (
          <div className="space-y-2.5">
            {remainingChickens.map((ch, idx) => {
              const days = getDaysInCoop(ch);
              return (
                <div 
                  key={ch.id}
                  className="bg-white border border-[#ffeedd] rounded-2xl p-3 flex items-center justify-between hover:bg-white/95 shadow-2xs gap-3 animate-scaleUp overflow-hidden w-full"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={ch.avatar} 
                      alt={ch.name} 
                      onError={handleChickenAvatarError}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border border-brand-container-highest object-cover shrink-0"
                    />
                    <div className="text-left min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-display font-bold text-sm text-brand-text truncate">{ch.name}</h4>
                        <span className="text-[9px] text-brand-outline bg-gray-100 px-1.5 rounded font-sans leading-none"># {idx + 4}</span>
                      </div>
                      
                      <p className="text-[10px] font-bold text-amber-900/95 font-sans leading-tight mt-0.5">
                        🕰️ {getSeniorityLabel(days)} ({days} dni w stadzie)
                      </p>
                      <p className="text-[11px] text-brand-outline font-sans italic leading-tight truncate">{ch.description}</p>
                      
                      {/* Stars */}
                      <div className="flex gap-0.5 mt-0.5 text-brand-yolk">
                        {[...Array(ch.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right shrink-0">
                      <span className="font-display font-semibold text-xs text-brand-outline block leading-none">
                        {chickenSortMode === 'rating' ? 'Klasa:' : 'Staż:'}
                      </span>
                      <span className="text-[10px] text-brand-text font-bold block bg-amber-50 px-2 py-0.5 rounded mt-1 text-center whitespace-nowrap">
                        {chickenSortMode === 'rating' ? `⭐ ${ch.rating} / 5` : `🕰️ ${days} dni`}
                      </span>
                    </div>

                    {/* Fox Attack / Remove helper */}
                    <button 
                      type="button"
                      onClick={() => onRemoveChicken(ch.id)}
                      className="p-1 px-2 text-red-900 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl cursor-pointer active:scale-95 transition-all flex flex-col items-center justify-center font-bold shrink-0"
                      title="Zgłoś, że lis zabrał tę kurę!"
                    >
                      <span className="text-base select-none">🦊</span>
                      <span className="text-[7px] uppercase font-black tracking-tighter mt-0.5 leading-none">Lis!</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RECRUIT BUTTON */}
      <div className="pt-2">
        <button
          onClick={() => setShowAddChickenModal(true)}
          className="w-full bg-amber-950 hover:bg-amber-900 text-white font-display font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
          id="show-add-chicken-btn"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Zwerbuj Nową Kurę (-25 PLN)</span>
        </button>
      </div>

      {/* CHICKEN ADD MODAL */}
      {showAddChickenModal && (
        <div className="fixed inset-0 bg-brand-text/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form 
            onSubmit={handleCreateChicken}
            className="w-full max-w-sm bg-white border border-brand-container-highest p-6 rounded-3xl shadow-xl space-y-4 animate-scaleUp text-left"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-xl text-brand-text">🐔 Dodaj Nową Kurę</h3>
              <button 
                type="button" 
                onClick={() => setShowAddChickenModal(false)}
                className="text-brand-outline hover:text-brand-text"
              >
                <X className="w-6 h-6 border-none" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-outline font-sans">Imię Kury / Nazwa</label>
                <input
                  type="text"
                  required
                  placeholder="Np. Szafirowa Gienia"
                  value={newChickenName}
                  onChange={(e) => setNewChickenName(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-container-high rounded-xl p-3 text-sm focus:outline-none focus:border-brand-yolk font-sans text-brand-text"
                  id="new-chicken-name-input"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-outline font-sans">Opis / Charakter (Ulubiony rewir)</label>
                <input
                  type="text"
                  placeholder="Np. Uwielbia kukurydzę, cicha i rzetelna"
                  value={newChickenDesc}
                  onChange={(e) => setNewChickenDesc(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-container-high rounded-xl p-3 text-sm focus:outline-none focus:border-brand-yolk font-sans text-brand-text"
                  id="new-chicken-desc-input"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-outline font-sans block">Ocena Gwiazdowa nioski</label>
                <div className="flex gap-2 text-brand-yolk">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setNewChickenRating(stars)}
                      className="p-1 focus:outline-none cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${newChickenRating >= stars ? 'fill-current text-brand-yolk' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-outline font-sans block">Koszt zakupu kury (PLN)</label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={newChickenPrice}
                  onChange={(e) => setNewChickenPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-brand-surface border border-brand-container-high rounded-xl p-3 text-sm focus:outline-none focus:border-brand-yolk font-mono font-bold text-brand-text"
                  id="new-chicken-price-input"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-brand-outline font-sans block">Wybierz portret z kurnika:</span>
                <div className="grid grid-cols-6 gap-2">
                  {CHICKEN_AVATAR_PRESETS.map((presetImg, idx) => {
                    const isSelected = newChickenAvatar === presetImg;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewChickenAvatar(presetImg)}
                        className={`w-11 h-11 rounded-xl relative overflow-hidden border-2 transition-all cursor-pointer ${
                          isSelected ? 'border-brand-yolk scale-110 shadow-sm' : 'border-gray-200 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={presetImg} alt={`Preskura ${idx + 1}`} onError={handleChickenAvatarError} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-brand-yolk/25 flex items-center justify-center">
                            <Check className="w-4 h-4 text-amber-950 font-bold" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddChickenModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-brand-outline font-sans font-semibold py-2.5 rounded-xl transition-colors"
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="flex-1 bg-amber-950 hover:bg-amber-900 text-white font-sans font-semibold py-2.5 rounded-xl shadow-sm transition-colors"
                id="submit-chicken-form-btn"
              >
                Zwerbuj
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
