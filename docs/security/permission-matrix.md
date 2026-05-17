# Permission Matrix

Roles: `super_admin` · `school_admin` · `sub_admin` · `teacher` · `parent` · `student` · `driver`

## Feature Access by Role

| Feature | super_admin | school_admin | sub_admin | teacher | parent | student | driver |
|---------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Attendance (manage) | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Attendance (view) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Timetable | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Homework | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Notices | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Results (manage) | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Results (view) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Fees (manage) | ✓ | ✓ | — | — | — | — | — |
| Fees (view) | ✓ | ✓ | ✓ | — | ✓ | — | — |
| Social feed (post) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Social feed (moderate) | ✓ | ✓ | ✓ | — | — | — | — |
| Events / Gallery | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Bus tracking (view) | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ |
| Bus location (update) | — | — | — | — | — | — | ✓ |
| Online classes | ✓ | ✓ | ✓ | ✓ | join | join | — |
| AI assistant | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Analytics | ✓ | ✓ | ✓ | — | — | — | — |
| Push / WhatsApp | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Platform tenants | ✓ | — | — | — | — | — | — |
| Subscription billing | ✓ | ✓ | — | — | — | — | — |

## Implementation

- Source of truth: `packages/shared/src/permissions/index.ts`
- Runtime check: `hasPermission(role, permission)` + `hasFeatureAccess(role, feature, enabledFeatures)`
- Firestore rules: role-based helpers in `firebase/firestore.rules`
- UI: route guards in GoRouter (mobile) and Next.js middleware (admin)

## Custom Permissions

`memberships.permissions[]` can extend role defaults for `sub_admin` granular access.
