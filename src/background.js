// background.js (Service Worker)

// Initialize storage keys if needed
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(["trainingData", "fileName"], (result) => {
        if (!result.trainingData) {
            chrome.storage.local.set({ trainingData: {} });
        }
        if (!result.fileName) {
            // Default file name
            chrome.storage.local.set({ fileName: "trainingData.json" });
        }
    });
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveOrUpdatePage") {
        // In the message listener where saveOrUpdatePage is handled:
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const tab = tabs[0];
            if (tab?.id) {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tab.id },
                        files: ["content_script.js"]
                    },
                    () => {
                        // After injection, request the content script to return the HTML
                        chrome.tabs.sendMessage(tab.id, { action: "getPageContent" }, (pageContent) => {
                            if (chrome.runtime.lastError) {
                                console.error("Error retrieving page content:", chrome.runtime.lastError);
                                sendResponse({ success: false });
                                return;
                            }
                            // Save the content in storage with title
                            saveOrUpdateData(tab.url, pageContent, tab.title).then(() => {
                                sendResponse({ success: true });
                            });
                        });
                    }
                );
            }
        });
        // Return true to indicate we'll send response asynchronously
        return true;
    } else if (request.action === "downloadDataset") {
        // Retrieve dataset and file name, then send to popup for download
        chrome.storage.local.get(["trainingData", "fileName"], (result) => {
            sendResponse({
                success: true,
                data: result.trainingData || {},
                fileName: result.fileName || "trainingData.json"
            });
        });
        return true;
    } else if (request.action === "getDataset") {
        // Return the dataset
        chrome.storage.local.get("trainingData", (result) => {
            sendResponse({ trainingData: result.trainingData || {} });
        });
        return true;
    } else if (request.action === "getFileName") {
        chrome.storage.local.get("fileName", (result) => {
            sendResponse({ fileName: result.fileName });
        });
        return true;
    } else if (request.action === "updateFileName") {
        // Update the file name in local storage
        chrome.storage.local.set({ fileName: request.newFileName }, () => {
            sendResponse({ success: true });
        });
        return true;
    } else if (request.action === "clearDataset") {
        // Clear all data
        chrome.storage.local.set({ trainingData: {} }, () => {
            sendResponse({ success: true });
        });
        return true;
    } else if (request.action === "updateDataset") {
        chrome.storage.local.set({ trainingData: request.newDataset }, () => {
            sendResponse({ success: true });
        });
        return true;
    }
});

// Helper function to save or update data in local storage
async function saveOrUpdateData(url, pageContent, pageTitle) {
    return new Promise((resolve) => {
        chrome.storage.local.get("trainingData", (result) => {
            const data = result.trainingData || {};
            // Store as an object with structured fields instead of just the content
            data[url] = {
                page_url: url,
                page_content: pageContent,
                page_title: pageTitle,
                source: "page",
                timestamp: new Date().toISOString()
            };
            chrome.storage.local.set({ trainingData: data }, () => {
                resolve();
            });
        });
    });
}