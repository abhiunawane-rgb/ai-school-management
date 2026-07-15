'use client';

import { useMemo, useState } from 'react';
import { useSchool } from '@/hooks/use-school';
import { updateBusLocation } from '@/lib/school-store';
import { useNotify } from '@/components/notifications/notification-provider';
import { PortalPage } from '@/components/portal/portal-page';
import { BusMap } from '@/components/maps/bus-map';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertBanner } from '@/components/ui/alert-banner';
import { MapPin, Navigation, RefreshCw } from 'lucide-react';

const DEFAULT_LAT = 18.5362;
const DEFAULT_LNG = 73.8958;

export default function PortalBusPage() {
  const { state, update } = useSchool();
  const notify = useNotify();
  const [updating, setUpdating] = useState(false);

  const isDriver = state?.currentUser.role === 'driver';
  const routes = state?.busRoutes ?? [];
  const userName = state?.currentUser.name ?? '';

  const route = useMemo(() => {
    if (!routes.length) return null;
    if (isDriver) {
      const first = userName.split(' ')[0]?.toLowerCase() ?? '';
      const mine = routes.find((r) => r.driverName.toLowerCase().includes(first));
      return mine ?? routes.find((r) => r.status === 'active') ?? routes[0];
    }
    return routes.find((r) => r.status === 'active') ?? routes[0];
  }, [routes, isDriver, userName]);

  if (!state) return null;

  const lat = route?.lastLat ?? DEFAULT_LAT;
  const lng = route?.lastLng ?? DEFAULT_LNG;

  function applyCoords(nextLat: number, nextLng: number, source: string) {
    if (!route || !state) return;
    update(updateBusLocation(state, route.id, nextLat, nextLng));
    notify.success(
      'Location updated',
      `${route.name} · ${nextLat.toFixed(5)}, ${nextLng.toFixed(5)}`,
      source === 'gps'
        ? 'Parents can see this position on Bus tracking.'
        : 'Demo position saved. Allow location access for real GPS.'
    );
  }

  function updateLocation() {
    if (!route) return;
    setUpdating(true);

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          applyCoords(pos.coords.latitude, pos.coords.longitude, 'gps');
          setUpdating(false);
        },
        () => {
          const jitterLat = (route.lastLat ?? DEFAULT_LAT) + (Math.random() - 0.5) * 0.004;
          const jitterLng = (route.lastLng ?? DEFAULT_LNG) + (Math.random() - 0.5) * 0.004;
          applyCoords(jitterLat, jitterLng, 'demo');
          setUpdating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      return;
    }

    const jitterLat = (route.lastLat ?? DEFAULT_LAT) + (Math.random() - 0.5) * 0.004;
    const jitterLng = (route.lastLng ?? DEFAULT_LNG) + (Math.random() - 0.5) * 0.004;
    applyCoords(jitterLat, jitterLng, 'demo');
    setUpdating(false);
  }

  return (
    <PortalPage title={isDriver ? 'Update bus GPS' : 'Bus tracking'}>
      <Card>
        <CardContent className="pt-6 space-y-4">
          {route ? (
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
              <MapPin className="h-4 w-4 text-blue-600 shrink-0" aria-hidden />
              <span className="font-medium">{route.name}</span>
              <span className="text-slate-400">·</span>
              <span>{route.vehicleNo}</span>
              {route.lastUpdatedAt ? (
                <>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">
                    Updated {new Date(route.lastUpdatedAt).toLocaleTimeString()}
                  </span>
                </>
              ) : null}
            </div>
          ) : null}

          <BusMap lat={lat} lng={lng} label={route?.name ?? 'Bus location'} />

          <p className="text-sm text-slate-600">
            {isDriver
              ? 'Share your live location so parents see the bus on their map. Allow location when the browser asks.'
              : `${route?.name ?? 'School bus'} — live map below. Ask the driver to tap Update location for freshest GPS.`}
          </p>

          {isDriver ? (
            <Button className="w-full gap-2" onClick={updateLocation} disabled={updating || !route}>
              {updating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" aria-hidden />
                  Getting GPS…
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4" aria-hidden />
                  Update my location
                </>
              )}
            </Button>
          ) : (
            <Button
              className="w-full gap-2"
              variant="secondary"
              onClick={() => {
                notify.success('Map refreshed', 'Showing the latest saved bus position.');
              }}
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              Refresh map
            </Button>
          )}
        </CardContent>
      </Card>

      <AlertBanner variant="info">
        Map uses OpenStreetMap (no Google key needed). GPS comes from your phone browser; cloud sync with Firebase can be enabled later.
      </AlertBanner>
    </PortalPage>
  );
}
