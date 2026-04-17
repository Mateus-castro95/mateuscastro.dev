<template>
  <div class="fixed inset-0 pointer-events-none z-50">
    
    <!-- === MODO NORMAL (Desktop ou Hero) === -->
    <!-- Linha de Fundo Reta -->
    <div 
      class="menu-line-bg bg-white/20 rounded-full transition-opacity duration-500"
      :class="isSnakeMode ? 'opacity-0' : 'opacity-100'"
    ></div>
    <!-- Linha Ativa (Neon) Reta -->
    <div 
      class="menu-line-active bg-[#A3FF12] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(163,255,18,0.5)]" 
      :style="{ height: mobileProgressHeight }"
      :class="isSnakeMode ? 'opacity-0' : 'opacity-100'"
    ></div>

    <!-- === MODO SNAKE (Curvo no Mobile) === -->
    <!-- SVG Desenhando a curva exata atrás dos botões conectando eles -->
    <svg class="fixed top-0 right-0 w-[320px] h-[320px] pointer-events-none transition-opacity duration-500 z-[-10]" :class="isSnakeMode ? 'opacity-100' : 'opacity-0'">
      <!-- Linha Inativa Curva -->
      <path d="M 50 40 L 160 40 Q 284 40 284 164 L 284 260" stroke="rgba(255,255,255,0.2)" stroke-width="2" fill="none" stroke-linecap="round" />
      
      <!-- Linha Ativa Neon Curva (Preenche dinamicamente) -->
      <path 
        d="M 50 40 L 160 40 Q 284 40 284 164 L 284 260" 
        stroke="#A3FF12" 
        stroke-width="2" 
        fill="none" 
        stroke-linecap="round" 
        pathLength="100" 
        stroke-dasharray="100" 
        :stroke-dashoffset="100 - snakeProgress" 
        style="filter: drop-shadow(0 0 5px rgba(163,255,18,0.5)); transition: stroke-dashoffset 0.6s cubic-bezier(0.34, 1.2, 0.64, 1);" 
      />
    </svg>

    <!-- Itens do Menu -->
    <div 
      v-for="(item, index) in menuItems" 
      :key="index" 
      @click="scrollTo(item.id)"
      class="menu-item pointer-events-auto group cursor-pointer flex items-center justify-center"
      :class="[`item-${index}`, { 'snake-active': isSnakeMode }]"
      :style="{ '--index': index }"
    >
      
      <!-- Tooltip com o nome da seção -->
      <div class="absolute right-14 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 bg-black/90 px-3 py-1.5 rounded-md border border-white/10 text-xs font-sans uppercase tracking-wider text-white whitespace-nowrap pointer-events-none backdrop-blur-md">
        {{ item.name }}
      </div>

      <!-- Ícone -->
      <div 
        class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 bg-black"
        :class="activeIndex >= index 
          ? 'border-[#A3FF12] text-[#A3FF12] shadow-[0_0_15px_rgba(163,255,18,0.4)] scale-110' 
          : 'border-transparent text-slate-400 hover:text-white hover:scale-110'"
      >
        <component :is="item.icon" class="w-5 h-5" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Rocket, Blocks, GalleryHorizontalEnd, Award, Workflow, Send } from 'lucide-vue-next'
import { useWindowSize } from '@vueuse/core'

const activeIndex = ref(0)
const { width } = useWindowSize()

// Condição para ativar o modo cobrinha (Apenas mobile e apenas se não estiver no inicio)
const isSnakeMode = computed(() => {
  return width.value < 768 && activeIndex.value > 0
})

const menuItems = [
  { name: '01. Início', icon: Rocket, id: 'hero' },
  { name: '02. Como Posso Ajudar', icon: Blocks, id: 'services' },
  { name: '03. Projetos', icon: GalleryHorizontalEnd, id: 'projects' },
  { name: '04. Diferenciais', icon: Award, id: 'differentials' },
  { name: '05. Processo', icon: Workflow, id: 'process' },
  { name: '06. Contato', icon: Send, id: 'contact' }
]

