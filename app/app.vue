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
  <div class="bg-black min-h-screen text-white">
    <!-- Navegação Lateral -->
    <SideMenu />
    
    <main>
      <!-- Hero Section -->
      <HeroSection />
      
      <!-- Seção de Serviços / Como posso ajudar -->
      <ServicesSection />
      
      <!-- Outras seções virão aqui: About, Skills, Projects, etc. -->
      <div style="height: 100vh;"></div> <!-- Apenas para permitir scroll por enquanto -->
    </main>

    <!-- Footer pode vir aqui depois -->
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Changa+One&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

html, body {
  margin: 0;
  padding: 0;
  background-color: black;
  font-family: 'Changa One', sans-serif;
  overflow-x: hidden;
}

*, *::before, *::after {
  box-sizing: border-box;
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

.selection\:bg-indigo-500\/30 ::selection {
  background-color: rgba(99, 102, 241, 0.3);
}
</style>
