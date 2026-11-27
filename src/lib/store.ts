import { useCallback, useEffect, useRef, useState } from 'react';
import type { Save } from '../types';
import { blank, connectRemote, loadLocal, saveLocal, type Remote, type SyncStatus } from './storage';

/**
 * The game state hook. Local storage is written on every change; the remote copy
 * only on the player's own changes. The newer `updated` timestamp wins on load.
 */
export function useStore() {
  const [s, setS] = useState<Save>(() => loadLocal() ?? blank());
  const [sync, setSync] = useState<SyncStatus>('local');
  // Standalone: data is on the device, ready at once. claude.ai: wait for local data or the first answer from the db.
  const [ready, setReady] = useState(() => !__ARTIFACT__ || loadLocal() !== null);
  const remote = useRef<Remote | null>(null);
  const dirty = useRef(false);
  const cur = useRef(s);
  cur.current = s;

  useEffect(() => {
    remote.current = connectRemote((r) => {
      const local = cur.current;
      if (local.updated === '' || r.updated > local.updated) setS(r);
      else if (local.updated > r.updated) remote.current?.push(local);
      setReady(true);
    }, (st) => {
      setSync(st);
      if (st !== 'connecting' && st !== 'saving') setReady(true);
    });
  }, []);

  useEffect(() => {
    saveLocal(s);
    if (dirty.current) {
      dirty.current = false;
      remote.current?.push(s);
    }
  }, [s]);

  const update = useCallback((fn: (d: Save) => void) => {
    dirty.current = true;
    setS((c) => {
      const n: Save = JSON.parse(JSON.stringify(c));
      fn(n);
      n.updated = new Date().toISOString();
      return n;
    });
  }, []);

  const replace = useCallback((n: Save) => {
    dirty.current = true;
    setS({ ...n, updated: new Date().toISOString() });
  }, []);

  return { s, update, replace, sync, ready };
}
