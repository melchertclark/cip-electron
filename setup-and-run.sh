#!/bin/bash

# Clean installation
rm -rf node_modules
rm -f package-lock.json

# Install dependencies with the correct versions
npm install

# Run the app
npm start