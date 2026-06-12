import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Egg, Users, BarChart2, ShieldAlert, Sparkles, Smile, Heart } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { Chicken, Client, HarvestLog, AlertLog, EggFuture, Achievement, FeedLog } from './types';
import { 
  DEFAULT_CHICKENS, 
  DEFAULT_CLIENTS, 
  DEFAULT_HARVESTS, 
  DEFAULT_ALERTS, 
  FOX_VISITS, 
  FoxEvent,
  CHICKEN_AVATAR_PRESETS
} from './utils';

import HomeView from './components/HomeView';
import EggsView from './components/EggsView';
import ChickensView from './components/ChickensView';
import ClientsView from './components/ClientsView';
import StatsView from './components/StatsView';
import ProfileModal from './components/ProfileModal';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_egg', title: 'Pierwsze jajo', description: 'Zbierz pomyślnie pierwsze jaja ze swojego gniazda.', icon: '🥚', unlocked: false, progressMax: 1, progressCurrent: 0, rewardText: 'Ciepła jajecznica na maśle' },
  { id: 'egg_gatherer', title: 'Zwiadowca Gniazd', description: 'Zbierz w sumie 50 jajek.', icon: '🧺', unlocked: false, progressMax: 50, progressCurrent: 0, rewardText: 'Nowy wygodny koszyk wiklinowy' },
  { id: 'egg_collector', title: 'Kolekcjoner Skorup', description: 'Zbierz w sumie 200 jajek.', icon: '🎡', unlocked: false, progressMax: 200, progressCurrent: 0, rewardText: 'Certyfikat Jajecznego Mistrza' },
  { id: 'egg_magnate', title: 'Guru Wydajności', description: 'Zbierz w sumie 1000 jajek.', icon: '👑', unlocked: false, progressMax: 1000, progressCurrent: 0, rewardText: 'Korona z piór wysoka na łokieć' },
  { id: 'rich_farmer', title: 'Jajeczny Krezus', description: 'Zgromadź 200 PLN w skarbonce.', icon: '💰', unlocked: false, progressMax: 200, progressCurrent: 0, rewardText: 'Tytuł Wielkiego Finansisty kurnika' },
  { id: 'millionaire_farmer', title: 'Złota Skarbonka', description: 'Zgromadź 1000 PLN w skarbonce.', icon: '💵', unlocked: false, progressMax: 1000, progressCurrent: 0, rewardText: 'Skórzany portfel wysadzany ziarnem' },
  { id: 'farm_tycoon', title: 'Magnat Rolny', description: 'Zgromadź 3000 PLN w skarbonce.', icon: '🏛️', unlocked: false, progressMax: 3000, progressCurrent: 0, rewardText: 'Marmurowy cokół z kurą w ogrodzie' },
  { id: 'flock_size', title: 'Szlachcic Piórowy', description: 'Utrzymuj stado składające się z przynajmniej 8 kur.', icon: '🐓', unlocked: false, progressMax: 8, progressCurrent: 0, rewardText: 'Miano Lorda Drobiu' },
  { id: 'emperor_flock', title: 'Pierzasty Imperator', description: 'Utrzymuj stado składające się z przynajmniej 15 kur.', icon: '🦅', unlocked: false, progressMax: 15, progressCurrent: 0, rewardText: 'Prawdziwy drobiowy monarcha' },
  { id: 'happy_clients', title: 'Wielka Dystrybucja', description: 'Obsłuż/dodaj przynajmniej 4 stałych klientów.', icon: '👥', unlocked: false, progressMax: 4, progressCurrent: 0, rewardText: 'Zapis w rejonowej księdze kurierów' },
  { id: 'market_conqueror', title: 'Drobiowe Imperium', description: 'Obsłuż/dodaj przynajmniej 10 klientów.', icon: '🛍️', unlocked: false, progressMax: 10, progressCurrent: 0, rewardText: 'Plakat "Kupuj u lokalnego Farmera"' },
  { id: 'futures_master', title: 'Makler Jajeczny', description: 'Zrealizuj pomyślnie kontrakt terminowy.', icon: '📈', unlocked: false, progressMax: 1, progressCurrent: 0, rewardText: 'Certyfikat Maklera Giełdy Kurzej' },
  { id: 'futures_emperor', title: 'Król Arbitrażu', description: 'Zrealizuj pomyślnie 5 kontraktów terminowych.', icon: '🔮', unlocked: false, progressMax: 5, progressCurrent: 0, rewardText: 'Złota tabliczka analityka rynku drobiu' }
];

const LOADING_MESSAGES = [
  "Zwoływanie kur do zagrody... 🐓",
  "Szlifowanie skorupek na błysk... ✨",
  "Napełnianie spichlerza pszenicą... 🌾",
  "Zliczanie piór i pazurów... 🪶",
  "Sprawdzanie stanu jajek w gnieździe... 🥚",
  "Zabezpieczanie kurnika przed lisem... 🦊",
  "Uruchamianie silnika Cluck & Collect... 🚀"
];