// Progresso para preencher a linha (0 a 100)
const snakeProgress = computed(() => {
  if (menuItems.length <= 1) return 0
  return (activeIndex.value / (menuItems.length - 1)) * 100
})

// Altura da linha no modo vertical (Desktop ou Hero Mobile)
const mobileProgressHeight = computed(() => {
  const totalHeight = width.value < 768 ? 280 : 360
  return `${(snakeProgress.value / 100) * totalHeight}px`
})

// Função de rolagem suave (funciona bem com o Lenis que já está no app.vue)
const scrollTo = (id: string) => {
  if (!id) return
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// Observa as seções para atualizar o activeIndex
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    // Pegamos a seção que está mais visível na tela
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
        const index = menuItems.findIndex(item => item.id === entry.target.id)
        if (index !== -1) {
          activeIndex.value = index
        }
      }
    })
  }, { 
    threshold: 0.3, // Dispara quando 30% da seção está visível
    rootMargin: "-20% 0px -20% 0px" // Ajuste para o meio da tela ser o foco
  })

  // Registra as seções existentes no DOM
  menuItems.forEach(item => {
    if (item.id) {
      const el = document.getElementById(item.id)
      if (el) observer?.observe(el)
    }
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
/* LINHAS VERTICAIS (Fundo e Neon) */
.menu-line-bg, .menu-line-active {
  position: fixed;
  width: 2px;
  right: 35px; /* 16px (margem) + 20px (meio do icone) - 1px (meio da linha) */
  top: calc(50% - 140px); /* Começa do centro do primeiro ícone (index 0) */
  height: 280px; /* Distância entre o primeiro e o último ícone (5 gaps de 56px) */
  z-index: -10;
}

.menu-line-active {
  height: 0px; /* Controlado via Vue :style */
}

@media (min-width: 768px) {
  .menu-line-bg, .menu-line-active {
    right: 59px; /* 40px + 20px - 1px */
    top: calc(50% - 180px);
    height: 360px;
  }
}

/* ITENS DO MENU (Layout fixo com transição) */
.menu-item {
  position: fixed;
  /* Topo centralizado verticalmente com offset do índice. Gap mobile: 56px */
  /* Diminuímos 20px para alinhar o centro exato do ícone que tem 40px de altura */
  top: calc(50% + ((var(--index) - 2.5) * 56px) - 20px); 
  right: 16px;
  
  /* Efeito cascata e curva suave com cubic-bezier */
  transition: top 0.6s cubic-bezier(0.34, 1.2, 0.64, 1), 
              right 0.6s cubic-bezier(0.34, 1.2, 0.64, 1);
              
  /* O delay baseado no índice cria o efeito cascata/cobrinha (um ícone segue o outro) */
  transition-delay: calc(var(--index) * 0.04s);
}

@media (min-width: 768px) {
  .menu-item {
    top: calc(50% + ((var(--index) - 2.5) * 72px) - 20px);
    right: 40px;
  }
}

/* 🐍 SNAKE MODE: Arco com Maior Espaçamento (Apenas Mobile < 768px) 🐍 */
@media (max-width: 767px) {
  /* Alinhados perfeitamente com a curva SVG (Path: M 50 40 L 160 40 Q 284 40 284 164 L 284 260) */
  .menu-item.snake-active.item-0 { top: 20px; right: 250px; }
  .menu-item.snake-active.item-1 { top: 20px; right: 170px; }
  
  .menu-item.snake-active.item-2 { top: 28px; right: 86px; }
  .menu-item.snake-active.item-3 { top: 90px; right: 24px; }
  
  .menu-item.snake-active.item-4 { top: 160px; right: 16px; }
  .menu-item.snake-active.item-5 { top: 240px; right: 16px; }
}
</style>
