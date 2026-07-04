#!/usr/bin/env bash
# Run this ON THE VPS from /var/www/sales-dashboard after pushing changes to GitHub.
set -e

echo "Pulling latest code..."
git pull origin main

echo "Installing backend dependencies..."
cd server
npm install --production

echo "Installing frontend dependencies and building..."
cd ../client
npm install
npm run build

echo "Restarting API..."
cd ../server
pm2 restart sales-dashboard-api || pm2 start ../deploy/ecosystem.config.js --env production

echo "Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "Deploy complete."