export default function App() {
  // Startup Loading screen state
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    
    const startTime = Date.now();
    const duration = 2400; // slightly faster and ultra-smooth

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setLoadingProgress(progress);

      if (elapsed >= duration) {
        clearInterval(progressInterval);
      }
    }, 20); // 50 updates per second

    const mainTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2800);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(mainTimeout);
    };
  }, [isLoading]);

  const loadingStep = Math.min(
    LOADING_MESSAGES.length - 1,
    Math.floor((loadingProgress / 100) * LOADING_MESSAGES.length)
  );

  // Navigation State
  const [activeTab, setActiveTab] = useState<'start' | 'jajka' | 'kury' | 'klienci' | 'statystyki'>('start');

  // Core Farm Stats States with LocalStorage
  const [farmerName, setFarmerName] = useState<string>(() => {
    return localStorage.getItem('farmer_name') || 'Mój Kurnik';
  });

  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return localStorage.getItem('farmer_avatar') || '/portrety/gospodarze/gospodarz1.png';
  });

  const [cashInNest, setCashInNest] = useState<number>(() => {
    const saved = localStorage.getItem('farmer_cash');
    return saved ? parseFloat(saved) : 0.00;
  });

  const [todayEggsCount, setTodayEggsCount] = useState<number>(() => {
    const saved = localStorage.getItem('farmer_today_eggs');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Main Stock Inventory count of eggs currently on hand
  const [eggsInStock, setEggsInStock] = useState<number>(() => {
    const saved = localStorage.getItem('farmer_eggs_in_stock');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Feed Stock Level in kg
  const [feedStock, setFeedStock] = useState<number>(() => {
    const saved = localStorage.getItem('farmer_feed_stock');
    return saved ? parseInt(saved, 10) : 0; // default 0kg
  });

  // Feed Operations History
  const [feedLogs, setFeedLogs] = useState<FeedLog[]>(() => {
    const saved = localStorage.getItem('farmer_feed_logs');
    if (saved) return JSON.parse(saved);
    return [];
  });

  // Achievements master list
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('farmer_achievements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === INITIAL_ACHIEVEMENTS.length) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ACHIEVEMENTS;
  });

  // Egg prices
  const [eggPrice, setEggPrice] = useState<number>(() => {
    const saved = localStorage.getItem('farmer_egg_price');
    return saved ? parseFloat(saved) : 1.20;
  });

  // Chcikens (STADO) list
  const [chickens, setChickens] = useState<Chicken[]>(() => {
    const saved = localStorage.getItem('farmer_chickens');
    return saved ? JSON.parse(saved) : [];
  });

  // Egg Clients list
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('farmer_clients');
    return saved ? JSON.parse(saved) : [];
  });

  // Harvest logs
  const [harvestLogs, setHarvestLogs] = useState<HarvestLog[]>(() => {
    const saved = localStorage.getItem('farmer_harvests');
    return saved ? JSON.parse(saved) : [];
  });

  // Wydajność alerts list
  const [alerts, setAlerts] = useState<AlertLog[]>(() => {
    const saved = localStorage.getItem('farmer_alerts');
    return saved ? JSON.parse(saved) : [];
  });

  // Egg Futures Contracts
  const [futures, setFutures] = useState<EggFuture[]>(() => {
    const saved = localStorage.getItem('farmer_futures');
    return saved ? JSON.parse(saved) : [];
  });

  // Profile Modal State
  const [showProfile, setShowProfile] = useState(false);

  // Synchronizacja status states
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  });

  // Fox Encounter popup state
  const [activeFoxEvent, setActiveFoxEvent] = useState<FoxEvent | null>(null);

  // Simple Notification banner of key event
  const [appBanner, setAppBanner] = useState<string | null>(null);

  // Sync to localStorage and Firebase
  const [isCloudLoaded, setIsCloudLoaded] = useState(false);

  useEffect(() => {
    const fetchCloud = async () => {
      if (!isFirebaseConfigured || !db) {
        setIsCloudLoaded(true);
        return;
      }
      try {
        const farmDoc = await getDoc(doc(db, "farms", "my_farm"));
        if (farmDoc.exists()) {
          const data = farmDoc.data();
          if (data.farmerName !== undefined) setFarmerName(data.farmerName);
          if (data.avatarUrl !== undefined) setAvatarUrl(data.avatarUrl);
          if (data.cashInNest !== undefined) setCashInNest(data.cashInNest);
          if (data.todayEggsCount !== undefined) setTodayEggsCount(data.todayEggsCount);
          if (data.eggsInStock !== undefined) setEggsInStock(data.eggsInStock);
          if (data.feedStock !== undefined) setFeedStock(data.feedStock);
          if (data.eggPrice !== undefined) setEggPrice(data.eggPrice);
          if (data.chickens) setChickens(data.chickens);
          if (data.clients) setClients(data.clients);
          if (data.harvestLogs) setHarvestLogs(data.harvestLogs);
          if (data.alerts) setAlerts(data.alerts);
          if (data.futures) setFutures(data.futures);
          if (data.feedLogs) setFeedLogs(data.feedLogs);
        }
      } catch (err) {
        console.error("Cloud fetch error", err);
      } finally {
        setIsCloudLoaded(true);
      }
    };
    fetchCloud();
  }, []);

  useEffect(() => {
    localStorage.setItem('farmer_name', farmerName);
    localStorage.setItem('farmer_avatar', avatarUrl);
    localStorage.setItem('farmer_cash', cashInNest.toString());
    localStorage.setItem('farmer_today_eggs', todayEggsCount.toString());
    localStorage.setItem('farmer_eggs_in_stock', eggsInStock.toString());
    localStorage.setItem('farmer_feed_stock', feedStock.toString());
    localStorage.setItem('farmer_egg_price', eggPrice.toString());
    localStorage.setItem('farmer_chickens', JSON.stringify(chickens));
    localStorage.setItem('farmer_clients', JSON.stringify(clients));
    localStorage.setItem('farmer_harvests', JSON.stringify(harvestLogs));
    localStorage.setItem('farmer_alerts', JSON.stringify(alerts));
    localStorage.setItem('farmer_futures', JSON.stringify(futures));
    localStorage.setItem('farmer_feed_logs', JSON.stringify(feedLogs));

    // Autosync visual trigger
    setIsSyncing(true);
    const timer = setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      setLastSyncTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
    }, 600);

    let cloudTimer: any;
    if (isCloudLoaded && isFirebaseConfigured && db) {
      cloudTimer = setTimeout(() => {
        setDoc(doc(db, "farms", "my_farm"), {
          farmerName, avatarUrl, cashInNest, todayEggsCount, eggsInStock, feedStock, eggPrice, chickens, clients, harvestLogs, alerts, futures, feedLogs
        }).catch(err => console.error("Cloud write error", err));
      }, 1500); // 1.5s debounce to protect free tier
    }

    return () => {
      clearTimeout(timer);
      if (cloudTimer) clearTimeout(cloudTimer);
    };
  }, [isCloudLoaded, farmerName, avatarUrl, cashInNest, todayEggsCount, eggsInStock, feedStock, eggPrice, chickens, clients, harvestLogs, alerts, futures, feedLogs]);

  // Reactive achievements progress checker
  useEffect(() => {
    const totalEggsCollected = harvestLogs.reduce((sum, h) => sum + h.count, 0);
    const completedFutures = futures.filter(f => f.status === 'Zrealizowany').length;

    setAchievements(prev => {
      let changed = false;
      const updated = prev.map(ach => {
        if (ach.unlocked) return ach;

        let newProgress = ach.progressCurrent;
        let shouldUnlock = false;

        switch (ach.id) {
          case 'first_egg':
            newProgress = harvestLogs.length > 0 ? 1 : 0;
            break;
          case 'egg_gatherer':
            newProgress = Math.min(ach.progressMax, totalEggsCollected);
            break;
          case 'egg_collector':
            newProgress = Math.min(ach.progressMax, totalEggsCollected);
            break;
          case 'egg_magnate':
            newProgress = Math.min(ach.progressMax, totalEggsCollected);
            break;
          case 'rich_farmer':
            newProgress = Math.min(ach.progressMax, Math.floor(cashInNest));
            break;
          case 'millionaire_farmer':
            newProgress = Math.min(ach.progressMax, Math.floor(cashInNest));
            break;
          case 'farm_tycoon':
            newProgress = Math.min(ach.progressMax, Math.floor(cashInNest));
            break;
          case 'flock_size':
            newProgress = Math.min(ach.progressMax, chickens.length);
            break;
          case 'emperor_flock':
            newProgress = Math.min(ach.progressMax, chickens.length);
            break;
          case 'happy_clients':
            newProgress = Math.min(ach.progressMax, clients.length);
            break;
          case 'market_conqueror':
            newProgress = Math.min(ach.progressMax, clients.length);
            break;
          case 'futures_master':
            newProgress = completedFutures > 0 ? 1 : 0;
            break;
          case 'futures_emperor':
            newProgress = Math.min(ach.progressMax, completedFutures);
            break;
          default:
            break;
        }

        shouldUnlock = newProgress >= ach.progressMax;

        if (newProgress !== ach.progressCurrent || shouldUnlock) {
          changed = true;
          if (shouldUnlock && !ach.unlocked) {
            // Trigger alert non-blocking inside timeout to avoid render warnings
            setTimeout(() => {
              const newAlert: AlertLog = {
                id: 'ach_unlock_' + ach.id + '_' + Date.now().toString(),
                title: `🏆 Odznaka: ${ach.title}!`,
                subtitle: `Nagroda: ${ach.rewardText}`,
                type: 'super',
                time: 'Teraz'
              };
              setAlerts(old => {
                const alreadyHas = old.some(a => a.title.includes(ach.title));
                return alreadyHas ? old : [newAlert, ...old];
              });
              triggerBanner(`🏆 Odblokowano osiągnięcie: ${ach.title}!`);
            }, 60);
          }
          return { ...ach, progressCurrent: newProgress, unlocked: shouldUnlock };
        }
        return ach;
      });

      if (changed) {
        localStorage.setItem('farmer_achievements', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  }, [harvestLogs, cashInNest, chickens, clients, futures]);

  // Action: Buy Feed (Kup Paszę)
  const handleKupPasze = (price: number = 30, amountKg: number = 12, label: string = 'Pasza Standardowa') => {
    if (cashInNest < price) {
      triggerBanner(`❌ Za mało funduszy! Kupno ${label} kosztuje ${price} PLN.`);
      return;
    }

    setCashInNest(prev => Math.max(0, parseFloat((prev - price).toFixed(2))));
    
    setFeedStock(prev => {
      const nextStock = prev + amountKg;
      const newLog: FeedLog = {
        id: 'fl_' + Date.now().toString(),
        timestamp: 'Dzisiaj, ' + new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        type: 'zakup',
        amount: amountKg,
        currentStockAfter: nextStock,
        note: `Zakup paszy: ${label} (+${amountKg} kg)`
      };
      setFeedLogs(old => [newLog, ...old]);
      return nextStock;
    });
    
    // Add custom alert log
    const newAlert: AlertLog = {
      id: Date.now().toString(),
      title: `Dodano paszę: ${label}`,
      subtitle: `Stan zapasów wzrósł o +${amountKg} kg. Koszt: ${price} PLN`,
      type: 'info',
      time: 'Właśnie teraz'
    };
    setAlerts(prev => [newAlert, ...prev]);
    triggerBanner(`🌾 Dokupiono paszę: ${label} (+${amountKg} kg) za ${price} PLN!`);
  };

  // Action: Report Feed Consumption
  const handleReportFeedConsumption = (amountKg: number, note: string) => {
    setFeedStock(prev => {
      const nextStock = Math.max(0, prev - amountKg);
      const newLog: FeedLog = {
        id: 'fl_' + Date.now().toString(),
        timestamp: 'Dzisiaj, ' + new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        type: 'zuzycie',
        amount: -amountKg,
        currentStockAfter: nextStock,
        note: note || `Zużycie paszy przez stadko (-${amountKg} kg)`
      };
      setFeedLogs(old => [newLog, ...old]);

      const newAlert: AlertLog = {
        id: Date.now().toString(),
        title: `Zużyto paszę: ${amountKg} kg`,
        subtitle: `Pozostało zapasów: ${nextStock} kg`,
        type: 'info',
        time: 'Teraz'
      };
      setAlerts(oldAlerts => [newAlert, ...oldAlerts]);
      return nextStock;
    });
    triggerBanner(`🌾 Zgłoszono zużycie ${amountKg} kg paszy.`);
  };

  // Action: Update Feed Stock Directly
  const handleUpdateFeedStock = (newStock: number, note: string) => {
    setFeedStock(prev => {
      const diff = newStock - prev;
      const type = diff >= 0 ? 'korekta' : 'zuzycie';
      const newLog: FeedLog = {
        id: 'fl_' + Date.now().toString(),
        timestamp: 'Dzisiaj, ' + new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        type: type,
        amount: diff,
        currentStockAfter: newStock,
        note: note || `Podano aktualny stan paszy: ${newStock} kg (Różnica: ${diff >= 0 ? '+' : ''}${diff.toFixed(1)} kg)`
      };
      setFeedLogs(old => [newLog, ...old]);

      const newAlert: AlertLog = {
        id: Date.now().toString(),
        title: `Korekta paszy: ${newStock} kg`,
        subtitle: `Zadeklarowano stan w kurniku`,
        type: 'info',
        time: 'Teraz'
      };
      setAlerts(oldAlerts => [newAlert, ...oldAlerts]);
      return newStock;
    });
    triggerBanner(`🌾 Zapisano aktualny stan paszy: ${newStock} kg.`);
  };

  // Action: Add New Chicken (Nowa Kura) with cost
  const handleAddChicken = (name: string, description: string, rating: number, avatar: string, price: number) => {
    if (cashInNest < price) {
      triggerBanner(`❌ Za mało gotówki! Zakup nowej kury kosztuje ${price} PLN.`);
      return;
    }

    const newCh: Chicken = {
      id: Date.now().toString(),
      name,
      rating,
      description: description || '"Młoda obiecująca nioska"',
      eggsLaidTotal: Math.floor(Math.random() * 20) + 5, // Starts with some random eggs laid
      rank: chickens.length + 1,
      avatar
    };

    setChickens(prev => [...prev, newCh]);
    setCashInNest(prev => Math.max(0, parseFloat((prev - price).toFixed(2))));
    
    // Create Alert
    const newAlert: AlertLog = {
      id: 'alert_' + Date.now().toString(),
      title: `Nowa nioska: ${name}!`,
      subtitle: `Dołączyła do stada. Koszt zakupu: ${price} PLN`,
      type: 'super',
      time: 'Przed chwilą'
    };
    setAlerts(prev => [newAlert, ...prev]);
    triggerBanner(`🐔 Nowa kura ${name} dołączyła do stada! Zapłacono: ${price} PLN.`);
  };

  // Action: Remove Chicken (Fox attack or selling a hen)
  const handleRemoveChicken = (chickenId: string) => {
    const chickenToRemove = chickens.find(c => c.id === chickenId);
    if (!chickenToRemove) return;

    setChickens(prev => prev.filter(c => c.id !== chickenId));

    // Create a warning alert
    const newAlert: AlertLog = {
      id: 'alert_fox_' + Date.now().toString(),
      title: `🦊 Atak lisa w kurniku!`,
      subtitle: `Niestety, lis porwał kurę o imieniu ${chickenToRemove.name} Zostanie ona zapamiętana!`,
      type: 'warning',
      time: 'Przed chwilą'
    };
    setAlerts(prev => [newAlert, ...prev]);
    triggerBanner(`🦊 O nie! Lis zbliżył się do kurnika i porwał kurę ${chickenToRemove.name}! 🏮`);
  };

  // Action: Edit Client details
  const handleEditClient = (
    clientId: string, 
    name: string, 
    phone: string, 
    deliveryType: 'Do Domu' | 'Odbiór Własny', 
    monthlyDemand: number, 
    useGlobalPrice: boolean, 
    customPricePerEgg?: number
  ) => {
    setClients(prev => {
      return prev.map(c => {
        if (c.id === clientId) {
          return {
            ...c,
            name,
            phone,
            deliveryType,
            monthlyDemand,
            useGlobalPrice,
            customPricePerEgg: useGlobalPrice ? undefined : customPricePerEgg
          };
        }
        return c;
      });
    });
    triggerBanner(`✏️ Zapisano zmiany dla klienta: ${name}`);
  };

  // Action: Top-Up Client Balance (Wpłata PLN na poczet jajek lub spłata długu)
  const handleTopUpClientBalance = (clientId: string, amountPLN: number) => {
    setClients(prev => {
      return prev.map(c => {
        if (c.id === clientId) {
          return {
            ...c,
            balance: parseFloat((c.balance + amountPLN).toFixed(2))
          };
        }
        return c;
      });
    });

    // Add cash to our farmer treasury
    setCashInNest(prev => parseFloat((prev + amountPLN).toFixed(2)));

    // Alert & banner
    const targetCli = clients.find(c => c.id === clientId);
    const newAlert: AlertLog = {
      id: 'topup_' + Date.now().toString(),
      title: `Zarejestrowano wpłatę!`,
      subtitle: `Klient: ${targetCli?.name || 'Kupiec'}. Kwota: +${amountPLN.toFixed(2)} PLN`,
      type: 'super',
      time: 'Właśnie teraz'
    };
    setAlerts(prev => [newAlert, ...prev]);
    triggerBanner(`💰 Wpłacono ${amountPLN.toFixed(2)} PLN od ${targetCli?.name || 'Klienta'}!`);
  };

  // Action: Trigger random Fox Encounter (Lisia wizyta)
  const handleLisiaWizyta = () => {
    const randEvent = FOX_VISITS[Math.floor(Math.random() * FOX_VISITS.length)];
    setActiveFoxEvent(randEvent);

    // Apply consequences
    if (randEvent.cashChange !== 0) {
      setCashInNest(prev => Math.max(0, prev + randEvent.cashChange));
    }
    if (randEvent.eggChange !== 0) {
      setTodayEggsCount(prev => Math.max(0, prev + randEvent.eggChange));
    }

    // Add alert
    const newAlert: AlertLog = {
      id: 'fox_' + Date.now().toString(),
      title: randEvent.title,
      subtitle: randEvent.cashChange !== 0 ? `Wydatki: ${randEvent.cashChange} PLN` : 'Przepędzono drapieżnika!',
      type: 'warning',
      time: 'Dzisiaj'
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  // Action: Add Harvest (Zatwierdź zbiór)
  const handleAddHarvest = (count: number, label: string) => {
    // Add count to today's count and physical inventory stock
    setTodayEggsCount(prev => prev + count);
    setEggsInStock(prev => prev + count);

    // Create log
    const now = new Date();
    const timestamp = `Dzisiaj, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newLog: HarvestLog = {
      id: 'harvest_' + Date.now().toString(),
      time: timestamp,
      label,
      count,
      dateKey: now.toISOString().split('T')[0]
    };
    setHarvestLogs(prev => [newLog, ...prev]);

    // Create Alert
    const newAlert: AlertLog = {
      id: 'alert_harvest_' + Date.now().toString(),
      title: `${label}: +${count} szt!`,
      subtitle: `Przeniesiono do magazynu jajek na sprzedaż`,
      type: 'super',
      time: 'Teraz'
    };
    setAlerts(prev => [newAlert, ...prev]);

    // Randomly increase some chicken's count
    setChickens(prev => {
      return prev.map((ch, idx) => {
        if (idx === 0) {
          return { ...ch, eggsLaidTotal: ch.eggsLaidTotal + count };
        }
        return ch;
      });
    });
  };

  // Action: Add Customer (Dodaj klienta)
  const handleAddClient = (name: string, phone: string, deliveryType: 'Do Domu' | 'Odbiór Własny', initialBalance: number, monthlyDemand: number = 30) => {
    const newCli: Client = {
      id: 'cli_' + Date.now().toString(),
      name,
      phone,
      deliveryType,
      balance: initialBalance,
      useGlobalPrice: true,
      dateAdded: new Date().toISOString().split('T')[0],
      monthlyDemand: monthlyDemand || 30,
      realizedThisMonth: 0
    };

    setClients(prev => [...prev, newCli]);

    // Create Alert
    const newAlert: AlertLog = {
      id: 'alert_cli_' + Date.now().toString(),
      title: `Nowy klient: ${name}`,
      subtitle: `Bilans startowy: ${initialBalance.toFixed(2)} PLN`,
      type: 'info',
      time: 'Właśnie dodano'
    };
    setAlerts(prev => [newAlert, ...prev]);
    triggerBanner(`👥 Zapisano nowego klienta: ${name}!`);
  };

  // Action: Sell eggs to client with settlement type
  const handleUpdateClientBalance = (clientId: string, eggCount: number, valuePLN: number, settlementType: 'cash' | 'balance' = 'cash') => {
    setClients(prev => {
      return prev.map(c => {
        if (c.id === clientId) {
          const newBalance = settlementType === 'balance'
            ? parseFloat((c.balance - valuePLN).toFixed(2))
            : c.balance;
          return { 
            ...c, 
            balance: newBalance,
            realizedThisMonth: (c.realizedThisMonth || 0) + eggCount
          };
        }
        return c;
      });
    });

    // Reduce physical eggs in stock
    setEggsInStock(prev => Math.max(0, prev - eggCount));

    // Add cash to nest ONLY if they paid cash immediately
    if (settlementType === 'cash') {
      setCashInNest(prev => parseFloat((prev + valuePLN).toFixed(2)));
    }

    // Log alert
    const targetCli = clients.find(c => c.id === clientId);
    const newAlert: AlertLog = {
      id: 'sale_' + Date.now().toString(),
      title: `Sprzedano ${eggCount} jajek`,
      subtitle: `Dla: ${targetCli?.name || 'Kupiec'}. Rozliczenie: ${settlementType === 'cash' ? `Gotówka (+${valuePLN.toFixed(2)} PLN)` : `Konto/Zeszyt (-${valuePLN.toFixed(2)} PLN)`}`,
      type: 'super',
      time: 'Przed chwilą'
    };
    setAlerts(prev => [newAlert, ...prev]);
    triggerBanner(`💸 Sprzedano ${eggCount} jajek dla ${targetCli?.name || 'Klienta'}. ${settlementType === 'cash' ? `Skarbonka urosła o +${valuePLN.toFixed(2)} PLN!` : 'Zapisano w zeszycie / pobrano z salda.'}`);
  };

  // Trigger quick top-floating banner info
  const triggerBanner = (message: string) => {
    setAppBanner(message);
    setTimeout(() => {
      setAppBanner(null);
    }, 4000);
  };

  // Profile Save
  const handleSaveProfile = (name: string, avatar: string) => {
    setFarmerName(name);
    setAvatarUrl(avatar);
    triggerBanner(`✏️ Zapisano profil gospodarza: ${name}`);
  };

  // Action: Add a future booking contract (Speculative Egg Future)
  const handleAddFuture = (clientId: string, eggCount: number, pricePerEgg: number, deliveryDate: string) => {
    const targetCli = clients.find(c => c.id === clientId);
    if (!targetCli) return;

    const newFuture: EggFuture = {
      id: 'f_' + Date.now().toString(),
      clientId,
      clientName: targetCli.name,
      eggCount,
      pricePerEgg,
      deliveryDate,
      status: 'Oczekuje'
    };

    setFutures(prev => [newFuture, ...prev]);

    const newAlert: AlertLog = {
      id: 'alert_fut_' + Date.now().toString(),
      title: `Kontrakt Future: ${targetCli.name}`,
      subtitle: `Zakontraktowano ${eggCount} szt. po ${pricePerEgg.toFixed(2)} PLN na ${deliveryDate}`,
      type: 'info',
      time: 'Właśnie teraz'
    };
    setAlerts(prev => [newAlert, ...prev]);
    triggerBanner(`📈 Dodano kontrakt jajeczny Future dła ${targetCli.name}!`);
  };

  // Action: Fulfill speculative future delivery
  const handleFulfillFuture = (futureId: string) => {
    const targetFut = futures.find(f => f.id === futureId);
    if (!targetFut) return;

    // Financial outcome
    const valuePLN = parseFloat((targetFut.eggCount * targetFut.pricePerEgg).toFixed(2));
    setCashInNest(prev => parseFloat((prev + valuePLN).toFixed(2)));

    // Warning if low stash
    if (eggsInStock < targetFut.eggCount) {
      triggerBanner(`⚠️ Mało jaj na stanie! Kontrakt zredukuje stan do zera.`);
    }

    // Deduct from stock
    setEggsInStock(prev => Math.max(0, prev - targetFut.eggCount));

    // Deduct client balance/debt (Prepaid or debt) and increment realized count
    setClients(prev => {
      return prev.map(c => {
        if (c.id === targetFut.clientId) {
          return { 
            ...c, 
            balance: c.balance - targetFut.eggCount,
            realizedThisMonth: (c.realizedThisMonth || 0) + targetFut.eggCount
          };
        }
        return c;
      });
    });

    // Mark as Zrealizowany
    setFutures(prev => {
      return prev.map(f => {
        if (f.id === futureId) {
          return { ...f, status: 'Zrealizowany' };
        }
        return f;
      });
    });

    // Create Alert
    const newAlert: AlertLog = {
      id: 'alert_fut_ful_' + Date.now().toString(),
      title: `Zrealizowano kontrakt!`,
      subtitle: `Dostarczono ${targetFut.eggCount} jajek do ${targetFut.clientName}. Zysk: +${valuePLN} PLN`,
      type: 'super',
      time: 'Teraz'
    };
    setAlerts(prev => [newAlert, ...prev]);
    triggerBanner(`✔️ Kontrakt zrealizowany! Kasa wzrosła o +${valuePLN} PLN.`);
  };

  // Action: Cancel speculative future contract
  const handleCancelFuture = (futureId: string) => {
    setFutures(prev => {
      return prev.map(f => {
        if (f.id === futureId) {
          return { ...f, status: 'Anulowany' };
        }
        return f;
      });
    });
    triggerBanner('❌ Kontrakt Future został anulowany.');
  };

  // Action: Populate demo/mock data manually
  const handleLoadDemoData = () => {
    setFarmerName('Farmer Mateo');
    setAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200');
    setCashInNest(120.00);
    setTodayEggsCount(42);
    setEggsInStock(38);
    setFeedStock(45);
    setEggPrice(1.20);
    setChickens(DEFAULT_CHICKENS);
    setClients(DEFAULT_CLIENTS);
    setHarvestLogs(DEFAULT_HARVESTS);
    setAlerts(DEFAULT_ALERTS);
    setAchievements([
      { id: 'first_egg', title: 'Pierwsze jajo', description: 'Zbierz pomyślnie pierwsze jaja ze swojego gniazda.', icon: '🥚', unlocked: true, progressMax: 1, progressCurrent: 1, rewardText: 'Uznanie u stada i pyszna jajecznica' },
      { id: 'rich_farmer', title: 'Jajeczny Krezus', description: 'Zgromadź 200 PLN w gotówce.', icon: '💰', unlocked: false, progressMax: 200, progressCurrent: 120, rewardText: 'Tytuł Wielkiego Finansisty kurnika' },
      { id: 'flock_size', title: 'Władca Piór', description: 'Utrzymuj stado składające się z przynajmniej 8 kur.', icon: '🐓', unlocked: false, progressMax: 8, progressCurrent: DEFAULT_CHICKENS.length, rewardText: 'Miano Lorda Drobiu' },
      { id: 'happy_clients', title: 'Wielka Dystrybucja', description: 'Dodaj przynajmniej 4 stałych i głodnych klientów.', icon: '👥', unlocked: false, progressMax: 4, progressCurrent: DEFAULT_CLIENTS.length, rewardText: 'Status Super Dostawcy' },
      { id: 'futures_master', title: 'Makler Jajeczny', description: 'Zrealizuj pomyślnie kontrakt terminowy (Future).', icon: '📈', unlocked: false, progressMax: 1, progressCurrent: 0, rewardText: 'Certyfikat Maklera Giełdy Kurzej' }
    ]);
    setFutures([
      {
        id: 'f_demo_1',
        clientId: 'c1',
        clientName: 'Pani Halinka z dwojgiem dzieci',
        eggCount: 20,
        pricePerEgg: 1.30,
        deliveryDate: 'W przyszły wtorek',
        status: 'Oczekuje'
      },
      {
        id: 'f_demo_2',
        clientId: 'c2',
        clientName: 'Pan Janusz spod piątki',
        eggCount: 15,
        pricePerEgg: 1.25,
        deliveryDate: 'W piątek rano',
        status: 'Oczekuje'
      }
    ]);
    triggerBanner('🚀 Załadowano przykładowe dane gospodarstwa dla łatwiejszych testów!');
  };

  // Reset Application State to raw blank
  const handleResetApp = () => {
    localStorage.clear();
    setFarmerName('Mój Kurnik');
    setAvatarUrl('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=200');
    setCashInNest(0.00);
    setTodayEggsCount(0);
    setEggsInStock(0);
    setFeedStock(15);
    setEggPrice(1.20);
    setChickens([]);
    setClients([]);
    setHarvestLogs([]);
    setAlerts([]);
    setFutures([]);
    setAchievements([
      { id: 'first_egg', title: 'Pierwsze jajo', description: 'Zbierz pomyślnie pierwsze jaja ze swojego gniazda.', icon: '🥚', unlocked: false, progressMax: 1, progressCurrent: 0, rewardText: 'Uznanie u stada i pyszna jajecznica' },
      { id: 'rich_farmer', title: 'Jajeczny Krezus', description: 'Zgromadź 200 PLN w gotówce.', icon: '💰', unlocked: false, progressMax: 200, progressCurrent: 0, rewardText: 'Tytuł Wielkiego Finansisty kurnika' },
      { id: 'flock_size', title: 'Władca Piór', description: 'Utrzymuj stado składające się z przynajmniej 8 kur.', icon: '🐓', unlocked: false, progressMax: 8, progressCurrent: 0, rewardText: 'Miano Lorda Drobiu' },
      { id: 'happy_clients', title: 'Wielka Dystrybucja', description: 'Dodaj przynajmniej 4 stałych i głodnych klientów.', icon: '👥', unlocked: false, progressMax: 4, progressCurrent: 0, rewardText: 'Status Super Dostawcy' },
      { id: 'futures_master', title: 'Makler Jajeczny', description: 'Zrealizuj pomyślnie kontrakt terminowy (Future).', icon: '📈', unlocked: false, progressMax: 1, progressCurrent: 0, rewardText: 'Certyfikat Maklera Giełdy Kurzej' }
    ]);
    triggerBanner('🧹 Zresetowano wszystkie dane kurnika do stanu całkowicie pustego.');
  };

  // Nav helper
  const handleNavigateToTab = (tab: string) => {
    if (tab === 'start' || tab === 'jajka' || tab === 'kury' || tab === 'klienci' || tab === 'statystyki') {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffcfb] flex flex-col justify-start items-center p-0 md:py-6 tracking-normal">
      
      {/* Highly Polished Premium Splash/Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#fffcf9] z-50 flex flex-col justify-between items-center px-6 py-16 text-center"
          >
            {/* Top decorative badge */}
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 bg-[#fef1e8] text-amber-900 border border-amber-200 text-[10px] font-bold py-1 px-4 rounded-full select-none uppercase tracking-widest leading-none font-sans shadow-xs">
                🌾 Gospodarstwo Premium 🌾
              </span>
            </div>

            {/* Middle logo + egg rotator */}
            <div className="flex flex-col items-center space-y-8">
              <div className="relative">
                {/* Ambient breathing glow */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                  className="absolute -inset-8 bg-gradient-to-tr from-amber-400/40 to-brand-yolk/10 rounded-full blur-2xl"
                />
                
                {/* Animated bouncing and rocking golden egg */}
                <motion.div
                  animate={{ 
                    y: [0, -12, 0],
                    scale: [1, 1.04, 1],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.6, 
                    ease: "easeInOut" 
                  }}
                  className="w-24 h-32 bg-[#ffd54f] rounded-[50%_50%_50%_50%/_60%_60%_40%_40%] shadow-[inset_-6px_-10px_20px_rgba(180,83,9,0.45),0_12px_24px_rgba(180,83,9,0.22)] flex items-center justify-center border-4 border-amber-950/15"
                >
                  <motion.span 
                    animate={{ rotate: [-6, 6, -6] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    className="text-4xl select-none"
                  >
                    👑
                  </motion.span>
                </motion.div>
              </div>

              {/* App Names & Custom Brand Slogan */}
              <div className="space-y-1.5">
                <h1 className="font-display font-black text-4xl text-[#3e2723] tracking-tight uppercase">
                  Cluck & Collect
                </h1>
                <p className="text-[11px] font-mono font-black text-amber-800 uppercase tracking-widest">
                  🍳 Biznes z jajem • Stable Release 🍳
                </p>
              </div>
            </div>

            {/* Loading text messages and subtle progress loading track */}
            <div className="w-full max-w-xs flex flex-col items-center space-y-4">
              <div className="h-6 overflow-hidden flex items-center justify-center">
                <motion.p
                  key={loadingStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs font-sans font-bold text-amber-950/80"
                >
                  {LOADING_MESSAGES[loadingStep]}
                </motion.p>
              </div>

              {/* Progress loading bar */}
              <div className="flex flex-col items-center gap-1.5 w-full">
                <div className="w-56 h-2 md:h-2.5 bg-amber-950/10 rounded-full overflow-hidden p-[2px] border border-amber-900/10 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-full transition-all duration-75 relative overflow-hidden" 
                    style={{ width: `${loadingProgress}%` }}
                  >
                    {/* Glossy shine overlay */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-[10px] font-black text-amber-900 tracking-tight">
                    {loadingProgress}%
                  </span>
                </div>
              </div>

              <span className="text-[10px] text-brand-outline font-sans">
                Aplikacja gotowa do wdrożenia na GitHubie
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic top banner alert toast */}
      {appBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 max-w-sm w-[90%] bg-emerald-950 text-white border border-emerald-500/20 text-xs font-semibold py-3 px-4 rounded-xl shadow-2xl z-50 flex items-center gap-2 animate-slideDown">
          <Sparkles className="w-4 h-4 text-brand-yolk animate-spin" />
          <span>{appBanner}</span>
        </div>
      )}

      {/* Main viewport frame container styled like a premium farm dashboard app */}
      <div className="w-full max-w-md bg-brand-surface md:rounded-3xl md:shadow-2xl md:border-4 md:border-amber-950/20 md:min-h-[850px] relative flex flex-col pb-24">
        
        {/* Render Active view */}
        <main className="flex-1">
          {activeTab === 'start' && (
            <HomeView 
              farmerName={farmerName}
              avatarUrl={avatarUrl}
              onOpenProfile={() => setShowProfile(true)}
              stadoSize={chickens.length} 
              cashInNest={cashInNest}
              todayEggsCount={todayEggsCount}
              eggsInStock={eggsInStock}
              feedStock={feedStock}
              feedLogs={feedLogs}
              onReportFeedConsumption={handleReportFeedConsumption}
              onUpdateFeedStock={handleUpdateFeedStock}
              achievements={achievements}
              onKupPasze={handleKupPasze}
              onNowaKura={() => {
                setActiveTab('kury');
                setTimeout(() => {
                  const addBtn = document.getElementById('show-add-chicken-btn');
                  if (addBtn) addBtn.click();
                }, 120);
              }}
              onLisiaWizyta={handleLisiaWizyta}
              alerts={alerts}
              onOpenAddClient={() => {
                setActiveTab('klienci');
                setTimeout(() => {
                  const btn = document.getElementById('add-client-tab-btn');
                  if (btn) btn.click();
                }, 100);
              }}
              onNavigateToTab={handleNavigateToTab}
              onLoadDemoData={handleLoadDemoData}
              eggPrice={eggPrice}
              onUpdateEggPrice={setEggPrice}
              isSyncing={isSyncing}
              lastSyncTime={lastSyncTime}
              onForceSync={() => {
                setIsSyncing(true);
                setTimeout(() => {
                  setIsSyncing(false);
                  const now = new Date();
                  setLastSyncTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
                  triggerBanner('⚡ Wszystkie dane kurnika błyskawicznie zapisane i zsynchronizowane chmurowo!');
                }, 600);
              }}
            />
          )}

          {activeTab === 'jajka' && (
            <EggsView 
              harvestLogs={harvestLogs}
              onAddHarvest={handleAddHarvest}
            />
          )}

          {activeTab === 'kury' && (
            <ChickensView 
              chickens={chickens}
              onAddChicken={handleAddChicken}
              onRemoveChicken={handleRemoveChicken}
              farmCash={cashInNest}
            />
          )}

          {activeTab === 'klienci' && (
            <ClientsView 
              clients={clients}
              onAddClient={handleAddClient}
              onUpdateClientBalance={handleUpdateClientBalance}
              onEditClient={handleEditClient}
              onTopUpClientBalance={handleTopUpClientBalance}
              farmCash={cashInNest}
              eggPrice={eggPrice}
              futures={futures}
              onAddFuture={handleAddFuture}
              onFulfillFuture={handleFulfillFuture}
              onCancelFuture={handleCancelFuture}
            />
          )}

          {activeTab === 'statystyki' && (
            <StatsView 
              farmerName={farmerName} 
              eggPrice={eggPrice} 
              achievements={achievements}
              harvestLogs={harvestLogs}
            />
          )}
        </main>

        {/* BOTTOM NAVIGATION BAR (Screens 1-5 layout) */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md w-full mx-auto bg-[#fff5f2] border-t border-brand-container-high py-3 px-4 flex justify-between items-center z-40 select-none rounded-t-3xl shadow-lg">
          {/* Start Tab */}
          <button
            onClick={() => setActiveTab('start')}
            className={`flex flex-col items-center gap-1 flex-1 py-1 px-2.5 rounded-full transition-all focus:outline-none ${
              activeTab === 'start'
                ? 'bg-brand-yolk text-amber-950 font-bold px-4 py-2 scale-102 shadow-md'
                : 'text-brand-outline hover:text-brand-text'
            }`}
            id="nav-start-btn"
          >
            <Home className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-display uppercase tracking-wide">Start</span>
          </button>

          {/* Jajka Tab */}
          <button
            onClick={() => setActiveTab('jajka')}
            className={`flex flex-col items-center gap-1 flex-1 py-1 px-2.5 rounded-full transition-all focus:outline-none ${
              activeTab === 'jajka'
                ? 'bg-brand-yolk text-amber-950 font-bold px-4 py-2 scale-102 shadow-md'
                : 'text-brand-outline hover:text-brand-text'
            }`}
            id="nav-jajka-btn"
          >
            <div className="relative">
              <Egg className="w-5 h-5 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#ba1a1a]" />
            </div>
            <span className="text-[10px] font-display uppercase tracking-wide">Jajka</span>
          </button>

          {/* Kury Tab */}
          <button
            onClick={() => setActiveTab('kury')}
            className={`flex flex-col items-center gap-1 flex-1 py-1 px-2.5 rounded-full transition-all focus:outline-none ${
              activeTab === 'kury'
                ? 'bg-brand-yolk text-amber-950 font-bold px-4 py-2 scale-102 shadow-md'
                : 'text-brand-outline hover:text-brand-text'
            }`}
            id="nav-kury-btn"
          >
            <Heart className="w-5 h-5 stroke-[2.2] fill-current text-amber-900" />
            <span className="text-[10px] font-display uppercase tracking-wide">Kury</span>
          </button>

          {/* Klienci Tab */}
          <button
            onClick={() => setActiveTab('klienci')}
            className={`flex flex-col items-center gap-1 flex-1 py-1 px-2.5 rounded-full transition-all focus:outline-none ${
              activeTab === 'klienci'
                ? 'bg-brand-yolk text-amber-950 font-bold px-4 py-2 scale-102 shadow-md'
                : 'text-brand-outline hover:text-brand-text'
            }`}
            id="nav-klienci-btn"
          >
            <Users className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-display uppercase tracking-wide">Klienci</span>
          </button>

          {/* Statystyki Tab */}
          <button
            onClick={() => setActiveTab('statystyki')}
            className={`flex flex-col items-center gap-1 flex-1 py-1 px-2.5 rounded-full transition-all focus:outline-none ${
              activeTab === 'statystyki'
                ? 'bg-brand-yolk text-amber-950 font-bold px-4 py-2 scale-102 shadow-md'
                : 'text-brand-outline hover:text-brand-text'
            }`}
            id="nav-statystyki-btn"
          >
            <BarChart2 className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] font-display uppercase tracking-wide">Statystyki</span>
          </button>
        </nav>

        {/* FOX ENCOUNTER LIGHTBOX DIALOG OVERLAY */}
        {activeFoxEvent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-sm bg-[#fff8f6] border-4 border-[#ba1a1a]/30 p-6 rounded-3xl shadow-2xl space-y-4 animate-bounceIn text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#ffdad6] rounded-full opacity-35" />
              
              <div className="w-16 h-16 bg-[#ffdad6] rounded-full flex items-center justify-center text-[#ba1a1a] mx-auto shadow-inner">
                <ShieldAlert className="w-8 h-8 stroke-[2.2]" />
              </div>

              <div className="space-y-2">
                <span className="bg-[#ba1a1a] text-white text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                  ⚠️ ALARM: Lis w dąbrowie!
                </span>
                <h3 className="font-display font-extrabold text-2xl text-brand-text leading-tight">
                  {activeFoxEvent.title}
                </h3>
                <p className="text-xs text-brand-text font-sans leading-relaxed px-1">
                  {activeFoxEvent.description}
                </p>
              </div>

              {/* Consequences tags */}
              <div className="bg-[#ffe2dd] border border-[#ffdad6] rounded-2xl p-3 grid grid-cols-2 gap-2 text-xs font-sans font-bold">
                <div className="text-left text-[#93000a]">
                  <span>Strata Kasy:</span>
                  <span className="float-right">{activeFoxEvent.cashChange} PLN</span>
                </div>
                <div className="text-left text-brand-primary">
                  <span>Strata Jajek:</span>
                  <span className="float-right">{activeFoxEvent.eggChange} szt</span>
                </div>
              </div>

              {/* sound snippet */}
              <div className="text-[10px] font-mono text-brand-outline italic">
                Słychać w kurniku: &ldquo;{activeFoxEvent.soundName}&rdquo;
              </div>

              <button
                onClick={() => setActiveFoxEvent(null)}
                className="w-full bg-[#ba1a1a] hover:bg-[#93000a] text-white font-sans font-semibold py-3 rounded-2xl shadow-md transition-colors"
              >
                Okej, zabezpiecz kurnik!
              </button>
            </div>
          </div>
        )}

        {/* PROFILE SETTINGS DIALOG POPUP */}
        {showProfile && (
          <ProfileModal 
            onClose={() => setShowProfile(false)}
            farmerName={farmerName}
            avatarUrl={avatarUrl}
            onSaveProfile={handleSaveProfile}
            onResetApp={handleResetApp}
          />
        )}
      </div>
    </div>
  );
}
