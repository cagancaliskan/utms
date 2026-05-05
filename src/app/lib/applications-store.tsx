import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { Application, ApplicationStatus, IntibakEntry } from '../types';
import { mockApplications } from './mock-data';

const STORAGE_KEY = 'utms.applications.v1';

interface ApplicationsContextValue {
  applications: Application[];
  addApplication: (app: Application) => void;
  updateApplication: (id: string, patch: Partial<Application>) => void;
  setLanguageDecision: (
    id: string,
    decision: 'successful' | 'unsuccessful' | 'exempt',
    actor: string,
    note?: string
  ) => void;
  saveIntibak: (id: string, entries: IntibakEntry[], actor: string) => void;
  advanceStatus: (id: string, status: ApplicationStatus, actor: string, note?: string) => void;
  getById: (id: string) => Application | undefined;
  resetToSeed: () => void;
}

const ApplicationsContext = createContext<ApplicationsContextValue | null>(null);

function reviveDates(app: Application): Application {
  return {
    ...app,
    submittedAt: app.submittedAt ? new Date(app.submittedAt as unknown as string) : undefined,
    documents: (app.documents || []).map(d => ({
      ...d,
      uploadedAt: new Date(d.uploadedAt as unknown as string)
    })),
    timeline: (app.timeline || []).map(t => ({
      ...t,
      timestamp: new Date(t.timestamp as unknown as string)
    }))
  };
}

function loadFromStorage(): Application[] {
  if (typeof window === 'undefined') return mockApplications.map(reviveDates);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return mockApplications.map(reviveDates);
    const parsed = JSON.parse(raw) as Application[];
    if (!Array.isArray(parsed)) return mockApplications.map(reviveDates);
    return parsed.map(reviveDates);
  } catch (err) {
    console.warn('[applications-store] load failed, using seed', err);
    return mockApplications.map(reviveDates);
  }
}

function saveToStorage(apps: Application[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch (err) {
    console.warn('[applications-store] save failed', err);
  }
}

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>(() => loadFromStorage());

  useEffect(() => {
    saveToStorage(applications);
  }, [applications]);

  const addApplication = useCallback((app: Application) => {
    setApplications(prev => [app, ...prev]);
  }, []);

  const updateApplication = useCallback((id: string, patch: Partial<Application>) => {
    setApplications(prev => prev.map(a => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const advanceStatus = useCallback(
    (id: string, status: ApplicationStatus, actor: string, note?: string) => {
      setApplications(prev =>
        prev.map(a => {
          if (a.id !== id) return a;
          const event = { status, timestamp: new Date(), actor, note };
          return { ...a, status, timeline: [...a.timeline, event] };
        })
      );
    },
    []
  );

  const setLanguageDecision = useCallback(
    (id: string, decision: 'successful' | 'unsuccessful' | 'exempt', actor: string, note?: string) => {
      setApplications(prev =>
        prev.map(a => {
          if (a.id !== id) return a;
          const nextStatus: ApplicationStatus =
            decision === 'unsuccessful' ? 'rejected' : 'academic_evaluation';
          const event = {
            status: nextStatus,
            timestamp: new Date(),
            actor,
            note: note || 'Language decision: ' + decision
          };
          return {
            ...a,
            languageStatus: decision,
            status: nextStatus,
            timeline: [...a.timeline, event]
          };
        })
      );
    },
    []
  );

  const saveIntibak = useCallback((id: string, entries: IntibakEntry[], actor: string) => {
    setApplications(prev =>
      prev.map(a => {
        if (a.id !== id) return a;
        const event = {
          status: 'dean_review' as ApplicationStatus,
          timestamp: new Date(),
          actor,
          note: 'Intibak saved (' + entries.length + ' entries)'
        };
        return {
          ...a,
          status: 'dean_review',
          timeline: [...a.timeline, event],

          intibak: entries
        };
      })
    );
  }, []);

  const getById = useCallback(
    (id: string) => applications.find(a => a.id === id),
    [applications]
  );

  const resetToSeed = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setApplications(mockApplications.map(reviveDates));
  }, []);

  const value = useMemo<ApplicationsContextValue>(
    () => ({
      applications,
      addApplication,
      updateApplication,
      setLanguageDecision,
      saveIntibak,
      advanceStatus,
      getById,
      resetToSeed
    }),
    [applications, addApplication, updateApplication, setLanguageDecision, saveIntibak, advanceStatus, getById, resetToSeed]
  );

  return <ApplicationsContext.Provider value={value}>{children}</ApplicationsContext.Provider>;
}

export function useApplications(): ApplicationsContextValue {
  const ctx = useContext(ApplicationsContext);
  if (!ctx) {
    throw new Error('useApplications must be used within an ApplicationsProvider');
  }
  return ctx;
}

export function generateApplicationId(): string {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return 'APP' + year + seq;
}

export function maskTckn(tckn: string): string {
  if (!tckn || tckn.length < 11) return tckn || '';
  return tckn.substring(0, 3) + '*****' + tckn.substring(8);
}

export function isInYdyoQueue(a: Application): boolean {
  return a.status === 'language_evaluation' || !!a.languageStatus;
}

export function isInYgkQueue(a: Application): boolean {
  return (
    a.status === 'academic_evaluation' ||
    a.status === 'dean_review' ||
    a.status === 'board_review'
  );
}

if (typeof window !== 'undefined') {
  (window as unknown as { __utmsResetDemo?: () => void }).__utmsResetDemo = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };
}
