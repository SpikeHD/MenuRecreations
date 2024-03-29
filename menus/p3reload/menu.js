let highlightIdx = -1

document.addEventListener('DOMContentLoaded', function() {
  const spans = document.querySelectorAll('#main-inner span')
  spans.forEach((span, index) => {
    const rotation = Number(span.getAttribute('data-rot'))
    const extraSkew = Number(span.getAttribute('data-extra-skew'))
    const xOffset = Number(span.getAttribute('data-x-offset'))
    const yOffset = Number(span.getAttribute('data-y-offset'))
    const scaleOffsetX = Number(span.getAttribute('data-scale-x-offset'))
    const scaleOffsetY = Number(span.getAttribute('data-scale-y-offset'))

    span.style.transform = `rotate(${rotation/3}deg) skewY(${(rotation/1.2) + -extraSkew}deg) translateX(${xOffset}px) translateY(${yOffset}px) scale(${0.9 + scaleOffsetX}, ${1 + scaleOffsetY})`

    span.addEventListener('mouseenter', (e) => onMenuItemHover(e, index))
    span.addEventListener('mouseleave', (e) => onMenuItemExit(e, index))
    span.addEventListener('click', (e) => playMenuSelect())
  })
});

function onMenuItemHover(e, idx) {
  const itemNum = document.getElementById('item-num')
  const target = e.target
  
  // Set the highlight position BEFORE we do anything else
  if (highlightIdx !== idx) {
    setHighlightPos(idx)
    highlightIdx = idx
  }
  
  // Set the scale to be whatever it is + 0.5
  target.style.transform = target.style.transform + ' scale(1.5)'

  // Set the zindex to be 3
  target.classList.add('menu-hover')

  // Set the item number
  itemNum.innerText = (idx + 1).toString().padStart(2, '0')

  playMenuHighlight()
}

function onMenuItemExit(e, idx) {
  const target = e.target
  target.style.transform = target.style.transform.replace(' scale(1.5)', '')

  // Remove the zindex
  target.classList.remove('menu-hover')

  highlightIdx = -1

  // Hide the highlight
  const highlight = document.getElementById('menu-item-highlight')
  const redHighlight = document.getElementById('menu-item-highlight-red')
  const redHightlightAbove = document.getElementById('menu-item-highlight-red-above')
  highlight.style.left = '-9999px'
  redHighlight.style.left = '-9999px'
  redHightlightAbove.style.left = '-9999px'
}

function setHighlightPos(idx) {
  // Argument is the element we are positioning with
  const scale = 1.2
  const elm = document.querySelectorAll('#main-inner span')[idx]
  const highlight = document.getElementById('menu-item-highlight')
  const redHighlight = document.getElementById('menu-item-highlight-red')
  const redHightlightAbove = document.getElementById('menu-item-highlight-red-above')
  const rect = elm.getBoundingClientRect()

  // DEBUG_drawRect(rect)
  
  // Calculate width based on amount of characters
  const text = elm.innerText
  const fontSize = window.getComputedStyle(elm).fontSize
  const width = text.length * parseFloat(fontSize) * scale

  highlight.style.width = `${width * 0.8}px`
  redHighlight.style.width = `${width * 0.8}px`
  redHightlightAbove.style.width = `${width * 0.8}px`

  // Ensure we are in the center of the rect
  const highlightRect = highlight.getBoundingClientRect()
  const x = (rect.left + (rect.width / 2) - (highlightRect.width / 2)) + 50
  const y = ((rect.top + (rect.height / 2) - (highlightRect.height / 2)) / scale) + 50
  
  highlight.style.left = `${x}px`
  highlight.style.top = `${y}px`
  redHighlight.style.left = `${x}px`
  redHighlight.style.top = `${y}px`
  redHightlightAbove.style.left = `${x}px`
  redHightlightAbove.style.top = `${y}px`

  // Apply the same rotation and skew to the highlight
  const rotation = Number(elm.getAttribute('data-rot'))
  const extraSkew = Number(elm.getAttribute('data-extra-skew'))

  // Depending on how sharp the angle is, also move down the highlight
  const offsetY = (highlightRect.height / 4) * scale

  highlight.style.transform = `rotate(${rotation/3}deg) skewY(${(rotation/1.2) + -extraSkew}deg) translateY(${offsetY}px)`
  redHighlight.style.transform = `rotate(${(rotation/3) + 2}deg) skewY(${(rotation/1.2) + -extraSkew}deg) translateY(${offsetY}px)`
  redHightlightAbove.style.transform = `rotate(${(rotation/3) + 2}deg) skewY(${(rotation/1.2) + -extraSkew}deg) translateY(${offsetY}px)`
}