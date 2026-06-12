import React, { useState } from 'react';
import { ShieldAlert, Plus, Home, User, UserPlus, Phone, Search, DollarSign, Check, X, TrendingUp, Pencil, Coins } from 'lucide-react';
import { Client, EggFuture } from '../types';

interface ClientsViewProps {
  clients: Client[];
  onAddClient: (name: string, phone: string, deliveryType: 'Do Domu' | 'Odbiór Własny', initialBalance: number, monthlyDemand: number) => void;
  onUpdateClientBalance: (clientId: string, amountOfEggs: number, valuePLN: number, settlementType: 'cash' | 'balance') => void;
  onEditClient: (
    clientId: string, 
    name: string, 
    phone: string, 
    deliveryType: 'Do Domu' | 'Odbiór Własny', 
    monthlyDemand: number, 
    useGlobalPrice: boolean, 
    customPricePerEgg?: number
  ) => void;
  onTopUpClientBalance: (clientId: string, amountPLN: number) => void;
  farmCash: number;
  eggPrice: number;
  futures: EggFuture[];
  onAddFuture: (clientId: string, eggCount: number, pricePerEgg: number, deliveryDate: string) => void;
  onFulfillFuture: (futureId: string) => void;
  onCancelFuture: (futureId: string) => void;
}

