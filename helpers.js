// From: https://stackoverflow.com/a/15618028/13438741
function whichTransitionEvent(){
  var t;
  var el = document.createElement('fakeelement');
  var transitions = {
    'transition':'transitionend',
    'OTransition':'oTransitionEnd',
    'MozTransition':'transitionend',
    'WebkitTransition':'webkitTransitionEnd'
  }

  for(t in transitions){
      if( el.style[t] !== undefined ){
          return transitions[t];
      }
  }
}

function DEBUG_drawRect(rect) {
  // DEBUG draw a rectangle around the element
  // remove all debug ercts
  const debugRects = document.querySelectorAll('.debug-rect')
  debugRects.forEach((rect) => rect.remove())

  const div = document.createElement('div')
  div.classList.add('debug-rect')
  div.style.position = 'absolute'
  div.style.width = `${rect.width}px`
  div.style.height = `${rect.height}px`
  div.style.left = `${rect.left}px`
  div.style.top = `${rect.top}px`
  div.style.border = '1px solid red'

  document.body.appendChild(div)
}