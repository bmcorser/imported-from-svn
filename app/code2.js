function reqListener () {
   element.textContent = oldNumber + parseInt(10);
   element2.remove();
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

element = document.createElement('div');
setTimeout(function(){
  document.querySelector('body').insertBefore(element, document.querySelector('button'));
}, 500);
