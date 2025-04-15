# CIP Code Explorer (Fixed Version)

This is a fixed version of the CIP Code Explorer Electron application that resolves the ESM URL scheme error.

## What Was Fixed

1. **Downgraded Electron**: Changed from version 35.0.0 to 25.9.8 which is more stable and compatible
2. **Fixed electron-store**: Updated to use version 8.1.0 and fixed its implementation
3. **Updated preload script**: Properly implemented contextBridge for secure IPC
4. **Moved CIP categories**: Eliminated require() in renderer process by moving categories directly into renderer.js
5. **Fixed security model**: Set `contextIsolation: true` and `nodeIntegration: false` for better security
6. **Enhanced build config**: Added detailed configuration in package.json
7. **Fixed link behavior**: Links now open in the default system browser without affecting the app window or navigating away from the current view
8. **Improved copy-paste functionality**: 
   - Added proper Edit menu with keyboard shortcuts
   - Enhanced text selection in card descriptions
   - Styling improvements for better selection visibility
9. **Added distribution package**: Created a comprehensive packaging system with documentation for sharing

## How to Run the Application

We've created a script that handles everything for you:

```bash
# Make it executable if it's not already
chmod +x setup-and-run.sh

# Run the script
./setup-and-run.sh
```

The script will:
1. Clean the existing node_modules and package-lock.json
2. Install the correct dependencies
3. Start the application

## Manual Setup

If you prefer to run the commands manually:

```bash
# Clean existing installation
rm -rf node_modules
rm -f package-lock.json

# Install dependencies
npm install

# Run the app
npm start
```

## Building for Distribution

### Quick Build

To create a standalone application:

```bash
npm run build
```

For specific platforms:

```bash
npm run build:mac
npm run build:win
```

The packaged application will be in the `dist` directory.

### Complete Distribution Package

We've created a comprehensive distribution script that handles everything:

```bash
./package-for-distribution.sh
```

This script will:
1. Install dependencies
2. Build the application
3. Gather sample data
4. Create user documentation
5. Package everything into a distributable ZIP file

The resulting package can be shared with users via Box or other file sharing platforms.

For detailed instructions on sharing the application, see the `DISTRIBUTION.md` file.

## Features

- Browse CIP categories and view related programs and clubs in a side-by-side layout
- Improved card interaction:
  - Click anywhere on a card to expand/collapse it
  - Dedicated link buttons for opening URLs in your default browser
  - Selectable and copy-pasteable text in card descriptions
- Customizable data schema to support different JSON structures
- Load data from local files or use sample data
- Search functionality for quick category finding
- Count indicators showing the number of programs and clubs in each category

## Data Loading

The application looks for two JSON files in your Downloads folder by default:
- `~/Downloads/DUprograms.json` - Contains program information
- `~/Downloads/categorized_clubs.json` - Contains club information

If these files aren't found, sample data will be used instead.

You can also load custom data files through the File menu:
- File -> Open Program Data
- File -> Open Club Data

## Customizing Data Schema

To adapt the application to different JSON structures:

1. Go to File -> Configure Data Schema
2. Specify the field names used in your JSON data for each entity type
3. Save the configuration

## Electron Version Compatibility

This application uses Electron 25.9.8, which is a stable version that avoids the ESM URL scheme error. If you need to update to a newer version, you may need to modify the code to handle any changes in the Electron API.

## Troubleshooting

If you encounter any issues:
- Check the console for error messages (View -> Toggle Developer Tools)
- Make sure your JSON data matches the expected schema
- Verify that the application has permission to access your Downloads folder
- If you see ESM-related errors again, make sure you're using the fixed versions of the files

## License

ISC