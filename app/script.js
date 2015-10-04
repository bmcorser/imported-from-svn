window.addEventListener('load',function(){
  var
  historyDisplay=document.querySelector('.history'),
  resultDisplay=document.querySelector('.result'),
  statusDisplay=document.querySelector('.status');
  singleBtn=document.querySelector('.single'),
  doubleBtn=document.querySelector('.double'),
  h5calc = new H5Calc();
  // events
  singleBtn.addEventListener('click',function(){
    if(h5calc.isReady()){
      singleBtn.disabled=true;
      doubleBtn.disabled=true;
      statusDisplay.innerHTML = 'adding...';
      h5calc.single();
    }
  });
  doubleBtn.addEventListener('click',function(){
    if(h5calc.isReady()){
      singleBtn.disabled=true;
      doubleBtn.disabled=true;
      statusDisplay.innerHTML = 'adding...';
      h5calc.double();
    }
  });
  h5calc.didAdd(function(){
    resultDisplay.innerHTML = h5calc.total();
    historyDisplay.innerHTML = h5calc.getLog().join(' + ');
    statusDisplay.innerHTML = '';
    singleBtn.disabled=false;
    doubleBtn.disabled=false;
  });
  h5calc.errAdd(function(){
    resultDisplay.innerHTML = h5calc.total();
    historyDisplay.innerHTML = h5calc.getLog().join(' + ');
    statusDisplay.innerHTML = '! try again';
    singleBtn.disabled=false;
    doubleBtn.disabled=false;
  });
});

/*
  lib
*/
function H5Calc(){
  //private
  var
  log=[],
  ready=true,
  fingers=5,
  add=function(f){
    if(typeof willAdd=='function')willAdd();
    ready = false;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange=function(){
      if (xhr.readyState==4){
        if(xhr.status==200){
          log.push(f);
          ready = true;
          if(typeof didAdd=='function')didAdd();
        }else{
          ready = true;
          if(typeof didAdd=='function')errAdd();
        }
      }
    }
    xhr.open("GET","http://www.httpbin.org/delay/1",true);
    xhr.send();
  },
  willAdd,didAdd,errAdd;
  //public
  this.single=function(){add(fingers);}
  this.double=function(){add(fingers*2);}
  this.getLog=function(){return log;}
  this.isReady=function(){return ready;}
  this.total=function(){
    var t=0;
    for(var k=0;k<log.length;k++){
      t+=log[k];
    }
    return t;
  }
  this.willAdd=function(f){willAdd=f}
  this.didAdd=function(f){didAdd=f}
  this.errAdd=function(f){errAdd=f}
  return this;
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
