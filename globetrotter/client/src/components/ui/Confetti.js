import confetti from 'canvas-confetti'

/**
 * Fires a celebratory burst of confetti in our theme colors
 */
export function fireCelebrationConfetti(origin = { x: 0.5, y: 0.6 }) {
  const colors = ['#3b72de', '#5b8a83', '#a5d2c1', '#f5a97f', '#ee8c5e']

  confetti({
    particleCount: 40,
    spread: 60,
    origin,
    colors,
    ticks: 200,
    gravity: 1.2,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['circle', 'square'],
    scalar: 0.9,
  })
}

export function fireTripCopiedConfetti() {
  const end = Date.now() + 1000
  const colors = ['#3b72de', '#79b4a9', '#f5a97f']

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }
  frame()
}
