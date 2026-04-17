<template>
  <section id="hero" class="relative w-full h-screen overflow-hidden bg-black selection:bg-indigo-500/30">
    <!-- Fundo 3D Spline (Exclusivo desta seção) -->
    <div class="absolute inset-0 z-0">
      <ClientOnly>
        <SplineHero />
      </ClientOnly>
    </div>

    <!-- Conteúdo da Seção -->
    <div class="relative z-10 w-full h-full p-8 md:p-16 flex flex-col justify-start items-start pointer-events-none">
      <div class="mt-4 md:mt-8 animate-fade-in">
        <h1 class="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-none mb-2 font-display">
          MATEUS CASTRO
        </h1>
        <p class="text-lg md:text-xl text-indigo-400 font-medium tracking-wide uppercase opacity-90 font-mono">
          Desenvolvedor Full Stack <span class="text-white/20 mx-2">|</span> Web Designer
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Nuxt 3 faz o auto-import dos componentes, então SplineHero já estará disponível
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1.2s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.font-display {
  font-family: 'Outfit', sans-serif;
}
</style>
