module.exports = {
  apps: [
    {
      name: "sales-dashboard-api",
      cwd: "/var/www/sales-dashboard/server",
      script: "server.js",
      env_production: {
        NODE_ENV: "production",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
    },
  ],
};
