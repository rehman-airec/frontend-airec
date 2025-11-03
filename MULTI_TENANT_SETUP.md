# Multi-Tenant Setup Guide

## Testing Locally (Development)

✅ **You CAN test multi-tenant functionality locally!**

### How It Works Locally:

1. **Subdomain Setup**: Use `*.localhost` subdomains (e.g., `vision.localhost:3000`)
   - No DNS configuration needed
   - Works out of the box with localhost

2. **Backend Detection**:
   - Backend middleware extracts subdomain from hostname (`vision.localhost:3000` → `vision`)
   - Falls back to `x-tenant-subdomain` header if hostname extraction fails
   - Frontend automatically sends this header in API requests

3. **Database**: Ensure tenant exists in database with:
   - `subdomain: "vision"`
   - `isActive: true`

### Testing Steps:

1. **Create tenant via Super Admin**:
   - Go to `http://localhost:3000/superadmin`
   - Create tenant with subdomain `vision`
   - Create admin user for that tenant

2. **Access tenant subdomain**:
   - Visit `http://vision.localhost:3000/jobs`
   - Should detect tenant and show jobs

3. **Login redirect**:
   - Login with tenant admin credentials
   - Should redirect to `http://vision.localhost:3000/admin/dashboard`

## Production Setup

### DNS Configuration Required:

For production, you need to configure DNS wildcard records:

1. **Wildcard DNS Record**:
   ```
   *.yourdomain.com  →  Your server IP
   yourdomain.com    →  Your server IP (for main domain)
   ```

2. **Example**:
   - `vision.yourdomain.com` → Points to your server
   - `company1.yourdomain.com` → Points to your server
   - `company2.yourdomain.com` → Points to your server
   - All handled by wildcard `*.yourdomain.com`

3. **Server Configuration**:
   - Your web server (Nginx/Apache) should handle all subdomains
   - Route all `*.yourdomain.com` to your application

### How It Works in Production:

1. User visits `vision.yourdomain.com`
2. Backend extracts `vision` from hostname
3. Looks up tenant in database
4. Returns tenant-specific data

**No code changes needed** - the same middleware works for both local and production!

## Troubleshooting

### "Company Not Found" Error:

1. **Check tenant exists**:
   ```javascript
   // In MongoDB or via API
   db.tenants.findOne({ subdomain: "vision", isActive: true })
   ```

2. **Verify subdomain format**:
   - Lowercase only
   - No special characters
   - Matches exactly in database

3. **Check backend logs**:
   - Look for: `Tenant subdomain "vision" not found or inactive`
   - Verify tenant is active: `isActive: true`

4. **Check CORS** (Development):
   - CORS now allows `*.localhost` subdomains in development
   - Make sure backend is running on correct port

## Current Status

✅ Fixed CORS to allow `*.localhost` subdomains in development
✅ Backend middleware properly extracts subdomain from hostname
✅ Frontend automatically sends subdomain header in API requests
✅ Login redirects to correct tenant subdomain
✅ Works with both `localhost` (dev) and production domains

