var H5Calc = function (opts) {

  var log = [];
  var ready = true;
  var fingers = 5;

  var setButtonsDisabled = function (value) {
    opts.singleBtn.disabled = value;
    opts.doubleBtn.disabled = value;
  };

  var total = function () {
    var t = 0;
    for(var k = 0; k < log.length; k++){
      t += log[k];
    }
    return t;
  };

  var addComplete = function () {
    opts.resultDisplay.innerHTML = total();
    opts.historyDisplay.innerHTML = log.join(' + ');
    opts.statusDisplay.innerHTML = '';
    setButtonsDisabled(false);
  };

  var addErr = function () {
    opts.resultDisplay.innerHTML = total();
    opts.historyDisplay.innerHTML = log.join(' + ');
    opts.statusDisplay.innerHTML = '! try again';
    setButtonsDisabled(false);
  };

  var add = function (f) {
    ready = false;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4){
        if(xhr.status == 200){
          log.push(f);
          ready = true;
          addComplete();
        } else {
          ready = true;
          addErr();
        }
      }
    };
    xhr.open("GET", "http://www.httpbin.org/delay/1", true);
    xhr.send();
  };

  // events
  opts.singleBtn.addEventListener('click', function () {
    if (ready) {
      setButtonsDisabled(true);
      opts.statusDisplay.innerHTML = 'adding...';
      add(fingers);
    }
  });

  opts.doubleBtn.addEventListener('click', function () {
    if (ready) {
      setButtonsDisabled(true);
      opts.statusDisplay.innerHTML = 'adding...';
      add(fingers * 2);
    }
  });

  return this;
};

window.addEventListener('load', function(){

  var opts = {
    historyDisplay: document.querySelector('.history'),
    resultDisplay: document.querySelector('.result'),
    statusDisplay: document.querySelector('.status'),
    singleBtn: document.querySelector('.single'),
    doubleBtn: document.querySelector('.double'),
  };

  h5calc = new H5Calc(opts);

});
