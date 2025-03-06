// dataset_view.js

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve data from storage
  chrome.runtime.sendMessage({ action: "getDataset" }, (response) => {
    const jsonContainer = document.getElementById("jsonContainer");
    const dataset = response.trainingData || {};

    // Pretty-print the JSON
    jsonContainer.textContent = JSON.stringify(dataset, null, 2);
  });

  // Clear dataset button functionality
  const clearDatasetButton = document.getElementById("clearDatasetButton");
  clearDatasetButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear the entire dataset?")) {
      chrome.runtime.sendMessage({ action: "clearDataset" }, (res) => {
        if (res.success) {
          alert("Dataset cleared!");
          // Update the view to show empty dataset
          document.getElementById("jsonContainer").textContent = "{}";
        }
      });
    }
  });

  const importDatasetButton = document.getElementById("importDatasetButton");
  const importFileInput = document.getElementById("importFile");

  importDatasetButton.addEventListener("click", () => {
    importFileInput.click();
  });

  importFileInput.addEventListener("change", () => {
    const file = importFileInput.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedData = JSON.parse(e.target.result);
        chrome.runtime.sendMessage({ action: "updateDataset", newDataset: importedData }, (res) => {
          if (res.success) {
            alert("Dataset imported successfully!");
            // Update the displayed dataset
            document.getElementById("jsonContainer").textContent = JSON.stringify(importedData, null, 2);
          } else {
            alert("Failed to import dataset!");
          }
        });
      } catch (err) {
        alert("Invalid JSON file!");
      }
    };
    reader.readAsText(file);
  });
});