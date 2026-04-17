<template>
  <section id="services" class="relative z-10 w-full py-24 md:py-32 px-6 md:px-20 bg-[#090D15] flex flex-col justify-center min-h-screen shadow-[0_-20px_50px_rgba(0,0,0,0.8)] perspective-[1000px]">
    <!-- Gradiente subtil no fundo para dar profundidade -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"></div>

    <div class="max-w-7xl mx-auto w-full relative z-10 pl-0 md:pr-[100px]">
      
      <!-- Cabeçalho -->
      <div class="mb-16 md:mb-20">
        <!-- Wrappers overflow-hidden para o efeito máscara (Mask Reveal) -->
        <h2 class="font-bold text-white tracking-wide uppercase leading-none font-display mb-6">
          <div class="overflow-hidden">
            <span class="block text-[clamp(2.5rem,6vw,5.5rem)] gs-reveal">Como posso</span>
          </div>
          <div class="overflow-hidden mt-1">
            <span class="block text-[clamp(2.5rem,6vw,5.5rem)] text-slate-500 gs-reveal">te ajudar</span>
          </div>
        </h2>
        
        <div class="border-l-2 border-[#A3FF12]/30 pl-6 mt-8 overflow-hidden">
          <p class="text-slate-400 text-lg md:text-xl lg:text-2xl font-sans max-w-2xl leading-relaxed tracking-tight gs-reveal-sub">
            Soluções digitais pensadas para performance, escala e experiência do usuário.
          </p>
        </div>
      </div>
      
      <!-- Efeito de luz difusa no fundo para o vidro fosco distorcer (Glow) -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[60%] bg-gradient-to-r from-[#A3FF12]/5 via-blue-500/5 to-[#A3FF12]/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <!-- Grid de Cards de Serviço -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 relative z-10">
        
        <div 
          v-for="(service, index) in services" 
          :key="index"
          class="service-card group relative bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 flex flex-col overflow-hidden backdrop-blur-xl"
          @mousemove="(e) => handleMouseMove(e, index)"
          @mouseleave="() => handleMouseLeave(index)"
          :style="cardStyles[index]"
        >
          <!-- Reflexo de luz do hover no background do vidro -->
          <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <!-- Ícone Flutuante (Glassmorphism opaco) -->
          <div class="floating-icon relative w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-white/5 border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-2xl z-10">
            <component :is="service.icon" class="w-8 h-8 text-[#A3FF12]" />
            <!-- Brilho interno do vidro do ícone -->
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/5 via-transparent to-white/10 pointer-events-none"></div>
          </div>

          <!-- Textos -->
          <h3 class="text-white text-xl md:text-2xl font-bold font-sans mb-4 tracking-wide z-10">{{ service.title }}</h3>
          <p class="text-slate-300 font-sans leading-relaxed text-sm md:text-base flex-grow z-10">{{ service.description }}</p>
          
          <!-- Linha neon fina embaixo ao fazer hover -->
          <div class="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#A3FF12]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Box, Code2, MonitorSmartphone } from 'lucide-vue-next'

// Dados dos Serviços
const services = [
  {
    title: 'Experiências 3D interativas',
    description: 'Interfaces com animações e elementos 3D que tornam seu produto mais envolvente e memorável.',
    icon: Box
  },
  {
    title: 'Sistemas sob medida',
    description: 'Desenvolvimento de sistemas personalizados para automatizar processos, melhorar a gestão e escalar operações.',
    icon: Code2
  },
  {
    title: 'Aplicações web modernas',
    description: 'Criação de aplicações rápidas, responsivas e escaláveis, com foco em usabilidade e performance.',
    icon: MonitorSmartphone
  }
]

// Estado para armazenar a rotação 3D individual de cada card
const cardStyles = reactive(services.map(() => ({
  transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
})))

// Efeito 3D Tilt interativo com o mouse
const handleMouseMove = (e: MouseEvent, index: number) => {
  const card = e.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  
  // Calcula posição relativa (-0.5 a 0.5)
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  
  // Multiplicador de inclinação (quanto maior, mais inclina)
  const tiltX = -y * 12
  const tiltY = x * 12

  // Aplica o rotate 3D no CSS do card
  cardStyles[index].transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`
}

// Reseta o card para a posição original quando o mouse sai
const handleMouseLeave = (index: number) => {
  cardStyles[index].transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
}

onMounted(() => {
  // Configuração inicial das animações de entrada
  gsap.set('.gs-reveal', { yPercent: 100, opacity: 0 })
  gsap.set('.gs-reveal-sub', { x: -30, opacity: 0 })
  gsap.set('.service-card', { y: 60, opacity: 0, scale: 0.95 })

  // Trigger principal de entrada da seção
  ScrollTrigger.create({
    trigger: '#services',
    start: 'top 70%',
    onEnter: () => {
      // 1. Títulos
      gsap.to('.gs-reveal', {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out'
      })
      
      // 2. Subtítulo
      gsap.to('.gs-reveal-sub', {
        x: 0,
        opacity: 1,
        duration: 1.2,
        delay: 0.3,
        ease: 'power3.out'
      })

      // 3. Entrada dos Cards em cascata (Stagger effect)
      gsap.to('.service-card', {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.2, // Um card aparece a cada 0.2 segundos
        delay: 0.4,
        ease: 'back.out(1.2)' // Um leve "pop" no final
      })
    },
    once: true
  })

  // Animação de flutuação e rotação falsa 3D contínua para os ícones
  gsap.to('.floating-icon', {
    y: -12, // Sobe 12px
    rotateY: 15, // Gira 15 graus no eixo Y (simula uma moeda)
    rotationZ: 3, // Inclina levemente
    duration: 3.5, // Duração de uma ida
    repeat: -1, // Repetição infinita
    yoyo: true, // Efeito Vai e Volta
    ease: 'sine.inOut', // Suavidade nas pontas
    stagger: {
      each: 0.5, // Ícones sobem em momentos diferentes
      from: "random"
    }
  })
})
</script>

<style scoped>
.font-display {
  font-family: 'Changa One', sans-serif;
}

.font-sans {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.service-card {
  transform-style: preserve-3d;
  /* Transição rápida para acompanhar o mouse, mas suave o suficiente para não piscar */
  transition: transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease, border-color 0.3s ease;
}

.service-card:hover {
  border-color: rgba(163, 255, 18, 0.1);
  box-shadow: 0 20px 40px -5px rgba(0,0,0,0.6), 0 0 30px rgba(163,255,18,0.03);
}

.service-card:hover .floating-icon {
  /* No hover do card, o ícone "acende" mais forte */
  border-color: rgba(163, 255, 18, 0.4);
  box-shadow: 0 0 35px rgba(163, 255, 18, 0.2);
  transform: scale(1.05);
}
</style>
