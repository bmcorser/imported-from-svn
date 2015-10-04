o = {
  history: [],
};

element = document.createElement('div');
setTimeout(function(){
  document.querySelector('body').insertBefore(element, document.querySelector('button'));
  element.textContent = 0;
}, 200);

function addFive () {
  addhistory(5);
  element.innerHTML = parseInt(element.innerHTML) + 5;
}
function addhistory (Added) {
  document.querySelector('span:last-child').appendChild(document.createElement('span'));
  document.querySelector('span:last-child').textContent += ' + ' + Added;
}
