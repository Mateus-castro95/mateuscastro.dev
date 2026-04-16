<script setup lang="ts">
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const hasEntered = ref(false)

const handleEnter = () => {
  hasEntered.value = true
}

onMounted(() => {
  const lenis = new Lenis()
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => { lenis.raf(time * 1000) })
  gsap.ticker.lagSmoothing(0)
})
</script>

<template>
  <div class="relative min-h-screen text-white overflow-hidden">
    <!-- 3D Canvas -->
    <div class="fixed inset-0 z-0">
      <ClientOnly>
        <ThreeScene :start-animation="hasEntered" />
      </ClientOnly>
    </div>

    <!-- Preloader (on top) -->
    <AppPreloader @enter="handleEnter" />

    <!-- UI -->
    <Transition name="fade-ui">
      <div v-if="hasEntered" class="relative z-20">
        <TheHeader />
        <TheSides />
        <main class="w-full overflow-x-hidden">
          <SectionsHeroSection :show="hasEntered" />
        </main>
      </div>
    </Transition>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Iceland&family=Inter:wght@400;700;900&display=swap');

*, *::before, *::after { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  background: #030708;
  color: white;
  overflow-x: hidden;
  font-family: 'Iceland', sans-serif;
}

.grid-bg {
  background-color: #030708;
  background-image:
    radial-gradient(circle, rgba(0,242,255,0.18) 1px, transparent 1px);
  background-size: 40px 40px;
}

.fade-ui-enter-active { transition: opacity 2s ease; }
.fade-ui-enter-from  { opacity: 0; }

::selection { background: #00F2FF; color: #030708; }
</style>
