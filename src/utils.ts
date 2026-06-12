import { Chicken, Client, HarvestLog, AlertLog } from './types';

export const DEFAULT_CHICKENS: Chicken[] = [
  {
    id: '1',
    name: 'Zofia',
    rating: 5,
    description: '"Nioska roku - korona z piórek zobowiązuje"',
    eggsLaidTotal: 312,
    rank: 1,
    avatar: '/portrety/kury/kura2.png'
  },
  {
    id: '2',
    name: 'Berta',
    rating: 5,
    description: '"Dzielna i rzetelna - klasyka brązowej skorupki"',
    eggsLaidTotal: 298,
    rank: 2,
    avatar: '/portrety/kury/kura1.png'
  },
  {
    id: '3',
    name: 'Kropka',
    rating: 4,
    description: '"Szybki bieg - pierwsza przy misce z dżdżownicami"',
    eggsLaidTotal: 284,
    rank: 3,
    avatar: '/portrety/kury/kura3.png'
  },
  {
    id: '4',
    name: 'Matylda',
    rating: 5,
    description: '"Puszysta kuleczka, królowa miękkich gniazd"',
    eggsLaidTotal: 210,
    rank: 4,
    avatar: '/portrety/kury/kura4.png'
  },
  {
    id: '5',
    name: 'Grażyna',
    rating: 4,
    description: '"Najgłośniejsza rano. Budzik z piórami"',
    eggsLaidTotal: 195,
    rank: 5,
    avatar: '/portrety/kury/kura5.png'
  },
  {
    id: '6',
    name: 'Czesława',
    rating: 5,
    description: '"Szybki stopa - potrafi ukraść kukurydzę w locie"',
    eggsLaidTotal: 180,
    rank: 6,
    avatar: '/portrety/kury/kura6.png'
  }
];

export const DEFAULT_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Pani Halinka z dwojgiem dzieci',
    phone: '+48 501 234 567',
    deliveryType: 'Do Domu',
    balance: 15.00,
    useGlobalPrice: true,
    dateAdded: '2026-06-01',
    monthlyDemand: 40,
    realizedThisMonth: 15
  },
  {
    id: 'c2',
    name: 'Pan Janusz spod piątki',
    phone: '+48 602 987 654',
    deliveryType: 'Odbiór Własny',
    balance: -6.00,
    useGlobalPrice: true,
    dateAdded: '2026-06-05',
    monthlyDemand: 20,
    realizedThisMonth: 8
  },
  {
    id: 'c3',
    name: 'Restauracja Pod Kogutem',
    phone: '+48 703 111 222',
    deliveryType: 'Do Domu',
    balance: 40.00,
    useGlobalPrice: false,
    customPricePerEgg: 1.00,
    dateAdded: '2026-05-20',
    monthlyDemand: 120,
    realizedThisMonth: 85
  }
];

export const FARMER_AVATAR_PRESETS = [
  '/portrety/gospodarze/gospodarz1.png',
  '/portrety/gospodarze/gospodarz2.png',
  '/portrety/gospodarze/gospodarz3.png',
  '/portrety/gospodarze/gospodarz4.png'
];

export const CHICKEN_AVATAR_PRESETS = [
  '/portrety/kury/kura1.png',
  '/portrety/kury/kura2.png',
  '/portrety/kury/kura3.png',
  '/portrety/kury/kura4.png',
  '/portrety/kury/kura5.png',
  '/portrety/kury/kura6.png'
];

export const DEFAULT_HARVESTS: HarvestLog[] = [
  {
    id: 'h1',
    time: 'Dzisiaj, 14:20',
    label: 'Świeży zbiór',
    count: 42,
    dateKey: '2026-06-11'
  },
  {
    id: 'h2',
    time: 'Wczoraj, 18:10',
    label: 'Zbiór wieczorny',
    count: 38,
    dateKey: '2026-06-10'
  },
  {
    id: 'h3',
    time: '24 Maj, 08:30',
    label: 'Zbiór poranny',
    count: 45,
    dateKey: '2026-05-24'
  }
];

export const DEFAULT_ALERTS: AlertLog[] = [
  {
    id: 'a1',
    title: 'Złotka zniosła 3 jajka!',
    subtitle: 'Przodowniczka dnia',
    type: 'super',
    time: 'Dzisiaj'
  },
  {
    id: 'a2',
    title: 'Zamykanie Kurnika',
    subtitle: 'Zaplanowano na 20:00',
    type: 'info',
    time: 'Za chwilę'
  }
];

