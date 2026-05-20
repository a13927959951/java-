<template>
  <canvas ref="canvas" class="particle-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx = null
let animationId = null
let particles = []

class Particle {
  constructor(canvas) {
    this.canvas = canvas
    this.reset()
  }

  reset() {
    this.x = Math.random() * this.canvas.width
    this.y = Math.random() * this.canvas.height
    this.size = Math.random() * 3 + 1
    this.speedX = (Math.random() - 0.5) * 0.5
    this.speedY = (Math.random() - 0.5) * 0.5
    this.opacity = Math.random() * 0.5 + 0.2
    this.color = this.getRandomColor()
  }

  getRandomColor() {
    const colors = [
      'rgba(0, 102, 204, ',
      'rgba(0, 204, 102, ',
      'rgba(255, 102, 0, ',
      'rgba(124, 58, 237, ',
      'rgba(0, 170, 255, '
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY

    if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1
    if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = this.color + this.opacity + ')'
    ctx.fill()
  }
}

function initCanvas() {
  if (!canvas.value) return
  
  const container = canvas.value.parentElement
  canvas.value.width = container.clientWidth
  canvas.value.height = container.clientHeight
  
  ctx = canvas.value.getContext('2d')
  
  particles = []
  const particleCount = Math.floor((canvas.value.width * canvas.value.height) / 15000)
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas.value))
  }
}

function animate() {
  if (!ctx || !canvas.value) return
  
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  particles.forEach(particle => {
    particle.update()
    particle.draw(ctx)
  })
  
  drawConnections()
  
  animationId = requestAnimationFrame(animate)
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 120) {
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.strokeStyle = `rgba(0, 102, 204, ${0.15 * (1 - distance / 120)})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  }
}

function handleResize() {
  initCanvas()
}

onMounted(() => {
  initCanvas()
  animate()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
}
</style>