var o={history:[]};
//window.onload = startBlink;

element = document.createElement('div');
setTimeout(function(){
  document.querySelector('body').insertBefore(element, document.querySelector('button'));
  element.textContent = 0;
}, 200);

setTimeout(function(){
  document.querySelector('button').onclick = function () {
    addFive();
  }
},200);

element = document.createElement('div');
setTimeout(function(){
  document.querySelector('body').insertBefore(element, document.querySelector('button'));
}, 500);

/*
  functions
*/
function reqListener () {
   element.textContent = oldNumber + parseInt(10);
   element2.remove();
}
function addhistory (Added) {
  document.querySelector('span:last-child').appendChild(document.createElement('span'));
  document.querySelector('span:last-child').textContent += ' + ' + Added;
}
function addFive () {
  addhistory(5);
  element.innerHTML = parseInt(element.innerHTML) + 5;
}
function addTen () {
  oldNumber = parseInt(element.textContent);
  addhistory(10);
  element2 = document.createElement('div');
  element2.textContent = 'adding';
  document.querySelector('body').insertBefore(element2, document.querySelector('button'));
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", "http://www.httpbin.org/delay/1", true);oReq.send();
}
// function doBlink() {
//   // Blink, Blink, Blink...
//   var blink = document.all.tags("BLINK");
//   for (var i=0; i < blink.length; i++){
//     blink[i].style.visibility = blink[i].style.visibility == "" ? "hidden" : "";
//   }
// }
// function startBlink() {
//   // Make sure it is IE4
//   if (document.all){
//     setInterval("doBlink()",1000);
//   }
// }
