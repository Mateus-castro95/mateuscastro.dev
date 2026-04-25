<template>
  <section id="services" class="services-section relative z-10 w-full pt-16 md:pt-32 pb-16 md:pb-0 px-4 sm:px-6 md:px-20 flex flex-col justify-start overflow-hidden shadow-[0_-30px_60px_rgba(0,0,0,0.8)]">
    
    <!-- Background Color with Fade-in (Narrower) -->
    <div class="absolute inset-0 bg-[#1E2229] pointer-events-none" style="mask-image: linear-gradient(to bottom, transparent, black 80px); -webkit-mask-image: linear-gradient(to bottom, transparent, black 80px);"></div>

    <!-- Blur Transition Layer (Narrower) -->
    <div class="absolute top-0 left-0 w-full h-24 backdrop-blur-xl pointer-events-none z-20" style="mask-image: linear-gradient(to bottom, black, transparent); -webkit-mask-image: linear-gradient(to bottom, black, transparent);"></div>
    
    <!-- Gradiente de transição no topo adicional (Narrower) -->
    <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-10"></div>
    
    <!-- Grain/Noise Overlay -->

    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Subtle Grid Pattern -->
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50"></div>
      <div class="absolute inset-0" style="background-image: radial-gradient(rgba(163, 255, 18, 0.03) 1px, transparent 1px); background-size: 40px 40px;"></div>
      
      <!-- Dynamic Glow Meshes -->
      <div class="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#A3FF12]/10 blur-[120px] rounded-full animate-pulse"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
    </div>

    <div class="max-w-7xl mx-auto w-full relative z-10">
      
      <!-- Cabeçalho Editorial -->
      <div class="mb-10 sm:mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div class="max-w-3xl">
          <div class="flex items-center gap-4 mb-8 gs-reveal-sub">
            <div class="w-12 h-[1px] bg-[#A3FF12]"></div>
            <span class="text-[#A3FF12] font-mono text-sm tracking-[0.3em] uppercase">ALTA PERFORMANCE</span>
          </div>
          
          <h2 class="text-white tracking-tighter leading-[0.9] font-display uppercase">
            <div class="overflow-hidden">
              <span class="block text-[clamp(1.5rem,11vw,8rem)] whitespace-nowrap gs-reveal">Como posso</span>
            </div>
            <div class="overflow-hidden">
              <span class="block text-[clamp(1.5rem,11vw,8rem)] whitespace-nowrap text-transparent stroke-text gs-reveal italic">te ajudar</span>
            </div>
          </h2>
        </div>


      </div>
      
      <!-- Grid de Cards de Serviço (Asymmetric Feel) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 cards-grid">
        
        <div 
          v-for="(service, index) in services" 
          :key="index"
          :class="[
            'service-card relative bg-[#12151A] border border-white/5 rounded-[32px] p-6 sm:p-8 md:p-10 flex flex-col h-[480px] sm:h-[560px] md:h-[650px] overflow-hidden shadow-2xl',
            index === 1 ? 'z-20' : 'z-10'
          ]"
          :style="isMobile ? {} : cardStyles[index]"
        >
          <!-- Internal Glass Effect -->
          <div class="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"></div>

          <!-- Textos no Topo -->
          <div class="z-10">
            <h3 class="text-white text-2xl md:text-3xl font-bold font-sans mb-8 tracking-tight leading-tight uppercase whitespace-pre-line">
              {{ service.title }}
            </h3>
            <p class="text-slate-400 font-sans leading-relaxed text-xs md:text-sm">
              {{ service.description }}
            </p>
          </div>

          <!-- Impact Box (Destaque Neon) -->
          <div class="mt-12 z-10 bg-[#A3FF12]/5 rounded-xl p-5 border border-[#A3FF12]/40 shadow-[0_0_20px_rgba(163,255,18,0.15)] backdrop-blur-sm">
             <span class="block text-xs font-mono text-[#A3FF12] mb-1 tracking-wider uppercase opacity-90">Impacto Direto:</span>
             <span class="block text-[#A3FF12] text-sm md:text-base font-sans font-medium">{{ service.impact }}</span>
          </div>


        </div>

      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'


const isMobile = ref(false)

// Dados dos Serviços
const services = [
  {
    title: 'Experiências 3D Interativas',
    description: 'Sites com elementos 3D e animações que prendem a atenção, aumentam o tempo de permanência e tornam sua marca memorável.',
    impact: 'Mais engajamento, mais interesse e maior conversão de visitantes em clientes.'
  },
  {
    title: 'Sistemas De Alta-Performance',
    description: 'Sistemas rápidos, seguros e escaláveis que automatizam processos e eliminam gargalos no seu negócio.',
    impact: 'Mais eficiência, redução de custos e aumento da capacidade de crescimento.'
  },
  {
    title: 'Design Criativo\n& Web',
    description: 'Sites modernos e estratégicos, pensados para guiar o usuário e transformar visitas em oportunidades reais.',
    impact: 'Mais leads, mais clientes e aumento direto nas vendas.'
  }
]

// Função para obter o transform inicial baseado na posição do card
const getInitialTransform = (index: number) => {
  // Rotação fixa para a esquerda em todos os cards (simulando a referência)
  const tilt = 'rotateZ(-5deg)'
  
  // Cards posicionados para que o ícone gigante na base seja parcialmente exibido antes do corte da section (h-1050px)
  if (index === 0) return `perspective(1200px) translate3d(0, 100px, 0) ${tilt} scale3d(0.9, 0.9, 0.9)`
  if (index === 1) return `perspective(1200px) translate3d(0, 0px, 0) ${tilt} scale3d(1.1, 1.1, 1.1)`
  if (index === 2) return `perspective(1200px) translate3d(0, 100px, 0) ${tilt} scale3d(0.9, 0.9, 0.9)`
  
  return `perspective(1200px) ${tilt} scale3d(1, 1, 1)`
}

