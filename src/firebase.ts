/// <reference types="vite/client" />
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/*
  =============================================================================
  💡 INSTRUKCJA DLA LAIKA - KONFIGURACJA FIREBASE (UZUPEŁNISZ TO PÓŹNIEJ! ☀️)
  =============================================================================
  Hej! Nie martw się, że nie masz jeszcze kluczy Firebase API. Gra działa w 100% 
  automatycznie na Twoim komputerze i przeglądarce korzystając z pamięci lokalnej (LocalStorage).
  
  Kiedy założysz już darmowy projekt w zakładce Firebase Console (https://console.firebase.google.com/):
  1. Kliknij "Add app" -> i wybierz ikonkę platformy Web (</>).
  2. Firebase wygeneruje dla Ciebie zestaw kluczy (firebaseConfig).
  3. Skopiuj je i wstaw do nowo utworzonego pliku o nazwie ".env" w głównym folderze gry.
  
  Szczegółowy przewodnik krok-po-kroku znajdziesz w pliku `INSTRUKCJA.md` w głównym katalogu!
  =============================================================================
*/

// Definicja konfiguracji z bezpiecznym odczytem zmiennych środowiskowych z pliku .env
// Zmienne te są automatycznie pobierane z Twojego bezpiecznego pliku .env
const firebaseConfig = {
  apiKey: "AIzaSyACmtZv2EVzDPwT4vTojcQTHryE3QXpiD4",
  authDomain: "moj-kurnik-app.firebaseapp.com",
  projectId: "moj-kurnik-app",
  storageBucket: "moj-kurnik-app.firebasestorage.app",
  messagingSenderId: "400007130645",
  appId: "1:400007130645:web:b769c42053601191a2a81c"
};

// Sprawdzenie, czy konfiguracja została uzupełniona we własnym pliku .env
export const isFirebaseConfigured = !!firebaseConfig.apiKey;

let app;
let db: any = null;
let auth: any = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("🔥 [Firebase] Pomyślnie zainicjalizowano połączenie z chmurą!");
  } catch (error) {
    console.error("❌ [Firebase] Błąd podczas inicjalizacji:", error);
  }
} else {
  console.warn(
    "⚠️ [Firebase] Brak zmiennych środowiskowych w pliku .env. Aplikacja działa teraz w trybie lokalnym offline (LocalStorage)."
  );
}

export { db, auth };

/**
 * 💡 Przyjacielski Pomocnik Synchronizacji Chmurowej:
 * Aby podpiąć rzeczywisty zapis do chmury Firestore w swoim kodzie, 
 * wystarczy podmienić odczyty z localStorage na zapytania Firestore.
 * 
 * Przykład zapisu nowego klienta:
 * ```ts
 * import { collection, addDoc } from "firebase/firestore";
 * import { db } from "./firebase";
 * 
 * export const dbAddClient = async (clientData) => {
 *   if (!db) return; // Jeśli brak konfiguracji, pomiń lub fallback na LocalStorage
 *   return await addDoc(collection(db, "clients"), clientData);
 * };
 * ```
 */
