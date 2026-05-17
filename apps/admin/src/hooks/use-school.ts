'use client';

import { useCallback, useEffect, useState } from 'react';
import { loadSchoolState, saveSchoolState } from '@/lib/school-store';
import type { SchoolState } from '@/lib/types';

export function useSchool() {
  const [state, setState] = useState<SchoolState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadSchoolState());
    setReady(true);
  }, []);

  const refresh = useCallback(() => {
    setState(loadSchoolState());
  }, []);

  const update = useCallback((next: SchoolState) => {
    saveSchoolState(next);
    setState(next);
  }, []);

  return { state, ready, refresh, update };
}
