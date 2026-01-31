#!/bin/bash
set -e

echo "Installing root dependencies..."
npm install

echo "Installing backend dependencies..."
cd backend && npm install --legacy-peer-deps && cd ..

echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "Installing Netlify functions dependencies..."
cd netlify/functions && npm install --legacy-peer-deps && cd ../..

echo "Building frontend..."
cd frontend && npx vite build

echo "Build complete!"