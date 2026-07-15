'use client';

import { useState } from 'react';
import { INQUIRY_TOPICS } from '@ai-school/shared';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { useNotify } from '@/components/notifications/notification-provider';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [topic, setTopic] = useState<string>(INQUIRY_TOPICS[0]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          school: form.get('school'),
          topic,
          message: form.get('message'),
        }),
      });
      if (!res.ok) throw new Error('Failed to send');
      setDone(true);
      notify.success('Message sent', 'We received your message and will reply within one business day.');
    } catch {
      if (typeof window !== 'undefined') {
        const name = String(form.get('name') ?? '');
        const email = String(form.get('email') ?? '');
        const school = String(form.get('school') ?? '');
        const message = String(form.get('message') ?? '');
        const fallback = { name, email, school, topic, message, savedAt: new Date().toISOString() };
        localStorage.setItem('aischool_contact_pending', JSON.stringify(fallback));

        const subject = encodeURIComponent(`[AI School Management] ${topic} — ${school || name}`);
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\nSchool: ${school}\nTopic: ${topic}\n\n${message}`
        );
        window.location.href = `mailto:hello@aischool.app?subject=${subject}&body=${body}`;

        setDone(true);
        notify.success(
          'Opening your email app',
          'We also saved a copy on this device.',
          'Send the email to reach our team. Or write hello@aischool.app directly.'
        );
        setError('');
        return;
      }
      notify.error(
        'Could not send',
        'The message could not be delivered.',
        'Email hello@aischool.app directly.'
      );
      setError('Could not send message. Please email support directly.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="gradient-hero section-padding">
        <div className="container-marketing max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-slate-900">Contact us</h1>
          <p className="mt-4 text-lg text-slate-600">
            Questions before signup? We respond within one business day.
          </p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-marketing grid gap-12 lg:grid-cols-2 max-w-5xl">
          <div className="space-y-6">
            {[
              { icon: Mail, label: 'Email', value: 'hello@aischool.app' },
              { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
              { icon: MapPin, label: 'Global', value: 'Serving schools in 50+ countries' },
            ].map((item) => (
              <div key={item.label} className="flex gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="font-medium text-slate-900">{item.value}</p>
                </div>
              </div>
            ))}
            <Button href="/signup" size="lg" className="mt-4">
              Or start 7-day trial instantly
            </Button>
          </div>
          {done ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-emerald-800">
              <p className="font-semibold">Message sent!</p>
              <p className="mt-2 text-sm">We&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4"
            >
              <label className="block">
                <span className="text-sm font-medium">Name</span>
                <input name="name" required className="mt-1 w-full h-11 rounded-xl border px-3" />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Email</span>
                <input name="email" type="email" required className="mt-1 w-full h-11 rounded-xl border px-3" />
              </label>
              <label className="block">
                <span className="text-sm font-medium">School</span>
                <input name="school" className="mt-1 w-full h-11 rounded-xl border px-3" />
              </label>
              <SelectField
                id="contact-topic"
                label="Topic"
                required
                value={topic}
                onChange={setTopic}
                options={INQUIRY_TOPICS.map((t) => ({ value: t, label: t }))}
              />
              <label className="block">
                <span className="text-sm font-medium">Message</span>
                <textarea name="message" rows={4} required className="mt-1 w-full rounded-xl border p-3" />
              </label>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send message'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