export const COOP_HUMOR_QUOTES = [
  "Kury są dziś w jajecznym humorze!",
  "Stado debatuje nad podwyżką racji kukurydzy o 15%.",
  "Grażyna zgłosiła, że gniazdo numer 3 ma za twardą słomę.",
  "Zofia założyła dziś pióropusz pod kątem 45 stopni. Szykuje się ważny dzień.",
  "Dzisiejsza prognoza pogody: słońce i wysoka nioskowość!",
  "Kogut Zenon ćwiczył dziś głos od 4:15 rano. Sąsiedzi zachwyceni (lub nie).",
  "Puszysta Matylda zasypiała podczas wysiadywania. Prawdziwy relaks.",
  "Kury twierdzą, że jajka mają idealny kształt dzięki najnowszej piosence w radiu."
];

export interface FoxEvent {
  title: string;
  description: string;
  cashChange: number;
  eggChange: number;
  type: 'success' | 'warning' | 'error';
  soundName: string;
}

export const FOX_VISITS: FoxEvent[] = [
  {
    title: "Lis Rudolf powstrzymany!",
    description: "Lis Rudolf skradał się za kurnikiem! Na szczęście kogut Zenon zaczął głośno piać i narobił takiego rabanu, że rudzielec uciekł w popłochu. Strata: 0 jajek. Kogut dostał dodatkową garść kukurydzy!",
    cashChange: -2,
    eggChange: 0,
    type: "success",
    soundName: "Koo-ka-ree-koo!"
  },
  {
    title: "Nocna kradzież!",
    description: "Lis przebiegł pod płotem i zabrał ze skrzynki 4 jajka zanim pies Bernard obudził się z drzemki. Musisz zainwestować w lepszy skobel do drzwi kurnika (-15 PLN).",
    cashChange: -15,
    eggChange: -4,
    type: "error",
    soundName: "Hau hau! (Za późno)"
  },
  {
    title: "Bernard na straży!",
    description: "Pies Bernard wywęszył lisa z odległości 100 metrów! Pogonił go aż do lasu. Lis porzucił dorodne, soczyste jabłko, które zaniosłeś kurom. Stado jest zachwycone. Koszt smakołyków dla psa: -5 PLN, ale humor stada: 100%!",
    cashChange: -5,
    eggChange: 0,
    type: "success",
    soundName: "Wrrr... hau!"
  },
  {
    title: "Spłoszone stadko!",
    description: "Lis zaglądał przez okienko! Nic nie ukradł, ale kury tak wpadły w panikę, że zapomniały jak się znosi jajka. Dzisiejsza wydajność spadła, ale kogut odzyskał honor. Kup paszy uspokajającej (-10 PLN).",
    cashChange: -10,
    eggChange: -2,
    type: "warning",
    soundName: "Ko-Ko-Ko-Koo!"
  },
  {
    title: "Dzielna straż sąsiedzka!",
    description: "Sąsiad pan Janusz zauważył lisa kręcącego się przy siatce i postraszył go grabiami. Lis uciekł na dobre! Pan Janusz dostał w podzięce 6 jajek gratis.",
    cashChange: 0,
    eggChange: -6,
    type: "warning",
    soundName: "Dziękujemy panie Januszu!"
  }
];

export function handleChickenAvatarError(e: any) {
  const target = e.currentTarget;
  // If the source does not already point to Unsplash (meaning it's local)
  if (target && target.src && !target.src.includes('unsplash.com')) {
    if (target.src.includes('kura1')) {
      target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=400';
    } else if (target.src.includes('kura2')) {
      target.src = 'https://images.unsplash.com/photo-1587520018450-b8b37493a749?auto=format&fit=crop&q=80&w=400';
    } else if (target.src.includes('kura3')) {
      target.src = 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?auto=format&fit=crop&q=80&w=400';
    } else if (target.src.includes('kura4')) {
      target.src = 'https://images.unsplash.com/photo-1569254994521-ddbb54af5ae8?auto=format&fit=crop&q=80&w=400';
    } else if (target.src.includes('kura5')) {
      target.src = 'https://images.unsplash.com/photo-1594142104523-2cb9e37da186?auto=format&fit=crop&q=80&w=400';
    } else if (target.src.includes('kura6')) {
      target.src = 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=400';
    } else {
      target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=400';
    }
  }
}

export function handleFarmerAvatarError(e: any) {
  const target = e.currentTarget;
  // If the source does not already point to Unsplash (meaning it's local)
  if (target && target.src && !target.src.includes('unsplash.com')) {
    if (target.src.includes('gospodarz1')) {
      target.src = 'https://images.unsplash.com/photo-1595273670150-db0a3e37d415?auto=format&fit=crop&q=80&w=400';
    } else if (target.src.includes('gospodarz2')) {
      target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=400';
    } else if (target.src.includes('gospodarz3')) {
      target.src = 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80&w=400';
    } else if (target.src.includes('gospodarz4')) {
      target.src = 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=400';
    } else {
      target.src = 'https://images.unsplash.com/photo-1595273670150-db0a3e37d415?auto=format&fit=crop&q=80&w=400';
    }
  }
}
