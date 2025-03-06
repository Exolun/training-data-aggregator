// popup.js
function setButtonLabel() {
    // We can request the dataset from background, then compare with current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentURL = tabs[0].url;
        chrome.storage.local.get("trainingData", (result) => {
            const data = result.trainingData || {};
            if (data[currentURL]) {
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

    // Add event listener for the new Copy Clipboard button
    copyClipboardButton.addEventListener("click", async () => {
        try {
            // Get the current tab URL
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const currentURL = tabs[0].url;
            const title = tabs[0].title;

            // Read data from clipboard
            const clipboardText = await navigator.clipboard.readText();

            if (!clipboardText) {
                console.error("Clipboard is empty or permission denied");
                return;
            }

            // Save the clipboard content with the current URL as key
            chrome.storage.local.get("trainingData", (result) => {
                const trainingData = result.trainingData || {};

                // Update or add the entry
                trainingData[currentURL] = {
                    page_url: currentURL,
                    page_content: clipboardText,
                    page_title: title,
                    source: "clipboard",
                    timestamp: new Date().toISOString()
                };

                // Save back to storage
                chrome.storage.local.set({ trainingData }, () => {
                    console.log("Clipboard content saved successfully for URL:", currentURL);
                    // Update button to "Update" since we now have data for this URL
                    saveButton.textContent = "Update";
                });
            });
        } catch (error) {
            console.error("Error accessing clipboard:", error);
        }
    });

    removeButton.addEventListener("click", async () => {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const currentURL = tabs[0].url;
        chrome.storage.local.get("trainingData", (result) => {
            const trainingData = result.trainingData || {};
            delete trainingData[currentURL];
            chrome.storage.local.set({ trainingData }, () => {
                console.log("Removed data for:", currentURL);
                // Optionally revert save button text
                saveButton.textContent = "Save";
            });
        });
    });
});