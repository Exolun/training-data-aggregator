import TrainingDatabase from "./trainingdatabase.js";

const trainingDb = new TrainingDatabase();

chrome.runtime.onInstalled.addListener(() => {
    trainingDb.getDataset().then((data) => {
        if (!Object.keys(data).length) {
            trainingDb.clearDataset();
        }
    });
    trainingDb.getFileName().then((fileName) => {
        if (!fileName) {
            trainingDb.updateFileName("trainingData.json");
        }
    });
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveOrUpdatePage") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if (tab?.id) {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tab.id },
                        files: ["content_script.js"]
                    },
                    () => {
                        chrome.tabs.sendMessage(tab.id, { action: "getPageContent" }, (pageContent) => {
                            if (chrome.runtime.lastError) {
                                console.error("Error retrieving page content:", chrome.runtime.lastError);
                                sendResponse({ success: false });
                                return;
                            }
                            trainingDb
                                .saveOrUpdatePage(tab.url, pageContent, tab.title, "page")
                                .then(() => sendResponse({ success: true }));
                        });
                    }
                );
            }
        });
        return true;
    } else if (request.action === "downloadDataset") {
        Promise.all([trainingDb.getDataset(), trainingDb.getFileName()]).then(([dataset, fileName]) => {
            sendResponse({ success: true, data: dataset, fileName: fileName || "trainingData.json" });
        });
        return true;
    } else if (request.action === "getDataset") {
        trainingDb.getDataset().then((data) => {
            sendResponse({ trainingData: data });
        });
        return true;
    } else if (request.action === "getFileName") {
        trainingDb.getFileName().then((fileName) => {
            sendResponse({ fileName });
        });
        return true;
    } else if (request.action === "updateFileName") {
        trainingDb.updateFileName(request.newFileName).then(() => {
            sendResponse({ success: true });
        });
        return true;
    } else if (request.action === "clearDataset") {
        trainingDb.clearDataset().then(() => {
            sendResponse({ success: true });
        });
        return true;
    } else if (request.action === "updateDataset") {
        trainingDb.updateDataset(request.newDataset).then(() => {
            sendResponse({ success: true });
        });
        return true;
    } else if (request.action === "saveClipboardContent") {
        const { url, title, clipboardText } = request;
        trainingDb.saveOrUpdatePage(url, clipboardText, title, "clipboard").then(() => {
            sendResponse({ success: true });
        });
        return true;
    } else if (request.action === "removePage") {
        removePage(request.url).then(() => {
            sendResponse({ success: true });
        });
        return true;
    }
});

async function removePage(url) {
    const db = await trainingDb.openDatabase();
    return new Promise((resolve) => {
        const tx = db.transaction(trainingDb.trainingStore, "readwrite");
        tx.objectStore(trainingDb.trainingStore).delete(url);
        tx.oncomplete = () => resolve(true);
    });
}