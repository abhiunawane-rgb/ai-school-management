'use client';

import { useSchool } from '@/hooks/use-school';
import { useNotify } from '@/components/notifications/notification-provider';
import { updateBusRouteStatus } from '@/lib/school-store';
import { BusMap } from '@/components/maps/bus-map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function BusTrackingPage() {
  const { state, update } = useSchool();
  const notify = useNotify();
  if (!state) return null;

  function setRouteStatus(routeId: string, routeName: string, status: 'active' | 'idle') {
    update(updateBusRouteStatus(state!, routeId, status));
    notify.success(
      'Route updated',
      `${routeName} is now ${status}.`,
      status === 'active'
        ? 'Parents can track this bus in the portal.'
        : 'GPS updates pause until the driver marks active again.'
    );
  }

  const routes = state.busRoutes ?? [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold">Bus tracking</h1>
        <p className="text-sm text-slate-600 mt-1">
          Monitor routes and live map positions. Drivers update GPS from the portal Bus tracking screen.
        </p>
      </div>

      <div className="grid gap-4">
        {routes.map((route) => (
          <Card key={route.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{route.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {route.vehicleNo} · Driver: {route.driverName}
                </p>
              </div>
              <span
                className={cn(
                  'text-xs font-semibold px-2 py-1 rounded-full',
                  route.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                )}
              >
                {route.status}
              </span>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {route.lastLat != null && route.lastLng != null ? (
                <BusMap lat={route.lastLat} lng={route.lastLng} label={route.name} />
              ) : (
                <p className="text-slate-500">No GPS fix yet — driver opens Bus tracking in the portal.</p>
              )}
              {route.lastUpdatedAt ? (
                <p className="text-xs text-slate-500">
                  Last update: {new Date(route.lastUpdatedAt).toLocaleString()}
                </p>
              ) : null}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={route.status === 'active' ? 'default' : 'secondary'}
                  onClick={() => setRouteStatus(route.id, route.name, 'active')}
                >
                  Mark active
                </Button>
                <Button
                  size="sm"
                  variant={route.status === 'idle' ? 'default' : 'secondary'}
                  onClick={() => setRouteStatus(route.id, route.name, 'idle')}
                >
                  Mark idle
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
