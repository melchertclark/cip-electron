#\!/bin/bash

# Package the application for the current platform
echo "Packaging CIP Electron App..."
npm run build

echo "Done\! The packaged application can be found in the dist directory."
