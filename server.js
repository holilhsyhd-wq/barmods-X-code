
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const config = {
  pterodactyl: {
    domain: process.env.PTERO_DOMAIN || "",
    apiKey: process.env.PTERO_KEY || "",
    eggId: Number(process.env.PTERO_EGG || 15),
    locationId: Number(process.env.PTERO_LOCATION || 1),
    cpu: Number(process.env.PTERO_CPU || 100),
    disk: Number(process.env.PTERO_DISK || 5120)
  },
  admin: {
    username: process.env.ADMIN_USER || "barmods",
    password: process.env.ADMIN_PASS || "barmods21"
  }
};

function maskKey(k){ if(!k) return ""; return k.slice(0,8) + "..." + k.slice(-4); }

app.get("/api/config", (req,res) => {
  res.json({
    domain: config.pterodactyl.domain,
    eggId: config.pterodactyl.eggId,
    locationId: config.pterodactyl.locationId,
    apiKeyMasked: maskKey(config.pterodactyl.apiKey)
  });
});

async function createUser(serverName){
  const url = `${config.pterodactyl.domain.replace(/\/+$/,'')}/api/application/users`;
  const random = Math.random().toString(36).substring(7);
  const email = `${serverName.toLowerCase().replace(/\s+/g,'')}-${random}@example.com`;
  const username = `${serverName.toLowerCase().replace(/\s+/g,'')}_${random}`;
  const password = Math.random().toString(36).slice(-10);

  const userData = {
    email, username, first_name: serverName, last_name: "User",
    password, root_admin: false
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.pterodactyl.apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if(res.status === 201) return { success:true, user: data.attributes, password };
    return { success:false, error: data.errors?.[0]?.detail || JSON.stringify(data) };
  } catch(e){
    return { success:false, error: e.message };
  }
}

async function createServer(serverName, memory, userId){
  const url = `${config.pterodactyl.domain.replace(/\/+$/,'')}/api/application/servers`;
  const serverData = {
    name: serverName,
    user: userId,
    egg: config.pterodactyl.eggId,
    docker_image: "ghcr.io/parkervcp/yolks:nodejs_18",
    startup: "if [[ -d .git ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then npm install ${NODE_PACKAGES}; fi; if [[ -f /home/container/package.json ]]; then npm install; fi; {{CMD_RUN}}",
    environment: { CMD_RUN: "node index.js" },
    limits: { memory: parseInt(memory) || 0, swap: 0, disk: config.pterodactyl.disk, io: 500, cpu: config.pterodactyl.cpu },
    feature_limits: { databases:1, allocations:1, backups:1 },
    deploy: { locations: [config.pterodactyl.locationId], dedicated_ip:false, port_range: [] }
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.pterodactyl.apiKey}`,
        "Content-Type":"application/json",
        Accept:"application/json"
      },
      body: JSON.stringify(serverData)
    });
    const data = await res.json();
    if(res.status === 201) return { success:true, server: data.attributes };
    return { success:false, error: data.errors?.[0]?.detail || JSON.stringify(data) };
  } catch(e){
    return { success:false, error: e.message };
  }
}

app.post("/api/create", async (req,res) => {
  const { name, ram } = req.body;
  if(!name || ram === undefined) return res.status(400).json({ error: "name and ram required" });
  if(typeof name !== "string" || name.length > 80) return res.status(400).json({ error: "invalid name" });

  const u = await createUser(name);
  if(!u.success) return res.status(500).json({ error: u.error });

  const s = await createServer(name, ram === "0" ? 0 : parseInt(ram), u.user.id);
  if(!s.success) {
    return res.status(500).json({ error: s.error, userCreated: { email: u.user.email, username: u.user.username, password: u.password } });
  }

  return res.json({
    message: "success",
    panel: config.pterodactyl.domain,
    user: { email: u.user.email, username: u.user.username, password: u.password },
    server: s.server
  });
});

const clientBuild = path.join(__dirname, "client", "dist");
if (require('fs').existsSync(clientBuild)) {
  app.use(express.static(clientBuild));
  app.get("*", (req,res) => res.sendFile(path.join(clientBuild, "index.html")));
} else {
  app.get("/", (req,res) => res.send(`<h2>API Server running. Build the client in /client (npm run build) before deploy.</h2>`));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
