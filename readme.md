# Training Data Aggregator

**Training Data Aggregator** is a Chrome Extension that allows you to collect content from web pages and your clipboard into a structured dataset for use as context by AI agents. The data is stored in a structured JSON format compatible with AI context files.

## Features

1. **Save/Update Page Content**  
   - Click **Save** (or **Update** if already saved) to extract and store the current page's text content.  
   - The extension intelligently extracts structured text from the page, preserving readability while removing HTML markup.
   - Each page is stored with its URL, title, and metadata indicating it's a "page" source.

2. **Copy Clipboard**  
   - Click **Copy Clipboard** to save your current clipboard content to the dataset.
   - Perfect for capturing content from sources that are difficult to scrape or for adding custom notes.
   - Clipboard entries are stored with the current tab's URL and title, with metadata indicating a "clipboard" source.

3. **Remove Data**  
   - Click **Remove Data** to delete the stored content for the current page/URL from your dataset.
   - Useful for cleaning up entries you no longer need.

4. **Persistent Dataset**  
   - The dataset is stored in IndexedDB, ensuring it persists across browser sessions.
   - Data is structured as a context file with memory settings and an array of files.

5. **Download Dataset**  
   - Exports your dataset as a JSON file (default name: `trainingData.json`) with a single click.
   - The JSON follows a structured format suitable for AI agent context:
     ```json
     {
       "context": {
         "memory": {
           "user_role": "Knowledge Base Expert",
           "topic": "Software Projects"
         },
         "files": [
           {
             "name": "Page Title",
             "metadata": {
               "source": "https://example.com",
               "type": "page"
             },
             "content": "Extracted text content..."
           }
         ]
       }
     }
     ```

6. **Import Dataset**  
   - Import an existing dataset from a JSON file through the **View Dataset** page.
   - Overwrites existing data, allowing you to restore backups or merge datasets.

7. **View Dataset**  
   - Open a well-formatted JSON display in a new tab to inspect your collected data.
   - Includes options to clear the entire dataset or import a JSON file.

8. **Settings**  
   - Customize your download file name (e.g., `myDataset.json`).  
   - Clear the entire dataset with one click if you want to start fresh.

## Getting Started

### 1. Download / Clone the Project

Clone the repository or download the extension folder onto your local machine:

```
git clone https://github.com/Exolun/training-data-aggregator.git
```

### 2. Project Structure

```
training-data-aggregator/
├── readme.md
└── src/
    ├── manifest.json
    ├── background.js
    ├── content_script.js
    ├── popup.html
    ├── popup.js
    ├── dataset_view.html
    ├── dataset_view.js
    ├── settings.html
    ├── settings.js
    └── trainingdatabase.js
```

- **manifest.json** – Chrome extension configuration (Manifest V3).  
- **background.js** – Service worker managing communication and coordinating data storage.  
- **content_script.js** – Injected script that extracts structured text from web pages.  
- **popup.html / popup.js** – Extension popup UI with buttons for all main features.  
- **dataset_view.html / dataset_view.js** – Displays the current dataset with import/clear options.  
- **settings.html / settings.js** – Configure the download filename and clear the dataset.  
- **trainingdatabase.js** – Database wrapper class managing IndexedDB operations.

### 3. Installation in Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** and select the `training-data-aggregator/src/` folder.
4. The extension should now appear in your list of installed extensions.  
   - Pin it to the toolbar by clicking the puzzle icon (Extensions), then pinning "Training Data Aggregator".

### 4. Usage

#### Collecting Web Page Content

1. **Navigate to a webpage** you want to save.
2. **Click the extension icon** to open the popup.
3. **Click "Save"** to extract and store the page's text content.
   - The button will change to "Update" if this page is already in your dataset.
   - The extension extracts readable text while preserving structure (headings, paragraphs, lists).

#### Capturing Clipboard Content

1. **Copy any text** to your clipboard.
2. **Open the extension popup** on any tab.
3. **Click "Copy Clipboard"** to save the clipboard content.
   - The content is associated with the current tab's URL and title.
   - Useful for capturing content from PDFs, videos, or other hard-to-scrape sources.

#### Removing Content

1. **Navigate to the page** whose content you want to remove.
2. **Click "Remove Data"** in the extension popup.
   - This removes all stored data associated with the current URL.

#### Downloading Your Dataset

1. **Click "Download"** in the popup.
2. The dataset is exported as a JSON file with your configured filename.
3. The file contains all collected pages and clipboard entries in a structured format.

#### Viewing Your Dataset

1. **Click "View Dataset"** to open a new tab displaying your data.
2. The dataset is shown as pretty-printed JSON for easy inspection.
3. From this page you can also:
   - **Clear Dataset** – Remove all stored data.
   - **Import Dataset** – Load a JSON file to replace your current dataset.

#### Configuring Settings

1. **Click "Settings"** to open the settings page.
2. **Change the filename** for dataset downloads.
3. **Clear the dataset** if you want to start fresh.

## Data Format

The extension stores data in a structured format designed for AI agent context files:

```json
{
  "context": {
    "memory": {
      "user_role": "Knowledge Base Expert",
      "topic": "Software Projects"
    },
    "files": [
      {
        "name": "Example Page Title",
        "metadata": {
          "source": "https://example.com/page",
          "type": "page"
        },
        "content": "Extracted page text..."
      },
      {
        "name": "Clipboard Entry",
        "metadata": {
          "source": "https://example.com/current-tab",
          "type": "clipboard"
        },
        "content": "Pasted clipboard text..."
      }
    ]
  }
}
```

- **memory** – Contains default role and topic information for AI context.
- **files** – Array of collected content entries, each with:
  - **name** – Page title or tab title
  - **metadata.source** – URL where the content was captured
  - **metadata.type** – Either "page" (extracted from webpage) or "clipboard" (from clipboard)
  - **content** – The actual text content

## Technical Details

- **Storage**: Uses IndexedDB for persistent, structured storage.
- **Content Extraction**: The content script intelligently extracts text from web pages, preserving structure while removing HTML tags, scripts, and styles.
- **Permissions**: Requires `clipboardRead` for clipboard access, `storage` for settings, `activeTab` and `scripting` for content extraction, and `<all_urls>` to work on any website.

## Contributing

1. Fork or clone this repository.
2. Make changes in a new feature branch.
3. Submit a pull request describing your changes and their benefits.

## License

This project is licensed under [MIT License](https://opensource.org/licenses/MIT). Feel free to modify or distribute as you see fit.

---

**Build your custom AI training datasets with Training Data Aggregator!**