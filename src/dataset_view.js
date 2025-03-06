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
  });