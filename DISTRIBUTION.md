# CIP Explorer - Distribution Guide

This guide provides instructions for packaging and sharing the CIP Explorer application with others via Box or similar file sharing services.

## Part 1: Packaging the Application

### Prerequisites
- Node.js and npm installed
- CIP Explorer source code (this repository)
- Any custom JSON data files you want to include

### Step 1: Build the Application
1. Open a terminal in the project directory
2. Run the setup script to install dependencies:
   ```bash
   ./setup-and-run.sh
   ```
3. Build the application for distribution:
   ```bash
   npm run build
   ```
4. After the build completes, you'll find distribution files in the `dist` folder

### Step 2: Prepare Sample Data Files
1. Create a folder called `sample-data` in the `dist` folder:
   ```bash
   mkdir -p dist/sample-data
   ```
2. Copy your JSON data files to this folder:
   ```bash
   cp ~/Downloads/DUprograms.json dist/sample-data/
   cp ~/Downloads/categorized_clubs.json dist/sample-data/
   ```

### Step 3: Create a User Guide
1. Create a file called `USER_GUIDE.md` in the `dist` folder with basic instructions
2. Include information about loading data files and using the application
3. Example content:
   ```markdown
   # CIP Explorer - User Guide

   ## Getting Started
   1. Double-click the application executable to launch
   2. The app will look for JSON data files in your Downloads folder
   3. You can also manually load data from the File menu

   ## Using the Application
   - Browse CIP categories in the left sidebar
   - View programs and clubs in the main panel
   - Click on cards to expand/collapse them
   - Click the link icon to open websites in your browser
   - Copy text by selecting it and using Ctrl+C (or Cmd+C on Mac)

   ## Data Files
   - Sample data files are included in the `sample-data` folder
   - Copy these to your Downloads folder, or
   - Use File > Open Program Data / Open Club Data to load them directly
   ```

### Step 4: Create a Distribution Package
1. Create a zip archive containing the app and documentation:
   - For macOS: Include the .app file, sample-data folder, and USER_GUIDE.md
   - For Windows: Include the .exe installer, sample-data folder, and USER_GUIDE.md

## Part 2: Sharing via Box

### Step 1: Upload to Box
1. Log in to your Box account
2. Create a new folder called "CIP Explorer"
3. Upload the zip file created in Part 1
4. If your data files are large, upload them separately to the same folder

### Step 2: Set Access Permissions
1. Select the folder in Box
2. Click "Share" 
3. Choose the appropriate access level:
   - "People in your company" for internal sharing
   - "People with the link" for wider distribution
4. Set permission level (View/Edit)
5. Click "Share" to generate a link

### Step 3: Create a README in Box
1. In your Box folder, click "New" and select "Document"
2. Title it "README - Installation Instructions"
3. Add instructions like:
   ```
   CIP Explorer - Installation Instructions

   1. Download the zip file [CIPExplorer.zip]
   2. Extract the contents to a location on your computer
   3. For Mac: Move the .app file to your Applications folder
      For Windows: Run the installer and follow the prompts
   4. Download the sample data files or use your own data
   5. Refer to USER_GUIDE.md for usage instructions

   If you encounter any issues, please contact [your contact info].
   ```

## Part 3: Instructions for Recipients

Provide these instructions to users who will download and install your app:

### For Mac Users:
1. Download the distribution package from Box
2. Extract the ZIP file
3. Move the CIP Explorer.app to your Applications folder
4. Copy the sample data files to your Downloads folder
5. Launch the application 
6. If you see a security warning when first opening:
   - Right-click (or Control+click) on the app and select "Open"
   - Click "Open" in the dialog box that appears

### For Windows Users:
1. Download the distribution package from Box
2. Extract the ZIP file
3. Run the installer (.exe file)
4. Follow the installation wizard
5. Copy the sample data files to your Downloads folder or keep them accessible
6. Launch CIP Explorer from the Start menu
7. Use the File menu to open your data files if needed

## Verifying Installation

To verify everything is working properly, users should:

1. Launch the application
2. See the CIP categories listed in the left sidebar
3. Select a category to view associated programs and clubs
4. Try expanding a card and selecting/copying text
5. Click a link button to ensure links open in their default browser

## Troubleshooting Common Issues

Include these common troubleshooting steps for users:

1. **No data appears**: Check that JSON files are properly placed in Downloads folder
2. **Application won't open**: 
   - Mac: Try right-click > Open to bypass security
   - Windows: Run as Administrator
3. **Text can't be copied**: Ensure text is selected and use keyboard shortcuts (Ctrl/Cmd+C)
4. **Links not working**: Check internet connection

---

This distribution approach ensures that users receive both the application and the data files needed to use it effectively, along with clear documentation on installation and usage.