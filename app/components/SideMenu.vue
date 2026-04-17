<template>
  <div class="fixed right-4 md:right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4 md:gap-8 pointer-events-auto">
    <!-- Linha de Fundo (Inativa) -->
    <div class="absolute top-4 bottom-4 w-[2px] bg-white/20 left-1/2 -translate-x-1/2 -z-10 rounded-full"></div>
    
    <!-- Linha Ativa (Progresso - será controlada pelo GSAP futuramente) -->
    <!-- Por enquanto deixei com 15% apenas para ilustrar visualmente o preenchimento -->
    <div class="absolute top-4 w-[2px] bg-[#A3FF12] left-1/2 -translate-x-1/2 -z-10 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(163,255,18,0.5)]" style="height: 15%;"></div>

    <!-- Itens do Menu -->
    <div v-for="(item, index) in menuItems" :key="index" class="relative group cursor-pointer flex items-center justify-center">
      
      <!-- Tooltip com o nome da seção -->
      <div class="absolute right-14 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 bg-black/90 px-3 py-1.5 rounded-md border border-white/10 text-xs font-sans uppercase tracking-wider text-white whitespace-nowrap pointer-events-none backdrop-blur-md">
        {{ item.name }}
      </div>

      <!-- Ícone -->
      <div 
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 bg-black"
        :class="index === 0 
          ? 'border-[#A3FF12] text-[#A3FF12] shadow-[0_0_15px_rgba(163,255,18,0.4)] scale-110' 
          : 'border-transparent text-slate-400 hover:text-white hover:scale-110'"
      >
        <component :is="item.icon" class="w-5 h-5" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Rocket, Blocks, GalleryHorizontalEnd, Award, Workflow, Send } from 'lucide-vue-next'

const menuItems = [
  { name: '01. Início', icon: Rocket },
  { name: '02. Como Posso Ajudar', icon: Blocks },
  { name: '03. Projetos', icon: GalleryHorizontalEnd },
  { name: '04. Diferenciais', icon: Award },
  { name: '05. Processo', icon: Workflow },
  { name: '06. Contato', icon: Send }
]
</script>