// Estado para armazenar a rotação 3D individual de cada card
const cardStyles = reactive(services.map((_, index) => ({
  transform: getInitialTransform(index)
})))

onMounted(() => {
  // Detecta mobile e atualiza ao redimensionar
  const checkMobile = () => { isMobile.value = window.innerWidth < 1289 }
  checkMobile()
  window.addEventListener('resize', checkMobile)

  gsap.registerPlugin(ScrollTrigger)

  const isDesktop = window.innerWidth >= 1289

  // Helper para definir o estado inicial (invisível)
  const resetElements = () => {
    gsap.set('.gs-reveal', { yPercent: 100, opacity: 0 })
    gsap.set('.gs-reveal-sub', { y: 20, opacity: 0 })
    gsap.set('.service-card', { y: 80, opacity: 0 })
  }

  resetElements()

  // Trigger para títulos e badge (compartilhado)
  ScrollTrigger.create({
    trigger: '#services',
    start: 'top 75%',
    end: 'top 10%',
    onEnter: () => {
      gsap.to('.gs-reveal', {
        yPercent: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.1,
        ease: 'expo.out'
      })
      gsap.to('.gs-reveal-sub', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        delay: 0.4,
        stagger: 0.2,
        ease: 'power3.out'
      })

      // Desktop: todos os cards animam juntos com o trigger da seção
      if (isDesktop) {
        gsap.to('.service-card', {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          delay: 0.6,
          ease: 'power4.out'
        })
      }
    },
    onLeaveBack: () => {
      resetElements()
    }
  })

  // Mobile/Tablet: cada card tem seu próprio scroll trigger individual
  if (!isDesktop) {
    const cards = document.querySelectorAll('.service-card')
    cards.forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 88%',
        end: 'top 40%',
        once: false,
        onEnter: () => {
          // Slide-up + fade mais suave e demorado
          gsap.to(card, {
            y: 0,
            opacity: 1,
            duration: 1.3,
            delay: i * 0.20,
            ease: 'expo.out'
          })

          // Glow pulse na borda — aparece e desaparece
          gsap.fromTo(card, 
            { boxShadow: '0 0 0px rgba(163, 255, 18, 0)' },
            { 
              boxShadow: '0 0 25px rgba(163, 255, 18, 0.25), inset 0 0 25px rgba(163, 255, 18, 0.05)',
              duration: 0.8,
              delay: i * 0.18 + 0.5,
              ease: 'power2.out',
              yoyo: true,
              repeat: 1
            }
          )
        },
        onLeaveBack: () => {
          gsap.to(card, {
            y: 80,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in'
          })
        }
      })
    })
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Changa+One:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;600;700&family=Outfit:wght@300;400;600&display=swap');

.font-display {
  font-family: 'Changa One', sans-serif;
}

.font-sans {
  font-family: 'Outfit', sans-serif;
}

.stroke-text {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
  text-shadow: none;
}

.noise-bg {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

/* Desktop (≥1289px): altura fixa + overflow hidden para o efeito de corte dos cards */
@media (min-width: 1289px) {
  .services-section {
    height: 1050px;
    padding-bottom: 0;
    overflow: hidden;
  }
}

/* Tablet/Medium (768px–1288px): cards horizontais, 1 por linha */
@media (min-width: 768px) and (max-width: 1288px) {
  .services-section {
    padding-bottom: 80px;
  }

  .cards-grid {
    grid-template-columns: 1fr !important;
    gap: 20px;
  }

  .service-card {
    height: auto !important;
    min-height: 180px;
    flex-direction: row !important;
    align-items: center;
    gap: clamp(16px, 3vw, 32px);
    transform: none !important;
    padding: clamp(20px, 3vw, 28px) clamp(20px, 3vw, 36px) !important;
  }

  .service-card .z-10:first-of-type {
    flex: 1;
    min-width: 0;
  }

  .service-card .z-10:first-of-type h3 {
    font-size: clamp(0.85rem, 1.5vw, 1.15rem);
    margin-bottom: 6px !important;
    white-space: normal !important;
    line-height: 1.25;
  }

  .service-card .z-10:first-of-type p {
    font-size: clamp(0.65rem, 1.1vw, 0.8rem);
    line-height: 1.5;
  }

  .service-card .mt-12 {
    margin-top: 0 !important;
    flex-shrink: 0;
    width: clamp(180px, 22vw, 260px);
  }

  .service-card .mt-12 span:first-child {
    font-size: clamp(0.6rem, 0.9vw, 0.75rem);
  }

  .service-card .mt-12 span:last-child {
    font-size: clamp(0.7rem, 1.1vw, 0.875rem);
  }
}

.service-card {
  transform-style: preserve-3d;
  transition: transform 0.2s cubic-bezier(0.2, 0, 0.2, 1), border-color 0.4s ease, background-color 0.4s ease;
}

/* Abaixo de 1289px, remove transforms 3D */
@media (max-width: 1288px) {
  .service-card {
    transform: none !important;
  }
}

/* Mobile (≤767px): card height auto para remover espaço vazio */
@media (max-width: 767px) {
  .service-card {
    height: auto !important;
    padding: 24px !important;
  }

  .service-card .mt-12 {
    margin-top: 24px !important;
  }
}



@keyframes pulse {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.15; transform: scale(1.1); }
}

.animate-pulse {
  animation: pulse 8s infinite ease-in-out;
}
</style>

