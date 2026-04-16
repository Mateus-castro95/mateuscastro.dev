<script setup lang="ts">
defineProps<{ show?: boolean }>()
</script>

<template>
  <section class="relative h-screen w-full flex flex-col items-start justify-center px-6 md:px-24">
    <div class="max-w-4xl z-10">
      <!-- Título Impactante em Verde Limão -->
      <h1 class="text-4xl md:text-8xl font-black text-[#A3FF00] leading-none mb-6 uppercase tracking-tighter">
        Building brands <br />
        that stand out
      </h1>
      
      <!-- Descrição Refinada -->
      <p class="text-lg md:text-2xl text-white/80 max-w-2xl font-light leading-relaxed mb-10">
        We craft solid foundations for your brand with <span class="text-white font-medium">bold creativity</span> and <span class="text-white font-medium">innovative design</span>.
      </p>
      
      <!-- Botões de Ação -->
      <div class="flex flex-wrap gap-6 pt-4">
        <button class="px-10 py-5 bg-[#A3FF00] text-black font-extrabold uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(163,255,0,0.3)]">
          Let's collaborate
        </button>
        <button class="px-10 py-5 border-2 border-white/20 text-white font-extrabold uppercase tracking-widest hover:bg-white/10 hover:border-white transition-all duration-300">
          See our work
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Adicionando um leve brilho no texto para combinar com o 3D */
h1 {
  text-shadow: 0 0 30px rgba(163, 255, 0, 0.2);
}
</style>
