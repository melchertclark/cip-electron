# CIP Code Explorer (Electron Edition)

An Electron-based application for exploring CIP (Classification of Instructional Programs) codes, university programs, and clubs.

## Features

- Browse CIP categories and view related programs and clubs
- Expandable cards with separate controls for expansion and link opening
- Customizable data schema to support different JSON structures
- Load data from local files or use sample data
- Search functionality for quick category finding
- Count indicators for programs and clubs in each category
- Electron security best practices (contextIsolation, no nodeIntegration)

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

To run the application in development mode:

```
npm start
```

For debugging:

```
npm run dev
```

## Loading Data

The application looks for two JSON files in your Downloads folder by default:
- `DUprograms.json` - Contains program information
- `categorized_clubs.json` - Contains club information

If these files are not found, sample data will be used instead.

You can also load custom data files through the File menu:
- File -> Open Program Data
- File -> Open Club Data

## Saving Data

When you save, the app writes new, timestamped JSON files to your Downloads folder:
- `DUprograms_YYYYMMDD_HHMMSS.json`
- `categorized_clubs_YYYYMMDD_HHMMSS.json`

Each save creates a new version, so your previous data is never overwritten.

## Customizing Data Schema

To adapt the application to different JSON structures:

1. Go to File -> Configure Data Schema
2. Specify the field names used in your JSON data for each entity type
3. Save the configuration

## Building the Application

To create a standalone application:

```
npm run build
```

Or for a specific platform:

```
npm run build:mac
npm run build:win
```

The packaged application will be available in the `dist` directory.

For advanced packaging and distribution (including sample data and user guides), see **DISTRIBUTION.md**.

## Data Format

The expected JSON data format is an array of objects with at least these fields:

### Programs
```json
[
  {
    "name": "Program Name",
    "description": "Program description text",
    "degree": "Degree type (e.g., BS, MS)",
    "link": "URL to program website",
    "eab_cip_code": "CIP category name"
  }
]
```

### Clubs
```json
[
  {
    "name": "Club Name",
    "description": "Club description text",
    "website": "URL to club website",
    "eab_cip_code": "CIP category name"
  }
]
```

The field names can be customized through the schema configuration dialog.

## Troubleshooting & Electron Version

- This app is tested with Electron 25.9.8 for maximum compatibility.
- If you see ESM or security warnings, make sure you are using the recommended Electron version and that your dependencies are up to date.
- If you encounter issues:
  - Check the console for error messages (View → Toggle Developer Tools)
  - Verify your JSON files match the expected schema
  - Try adjusting the schema settings to match your data structure
  - Ensure the app has permission to access your Downloads folder
- For packaging/distribution issues, see **DISTRIBUTION.md**.

## License

ISC