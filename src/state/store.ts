import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Mood = 'scattered' | 'okay' | 'flow';
export type SessionKind = 'focus' | 'break';

export type Session = {
  id: string;
  intention: string;
  plannedMin: number;
  /** Actual focused seconds (may be less than planned if ended early). */
  actualSec: number;
  completed: boolean;
  startedAt: string; // ISO
  endedAt: string; // ISO
  mood: Mood | null;
  kind: SessionKind;
};

export type Settings = {
  defaultMin: number;
  breathing: boolean;
  haptics: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  defaultMin: 25,
  breathing: true,
  haptics: true,
};

type StoreShape = {
  ready: boolean;
  sessions: Session[];
  settings: Settings;
  addSession: (s: Omit<Session, 'id'>) => void;
  setSettings: (patch: Partial<Settings>) => void;
  resetData: () => void;
};

const KEY = 'cadence.v1';

const StoreContext = createContext<StoreShape | null>(null);

type Persisted = { sessions: Session[]; settings: Settings };

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const hydrated = useRef(false);

  // Hydrate once on mount.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const data = JSON.parse(raw) as Partial<Persisted>;
          if (Array.isArray(data.sessions)) setSessions(data.sessions);
          if (data.settings) setSettingsState({ ...DEFAULT_SETTINGS, ...data.settings });
        }
      } catch {
        // Corrupt or unavailable storage — start fresh rather than crash.
      } finally {
        hydrated.current = true;
        setReady(true);
      }
    })();
  }, []);

  // Persist after hydration whenever data changes.
  useEffect(() => {
    if (!hydrated.current) return;
    AsyncStorage.setItem(KEY, JSON.stringify({ sessions, settings } satisfies Persisted)).catch(
      () => {},
    );
  }, [sessions, settings]);

  const addSession = useCallback((s: Omit<Session, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setSessions((prev) => [{ ...s, id }, ...prev]);
  }, []);

  const setSettings = useCallback((patch: Partial<Settings>) => {
    setSettingsState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetData = useCallback(() => {
    setSessions([]);
    setSettingsState(DEFAULT_SETTINGS);
  }, []);

  const value = useMemo<StoreShape>(
    () => ({ ready, sessions, settings, addSession, setSettings, resetData }),
    [ready, sessions, settings, addSession, setSettings, resetData],
  );

  return React.createElement(StoreContext.Provider, { value }, children);
}

export function useStore(): StoreShape {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
