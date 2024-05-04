document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.button')
  const copyright = document.querySelector('#bottom-right')

  copyright.addEventListener('click', () => {
    window.open('attributions.txt', '_blank')
  })

  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      const img = button.querySelector('img')
      img.src = 'assets/mc_selected.png'
    })

    button.addEventListener('mouseleave', () => {
      const img = button.querySelector('img')
      img.src = 'assets/mc_button.png'
    })

    button.addEventListener('click', () => {
      // play the click noise
      const audio = new Audio('sound/button.mp3')
      audio.play()
    })
  })

  doLoadingBar()
})

function doLoadingBar() {
  const bar = document.querySelector('#loading-bar')
  const progress = document.querySelector('#loading-bar-fill')
  let pctPerSecond = 10
  let pct = 0

  // until we hit >= 100%, fill the bar and randomly change the rate at which it changes
  const interval = setInterval(() => {
    if (pct >= 100) {
      clearInterval(interval)
      bar.style.display = 'none'
      removeLoadingScreen()
      return
    }

    if (pct + pctPerSecond > 100) {
      pct = 100
    } else {
      pct += pctPerSecond
    }

    progress.style.width = `${pct}%`

    if (Math.random() > 0.5) {
      pctPerSecond = Math.floor(Math.random() * 20)
    }
  }, 200)
}

function removeLoadingScreen() {
  const screen = document.querySelector('#mojang-load')
  screen.style.opacity = 0

  setTimeout(() => {
    screen.style.display = 'none'
  }, 1000)
}