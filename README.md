# barmods-x-panel-create-server

This project is a create-panel web UI + backend to create Pterodactyl servers via Application API.
**Important:** Do NOT commit your real PTERO_KEY to GitHub. Use Vercel Environment Variables.

## Quick deploy (Vercel)
1. Create a new repo and push this project.
2. Import repo into Vercel.
3. Set Environment Variables in Vercel:
   - PTERO_DOMAIN
   - PTERO_KEY
   - PTERO_EGG
   - PTERO_LOCATION
   - PTERO_CPU
   - PTERO_DISK
   - ADMIN_USER
   - ADMIN_PASS
4. Deploy. Vercel will build the client (client/package.json) and run server.js as serverless.

## Local test
- Build client: `cd client && npm install && npm run build`
- Start server: `npm start`
