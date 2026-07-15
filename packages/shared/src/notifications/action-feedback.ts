export type FeedbackVariant = 'success' | 'error' | 'warning' | 'info';

/** User-facing outcome for any action — title, what happened, and how to fix. */
export type ActionFeedback = {
  variant: FeedbackVariant;
  title: string;
  message: string;
  solution?: string;
};

export function feedback(
  variant: FeedbackVariant,
  title: string,
  message: string,
  solution?: string
): ActionFeedback {
  return { variant, title, message, solution };
}

export const ACTION_FEEDBACK = {
  saved: (what: string) =>
    feedback('success', 'Saved', `${what} was updated successfully.`),
  created: (what: string) =>
    feedback('success', 'Created', `${what} was added successfully.`),
  sent: (what: string) =>
    feedback('success', 'Sent', `${what} was sent successfully.`),
  validation: (message: string, solution: string) =>
    feedback('error', 'Check your input', message, solution),
  failed: (what: string, solution: string) =>
    feedback('error', 'Something went wrong', `${what} could not be completed.`, solution),
  offline: (what: string) =>
    feedback(
      'warning',
      'Saved on this device',
      `${what} is stored locally until the server connects.`,
      'Use the same browser when you sign in again.'
    ),
} as const;
