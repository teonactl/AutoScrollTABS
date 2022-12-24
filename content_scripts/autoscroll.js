(function() {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;





function pageScroll(speed) {
  window.scrollBy(0, speed); // horizontal and vertical scroll increments
  scrolldelay = setTimeout('pageScroll(1)', 1000); // scrolls every 100 milliseconds
  if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
    clearTimeout(scrolldelay);
    scrolldelay = setTimeout('PageUp()', 2000);
  }

}

function PageUp() {
  window.scrollTo(0, 0);
  setTimeout(function() {
    pageScroll(1)
  }, 600);
}

function AutoScroll(){
    document.body.style.border = "5px solid red";

    console.log("STARTEDDDD");
    navigator.mediaDevices.getUserMedia({
      audio: true,
    })
      .then(function(stream) {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);
      scriptProcessor.onaudioprocess = function() {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const arraySum = array.reduce((a, value) => a + value, 0);
        const average = arraySum / array.length;
        console.log(Math.round(average));
        if (average>= 2){
          pageScroll(1);
        }
        else{
          console.log("zero");//clearTimeout(scrolldelay);
        }
        // colorPids(average);
      };
    })
    .catch(function(err) {
      /* handle the error */
      console.error(err);
    });         


};







 

  /**
   * Listen for messages from the background script.
   * Call "beastify()" or "reset()".
   */
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "start") {
      AutoScroll();
    } else if (message.command === "stop") {
      console.log("Stop");
      location.reload();
    }
  });

})();
