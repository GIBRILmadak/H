import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Contact {
  id: string;
  timestamp: number;
  duration: number;
}

interface User {
  id: string;
  name: string;
  avatar: string | null;
  status: 'safe' | 'warning' | 'danger';
}

interface AppState {
  hasSeenOnboarding: boolean;
  isAuthenticated: boolean;
  user: User | null;
  contacts: Contact[];
  lastReadAlertTimestamp: number;
  hasUnreadAlerts: boolean;
}

interface AppContextType extends AppState {
  setHasSeenOnboarding: (value: boolean) => void;
  setAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  addContact: (contactId: string, duration: number) => void;
  markAlertsAsRead: () => void;
  setHasUnreadAlerts: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const STORAGE_KEY = 'h_app_state_v3';

const generateId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let res = "";
  for (let i = 0; i < 2; i++) res += letters.charAt(Math.floor(Math.random() * letters.length));
  for (let i = 0; i < 4; i++) res += numbers.charAt(Math.floor(Math.random() * numbers.length));
  return res;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [lastReadAlertTimestamp, setLastReadAlertTimestamp] = useState(0);
  const [hasUnreadAlerts, setHasUnreadAlerts] = useState(false);

  const syncUserToCloud = async (userData: User) => {
    try {
      await supabase.from('users').upsert({
        id: userData.id,
        name: userData.name,
        status: userData.status,
        updated_at: new Date().toISOString()
      });
    } catch (e) {}
  };

  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setHasSeenOnboarding(parsed.hasSeenOnboarding);
        setAuthenticated(parsed.isAuthenticated);
        setLastReadAlertTimestamp(parsed.lastReadAlertTimestamp || 0);
        setHasUnreadAlerts(parsed.hasUnreadAlerts || false);
        if (parsed.user) {
            setUser(parsed.user);
            syncUserToCloud(parsed.user);
        }
        setContacts(parsed.contacts || []);
      } catch (e) {}
    } else {
        const newUser = { id: generateId(), name: 'Utilisateur Anonyme', avatar: null, status: 'safe' };
        setUser(newUser);
        syncUserToCloud(newUser);
    }
  }, []);

  useEffect(() => {
    const stateToSave = { hasSeenOnboarding, isAuthenticated, user, contacts, lastReadAlertTimestamp, hasUnreadAlerts };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [hasSeenOnboarding, isAuthenticated, user, contacts, lastReadAlertTimestamp, hasUnreadAlerts]);

  const updateUser = async (updates: Partial<User>) => {
    setUser(prev => {
      const updated = prev ? { ...prev, ...updates } : null;
      if (updated) syncUserToCloud(updated);
      return updated;
    });
  };

  const addContact = async (contactId: string, duration: number) => {
    const newContact = { id: contactId, timestamp: Date.now(), duration };
    setContacts(prev => [...prev, newContact]);

    // Synchronisation Cloud pour le traçage médical
    if (user?.id) {
        await supabase.from('contacts_exchange').insert({
            user_id: user.id,
            contact_id: contactId
        });
    }
  };

  const markAlertsAsRead = () => { setHasUnreadAlerts(false); };

  return (
    <AppContext.Provider value={{
        hasSeenOnboarding, isAuthenticated, user, contacts, lastReadAlertTimestamp, hasUnreadAlerts,
        setHasSeenOnboarding, setAuthenticated, setUser, updateUser, addContact, markAlertsAsRead, setHasUnreadAlerts
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppStore must be used within an AppProvider');
  return context;
}
