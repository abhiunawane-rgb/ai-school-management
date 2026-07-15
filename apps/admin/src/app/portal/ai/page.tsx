'use client';

import { useMemo } from 'react';
import { useSchool } from '@/hooks/use-school';
import { AiChatPanel } from '@/components/ai/ai-chat-panel';
import { PortalPage } from '@/components/portal/portal-page';
import { buildSchoolAiSnapshot } from '@/lib/ai-context';
import { tryLiveAi } from '@/lib/try-live-ai';

export default function PortalAiPage() {
  const { state } = useSchool();
  const snapshot = useMemo(() => (state ? buildSchoolAiSnapshot(state) : null), [state]);

  if (!state || !snapshot) return null;

  const roleLabel = state.currentUser.role.replace(/_/g, ' ');

  return (
    <PortalPage title="AI assistant">
      <p className="text-sm text-slate-600 -mt-2 mb-4">
        Personalized for <span className="font-medium capitalize">{roleLabel}</span> — answers from your school&apos;s
        live data.
      </p>
      <AiChatPanel
        snapshot={snapshot}
        subtitle={`${snapshot.schoolName} · ${roleLabel}`}
        compact
        onLiveChat={(message) => tryLiveAi(state, message)}
      />
    </PortalPage>
  );
}
