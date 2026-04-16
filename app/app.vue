<script setup lang="ts">
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  const lenis = new Lenis()
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => { lenis.raf(time * 1000) })
  gsap.ticker.lagSmoothing(0)
})
</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden bg-black">
    <!-- Exatamente apenas o fundo 3D Spline, e absolutamente mais nada -->
    <div class="absolute inset-0 z-0">
      <ClientOnly>
        <SplineHero />
      </ClientOnly>
    </div>
  </div>
</template>

<style>
/* Reset absoluto */
*, *::before, *::after { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* Tenta remover a marca d'água do Spline globalmente */
#spline-logo, 
a[href*="spline.design"], 
[class*="spline-watermark"],
[id*="spline-watermark"] {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
}
</style>
