<template>
  <section id="hero" class="sticky top-0 z-0 w-full h-screen overflow-hidden bg-black selection:bg-indigo-500/30">
    <!-- Fundo 3D Spline (Exclusivo desta seção) -->
    <div class="absolute inset-0 z-0">
      <ClientOnly>
        <SplineHero />
      </ClientOnly>
    </div>

    <!-- Conteúdo da Seção -->
    <div class="relative z-10 w-full h-full pl-6 pr-[80px] md:pl-20 md:pr-[180px] flex flex-col justify-center items-start pointer-events-none">
      <div class="mt-4 md:mt-8 animate-fade-in max-w-[90%]">
        <h1 class="text-[clamp(1.5rem,7.5vw,10rem)] font-bold text-[#A3FF12] tracking-[0.1em] leading-none mb-6 font-display whitespace-nowrap uppercase">
          Mateus Castro
        </h1>
        <p class="text-xs sm:text-base md:text-lg lg:text-xl text-white/90 font-bold tracking-widest uppercase opacity-90 font-mono leading-relaxed">
          <span class="inline-block whitespace-nowrap mr-2">Desenvolvedor Full Stack |</span>
          <span class="inline-block whitespace-nowrap">Web Designer</span>
        </p>
        <div class="mt-16 md:mt-24 border-l-2 border-[#A3FF12] pl-6 max-w-lg animate-fade-in" style="animation-delay: 0.3s">
          <p class="text-slate-400 text-sm md:text-base lg:text-lg leading-[2.2] font-sans tracking-tight">
            Desenvolvo sistemas sob medida para empresas <br />
            <span class="text-[#A3FF12] font-bold uppercase tracking-wider mt-4 inline-block">Sites 3D, animações e interações imersivas</span>
          </p>
        </div>
      </div>
    </div>
    <!-- Indicador de Scroll -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce-slow opacity-100 hover:scale-110 transition-all duration-500 drop-shadow-[0_0_10px_rgba(163,255,18,0.6)]">
      <Mouse class="text-[#A3FF12] w-8 h-8 md:w-12 md:h-12" />
      <ChevronDown class="text-[#A3FF12] w-5 h-5 md:w-8 md:h-8 -mt-2" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { Mouse, ChevronDown } from 'lucide-vue-next'
// Nuxt faz o auto-import dos componentes locais, mas precisamos importar ícones da lib
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
  font-family: 'Changa One', sans-serif;
}

.font-sans {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.animate-bounce-slow {
  animation: bounceSlow 3s infinite ease-in-out;
}

@keyframes bounceSlow {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, 15px); }
}
</style>
