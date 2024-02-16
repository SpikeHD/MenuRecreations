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

    span.addEventListener('mouseenter', onMenuItemHover)
    span.addEventListener('mouseleave', onMenuItemExit)
  })
});

function onMenuItemHover(e) {
  const target = e.target
  
  // Set the scale to be whatever it is + 0.5
  target.style.transform = target.style.transform + ' scale(1.5)'

  // Set the zindex to be 3
  target.style.zIndex = 3
}

function onMenuItemExit(e) {
  const target = e.target
  target.style.transform = target.style.transform.replace(' scale(1.5)', '')

  // Remove the zindex
  target.style.zIndex = 1
}