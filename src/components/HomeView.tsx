import React, { useState } from 'react';
import { Heart, PiggyBank, Bell, Clock, ChevronRight, AlertCircle, Sparkles, Wheat, Plus, Smile, Check, X, Cloud, Scale, TrendingDown, BookOpen } from 'lucide-react';
import { Chicken, Client, HarvestLog, AlertLog, Achievement, FeedLog } from '../types';
import { handleFarmerAvatarError } from '../utils';

const CHICKEN_PRO_TIPS = [
  "Kury uwielbiają słuchać spokojnej i cichej muzyki. Redukuje to stres i może zwiększyć nioskowość o kilkanaście procent!",
  "Kura potrafi rozpoznać i zapamiętać ponad 100 różnych twarzy ludzkich oraz rozróżnia swoje pierzaste koleżanki.",
  "Kolor skorupki jajka zależy głównie od rasy: kury o białych płatkach usznych znoszą białe jajka, a te o czerwonych - brązowe.",
  "Kury są bezpośrednimi potomkami teropodów, w tym legendarnego Tyranozaura Rexa! Zachowały po nich sposób poruszania.",
  "Garść ziarna kukurydzy lub dodatek płatków nagietka sprawia, że żółtka jajek stają się pięknie pomarańczowe.",
  "Kury uwielbiają kąpiele w suchym piasku lub ziemi, chroniąc się w ten sposób naturalnie przed pasożytami.",
  "Stado bardzo dobrze widzi kolory (nawet UV), znacznie wyraźniej niż ludzie, co pomaga im w poszukiwaniu owadów.",
  "Kury posiadają unikalny język komunikacji składający się z ponad 30 różnych precyzyzyjnych gdakań i okrzyków ostrzegawczych."
];

interface HomeViewProps {
  farmerName: string;
  avatarUrl: string;
  onOpenProfile: () => void;
  stadoSize: number;
  cashInNest: number;
  todayEggsCount: number;
  eggsInStock: number;
  feedStock: number;
  feedLogs: FeedLog[];
  onReportFeedConsumption: (amountKg: number, note: string) => void;
  onUpdateFeedStock: (newStock: number, note: string) => void;
  achievements: Achievement[];
  onKupPasze: (price: number, amountKg: number, label: string) => void;
  onNowaKura: () => void;
  onLisiaWizyta: () => void;
  alerts: AlertLog[];
  onOpenAddClient: () => void;
  onNavigateToTab: (tab: string) => void;
  onLoadDemoData: () => void;
  eggPrice: number;
  onUpdateEggPrice: (newPrice: number) => void;
  isSyncing: boolean;
  lastSyncTime: string;
  onForceSync: () => void;
}

