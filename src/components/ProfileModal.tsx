import React, { useState } from 'react';
import { X, Check, RotateCcw, Award, User, HelpCircle } from 'lucide-react';
import { handleFarmerAvatarError } from '../utils';

interface ProfileModalProps {
  onClose: () => void;
  farmerName: string;
  avatarUrl: string;
  onSaveProfile: (name: string, avatar: string) => void;
  onResetApp: () => void;
}

const AVATAR_PRESETS = [
  { name: 'Mateo', url: '/portrety/gospodarze/gospodarz1.png' },
  { name: 'Joe', url: '/portrety/gospodarze/gospodarz2.png' },
  { name: 'Halinka', url: '/portrety/gospodarze/gospodarz3.png' },
  { name: 'Jan', url: '/portrety/gospodarze/gospodarz4.png' }
];

export default function ProfileModal({
  onClose,
  farmerName,
  avatarUrl,
  onSaveProfile,
  onResetApp,
}: ProfileModalProps) {
  const [tempName, setTempName] = useState(farmerName);
  const [tempAvatar, setTempAvatar] = useState(avatarUrl);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(tempName, tempAvatar);
    onClose();
  };

  const handleReset = () => {
    onResetApp();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-brand-text/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm bg-white border border-brand-container-highest p-6 rounded-3xl shadow-xl space-y-5 animate-scaleUp text-left">
        <div className="flex justify-between items-center">
          <h3 className="font-display font-bold text-xl text-brand-text">Gospodarstwo - Profil</h3>
          <button 
            onClick={onClose}
            className="text-brand-outline hover:text-brand-text"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-sans font-bold uppercase tracking-wider text-brand-outline block">
              Imię Gospodarza / Nazwa Farmy
            </label>
            <input
              type="text"
              required
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full bg-brand-surface border border-brand-container-high rounded-xl p-3 text-sm focus:outline-none focus:border-brand-yolk font-sans font-semibold text-brand-text"
            />
          </div>

          {/* Avatar selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-sans font-bold uppercase tracking-wider text-brand-outline block">
              Wybierz Portret Gospodarza
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVATAR_PRESETS.map((p) => {
                const isSelected = tempAvatar === p.url;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setTempAvatar(p.url)}
                    className={`relative rounded-full aspect-square border-2 overflow-hidden hover:scale-105 transition-all ${
                      isSelected ? 'border-brand-yolk ring-4 ring-brand-yolk/10 scale-102' : 'border-brand-container'
                    }`}
                  >
                    <img 
                      src={p.url} 
                      alt={p.name} 
                      onError={handleFarmerAvatarError}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-brand-yolk/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-amber-900 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
              {/* Osobne kółeczko dla linku z sieci */}
              {!AVATAR_PRESETS.some(p => p.url === tempAvatar) && tempAvatar && (
                <button
                  type="button"
                  className="relative rounded-full aspect-square border-2 border-brand-yolk ring-4 ring-brand-yolk/10 scale-102 overflow-hidden hover:scale-105 transition-all"
                >
                  <img 
                    src={tempAvatar} 
                    alt="Custom" 
                    onError={handleFarmerAvatarError}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-brand-yolk/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-amber-900 stroke-[3]" />
                  </div>
                </button>
              )}
            </div>
            
            {/* Custom URL Option */}
            <input
              type="text"
              placeholder="Lub wklej własny URL obrazka..."
              value={tempAvatar}
              onChange={(e) => setTempAvatar(e.target.value)}
              className="w-full bg-brand-surface border border-brand-container-high rounded-lg p-2 text-xs focus:outline-none focus:border-brand-yolk font-mono"
            />
          </div>

          {/* Quick presets for Farmer Mateo or Farmer Joe */}
          <div className="space-y-1.5 bg-[#fff5f2] rounded-2xl p-3 border border-brand-container">
            <span className="text-[10px] font-bold text-brand-outline block uppercase">SZYBKIE PROFILE Z SZABLONU</span>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setTempName('Farmer Mateo');
                  setTempAvatar('/portrety/gospodarze/gospodarz1.png');
                }}
                className="flex-1 bg-white hover:bg-amber-50 text-xs font-semibold p-1.5 rounded-lg border border-brand-container transition-colors"
              >
                Mateo 🤠
              </button>
              <button
                type="button"
                onClick={() => {
                  setTempName('Farmer Joe');
                  setTempAvatar('/portrety/gospodarze/gospodarz2.png');
                }}
                className="flex-1 bg-white hover:bg-amber-50 text-xs font-semibold p-1.5 rounded-lg border border-brand-container transition-colors"
              >
                Joe 🧑‍🌾
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-brand-container flex items-center justify-between">
            {showResetConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold py-1.5 px-2.5 rounded-xl transition-colors"
                >
                  Tak, usuń!
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-xs font-bold py-1.5 px-2.5 rounded-xl"
                >
                  Anuluj
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="text-xs text-[#93000a] hover:underline flex items-center gap-1 font-sans font-medium"
                onClick={() => setShowResetConfirm(true)}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resetuj Dane</span>
              </button>
            )}

            <button
              type="submit"
              className="bg-amber-950 hover:bg-amber-900 text-white font-sans font-semibold py-2 px-5 rounded-xl shadow-xs hover:shadow transition-all text-xs"
            >
              Zapisz Zmiany
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