export default function ClientsView({
  clients,
  onAddClient,
  onUpdateClientBalance,
  onEditClient,
  onTopUpClientBalance,
  farmCash,
  eggPrice,
  futures,
  onAddFuture,
  onFulfillFuture,
  onCancelFuture,
}: ClientsViewProps) {
  // Navigation segment: 'klienci' or 'futures'
  const [activeSegment, setActiveSegment] = useState<'klienci' | 'futures'>('klienci');

  // Add Client Screen ('list' or 'add')
  const [clientSubView, setClientSubView] = useState<'list' | 'add'>('list');
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientDelivery, setNewClientDelivery] = useState<'Do Domu' | 'Odbiór Własny'>('Do Domu');
  const [newClientInitialBalance, setNewClientInitialBalance] = useState(0);
  const [newClientMonthlyDemand, setNewClientMonthlyDemand] = useState<number>(30);

  // Client Purchase Dialog
  const [activeSaleClient, setActiveSaleClient] = useState<Client | null>(null);
  const [saleEggsCount, setSaleEggsCount] = useState<number>(10);
  const [salePricePerEgg, setSalePricePerEgg] = useState<number>(eggPrice);
  const [saleSettlementType, setSaleSettlementType] = useState<'cash' | 'balance'>('cash');

  // Top-Up Client Balance dialog
  const [activeTopUpClient, setActiveTopUpClient] = useState<Client | null>(null);
  const [topUpAmount, setTopUpAmount] = useState<number>(50);

  // Edit Client Modal
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editClientName, setEditClientName] = useState('');
  const [editClientPhone, setEditClientPhone] = useState('');
  const [editClientDelivery, setEditClientDelivery] = useState<'Do Domu' | 'Odbiór Własny'>('Do Domu');
  const [editClientMonthlyDemand, setEditClientMonthlyDemand] = useState<number>(30);
  const [editClientUseGlobalPrice, setEditClientUseGlobalPrice] = useState<boolean>(true);
  const [editClientCustomPrice, setEditClientCustomPrice] = useState<number>(eggPrice);

  // Egg Futures Creation States
  const [showAddFutureForm, setShowAddFutureForm] = useState(false);
  const [futureClientId, setFutureClientId] = useState('');
  const [futureEggCount, setFutureEggCount] = useState(30);
  const [futurePricePerEgg, setFuturePricePerEgg] = useState(eggPrice);
  const [futureDeliveryDate, setFutureDeliveryDate] = useState('W najbliższy wtorek');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');



  const handleCreateClient = () => {
    if (!newClientName.trim()) return;

    onAddClient(
      newClientName,
      newClientPhone || '+48 000 000 000',
      newClientDelivery,
      newClientInitialBalance,
      newClientMonthlyDemand
    );

    // Reset Form
    setNewClientName('');
    setNewClientPhone('');
    setNewClientDelivery('Do Domu');
    setNewClientInitialBalance(0);
    setNewClientMonthlyDemand(30);
    setClientSubView('list');
  };

  const handleExecuteSale = () => {
    if (!activeSaleClient) return;
    const value = parseFloat((saleEggsCount * salePricePerEgg).toFixed(2));
    onUpdateClientBalance(activeSaleClient.id, saleEggsCount, value, saleSettlementType);
    setActiveSaleClient(null);
    setSaleEggsCount(10);
  };

  const handleExecuteTopUp = () => {
    if (!activeTopUpClient) return;
    onTopUpClientBalance(activeTopUpClient.id, topUpAmount);
    setActiveTopUpClient(null);
    setTopUpAmount(50);
  };

  const handleOpenEditClient = (client: Client) => {
    setEditingClient(client);
    setEditClientName(client.name);
    setEditClientPhone(client.phone);
    setEditClientDelivery(client.deliveryType);
    setEditClientMonthlyDemand(client.monthlyDemand || 35);
    setEditClientUseGlobalPrice(client.useGlobalPrice ?? true);
    setEditClientCustomPrice(client.customPricePerEgg || eggPrice);
  };

  const handleExecuteEditClient = () => {
    if (!editingClient) return;
    onEditClient(
      editingClient.id,
      editClientName,
      editClientPhone,
      editClientDelivery,
      editClientMonthlyDemand,
      editClientUseGlobalPrice,
      editClientUseGlobalPrice ? undefined : editClientCustomPrice
    );
    setEditingClient(null);
  };

  // Filter clients based on search
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="w-full max-w-md mx-auto bg-brand-surface min-h-[85vh] pb-24 overflow-hidden rounded-2xl flex flex-col">
      {/* Top Segment Controller */}
      <div className="px-5 pt-5 pb-3">
        <div className="bg-brand-container p-1 rounded-2xl flex whitespace-nowrap">
          <button
            onClick={() => {
              setActiveSegment('klienci');
            }}
            className={`flex-1 font-display font-semibold text-xs py-2 rounded-lg transition-all ${
              activeSegment === 'klienci'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-brand-outline hover:text-brand-text'
            }`}
            id="tab-klienci-btn"
          >
            👥 Moi Klienci
          </button>

          <button
            onClick={() => {
              setActiveSegment('futures');
            }}
            className={`flex-1 font-display font-semibold text-xs py-2 rounded-lg transition-all ${
              activeSegment === 'futures'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-brand-outline hover:text-brand-text'
            }`}
            id="tab-futures-btn"
          >
            📈 Futures
          </button>
        </div>
      </div>

      {activeSegment === 'klienci' && (
        /* ================= MOI KLIENCI VIEW (Customer Records & Sales) ================= */
        <div className="px-5 py-3 flex-1 flex flex-col space-y-4">
          
          {clientSubView === 'list' ? (
            /* ================= CLIENT LIST SUB-VIEW ================= */
            <>
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="font-display font-bold text-2xl text-brand-text">Klienci</h1>
                <button
                  onClick={() => setClientSubView('add')}
                  className="bg-[#d4fcd0] hover:bg-[#b0f5ab] text-brand-secondary text-xs font-bold py-1.5 px-3 rounded-full flex items-center gap-1 transition-colors"
                  id="add-client-tab-btn"
                >
                  <UserPlus className="w-4.5 h-4.5" />
                  <span>Nowy Klient</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brand-outline" />
                <input
                  type="text"
                  placeholder="Szukaj klientów..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-brand-container-highest rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-yolk transition-colors font-sans"
                  id="client-search-input"
                />
              </div>

              {/* Client List */}
              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {filteredClients.length === 0 ? (
                  <div className="text-center p-8 text-xs text-brand-outline bg-brand-container-low rounded-2xl">
                    Nie znaleziono takich klientów jajecznych.
                  </div>
                ) : (
                  filteredClients.map((client) => {
                    const hasGoldBalance = client.balance > 0;
                    const hasDebt = client.balance < 0;
                    
                    // Custom pricing
                    const displayPrice = (!client.useGlobalPrice && client.customPricePerEgg !== undefined) 
                      ? client.customPricePerEgg 
                      : eggPrice;
                    
                    const isCustomPrice = !client.useGlobalPrice && client.customPricePerEgg !== undefined;

                    // Calculate egg equivalent of their current balance
                    const eggsEquivalent = displayPrice > 0 ? Math.floor(Math.abs(client.balance) / displayPrice) : 0;

                    return (
                      <div 
                        key={client.id}
                        className="bg-white border border-[#ffeedd] rounded-2xl p-4 flex flex-col space-y-3 shadow-xs relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-display font-bold text-base text-brand-text">{client.name}</h3>
                              <button
                                onClick={() => handleOpenEditClient(client)}
                                className="p-1 hover:bg-gray-100 rounded text-brand-outline hover:text-brand-text cursor-pointer"
                                title="Edytuj dane klienta"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-brand-outline font-sans">
                              <Phone className="w-3 h-3 text-brand-outline-variant" />
                              <span>{client.phone}</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full font-sans uppercase tracking-wider ${
                              client.deliveryType === 'Do Domu' ? 'bg-[#e2f9e0] text-emerald-950' : 'bg-[#fff0ee] text-red-950'
                            }`}>
                              {client.deliveryType}
                            </span>
                            
                            {isCustomPrice ? (
                              <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 rounded px-1.5 font-bold font-sans">
                                Cena indywid.: {displayPrice.toFixed(2)} zł
                              </span>
                            ) : (
                              <span className="text-[9px] text-gray-400 font-sans">
                                Cena globalna: {eggPrice.toFixed(2)} zł
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Financial balance and Quick Actions */}
                        <div className="border-t border-dashed border-brand-container pt-3">
                          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-brand-outline block mb-1">FINANSE I SALDO</span>
                          
                          <div className="flex flex-col gap-1 mb-2.5">
                            {client.balance === 0 ? (
                              <span className="text-xs text-brand-outline font-sans font-medium">Czyste konto (0.00 PLN)</span>
                            ) : client.balance > 0 ? (
                              <div className="flex flex-col">
                                <span className="text-sm text-emerald-700 font-bold font-mono">
                                  + {client.balance.toFixed(2)} PLN (Nadpłata)
                                </span>
                                <span className="text-[10px] font-sans text-emerald-600 font-medium">
                                  Zapas gotówki wystarczy na ok. <strong className="font-bold">{eggsEquivalent} szt.</strong> jaj
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col">
                                <span className="text-sm text-red-600 font-bold font-mono">
                                  {client.balance.toFixed(2)} PLN (Zaległość / Dług)
                                </span>
                                <span className="text-[10px] font-sans text-red-700/80 font-medium">
                                  Klient wisi pieniądze za ok. <strong className="font-bold">{eggsEquivalent} szt.</strong> jajek
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Quick Action Buttons */}
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => {
                                setActiveTopUpClient(client);
                                setTopUpAmount(50);
                              }}
                              className="bg-amber-50/80 hover:bg-amber-100 text-amber-950 text-xs font-bold py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer border border-amber-200"
                            >
                              <Coins className="w-3.5 h-3.5 text-amber-700" />
                              <span>Wpłata PLN</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveSaleClient(client);
                                setSalePricePerEgg(displayPrice);
                                setSaleEggsCount(10);
                                setSaleSettlementType(client.balance > 0 ? 'balance' : 'cash');
                              }}
                              className="bg-[#ffe8e5] hover:bg-[#ffdad4] text-brand-primary text-xs font-bold py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer shadow-xs border border-brand-container-high"
                              id={`sell-to-${client.id}`}
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>Sprzedaj Jaja</span>
                            </button>
                          </div>
                        </div>

                        {/* Level of realization meter */}
                        <div className="bg-[#fffbf7] border border-amber-100/50 rounded-xl p-3 space-y-2 text-left">
                          <div className="flex justify-between items-center text-[10px] font-sans">
                            <span className="text-brand-outline font-semibold">Zapotrzebowanie:</span>
                            <span className="font-bold text-brand-text">{client.monthlyDemand || 30} jajek / msc</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-sans">
                            <span className="text-brand-outline font-semibold">Poziom Realizacji:</span>
                            <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {client.realizedThisMonth || 0} dostarczono ({Math.min(100, Math.round(((client.realizedThisMonth || 0) / (client.monthlyDemand || 30)) * 100))}% )
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(100, Math.round(((client.realizedThisMonth || 0) / (client.monthlyDemand || 30)) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            /* ================= SCREEN 5: NOWY KLIENT (Add Customer View) ================= */
            <div className="space-y-5 animate-fadeIn">
              {/* Custom Header in Screen 5 layout */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-amber-800">
                  <UserPlus className="w-4 h-4" />
                  <span className="text-[10px] font-bold tracking-widest uppercase font-sans">REKRUTACJA NOWYCH PIERZASTYCH FANÓW</span>
                </div>
                <h1 className="font-display font-bold text-2xl text-brand-text">Nowy Klient</h1>
                <p className="text-xs text-brand-outline font-sans">
                  Dodaj kolejną osobę do swojej listy jajecznych klientów.
                </p>
              </div>

              {/* Form Input fields */}
              <div className="space-y-4">
                {/* Client Name Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-brand-outline block">
                    Nazwa Klienta
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Np. Pani Halinka z dwojgiem dzieci"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="w-full bg-[#faefe9] border border-brand-container-highest rounded-2.5xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-yolk transition-colors font-sans text-brand-text"
                      id="new-client-name"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xl select-none opacity-40">📇</div>
                  </div>
                </div>

                {/* Client Phone Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-brand-outline block">
                    Numer Telefonu
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="+48 000 000 000"
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                      className="w-full bg-white border border-brand-container-highest rounded-2.5xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-yolk transition-colors font-sans text-brand-text"
                      id="new-client-phone"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xl select-none opacity-40">📞</div>
                  </div>
                </div>

                {/* Delivery Type */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-brand-outline block">
                    Typ Dostawy
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Do domu */}
                    <button
                      type="button"
                      onClick={() => setNewClientDelivery('Do Domu')}
                      className={`py-4 px-3 rounded-3xl border flex flex-col items-center justify-center gap-1.5 transition-all focus:outline-none ${
                        newClientDelivery === 'Do Domu'
                          ? 'bg-[#d2f3cf] border-brand-secondary text-brand-secondary shadow-sm scale-102'
                          : 'bg-white border-brand-container-highest text-brand-outline hover:bg-white/80'
                      }`}
                      id="delivery-house"
                    >
                      <Home className="w-6 h-6" />
                      <span className="font-display font-bold text-xs uppercase tracking-wider">Do Domu</span>
                    </button>

                    {/* Odbior wlasny */}
                    <button
                      type="button"
                      onClick={() => setNewClientDelivery('Odbiór Własny')}
                      className={`py-4 px-3 rounded-3xl border flex flex-col items-center justify-center gap-1.5 transition-all focus:outline-none ${
                        newClientDelivery === 'Odbiór Własny'
                          ? 'bg-[#ffe8e5] border-[#ba1a1a] text-[#ba1a1a] shadow-sm scale-102'
                          : 'bg-white border-brand-container-highest text-brand-outline hover:bg-white/80'
                      }`}
                      id="delivery-self"
                    >
                      <User className="w-6 h-6" />
                      <span className="font-display font-bold text-xs uppercase tracking-wider">Odbiór Własny</span>
                    </button>
                  </div>
                </div>

                {/* MONTHLY DEMAND ESTIMATION */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-brand-outline block">
                    Szacowane Zapotrzebowanie Miesięczne (szt. jajek)
                  </label>
                  <div className="flex items-center gap-3 font-sans">
                    <button
                      type="button"
                      onClick={() => setNewClientMonthlyDemand(prev => Math.max(5, prev - 5))}
                      className="w-10 h-10 rounded-xl bg-amber-100 text-amber-950 font-bold flex items-center justify-center text-lg active:scale-95 cursor-pointer"
                    >
                      -
                    </button>
                    <div className="flex-1 bg-white border border-brand-container-highest text-center py-2.5 rounded-xl text-xs font-display font-bold text-brand-text">
                      {newClientMonthlyDemand} szt. / msc
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewClientMonthlyDemand(prev => prev + 5)}
                      className="w-10 h-10 rounded-xl bg-amber-100 text-amber-950 font-bold flex items-center justify-center text-lg active:scale-95 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-[9px] text-brand-outline font-sans">
                    Służy do automatycznego śledzenia i wyliczania poziomu realizacji zamówień klienta.
                  </p>
                </div>

                {/* INITIAL BALANCE INCREMENTER */}
                <div className="bg-[#fff0ee] border border-brand-container-high rounded-3xl p-5 space-y-4">
                  <h3 className="font-display font-bold text-center text-brand-text leading-tight">Początkowe Saldo</h3>

                  <div className="flex items-center justify-center gap-4">
                    {/* Minus button */}
                    <button
                      type="button"
                      onClick={() => setNewClientInitialBalance(prev => prev - 1)}
                      className="w-10 h-10 rounded-xl bg-[#ffd6d0] hover:bg-[#ffbebe] text-[#93000a] flex items-center justify-center font-bold"
                    >
                      -
                    </button>

                    {/* Yellow center egg */}
                    <div className="w-24 h-24 rounded-full bg-brand-yolk border-2 border-white flex flex-col items-center justify-center shadow-md">
                      <span className="font-display font-bold text-3xl text-white">{newClientInitialBalance}</span>
                      <span className="text-[8px] font-sans font-extrabold uppercase text-amber-950 tracking-tight">
                        {newClientInitialBalance === 0 ? 'Czyste konto' : newClientInitialBalance > 0 ? 'Prepaid' : 'Kredyt'}
                      </span>
                    </div>

                    {/* Plus button */}
                    <button
                      type="button"
                      onClick={() => setNewClientInitialBalance(prev => prev + 1)}
                      className="w-10 h-10 rounded-xl bg-[#d4fcd0] hover:bg-[#b0f5ab] text-brand-secondary flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-[10px] text-brand-outline text-center leading-relaxed font-sans max-w-[280px] mx-auto">
                    Dodatnie saldo to jajka opłacone z góry (Prepaid). Ujemne to dług (Kredyt jajeczny).
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setClientSubView('list')}
                    className="flex-1 border border-brand-container-highest hover:bg-white text-brand-outline font-sans font-semibold py-3 px-4 rounded-xl transition-colors"
                  >
                    Anuluj
                  </button>

                  <button
                    type="button"
                    onClick={handleCreateClient}
                    disabled={!newClientName.trim()}
                    className={`flex-[2] font-sans font-semibold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all ${
                      newClientName.trim()
                        ? 'bg-amber-950 hover:bg-amber-900 text-white hover:shadow'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    id="save-client-btn"
                  >
                    <Check className="w-5 h-5" />
                    <span>Zapisz Klienta</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSegment === 'futures' && (
        /* ================= SPEKULACYJNE KONTRAKTY FUTURES VIEW ================= */
        <div className="px-5 py-3 flex-1 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h1 className="font-display font-bold text-2xl text-brand-text">Jajeczne Futures</h1>
              <p className="text-xs text-brand-outline font-sans">
                Spekulacja cenowa i gwarantowane rezerwacje
              </p>
            </div>
            
            <button
              onClick={() => {
                setShowAddFutureForm(!showAddFutureForm);
                if (clients.length > 0) {
                  setFutureClientId(clients[0].id);
                  setFuturePricePerEgg(eggPrice);
                }
              }}
              className="bg-brand-yolk text-amber-950 font-display font-bold text-xs py-2 px-3 rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border border-amber-300"
              id="new-future-contract-toggle"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{showAddFutureForm ? 'Zamknij' : 'Nowy Kontrakt'}</span>
            </button>
          </div>

          {/* Form to Create Future Contract booking */}
          {showAddFutureForm && (
            <div className="bg-[#fff9f6] border-2 border-brand-container-high rounded-3xl p-5 space-y-4 animate-slideDown shadow-xs">
              <h3 className="font-display font-extrabold text-sm uppercase text-brand-primary tracking-wider flex items-center gap-1.5">
                📈 Nowy Kontrakt Terminowy
              </h3>
              
              {clients.length === 0 ? (
                <div className="text-center py-4 space-y-2">
                  <p className="text-xs text-brand-outline font-sans">Nie masz jeszcze żadnych klientów w bazie!</p>
                  <button
                    onClick={() => setActiveSegment('klienci')}
                    className="text-xs text-[#951d0c] font-bold underline font-sans"
                  >
                    Wróć do klientów i dodaj pierwszego
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Client Selector */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-sans font-black uppercase text-brand-outline tracking-wider">Klient</label>
                    <select
                      value={futureClientId}
                      onChange={(e) => setFutureClientId(e.target.value)}
                      className="w-full bg-white border border-brand-container-highest rounded-xl p-2.5 text-xs font-sans text-brand-text focus:outline-none"
                    >
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Volume (Egg count) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-sans font-black uppercase text-brand-outline tracking-wider block">Wielkość zamówienia (jajek)</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFutureEggCount(prev => Math.max(5, prev - 5))}
                        className="w-8 h-8 rounded-lg bg-orange-100 text-[#ba1a1a] font-bold text-sm"
                      >
                        -5
                      </button>
                      <div className="flex-1 text-center font-mono text-xs font-bold text-brand-text bg-white border border-[#ffeedd] py-1 rounded-lg">
                        {futureEggCount} sztuk
                      </div>
                      <button
                        type="button"
                        onClick={() => setFutureEggCount(prev => prev + 5)}
                        className="w-8 h-8 rounded-lg bg-emerald-100 text-brand-secondary font-bold text-sm"
                      >
                        +5
                      </button>
                    </div>
                  </div>

                  {/* Price per Egg */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-sans font-black uppercase text-brand-outline tracking-wider block">Gwarantowana Cena (PLN/szt)</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFuturePricePerEgg(prev => Math.max(0.4, prev - 0.05))}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs"
                      >
                        -0.05
                      </button>
                      <div className="flex-1 text-center font-mono text-xs font-bold text-brand-text bg-white border border-[#ffeedd] py-1 rounded-lg">
                        {futurePricePerEgg.toFixed(2)} PLN
                      </div>
                      <button
                        type="button"
                        onClick={() => setFuturePricePerEgg(prev => prev + 0.05)}
                        className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs"
                      >
                        +0.05
                      </button>
                    </div>
                  </div>

                  {/* Delivery date string input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-sans font-black uppercase text-brand-outline tracking-wider">Data dostawy / Termin</label>
                    <input
                      type="text"
                      placeholder="Np. W przyszły wtorek, 25 Czerwca rano"
                      value={futureDeliveryDate}
                      onChange={(e) => setFutureDeliveryDate(e.target.value)}
                      className="w-full bg-white border border-brand-container-highest rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-yolk font-sans"
                    />
                  </div>

                  {/* Pricing Overview summary */}
                  <div className="bg-amber-500/10 rounded-xl p-3 flex justify-between text-xs font-sans text-brand-text">
                    <span className="font-semibold text-amber-950">Wartość kontraktu:</span>
                    <span className="font-bold text-amber-950">{(futureEggCount * futurePricePerEgg).toFixed(2)} PLN</span>
                  </div>

                  {/* Submit button */}
                  <button
                    type="button"
                    onClick={() => {
                      onAddFuture(futureClientId, futureEggCount, futurePricePerEgg, futureDeliveryDate);
                      setShowAddFutureForm(false);
                    }}
                    className="w-full bg-amber-950 hover:bg-amber-900 text-white text-xs font-sans font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 text-center block"
                  >
                    🤝 Podpisz Kontrakt Future
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Explanation Banner */}
          <div className="border border-dashed border-emerald-600/30 bg-emerald-500/5 rounded-2xl p-4 flex gap-3 text-emerald-950">
            <span className="text-xl select-none font-display">💡</span>
            <p className="text-[11px] leading-relaxed italic font-sans text-left">
              <strong>Co to są Futures?</strong> Są to spekulacyjne rezerwacje jaj. Klient gwarantuje, że kupi określoną liczbę jajek po umówionej cenie, chroniąc Twoje dochody przed rynkowymi wahaniami cen!
            </p>
          </div>

          {/* Active Futures list card section */}
          <div className="space-y-3 flex-1 text-left">
            <h2 className="font-display font-extrabold text-base text-brand-text">Zakontraktowane Rezerwacje ({futures.length})</h2>

            {futures.length === 0 ? (
              <div className="bg-white border border-brand-container-highest rounded-2xl p-6 text-center space-y-2">
                <span className="text-2xl block">📉</span>
                <p className="text-xs text-brand-outline font-sans">
                  Brak aktywnych rezerwacji terminowych. Załóż pierwszy kontrakt za pomocą przycisku wyżej!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {futures.map((fut) => {
                  const totalVal = (fut.eggCount * fut.pricePerEgg).toFixed(2);
                  
                  return (
                    <div
                      key={fut.id}
                      className={`border rounded-2xl p-4 flex flex-col space-y-3 transition-shadow ${
                        fut.status === 'Zrealizowany'
                          ? 'bg-emerald-500/5 border-emerald-250'
                          : fut.status === 'Anulowany'
                          ? 'bg-red-500/5 border-red-200 opacity-60'
                          : 'bg-white border-[#ffeedd] shadow-xs hover:shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-display font-extrabold text-sm text-brand-text">{fut.clientName}</h4>
                          <span className="text-[10px] text-brand-outline tracking-tight font-sans block mt-0.5">
                            📅 Termin odbioru: <strong className="font-semibold">{fut.deliveryDate}</strong>
                          </span>
                        </div>
                        
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                          fut.status === 'Zrealizowany'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fut.status === 'Anulowany'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {fut.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-dashed border-brand-container pt-3 text-xs">
                        <div className="font-sans text-brand-outline">
                          Wolumen: <strong className="text-brand-text font-bold">{fut.eggCount} szt.</strong>
                          <span className="block text-[10px]">Stawka: {fut.pricePerEgg.toFixed(2)} PLN</span>
                        </div>
                        <div className="text-right flex flex-col justify-center">
                          <span className="text-[9px] text-brand-outline uppercase">Wartość kontraktu</span>
                          <span className="font-display font-black text-sm text-brand-text">{totalVal} PLN</span>
                        </div>
                      </div>

                      {fut.status === 'Oczekuje' && (
                        <div className="flex gap-2 pt-1 border-t border-dashed border-brand-container">
                          {/* Cancel Option */}
                          <button
                            onClick={() => onCancelFuture(fut.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-sans font-bold py-1.5 px-3 rounded-lg flex-1 cursor-pointer transition-all active:scale-95 text-center"
                          >
                            Anuluj rezerwację
                          </button>
                          
                          {/* Deliver/Fulfill option */}
                          <button
                            onClick={() => onFulfillFuture(fut.id)}
                            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-950 text-[10px] font-sans font-bold py-1.5 px-3 rounded-lg flex-1 cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Zrealizuj dostawę</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUICK SALE TRANSACTION MODAL */}
      {activeSaleClient && (
        <div className="fixed inset-0 bg-brand-text/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm bg-white border border-brand-container-highest p-6 rounded-3xl shadow-xl space-y-4 animate-scaleUp text-left">
            <div className="flex justify-between items-center font-sans">
              <div>
                <h3 className="font-display font-bold text-lg text-brand-text">Sprzedaż Jajeczek</h3>
                <p className="text-xs text-brand-outline">Dla: <strong className="font-semibold">{activeSaleClient.name}</strong></p>
              </div>
              <button 
                onClick={() => setActiveSaleClient(null)}
                className="text-brand-outline hover:text-brand-text cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3 font-sans">
              <div className="bg-[#fff5f2] rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-brand-outline block">Aktualne Saldo klienta</span>
                  <span className="font-display font-bold text-sm tracking-wide text-brand-text font-mono">
                    {activeSaleClient.balance === 0 
                      ? '0.00 PLN (Czyste konto)' 
                      : activeSaleClient.balance > 0 
                      ? `+${activeSaleClient.balance.toFixed(2)} PLN (Przedpłata)` 
                      : `${activeSaleClient.balance.toFixed(2)} PLN (Dług)`}
                  </span>
                </div>
              </div>

              {/* Number of eggs to sell */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-outline block">Ilość kupowanych jajek (szt.)</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSaleEggsCount(prev => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-xl bg-orange-100 text-brand-primary font-bold flex items-center justify-center cursor-pointer select-none"
                  >
                    -
                  </button>
                  <div className="flex-1 bg-brand-surface border border-brand-container text-center py-2 rounded-xl text-lg font-display font-extrabold text-brand-text">
                    {saleEggsCount} szt.
                  </div>
                  <button
                    onClick={() => setSaleEggsCount(prev => prev + 1)}
                    className="w-10 h-10 rounded-xl bg-emerald-100 text-brand-secondary font-bold flex items-center justify-center cursor-pointer select-none"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price per egg selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-outline block">Cena za sztukę (PLN)</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(() => {
                    const priceOptions = Array.from(new Set([
                      Math.max(0.50, eggPrice - 0.20),
                      eggPrice,
                      eggPrice + 0.30,
                      1.50
                    ])).sort((a, b) => a - b);
                    return priceOptions.map((prc) => (
                      <button
                        key={prc}
                        onClick={() => setSalePricePerEgg(prc)}
                        className={`text-[10px] md:text-xs font-sans font-semibold py-2 px-1.5 rounded-lg border transition-all cursor-pointer ${
                          Math.abs(salePricePerEgg - prc) < 0.01
                            ? 'bg-amber-950 border-amber-950 text-white shadow-inner'
                            : 'bg-white border-brand-container-highest text-brand-outline hover:bg-white/80'
                        }`}
                      >
                        {prc.toFixed(2)} PLN
                      </button>
                    ));
                  })()}
                </div>
              </div>

              {/* Settlement selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-outline block">Sposób rozliczenia transakcji</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSaleSettlementType('cash')}
                    className={`py-2 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all text-center cursor-pointer ${
                      saleSettlementType === 'cash'
                        ? 'bg-[#d2f3cf] border-brand-secondary text-brand-secondary font-bold font-sans'
                        : 'bg-white border-brand-container-highest text-brand-outline font-sans'
                    }`}
                  >
                    <span className="text-xs">Gotówka do ręki</span>
                    <span className="text-[8px] opacity-75 font-medium font-mono">(Zasila skarbonkę)</span>
                  </button>

                  <button
                    onClick={() => setSaleSettlementType('balance')}
                    className={`py-2 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all text-center cursor-pointer ${
                      saleSettlementType === 'balance'
                        ? 'bg-amber-100 border-amber-600 text-amber-950 font-bold font-sans'
                        : 'bg-white border-brand-container-highest text-brand-outline font-sans'
                    }`}
                  >
                    <span className="text-xs">Zeszyt (Z salda)</span>
                    <span className="text-[8px] opacity-75 font-medium font-mono">(Brak gotówki żywej)</span>
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="pt-2 border-t border-dashed border-gray-200 flex justify-between text-xs text-brand-outline">
                <span>Razem do rozliczenia:</span>
                <span className="font-bold text-sm text-brand-text font-mono">{(saleEggsCount * salePricePerEgg).toFixed(2)} PLN</span>
              </div>
            </div>

            <button
              onClick={handleExecuteSale}
              className="w-full bg-[#e2f9e0] hover:bg-[#c2f4bc] text-brand-secondary border border-[#c6efbe] font-sans font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer text-sm"
              id="confirm-sale-btn"
            >
              <Check className="w-5 h-5" />
              <span>Zatwierdź Transakcję</span>
            </button>
          </div>
        </div>
      )}

      {/* EDIT CLIENT MODAL */}
      {editingClient && (
        <div className="fixed inset-0 bg-brand-text/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm bg-white border border-brand-container-highest p-6 rounded-3xl shadow-xl space-y-4 animate-scaleUp text-left">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-lg text-brand-text">Edytuj Klienta</h3>
                <p className="text-xs text-brand-outline font-sans">Zmień dane, ceny lub zapotrzebowanie</p>
              </div>
              <button 
                onClick={() => setEditingClient(null)}
                className="text-brand-outline hover:text-brand-text cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3 font-sans">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-outline block">Imię / Nazwa klienta</label>
                <input
                  type="text"
                  value={editClientName}
                  onChange={(e) => setEditClientName(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-container-high rounded-xl p-3 text-sm focus:outline-none focus:border-brand-yolk font-sans"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-outline block">Numer telefonu</label>
                <input
                  type="text"
                  value={editClientPhone}
                  onChange={(e) => setEditClientPhone(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-container-high rounded-xl p-3 text-sm focus:outline-none focus:border-brand-yolk font-sans"
                />
              </div>

              {/* Delivery type */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-outline block">Typ Dostawy</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditClientDelivery('Do Domu')}
                    className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                      editClientDelivery === 'Do Domu' ? 'bg-[#d2f3cf] border-brand-secondary text-brand-secondary' : 'bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    Do Domu
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditClientDelivery('Odbiór Własny')}
                    className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                      editClientDelivery === 'Odbiór Własny' ? 'bg-[#ffe8e5] border-[#ba1a1a] text-[#ba1a1a]' : 'bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    Odbiór Własny
                  </button>
                </div>
              </div>

              {/* Monthly Demand */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-outline block">Miesięczne zapotrzebowanie (szt. jajek)</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditClientMonthlyDemand(prev => Math.max(5, prev - 5))}
                    className="w-10 h-10 rounded-xl bg-orange-100 text-brand-primary font-bold flex items-center justify-center cursor-pointer select-none"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-display font-bold text-sm text-brand-text">
                    {editClientMonthlyDemand} szt. / msc
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditClientMonthlyDemand(prev => prev + 5)}
                    className="w-10 h-10 rounded-xl bg-emerald-100 text-brand-secondary font-bold flex items-center justify-center cursor-pointer select-none"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Individual Egg Pricing */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/50 space-y-2">
                <label className="text-xs font-bold text-amber-950 block">Indywidualna cena za sztukę jajka</label>
                
                <div className="flex gap-4 text-xs font-semibold text-brand-text">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={editClientUseGlobalPrice}
                      onChange={() => setEditClientUseGlobalPrice(true)}
                      className="accent-amber-950 font-sans"
                    />
                    <span>Globalna ({eggPrice.toFixed(2)} zł)</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!editClientUseGlobalPrice}
                      onChange={() => setEditClientUseGlobalPrice(false)}
                      className="accent-amber-950 font-sans"
                    />
                    <span>Własna cena</span>
                  </label>
                </div>

                {!editClientUseGlobalPrice && (
                  <div className="pt-1.5 flex items-center gap-2 font-sans">
                    <input
                      type="number"
                      step="0.05"
                      min="0.1"
                      value={editClientCustomPrice}
                      onChange={(e) => setEditClientCustomPrice(parseFloat(e.target.value) || eggPrice)}
                      className="w-24 bg-white border border-brand-container-high rounded-lg p-1.5 text-xs text-center font-mono font-bold"
                    />
                    <span className="text-xs text-brand-outline">PLN za sztukę jajka</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setEditingClient(null)}
                className="flex-1 border border-brand-container-highest hover:bg-gray-50 font-sans font-semibold py-2.5 rounded-xl text-center text-brand-outline text-xs cursor-pointer"
              >
                Anuluj
              </button>
              <button
                onClick={handleExecuteEditClient}
                className="flex-[2] bg-amber-950 hover:bg-amber-900 text-white font-sans font-semibold py-2.5 rounded-xl text-center text-xs shadow-sm cursor-pointer"
              >
                Zatwierdź Zmiany
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP-UP (WPLATA PLN COIN) MODAL */}
      {activeTopUpClient && (
        <div className="fixed inset-0 bg-brand-text/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="w-full max-w-sm bg-white border border-brand-container-highest p-6 rounded-3xl shadow-xl space-y-4 animate-scaleUp text-left">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-lg text-brand-text">Zarejestruj Wpłatę</h3>
                <p className="text-xs text-brand-outline">Dla: <strong className="font-semibold">{activeTopUpClient.name}</strong></p>
              </div>
              <button 
                onClick={() => setActiveTopUpClient(null)}
                className="text-brand-outline hover:text-brand-text cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-emerald-50 rounded-2xl p-4 flex items-center justify-between border border-emerald-100">
                <div>
                  <span className="text-xs text-emerald-800 block">Aktualny Bilans Klienta</span>
                  <span className="font-display font-bold text-sm tracking-wide text-emerald-950 font-mono">
                    {activeTopUpClient.balance.toFixed(2)} PLN
                  </span>
                </div>
              </div>

              {/* Preset buttons */}
              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-bold text-brand-outline block">Predefiniowane kwoty wpłaty</label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setTopUpAmount(amt)}
                      className={`text-xs font-bold py-2 rounded-lg border transition-all cursor-pointer ${
                        topUpAmount === amt
                          ? 'bg-amber-950 border-amber-950 text-white'
                          : 'bg-white border-brand-container-highest text-brand-outline hover:bg-white/80'
                      }`}
                    >
                      {amt} zł
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div className="space-y-1 font-sans">
                <label className="text-xs font-bold text-brand-outline block">Inna kwota wpłaty (PLN)</label>
                <input
                  type="number"
                  min="0.1"
                  step="1"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-brand-surface border border-brand-container-high rounded-xl p-3 text-sm focus:outline-none focus:border-brand-yolk text-center font-mono font-bold text-brand-text"
                />
              </div>

              <p className="text-[10px] text-brand-outline leading-tight font-sans">
                💡 Wpłata zasila Twoją kurnikową skarbonkę żywą gotówką od klienta, a stan jego salda podnosi się o tę kwotę (spłata długu lub opłacenie z góry).
              </p>
            </div>

            <button
              onClick={handleExecuteTopUp}
              className="w-full bg-[#e2f9e0] hover:bg-[#c2f4bc] text-brand-secondary border border-[#c6efbe] font-sans font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer text-sm"
            >
              <Check className="w-4 h-4" />
              <span>Zatwierdź Wpłatę (+{topUpAmount.toFixed(2)} zł)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