export default function HomeView({
  farmerName,
  avatarUrl,
  onOpenProfile,
  stadoSize,
  cashInNest,
  todayEggsCount,
  eggsInStock,
  feedStock,
  feedLogs,
  onReportFeedConsumption,
  onUpdateFeedStock,
  achievements,
  onKupPasze,
  onNowaKura,
  onLisiaWizyta,
  alerts,
  onOpenAddClient,
  onNavigateToTab,
  onLoadDemoData,
  eggPrice,
  onUpdateEggPrice,
  isSyncing,
  lastSyncTime,
  onForceSync,
}: HomeViewProps) {
  const [tipIndex, setTipIndex] = useState(0);
  const [showFeedManagerModal, setShowFeedManagerModal] = useState(false);
  const [feedManagerTab, setFeedManagerTab] = useState<'consumption' | 'correction' | 'buy'>('consumption');

  // Input states for Feed Manager modal
  const [inputConsumption, setInputConsumption] = useState<number>(2.5);
  const [inputConsumptionNote, setInputConsumptionNote] = useState('Karmienie poranne');
  
  const [inputCorrection, setInputCorrection] = useState<number>(feedStock);
  const [inputCorrectionNote, setInputCorrectionNote] = useState('Rzeczywisty pomiar w spichlerzu');

  // Custom purchase feed inside the modal
  const [customFeedName, setCustomFeedName] = useState('Pasza pełnoporcjowa');
  const [customFeedWeight, setCustomFeedWeight] = useState<number>(25);
  const [customFeedPrice, setCustomFeedPrice] = useState<number>(50);

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % CHICKEN_PRO_TIPS.length);
  };

  const prevTip = () => {
    setTipIndex((prev) => (prev - 1 + CHICKEN_PRO_TIPS.length) % CHICKEN_PRO_TIPS.length);
  };

  const handleOpenFeedManager = () => {
    setInputCorrection(feedStock);
    setShowFeedManagerModal(true);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-brand-surface min-h-[85vh] pb-24 overflow-hidden rounded-2xl flex flex-col">
      {/* Top Profile Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-brand-container">
        <button 
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 group focus:outline-none"
          id="profile-btn"
        >
          <img 
            src={avatarUrl} 
            alt="Farmer Avatar" 
            onError={handleFarmerAvatarError}
            className="w-10 h-10 rounded-full border-2 border-brand-yolk object-cover shadow-sm group-hover:scale-105 transition-transform"
          />
          <div className="text-left">
            <span className="text-[9px] text-brand-on-surface-variant font-bold uppercase tracking-wider block leading-none">Twój Kurnik</span>
            <span className="font-display font-bold text-base text-brand-text group-hover:text-brand-yolk-dark transition-colors leading-tight">{farmerName}</span>
          </div>
        </button>

        {/* Compact Top Bar Sync Status */}
        <div className="flex items-center gap-2">
          <button
            onClick={onForceSync}
            disabled={isSyncing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all active:scale-[0.97] text-[10px] font-mono font-bold ${
              isSyncing 
                ? 'bg-amber-50 border-amber-200 text-amber-900 animate-pulse' 
                : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-950 shadow-xs'
            }`}
            title={`Autozapis gniazda aktywny! Ostatni autosync: ${lastSyncTime}`}
            id="d1-sync-top-btn"
          >
            <Cloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-600' : 'text-emerald-750'}`} />
            <span className="hidden xs:inline">Autosync: {lastSyncTime}</span>
            <span className="xs:hidden font-bold">{lastSyncTime}</span>
            <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></span>
          </button>

          <button 
            onClick={onOpenProfile}
            className="p-1.5 text-brand-on-surface-variant hover:text-brand-yolk transition-colors rounded-full hover:bg-brand-container-low"
            title="Ustawienia Profilu"
            id="smiley-btn"
          >
            <Smile className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="px-5 py-5 flex-1 space-y-6">
        {/* Hello Banner */}
        <div className="space-y-1">
          <h1 className="font-display font-bold text-3xl tracking-tight text-brand-text">
            Witaj w Kurniku!
          </h1>
          <p className="text-sm text-brand-on-surface-variant font-sans">
            Pierzaste pracownice ciężko pracują. Oto dzisiejsze zestawienie.
          </p>
        </div>

        {/* Empty state Demo loader banner */}
        {stadoSize === 0 && (
          <div className="bg-[#fff3f0] border-2 border-dashed border-orange-200 rounded-3xl p-5 text-center space-y-3 relative overflow-hidden shadow-xs animate-scaleUp">
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-200/20 rounded-full blur-xs pointer-events-none" />
            <span className="text-2xl block animate-bounce">🐔</span>
            <h3 className="font-display font-black text-amber-950 text-base leading-tight">Twój Kurnik jest gotowy do zasiedlenia!</h3>
            <p className="text-xs text-brand-outline leading-relaxed px-1 font-sans">
              To czyste konto jest puste i gotowe pod Twój własny drób i klientów. Możesz też załadować gotowe dane próbne do natychmiastowego testowania!
            </p>
            <button
              onClick={onLoadDemoData}
              className="bg-amber-950 hover:bg-amber-900 text-white text-xs font-sans font-bold py-2.5 px-5 rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              🚀 Załaduj Gotowe Dane Demo
            </button>
          </div>
        )}



        {/* Highlights - Today's Harvest */}
        <div 
          onClick={() => onNavigateToTab('jajka')}
          className="bg-[#fff4e0] border border-amber-200 rounded-3xl p-5 flex items-center justify-between cursor-pointer hover:opacity-95 active:scale-98 transition-all shadow-xs"
          id="today-harvest-card"
        >
          <div className="space-y-1">
            <span className="text-xs uppercase font-semibold text-amber-950 tracking-wider font-sans">
              Dzisiejszy zbiór z kurnika
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-medium text-3xl text-amber-950">
                {todayEggsCount}
              </span>
              <span className="font-display font-medium text-2xl text-amber-950">
                {todayEggsCount === 1 ? 'jajko' : (todayEggsCount % 10 >= 2 && todayEggsCount % 10 <= 4 && (todayEggsCount % 100 < 10 || todayEggsCount % 100 >= 20)) ? 'jajka' : 'jajek'}
              </span>
            </div>
          </div>
          <div className="w-14 h-14 bg-brand-yolk rounded-2xl flex items-center justify-center shadow-xs animate-pulse">
            <span className="text-2xl">🧺</span>
          </div>
        </div>

        {/* NEW INVENTORY ROW - Eggs available in stock & Feed Stock status */}
        <div className="grid grid-cols-2 gap-4">
          {/* Available to Sell Counter */}
          <div 
            onClick={() => onNavigateToTab('klienci')}
            className="bg-[#eefcfd] border border-[#ccf4f6] rounded-3xl p-5 flex flex-col justify-between h-36 cursor-pointer hover:opacity-95 transition-opacity relative overflow-hidden"
            id="eggs-stock-inventory-card"
          >
            <div className="flex justify-between items-center">
              <div className="w-9 h-9 rounded-full bg-[#ccf4f6] flex items-center justify-center text-teal-800">
                <span className="text-base">🥚</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${eggsInStock > 0 ? 'bg-emerald-500 animate-ping' : 'bg-red-400'}`}></span>
                <span className="text-[8px] font-bold text-teal-900 uppercase font-sans">
                  {eggsInStock > 0 ? 'Na stanie' : 'Brak !'}
                </span>
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-3xl text-teal-950 block leading-none">
                {eggsInStock} szt.
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 font-sans mt-1 block">
                Magazyn Jajek
              </span>
            </div>
          </div>

          {/* Feed Stock Status */}
          <div 
            onClick={handleOpenFeedManager}
            className="bg-[#f0fbf0] border border-[#daf2da] rounded-3xl p-5 flex flex-col justify-between h-36 cursor-pointer hover:opacity-95 transition-opacity relative"
            id="feed-stock-card"
          >
            <div className="flex justify-between items-start">
              <div className="w-9 h-9 rounded-full bg-[#c9ecc9] flex items-center justify-center text-emerald-800">
                <Wheat className="w-5 h-5" />
              </div>
              <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase font-sans ${feedStock <= 5 ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-emerald-100 text-emerald-800'}`}>
                {feedStock <= 5 ? 'GŁÓD!' : 'Dostatek'}
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-bold text-2xl text-emerald-950 leading-none">
                  {feedStock} kg
                </span>
              </div>
              
              {/* Custom micro feed progress bar (max 50kg for visual standard) */}
              <div className="w-full bg-emerald-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${feedStock <= 5 ? 'bg-rose-500' : 'bg-emerald-600'}`}
                  style={{ width: `${Math.min(100, (feedStock / 50) * 100)}%` }}
                />
              </div>

              <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-800 font-sans mt-1 block">
                Zapas Paszy
              </span>
            </div>
          </div>
        </div>

        {/* Small stats row (Flock & nesting Cash) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Stado size */}
          <div 
            onClick={() => onNavigateToTab('kury')}
            className="bg-[#fcf8f2] border border-[#ffeedd] rounded-3xl p-5 flex flex-col justify-between h-36 cursor-pointer hover:opacity-95 transition-opacity"
            id="stado-card"
          >
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="font-display font-bold text-3xl text-amber-950 block leading-none">
                {stadoSize}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 font-sans mt-1 block">
                Kury nioski
              </span>
            </div>
          </div>

          {/* Money in Nest */}
          <div 
            onClick={() => onNavigateToTab('statystyki')}
            className="bg-[#fff0ee] border border-[#ffdad4] rounded-3xl p-5 flex flex-col justify-between h-36 cursor-pointer hover:opacity-95 transition-opacity"
            id="kasa-card"
          >
            <div className="w-9 h-9 rounded-full bg-[#ffd1ca] flex items-center justify-center text-[#ba1a1a]">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-3xl text-[#ba1a1a] block leading-none">
                {cashInNest.toFixed(2)} PLN
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#ba1a1a]/80 font-sans mt-1 block">
                Skarbonka
              </span>
            </div>
          </div>
        </div>

        {/* Globalna Cena Jajka Widget */}
        <div className="bg-[#fffcf0] border border-amber-200 rounded-3xl p-5 space-y-3.5 shadow-xs">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#7a4b00]">Ustawienie Globalne</span>
              <h3 className="font-display font-extrabold text-amber-950 text-sm md:text-base">Bazowa rynkowa cena jajka</h3>
            </div>
            <div className="bg-amber-100 border border-amber-300 text-amber-950 px-3 py-1 rounded-xl text-xs font-mono font-black shadow-xs">
              {eggPrice.toFixed(2)} PLN
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateEggPrice(Math.max(0.50, eggPrice - 0.05))}
              className="px-3 py-2 text-xs font-sans font-bold text-red-700 bg-red-100/75 hover:bg-red-100 rounded-xl active:scale-95 transition-all cursor-pointer shadow-xs border border-red-200/40"
              id="price-dec-btn"
            >
              -0.05 PLN
            </button>
            
            <div className="flex-1 text-center font-mono text-xs font-bold text-[#4e2d00] py-1.5 bg-white rounded-xl border border-amber-300/40 shadow-inner">
              🏷️ {eggPrice.toFixed(2)} PLN/szt.
            </div>

            <button
              onClick={() => onUpdateEggPrice(Math.min(5.00, eggPrice + 0.05))}
              className="px-3 py-2 text-xs font-sans font-bold text-emerald-800 bg-emerald-100/75 hover:bg-emerald-100 rounded-xl active:scale-95 transition-all cursor-pointer shadow-xs border border-emerald-200/40"
              id="price-inc-btn"
            >
              +0.05 PLN
            </button>
          </div>
        </div>

        {/* Gospodarskie Wydatki Section */}
        <div className="space-y-3">
          <h2 className="font-display font-bold text-xl text-brand-text">
            Gospodarskie Wydatki
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Kup Paszę trigger feed manager modal */}
            <button
              onClick={handleOpenFeedManager}
              className="bg-amber-950 hover:bg-amber-900 text-white font-sans font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm hover:shadow cursor-pointer"
              id="buy-feed-btn"
            >
              <Wheat className="w-4 h-4 text-brand-yolk" />
              <span>Zarządzaj Paszą</span>
            </button>

            {/* Nowa Kura */}
            <button
              onClick={onNowaKura}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-sans font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm hover:shadow cursor-pointer"
              id="new-hen-btn"
            >
              <Plus className="w-4 h-4 text-brand-secondary-light" />
              <span>Nowa Kura</span>
            </button>
          </div>
        </div>

        {/* Czy wiesz, że - Pro tips card */}
        <div className="bg-gradient-to-br from-brand-surface to-[#fdf9f2] border-2 border-amber-100 rounded-3xl p-6 text-center relative shadow-sm">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-950 text-white text-[10px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm">
            CZY WIESZ, ŻE... 🤔
          </div>

          <div className="mt-2 flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 shadow-inner">
              <span className="text-xl">💡</span>
            </div>
            
            <div className="space-y-1.5 px-2">
              <p className="text-xs md:text-sm text-brand-text font-medium leading-relaxed min-h-[70px] flex items-center justify-center">
                "{CHICKEN_PRO_TIPS[tipIndex]}"
              </p>
            </div>

            {/* Pager Buttons / Nav */}
            <div className="flex justify-between items-center w-full px-4 mt-1">
              <button
                onClick={prevTip}
                className="text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl cursor-pointer active:scale-95 transition-all"
              >
                ◀ Wstecz
              </button>
              
              <span className="text-[10px] font-mono text-brand-outline font-bold">
                {tipIndex + 1} / {CHICKEN_PRO_TIPS.length}
              </span>

              <button
                onClick={nextTip}
                className="text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl cursor-pointer active:scale-95 transition-all"
              >
                Dalej ▶
              </button>
            </div>
          </div>
        </div>

        {/* Wydajność Stadka section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl text-brand-text">
                Ostatnie Powiadomienia
              </h2>
            </div>
            <button 
              onClick={() => onNavigateToTab('statystyki')}
              className="text-xs font-bold text-[#7c5800] hover:underline"
              id="view-all-alerts-btn"
            >
              Statystyki
            </button>
          </div>

          <div className="space-y-2">
            {alerts.length === 0 ? (
              <div className="text-center p-4 text-xs text-brand-outline bg-brand-container-low rounded-2xl">
                Cisza w kurniku. Brak nowych powiadomień.
              </div>
            ) : (
              alerts.slice(0, 3).map((alert) => (
                <div 
                  key={alert.id}
                  className="bg-white border border-[#ffeedd] hover:border-brand-yolk/30 rounded-2xl p-3.5 flex items-center justify-between shadow-xs transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      alert.type === 'super' ? 'bg-[#ffebe8] text-[#ba1a1a]' : 'bg-[#fff4e0] text-[#7c5800]'
                    }`}>
                      {alert.type === 'super' ? <Bell className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div className="text-left">
                      <h4 className="font-display font-semibold text-sm text-brand-text">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-brand-outline font-sans">
                        {alert.subtitle}
                      </p>
                    </div>
                  </div>
                  {alert.type === 'super' && (
                    <span className="bg-[#9fff99] text-emerald-950 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider font-sans uppercase">
                      SUPER!
                    </span>
                  )}
                  {alert.type === 'info' && (
                    <ChevronRight className="w-4 h-4 text-brand-outline" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* DETAILED SPICHLERZ & FEED MANAGER MODAL */}
      {showFeedManagerModal && (
        <div className="fixed inset-0 bg-brand-text/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-brand-container-highest p-5 rounded-3xl shadow-2xl space-y-4 animate-scaleUp text-left my-8 max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowFeedManagerModal(false)}
              className="absolute top-4 right-4 text-brand-outline hover:text-brand-text cursor-pointer p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full uppercase font-mono">
                Spichlerz kurnika
              </span>
              <h3 className="font-display font-bold text-2xl text-brand-text mt-1 flex items-center gap-2">
                🌾 Stan i Zużycie Paszy
              </h3>
              <p className="text-xs text-brand-outline font-sans">
                Wprowadzaj zużycie paszy, koryguj zapasy rzeczywiste lub dokupuj worki ze zbożem.
              </p>
            </div>

            {/* Current Stock Board */}
            <div className="bg-gradient-to-r from-emerald-50 to-[#f0faf0] border border-emerald-150 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
                  Aktualny zapas w kurniku:
                </span>
                <strong className="text-3xl font-display font-semibold text-emerald-950 font-mono">
                  {feedStock} kg
                </strong>
                {feedStock <= 5 && (
                  <span className="text-[10px] font-medium text-rose-700 block mt-0.5 animate-pulse">
                    ⚠️ Zapasy krytycznie niskie! Kup paszę.
                  </span>
                )}
              </div>
              <div className="text-right text-xs text-brand-outline font-sans">
                <span>W skarbonce:</span>
                <div className="text-sm font-bold text-emerald-900 font-mono">
                  {cashInNest.toFixed(2)} PLN
                </div>
              </div>
            </div>

            {/* Tab Selectors */}
            <div className="grid grid-cols-3 gap-1 bg-brand-surface p-1 rounded-xl border border-brand-container-high text-xs">
              <button
                type="button"
                onClick={() => setFeedManagerTab('consumption')}
                className={`py-2 rounded-lg font-semibold text-center transition-all cursor-pointer ${
                  feedManagerTab === 'consumption'
                    ? 'bg-white shadow-xs text-brand-text border border-amber-950/10 font-bold'
                    : 'text-brand-outline hover:text-brand-text'
                }`}
              >
                🍽️ Zużycie
              </button>
              <button
                type="button"
                onClick={() => setFeedManagerTab('correction')}
                className={`py-2 rounded-lg font-semibold text-center transition-all cursor-pointer ${
                  feedManagerTab === 'correction'
                    ? 'bg-white shadow-xs text-brand-text border border-amber-950/10 font-bold'
                    : 'text-brand-outline hover:text-brand-text'
                }`}
              >
                ⚖️ Korekta
              </button>
              <button
                type="button"
                onClick={() => setFeedManagerTab('buy')}
                className={`py-2 rounded-lg font-semibold text-center transition-all cursor-pointer ${
                  feedManagerTab === 'buy'
                    ? 'bg-white shadow-xs text-brand-text border border-amber-950/10 font-bold'
                    : 'text-brand-outline hover:text-brand-text'
                }`}
              >
                🛒 Kup paszę
              </button>
            </div>

            {/* Tab content 1: Zużycie */}
            {feedManagerTab === 'consumption' && (
              <div className="space-y-3 p-1 font-sans animate-fadeIn">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1 space-y-1">
                    <label className="text-xs font-bold text-brand-outline block">Masa (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      max="100"
                      value={inputConsumption}
                      onChange={(e) => setInputConsumption(parseFloat(e.target.value) || 0)}
                      className="w-full bg-brand-surface border border-brand-container-high rounded-xl p-2.5 text-sm font-mono font-bold text-center focus:outline-none focus:border-brand-yolk"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-bold text-brand-outline block">Opis / Notatka</label>
                    <input
                      type="text"
                      value={inputConsumptionNote}
                      onChange={(e) => setInputConsumptionNote(e.target.value)}
                      className="w-full bg-brand-surface border border-brand-container-high rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-yolk font-sans"
                      placeholder="Np. Sypanie poranne, dokarmienie wieczorne"
                    />
                  </div>
                </div>

                <div className="flex gap-2 font-sans">
                  <button
                    type="button"
                    onClick={() => setInputConsumption(1.5)}
                    className="flex-1 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-[10px] font-bold p-1 px-1.5 rounded-lg text-brand-text text-center cursor-pointer"
                  >
                    1.5 kg
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputConsumption(2.5)}
                    className="flex-1 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-[10px] font-bold p-1 px-1.5 rounded-lg text-brand-text text-center cursor-pointer"
                  >
                    2.5 kg
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputConsumption(5.0)}
                    className="flex-1 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-[10px] font-bold p-1 px-1.5 rounded-lg text-brand-text text-center cursor-pointer"
                  >
                    5.0 kg
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (inputConsumption <= 0) return;
                    onReportFeedConsumption(inputConsumption, inputConsumptionNote);
                    setInputConsumptionNote('Karmienie popołudniowe');
                  }}
                  disabled={inputConsumption <= 0}
                  className="w-full bg-amber-950 text-white hover:bg-amber-900 font-semibold py-2.5 rounded-xl text-center text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  📉 Zgłoś Zużycie (-{inputConsumption} kg)
                </button>
              </div>
            )}

            {/* Tab content 2: Korekta stanu */}
            {feedManagerTab === 'correction' && (
              <div className="space-y-3 p-1 font-sans animate-fadeIn">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1 space-y-1">
                    <label className="text-xs font-bold text-brand-outline block">Masa (kg)</label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="1000"
                      value={inputCorrection}
                      onChange={(e) => setInputCorrection(parseFloat(e.target.value) || 0)}
                      className="w-full bg-brand-surface border border-brand-container-high rounded-xl p-2.5 text-sm font-mono font-bold text-center focus:outline-none focus:border-brand-yolk"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-bold text-brand-outline block">Dlaczego? Notatka</label>
                    <input
                      type="text"
                      value={inputCorrectionNote}
                      onChange={(e) => setInputCorrectionNote(e.target.value)}
                      className="w-full bg-brand-surface border border-brand-container-high rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-yolk font-sans"
                      placeholder="Np. Odważenie worków na wadze"
                    />
                  </div>
                </div>

                <div className="text-[10px] bg-amber-50 text-amber-950 p-2 rounded-xl border border-amber-100 font-medium font-sans">
                  Różnica wynosi: <strong className="font-mono font-bold">{(inputCorrection - feedStock) >= 0 ? '+' : ''}{(inputCorrection - feedStock).toFixed(1)} kg</strong>. 
                  Zaraz po zatwierdzeniu stan magazynowy spichlerza zmieni się do tej wartości i zostanie to ujęte w historii zużycia paszy.
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onUpdateFeedStock(inputCorrection, inputCorrectionNote);
                  }}
                  className="w-full bg-emerald-800 text-white hover:bg-emerald-700 font-semibold py-2.5 rounded-xl text-center text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  ⚖️ Zapisz Rzeczywisty Zapas ({inputCorrection} kg)
                </button>
              </div>
            )}

            {/* Tab content 3: Kup paszę */}
            {feedManagerTab === 'buy' && (
              <div className="space-y-3 p-1 font-sans animate-fadeIn">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-outline block">Dostawca / Nazwa Paszy / Rodzaj zboża</label>
                  <input
                    type="text"
                    value={customFeedName}
                    onChange={(e) => setCustomFeedName(e.target.value)}
                    className="w-full bg-brand-surface border border-brand-container-high rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-yolk font-sans"
                    placeholder="Np. Ziarno kukurydzy, Pasza Premium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-outline block">Masa zakupiona (kg)</label>
                    <input
                      type="number"
                      min="1"
                      max="500"
                      value={customFeedWeight}
                      onChange={(e) => setCustomFeedWeight(parseFloat(e.target.value) || 0)}
                      className="w-full bg-brand-surface border border-brand-container-high rounded-xl p-2 text-xs text-center font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-brand-outline block">Całkowity koszt (PLN)</label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={customFeedPrice}
                      onChange={(e) => setCustomFeedPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-brand-surface border border-brand-container-high rounded-xl p-2 text-xs text-center font-mono font-bold text-brand-text"
                    />
                  </div>
                </div>

                {customFeedWeight > 0 && customFeedPrice > 0 && (
                  <div className="text-[10px] text-amber-950 bg-amber-50 rounded-lg p-2 border border-amber-100 text-center font-medium font-sans">
                    Koszt jednostkowy zakupu: <strong className="font-bold font-mono">{(customFeedPrice / customFeedWeight).toFixed(2)} zł / kg</strong>
                  </div>
                )}

                {cashInNest < customFeedPrice ? (
                  <p className="text-[10px] font-bold text-red-600 text-center uppercase tracking-wider animate-pulse font-sans">
                    ⚠️ Masz za mało gotówki w skarbonce! Potrzebujesz {customFeedPrice} zł.
                  </p>
                ) : (
                  <p className="text-[10px] font-medium text-emerald-800 text-center font-sans">
                    ✔️ Posiadasz wystarczającą ilość pieniędzy w skarbonce.
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (cashInNest < customFeedPrice) return;
                    onKupPasze(customFeedPrice, customFeedWeight, customFeedName);
                  }}
                  disabled={cashInNest < customFeedPrice || customFeedWeight <= 0 || customFeedPrice <= 0}
                  className={`w-full py-2.5 rounded-xl text-center text-xs font-bold shadow-md transition-all active:scale-[0.98] cursor-pointer ${
                    (cashInNest >= customFeedPrice && customFeedWeight > 0 && customFeedPrice > 0)
                      ? 'bg-amber-950 text-white hover:bg-amber-900'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  🛒 Opłać i dodaj do zapasów kurnika (+{customFeedWeight} kg)
                </button>
              </div>
            )}

            {/* Timeline Operations list */}
            <div className="pt-2 border-t border-brand-container-high space-y-2 text-left">
              <span className="text-[11px] font-bold text-brand-outline uppercase tracking-wider block font-sans">
                ⚙️ Ostatnie operacje i ruch paszy:
              </span>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {feedLogs.length === 0 ? (
                  <div className="text-center p-3 text-[10px] text-brand-outline bg-brand-container-low rounded-xl font-sans">
                    Brak zdarzeń zużycia paszy w historii.
                  </div>
                ) : (
                  feedLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className="text-[10px] p-2 bg-brand-surface rounded-xl border border-brand-container-high flex items-center justify-between gap-2.5 hover:bg-amber-500/5 font-sans"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs">
                          {log.type === 'zakup' ? '🌾' : log.type === 'korekta' ? '⚖️' : '🍽️'}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-brand-text truncate leading-tight">
                            {log.note}
                          </p>
                          <span className="text-[8px] text-brand-outline font-mono">
                            {log.timestamp} • zapas: {log.currentStockAfter} kg
                          </span>
                        </div>
                      </div>
                      <span className={`font-mono font-bold shrink-0 text-right px-1.5 py-0.5 rounded-sm ${
                        log.amount >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.amount >= 0 ? `+${log.amount} kg` : `${log.amount} kg`}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowFeedManagerModal(false)}
                className="w-full border border-[#ffeedd] hover:bg-gray-50 font-sans font-semibold py-2 rounded-xl text-center text-brand-outline text-xs cursor-pointer active:scale-95 transition-all"
              >
                Zamknij Spichlerz
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
