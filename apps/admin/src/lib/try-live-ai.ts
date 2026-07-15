import { buildSchoolAiSnapshot } from '@/lib/ai-context';
import type { SchoolState } from '@/lib/types';

/** Optional live AI microservice; returns null so the local school assistant can answer. */
export async function tryLiveAi(state: SchoolState, message: string): Promise<string | null> {
  const aiUrl = process.env.NEXT_PUBLIC_AI_SERVICE_URL;
  const aiKey = process.env.NEXT_PUBLIC_AI_SERVICE_KEY;
  if (!aiUrl || !aiKey) return null;

  try {
    const res = await fetch(`${aiUrl}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': aiKey,
      },
      body: JSON.stringify({
        tenantId: state.school.id,
        userId: state.currentUser.id,
        message,
        context: {
          role: state.currentUser.role,
          snapshot: buildSchoolAiSnapshot(state),
        },
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { reply?: string };
    return data.reply ?? null;
  } catch {
    return null;
  }
}
