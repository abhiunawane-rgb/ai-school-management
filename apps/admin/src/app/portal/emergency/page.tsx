'use client';

import { PortalPage } from '@/components/portal/portal-page';
import { Button } from '@/components/ui/button';
import { AlertBanner } from '@/components/ui/alert-banner';

export default function PortalEmergencyPage() {
  return (
    <PortalPage title="Emergency">
      <AlertBanner variant="warning" title="Transport emergency">
        Use only for breakdown, accident, or immediate safety issues on your route.
      </AlertBanner>
      <Button
        className="w-full"
        variant="destructive"
        onClick={() => alert('Emergency alert sent to transport desk (demo).')}
      >
        Send emergency alert
      </Button>
      <Button className="w-full" variant="secondary" asChild>
        <a href="tel:+919876543210">Call transport desk</a>
      </Button>
    </PortalPage>
  );
}
