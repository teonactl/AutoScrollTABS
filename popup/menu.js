
/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {


    /**

     * send a  message to the content script in the active tab.
     */
    function start(tabs) {
     
        browser.tabs.sendMessage(tabs[0].id, {
          command: "start",
        });
      
    }

    function stop(tabs) {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "stop",
        });
      }
    /**
     * Just log the error to the console.
     */
    function reportError(error) {
      console.error(`ERROR: ${error}`);
    }

    /**
     * Get the active tab,
     * then call "beastify()" or "reset()" as appropriate.
     */
    if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")) {
      // Ignore when click is not on a button within <div id="popup-content">.
      return;
    } 
    if (e.target.id === "start") {
      browser.tabs.query({active: true, currentWindow: true})
        .then(start)
        .catch(reportError);
    } else if(e.target.id === "stop") {
      browser.tabs.query({active: true, currentWindow: true})
        .then(stop)
        .catch(reportError);
    }
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "/content_scripts/autoscroll.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);
