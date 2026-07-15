import type { ActionFeedback } from '@ai-school/shared';
import type { useNotify } from '@/components/notifications/notification-provider';

type NotifyApi = ReturnType<typeof useNotify>;

export async function runAction<T>(
  notify: NotifyApi,
  opts: {
    run: () => T | Promise<T>;
    onSuccess: ActionFeedback | ((result: T) => ActionFeedback);
    onError?: ActionFeedback | ((error: unknown) => ActionFeedback);
  }
): Promise<T | null> {
  try {
    const result = await opts.run();
    const feedback =
      typeof opts.onSuccess === 'function' ? opts.onSuccess(result) : opts.onSuccess;
    notify.show(feedback);
    return result;
  } catch (error) {
    const feedback =
      typeof opts.onError === 'function'
        ? opts.onError(error)
        : opts.onError ?? {
            variant: 'error' as const,
            title: 'Action failed',
            message: error instanceof Error ? error.message : 'Please try again.',
            solution: 'Check your connection and retry. If it persists, contact support.',
          };
    notify.show(feedback);
    return null;
  }
}
