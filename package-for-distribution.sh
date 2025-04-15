#!/bin/bash

# Build and Package Script for CIP Electron App

echo "===== CIP Explorer Distribution Packager ====="
echo "This script will build and package CIP Explorer for distribution."
echo ""

# Step 1: Clean installation and install dependencies
echo "Step 1: Installing dependencies..."
rm -rf node_modules
rm -f package-lock.json
npm install
echo "✓ Dependencies installed"
echo ""

# Step 2: Build the application
echo "Step 2: Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check error messages above."
    exit 1
fi
echo "✓ Application built successfully"
echo ""

# Step 3: Prepare sample data
echo "Step 3: Preparing sample data..."
mkdir -p dist/sample-data

# Copy sample data from project
cp data/sample-*.json dist/sample-data/

# Check if user has actual data to include
if [ -f ~/Downloads/DUprograms.json ]; then
    echo "  Found DUprograms.json in Downloads folder. Including it."
    cp ~/Downloads/DUprograms.json dist/sample-data/
fi

if [ -f ~/Downloads/categorized_clubs.json ]; then
    echo "  Found categorized_clubs.json in Downloads folder. Including it."
    cp ~/Downloads/categorized_clubs.json dist/sample-data/
fi
echo "✓ Sample data prepared"
echo ""

# Step 4: Create user guide
echo "Step 4: Creating user guide..."
cat > dist/USER_GUIDE.md << 'EOF'
# CIP Explorer - User Guide

## Getting Started
1. Double-click the application executable to launch
2. The app will look for JSON data files in your Downloads folder:
   - DUprograms.json
   - categorized_clubs.json
3. You can also manually load data from the File menu

## Using the Application
- Browse CIP categories in the left sidebar
- Search for categories using the search box
- View programs and clubs side-by-side
- Click anywhere on a card to expand/collapse it
- Click the link icon (🔗) to open websites in your browser
- Copy text by selecting it and using Ctrl+C (or Cmd+C on Mac)

## Data Files
- Sample data files are included in the `sample-data` folder
- Copy these to your Downloads folder, or
- Use File > Open Program Data / Open Club Data to load them directly

## Customizing Data Schema
If your JSON files use different field names:
1. Go to File > Configure Data Schema
2. Enter the field names that match your data structure
3. Click Save Configuration

## Keyboard Shortcuts
- Ctrl+C / Cmd+C: Copy selected text
- Ctrl+A / Cmd+A: Select all text in a field

## Need Help?
Refer to the documentation or contact the app distributor for assistance.
EOF
echo "✓ User guide created"
echo ""

# Step 5: Create distribution package
echo "Step 5: Creating distribution package..."
PLATFORM=$(uname)
DIST_DIR="dist"
PACKAGE_NAME="CIPExplorer-$(date +%Y%m%d)"

if [[ "$PLATFORM" == "Darwin" ]]; then
    # macOS
    echo "  Creating macOS distribution package..."
    cp DISTRIBUTION.md dist/
    cd $DIST_DIR
    zip -r "$PACKAGE_NAME-mac.zip" *.app sample-data USER_GUIDE.md DISTRIBUTION.md
    cd ..
    echo "✓ macOS package created: $DIST_DIR/$PACKAGE_NAME-mac.zip"
else
    # Windows/Linux
    echo "  Creating cross-platform distribution package..."
    cp DISTRIBUTION.md dist/
    cd $DIST_DIR
    zip -r "$PACKAGE_NAME.zip" * -x "*.zip"
    cd ..
    echo "✓ Distribution package created: $DIST_DIR/$PACKAGE_NAME.zip"
fi
echo ""

echo "===== Packaging Complete ====="
echo "Your distribution package is ready in the dist directory."
echo "See DISTRIBUTION.md for instructions on sharing the application."
echo ""