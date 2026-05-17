# Firestore Collections Reference

## Naming Convention

- **camelCase** field names
- **ISO 8601** timestamps as strings
- Every tenant-scoped doc includes `tenantId`
- Membership doc ID: `{userId}_{tenantId}`

## Collection List

```
tenants/
plans/
country_pricing/
users/
memberships/
otp_sessions/          # Functions write-only
subscriptions/
payment_intents/       # Functions write-only
webhook_events/        # Functions write-only
students/
attendance/
timetables/
homework/
notices/
results/
fees/
feed_posts/
events/
galleries/
bus_routes/
bus_locations/         # doc ID = routeId
online_classes/
ai_sessions/
notifications/
branches/
classes/
sections/
subjects/
feature_flags/         # doc ID = tenantId
audit_logs/
```

## Sample Documents

### tenants/{tenantId}

```json
{
  "id": "school_abc",
  "name": "ABC International School",
  "slug": "abc-intl",
  "countryCode": "IN",
  "currency": "INR",
  "timezone": "Asia/Kolkata",
  "isActive": true,
  "isWhiteLabel": false,
  "branding": {
    "appName": "ABC School",
    "primaryColor": "#2563EB",
    "secondaryColor": "#1E40AF"
  },
  "locale": {
    "defaultLanguage": "en",
    "supportedLanguages": ["en", "hi"],
    "timezone": "Asia/Kolkata",
    "dateFormat": "dd/MM/yyyy"
  },
  "planId": "growth",
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-01T00:00:00Z"
}
```

### memberships/{userId}_{tenantId}

```json
{
  "tenantId": "school_abc",
  "userId": "uid_123",
  "role": "teacher",
  "isActive": true,
  "branchIds": ["branch_main"],
  "createdAt": "2026-01-01T00:00:00Z"
}
```

### feature_flags/{tenantId}

```json
{
  "attendance": true,
  "bus_tracking": true,
  "ai_chatbot": false,
  "resolvedAt": "2026-01-15T00:00:00Z"
}
```

## Storage Paths

```
tenants/{tenantId}/gallery/{albumId}/{file}
tenants/{tenantId}/notices/{file}
users/{userId}/avatar/{file}
```
