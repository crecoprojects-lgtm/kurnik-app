export interface Chicken {
  id: string;
  name: string;
  avatar: string;
  rating: number; // 1 to 5 stars
  description: string; // e.g. "Nioska roku"
  eggsLaidTotal: number;
  rank: number;
  daysInCoop?: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  deliveryType: 'Do Domu' | 'Odbiór Własny';
  balance: number; // Saldo gotówkowe w PLN. Dodatnie = nadpłata (przedpłata), Ujemne = dług (należność dla rolnika)
  useGlobalPrice: boolean; // true = używa bazy globalnej, false = używa customPricePerEgg
  customPricePerEgg?: number; // Indywidualna cena za sztukę
  dateAdded: string;
  monthlyDemand?: number; // Szacowane miesięczne zapotrzebowanie w sztukach
  realizedThisMonth?: number; // Liczba odebranych jaj w bieżącym okresie
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progressMax: number;
  progressCurrent: number;
  rewardText: string;
}

export interface HarvestLog {
  id: string;
  time: string; // Formatting e.g. "Dzisiaj, 14:20" or "Wczoraj" or "24 Maj"
  label: string; // e.g. "Świeży zbiór", "Zbiór wieczorny"
  count: number;
  dateKey: string; // e.g., '2026-06-11' to coordinate with history
}

export interface AlertLog {
  id: string;
  title: string;
  subtitle: string;
  type: 'super' | 'info' | 'warning';
  time?: string;
}

export interface FinanceLog {
  id: string;
  timestamp: string;
  type: 'expenditure' | 'income';
  amount: number;
  description: string;
}

export interface EggFuture {
  id: string;
  clientId: string;
  clientName: string;
  eggCount: number;
  pricePerEgg: number;
  deliveryDate: string; // e.g. "2026-06-18" or "W przyszły piątek"
  status: 'Oczekuje' | 'Zrealizowany' | 'Anulowany';
}

export interface FeedLog {
  id: string;
  timestamp: string; // Formatting e.g. "Dzisiaj, 15:40"
  type: 'zakup' | 'zuzycie' | 'korekta';
  amount: number; // in kg
  currentStockAfter: number; // weight after this event
  note: string;
}

