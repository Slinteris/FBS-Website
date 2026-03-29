const fs = require("fs");
const path = require("path");

// Parse .env file on the server to load secrets into PM2's environment
const envPath = path.join(__dirname, ".env");
const env = {};
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf-8")
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) return;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      env[key] = value;
    });
}

module.exports = {
  apps: [
    {
      name: "fbs-website",
      script: "./node_modules/.bin/react-router-serve",
      args: "./build/server/index.js",
      env: {
        NODE_ENV: "production",
        ...env,
        PORT: 3000,   // always wins; Nginx proxies to this
      },
    },
  ],
};
