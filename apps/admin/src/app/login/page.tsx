'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { initSchoolState } from '@/lib/school-store';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  async function sendOtp() {
    setLoading(true);
    try {
      setStep('otp');
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setLoading(true);
    try {
      initSchoolState(phone);
      window.location.href = '/dashboard';
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">AI School Management</CardTitle>
          <CardDescription>
            Sign in with OTP. For local testing, enter any phone number and OTP{' '}
            <strong>123456</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'phone' ? (
            <>
              <Input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Button className="w-full" onClick={sendOtp} disabled={loading || !phone}>
                Send OTP
              </Button>
            </>
          ) : (
            <>
              <Input
                type="text"
                placeholder="6-digit OTP (use 123456 for testing)"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={verifyOtp}
                disabled={loading || otp.length !== 6}
              >
                Verify & sign in
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep('phone')}>
                Change number
              </Button>
            </>
          )}
          <p className="text-xs text-center text-muted-foreground pt-2">
            Tip: Complete signup on{' '}
            <a href="http://localhost:3002/signup" className="text-blue-600 underline">
              marketing site
            </a>{' '}
            first to load your school name and logo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
