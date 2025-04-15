# CIP Code Explorer (Electron Edition)

An Electron-based application for exploring CIP (Classification of Instructional Programs) codes, university programs, and clubs.

## Features

- Browse CIP categories and view related programs and clubs
- Expandable cards with separate controls for expansion and link opening
- Customizable data schema to support different JSON structures
- Load data from local files or use sample data
- Search functionality for quick category finding

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

## License

ISC