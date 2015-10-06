/*
  lib
*/
var H5Calc = function () {
  //private
  var log = [];
  var ready = true;
  var fingers = 5;
  var add = function (f) {
    ready = false;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4){
        if(xhr.status == 200){
          log.push(f);
          ready = true;
          if (typeof didAdd == 'function') {
            didAdd();
          }
        } else {
          ready = true;
          if (typeof didAdd == 'function') {
            errAdd();
          }
        }
      }
    };
    xhr.open("GET","http://www.httpbin.org/delay/1",true);
    xhr.send();
  };
  var didAdd, errAdd;

  //public
  this.single = function () {
    add(fingers);
  };
  this.double = function () {
    add(fingers*2);
  };
  this.getLog = function () {
    return log;
  };
  this.isReady = function () {
    return ready;
  };
  this.total = function () {
    var t = 0;
    for(var k = 0; k < log.length; k++){
      t += log[k];
    }
    return t;
  };
  this.didAdd = function (f) {
    didAdd = f;
  };
  this.errAdd =function (f) {
    errAdd = f;
  };
  return this;
};

window.addEventListener('load', function(){

  var historyDisplay = document.querySelector('.history');
  var resultDisplay = document.querySelector('.result');
  var statusDisplay = document.querySelector('.status');
  var singleBtn = document.querySelector('.single');
  var doubleBtn = document.querySelector('.double');

  h5calc = new H5Calc();

  // events
  singleBtn.addEventListener('click', function(){
    if(h5calc.isReady()){
      singleBtn.disabled = true;
      doubleBtn.disabled = true;
      statusDisplay.innerHTML = 'adding...';
      h5calc.single();
    }
  });

  doubleBtn.addEventListener('click', function(){
    if(h5calc.isReady()){
      singleBtn.disabled = true;
      doubleBtn.disabled = true;
      statusDisplay.innerHTML = 'adding...';
      h5calc.double();
    }
  });

  h5calc.didAdd(function(){
    resultDisplay.innerHTML = h5calc.total();
    historyDisplay.innerHTML = h5calc.getLog().join(' + ');
    statusDisplay.innerHTML = '';
    singleBtn.disabled = false;
    doubleBtn.disabled = false;
  });

  h5calc.errAdd(function(){
    singleBtn.disabled = false;
    doubleBtn.disabled = false;
    resultDisplay.innerHTML = h5calc.total();
    historyDisplay.innerHTML = h5calc.getLog().join(' + ');
    statusDisplay.innerHTML = '! try again';
  });

});
