# Backend notes

Default super-admin
-------------------
For convenience the server will create a default super-admin on startup if none exists.

Defaults (change in production using environment vars):
- SUPER_ADMIN_EMAIL (default: admin@gmail.com)
- SUPER_ADMIN_PASSWORD (default: admin123)

Only the super-admin is allowed to create additional admin users using the protected endpoint POST /api/auth/register-admin. The public registration endpoint (/api/auth/register) will not allow role=admin.

Security note: Change the default super-admin credentials and use a secure ADMIN_SECRET / JWT_SECRET in production.

Password reset behavior (development)
-----------------------------------
On server start the code ensures a super-admin exists; if one already exists but its password differs from the configured SUPER_ADMIN_PASSWORD, the server will overwrite the stored super-admin password with the value from the environment. This is intended to make local development easier so you can reliably log in with the configured credentials. For production, do NOT rely on this behavior — rotate passwords safely and set secure values in environment variables.

Seeding sample data (development)
--------------------------------
If you'd like the app to show example donors, recipients, listings and donation requests you can run the included seed script (development only):

```powershell
cd backend
npm run seed
```

This will create a couple of sample donor and recipient users and add example food listings and donation requests. It skips records that already exist to avoid accidental duplication.
