// content_script.js

function extractStructuredText(element) {
    let output = [];

    function extract(element) {
        // Skip script and style tags
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
            return;
        }

        // If this is a text node, just push its content
        if (element.nodeType === Node.TEXT_NODE) {
            const text = element.nodeValue.trim();
            if (text) {
                output.push(text);
            }
        }

        // If it's an element node, handle blocky tags
        if (element.nodeType === Node.ELEMENT_NODE) {
            // Add line breaks or spacing before certain tags
            if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'DIV', 'LI', 'BR'].includes(element.tagName)) {
                output.push('\n');
            }

            // Recurse over child nodes
            for (const child of element.childNodes) {
                extract(child);
            }

            // Possibly add a trailing newline for some block elements
            if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'DIV', 'LI'].includes(element.tagName)) {
                output.push('\n');
            }
        }
    }

    extract(element);
    
    // Join the output array into a string
    let result = output.join('');
    
    // Replace 3 or more consecutive newlines with just 2 newlines
    result = result.replace(/(\r?\n){3,}/g, '\n\n');
    
    return result;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getPageContent") {
        // Instead of passing the HTML string, pass the document element directly
        const extractedContent = extractStructuredText(document.body);

        sendResponse(extractedContent);
        return true;
    }
});