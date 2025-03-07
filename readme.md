# Training Data Aggregator

**Training Data Aggregator** is a Chrome Extension that lets you save the content (HTML) of any web page into a local dataset, then download it as JSON. It’s useful for building small, curated data collections for machine learning or other data-oriented tasks.

## Features

1. **Save/Update Page Content**  
   - Click **Save** (or **Update** if already saved) to store the current page’s full HTML.  
   - The URL of the page is used as the key in your dataset.

2. **Persistent Dataset**  
   - The dataset is stored via an IndexedDB, so it remains available across browser sessions.

3. **Download Dataset**  
   - Exports your dataset as a JSON file (default name: `trainingData.json`) with a single click.

4. **Import Dataset**  
   - Imports an existing dataset via a filepicker.  Will overwrite existing data if present.
   
5. **View Dataset**  
   - Open a well-formatted JSON display in a new tab to quickly inspect the collected data.

6. **Settings**  
   - Customize your download file name (e.g., `myDataset.json`).  
   - Clear the entire dataset with one click if you want to start fresh.

## Getting Started

### 1. Download / Clone the Project

Either clone the repository or copy the entire extension folder (e.g., `training-data-aggregator/`) onto your local machine.

### 2. Project Structure

```
training-data-aggregator/
├── manifest.json
├── background.js
├── content_script.js
├── popup.html
├── popup.js
├── dataset_view.html
├── dataset_view.js
├── settings.html
├── settings.js
└── bootstrap_app.bat
```

- **manifest.json** – Chrome extension configuration (Manifest V3).  
- **background.js** – The service worker that manages communication and storage logic.  
- **content_script.js** – Injected script for retrieving the current page’s HTML.  
- **popup.html / popup.js** – Extension popup UI and logic.  
- **dataset_view.html / dataset_view.js** – Displays the current dataset.  
- **settings.html / settings.js** – Allows the user to edit the download filename and clear the dataset.  
- **bootstrap_app.bat** – An optional script that creates the basic file structure for you.

### 3. Installation in Chrome

1. Open the Chrome browser and go to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** and select the `training-data-aggregator/` folder.
4. The extension should now be visible in your list of installed extensions.  
   - You can also pin it to the toolbar by clicking the puzzle icon (Extensions), then pinning “Training Data Aggregator”.

### 4. Usage

1. **Open the Extension Popup**  
   - Click the extension’s icon (a puzzle piece if you’re in dev mode, or your custom icon if you added one).

2. **Save/Update the Current Page**  
   - Navigate to any webpage you want to save.  
   - Click **Save**. The extension will store the page’s HTML in its local dataset under that URL.  
   - If the page was previously saved, the button will say **Update** instead.

3. **Download the Dataset**  
   - Click **Download** to export all saved data to a JSON file (defaults to `trainingData.json`).

4. **View the Dataset**  
   - Click **View Dataset** to open a tab that displays your dataset as pretty-printed JSON.

5. **Settings**  
   - Click **Settings** to open a new tab where you can:  
     - Change the default file name used during downloads.  
     - Clear the entire dataset (be cautious—this permanently removes all saved pages!).

### 5. Customization

- **File Name** – You can set your preferred file name under the **Settings** page. This is especially handy if you manage multiple datasets across different uses.  
- **Page Content** – By default, the extension saves the entire HTML of the current page. If you’d rather store text only (e.g., for an NLP dataset), you can modify `content_script.js` to parse the document and send a text-only version back.

### 6. Contributing

1. Fork or clone this repository.
2. Make changes in a new feature branch.
3. Submit a pull request describing your changes and why you think they’d be beneficial.

### 7. License

This project is licensed under [MIT License](https://opensource.org/licenses/MIT). Feel free to modify or distribute as you see fit.

---

**Enjoy building your custom datasets with Training Data Aggregator!**