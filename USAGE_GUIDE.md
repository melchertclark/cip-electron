# CIP Explorer - Usage Guide

## Introduction

The CIP Explorer is an Electron desktop application that allows you to browse Classification of Instructional Programs (CIP) categories and view related university programs and clubs. This guide will walk you through how to use the application.

## Getting Started

### Running the Application

1. Open a terminal in the cip-electron directory
2. Run the following command:
   ```
   npm start
   ```
3. The application should launch, showing the CIP categories in the left sidebar

### Initial Data Loading

When the application starts, it will:
1. First try to load data from your Downloads folder:
   - `~/Downloads/DUprograms.json` for programs data
   - `~/Downloads/categorized_clubs.json` for clubs data
2. If those files aren't found, it will use the included sample data

## Using the Application

### Browsing CIP Categories

- The left sidebar shows all CIP categories
- Categories with no data appear in gray
- Click on a category to see related programs and clubs

### Searching

- Use the search box at the top of the sidebar to filter categories
- Type any part of a category name to filter the list

### Working with Cards

Each program or club is displayed as a card with:
- An arrow for expanding/collapsing the card
- A title that acts as a hyperlink
- An optional subtitle (e.g., degree type for programs)
- A description (visible when expanded)

### Navigation

- Click the arrow to expand/collapse a card
- Click the title to open its link in your default browser
- Use the `.edu` and `@Insta` buttons to access the university's website and Instagram

## Customizing Data Schema

If you have JSON data with different field names:

1. Go to File → Configure Data Schema
2. For each entity type (Programs and Clubs), specify:
   - The field containing the name
   - The field containing the description
   - The field containing the link URL
   - The field containing the extra label (if any)
   - The field containing the CIP category identifier
3. Click "Save Configuration"

The application will immediately reorganize your data according to the new schema.

## Loading Custom Data

You can load your own JSON files:

1. Go to File → Open Program Data to load a custom programs JSON file
2. Go to File → Open Club Data to load a custom clubs JSON file

## Building for Distribution

To create a standalone application package:

1. Open a terminal in the cip-electron directory
2. Run: `npm run build`
3. Find the packaged application in the `dist` directory

## Troubleshooting

If you encounter issues:
- Check the console for errors (View → Toggle Developer Tools)
- Verify your JSON files match the expected schema
- Try adjusting the schema settings to match your data structure

## Need Help?

Refer to the README.md file for more detailed information about:
- Data formats
- Building options
- Configuration details