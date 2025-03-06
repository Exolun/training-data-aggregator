// settings.js

document.addEventListener("DOMContentLoaded", () => {
    const fileNameInput = document.getElementById("fileNameInput");
    const saveFileNameButton = document.getElementById("saveFileNameButton");
    const clearDatasetButton = document.getElementById("clearDatasetButton");
  
    // Load the current file name
    chrome.runtime.sendMessage({ action: "getFileName" }, (response) => {
      if (response.fileName) {
        fileNameInput.value = response.fileName;
      }
    });
  
    // Save the file name
    saveFileNameButton.addEventListener("click", () => {
      const newFileName = fileNameInput.value.trim();
      if (newFileName) {
        chrome.runtime.sendMessage({
          action: "updateFileName",
          newFileName: newFileName
        }, (res) => {
          if (res.success) {
            alert("File name updated!");
          }
        });
      }
    });
  
    // Clear the dataset
    clearDatasetButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear the entire dataset?")) {
        chrome.runtime.sendMessage({ action: "clearDataset" }, (res) => {
          if (res.success) {
            alert("Dataset cleared!");
          }
        });
      }
    });
  });
  