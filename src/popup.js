// popup.js
function setButtonLabel() {
    // Request the dataset from background, then check if current URL exists
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentURL = tabs[0].url;
        chrome.runtime.sendMessage({ action: "getDataset" }, (response) => {
            const dataset = response.trainingData || {};
            const files = dataset?.context?.files || [];
            
            // Check if any file has this URL as its source
            const existingFile = files.find(file => file.metadata?.source === currentURL);
            
            if (existingFile) {
                // If current page is already in the dataset, show 'Update'
                document.getElementById("saveButton").textContent = "Update";
            } else {
                document.getElementById("saveButton").textContent = "Save";
            }
        });
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.getElementById("saveButton");
    const downloadButton = document.getElementById("downloadButton");
    const viewDatasetButton = document.getElementById("viewDatasetButton");
    const settingsButton = document.getElementById("settingsButton");
    const copyClipboardButton = document.getElementById("copyClipboard");
    const removeButton = document.getElementById("removeButton");

    // Check if current tab URL is already in dataset to toggle the button text
    setButtonLabel();

    saveButton.addEventListener("click", () => {
        // Ask background to inject content script and save or update
        chrome.runtime.sendMessage({ action: "saveOrUpdatePage" }, (response) => {
            if (response && response.success) {
                console.log("Page content saved or updated successfully.");
                // Update the button label to "Update"
                saveButton.textContent = "Update";
            }
        });
    });

    downloadButton.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "downloadDataset" }, (response) => {
            if (response && response.success) {
                const dataStr = JSON.stringify(response.data, null, 2);
                const fileName = response.fileName || "trainingData.json";

                // Create a temporary link and click to download
                const blob = new Blob([dataStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.download = fileName;
                link.click();

                URL.revokeObjectURL(url);
            }
        });
    });

    viewDatasetButton.addEventListener("click", () => {
        // Open the dataset_view.html in a new tab or a new popup window
        chrome.tabs.create({ url: chrome.runtime.getURL("dataset_view.html") });
    });

    settingsButton.addEventListener("click", () => {
        // Open settings.html in a new tab or popup window
        chrome.tabs.create({ url: chrome.runtime.getURL("settings.html") });
    });

    copyClipboardButton.addEventListener("click", async () => {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const currentURL = tabs[0].url;
            const title = tabs[0].title;
            const clipboardText = await navigator.clipboard.readText();
    
            if (!clipboardText) {
                console.error("Clipboard is empty or permission denied");
                return;
            }
    
            // Send message to background.js to save clipboard content
            chrome.runtime.sendMessage({
                action: "saveClipboardContent",
                url: currentURL,
                title,
                clipboardText
            }, (response) => {
                if (response && response.success) {
                    console.log("Clipboard content saved successfully for URL:", currentURL);
                    saveButton.textContent = "Update";
                }
            });
        } catch (error) {
            console.error("Error accessing clipboard:", error);
        }
    });
    
    removeButton.addEventListener("click", async () => {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const currentURL = tabs[0].url;
    
        // Send message to background.js to remove stored data
        chrome.runtime.sendMessage({
            action: "removePage",
            url: currentURL
        }, (response) => {
            if (response && response.success) {
                console.log("Removed data for:", currentURL);
                saveButton.textContent = "Save";
            }
        });
    });
});