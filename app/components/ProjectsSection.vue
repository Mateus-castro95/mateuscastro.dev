<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context

const projects = [
  { 
    id: 1, 
    title: 'E-Commerce Platform', 
    category: 'Web Development', 
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop', 
    description: 'A modern e-commerce solution with high performance and seamless user experience.' 
  },
  { 
    id: 2, 
    title: 'Fintech Dashboard', 
    category: 'UI/UX Design', 
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop', 
    description: 'Analytics dashboard for a leading fintech startup with real-time data visualization.' 
  },
  { 
    id: 3, 
    title: 'Social App', 
    category: 'Mobile App', 
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop', 
    description: 'A responsive cross-platform mobile application connecting thousands of users.' 
  },
  { 
    id: 4, 
    title: 'Brand Identity', 
    category: 'Branding', 
    image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1200&auto=format&fit=crop', 
    description: 'Complete visual identity redesign for a corporate client, including print and digital.' 
  },
  { 
    id: 5, 
    title: 'AI Saas Landing', 
    category: 'Web Design', 
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop', 
    description: 'High-converting landing page for a next-generation artificial intelligence startup.' 
  },
]

// Quebra o título em spans por letra, agrupando palavras numa linha-wrapper com overflow:hidden
// "PROJETOS" e "RECENTES" ficam em linhas separadas, cada letra animável individualmente
const titleLines = [
  { text: 'PROJETOS', chars: 'PROJETOS'.split('') },
  { text: 'RECENTES', chars: 'RECENTES'.split('') },
]

// Palavras do subtítulo para stagger por palavra
const subtitleWords = 'Uma seleção dos meus projetos recentes, demonstrando minha experiência em desenvolvimento web e design.'.split(' ')

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  setTimeout(() => {
    ctx = gsap.context(() => {
      if (!sectionRef.value || !trackRef.value) return

      // ─── Animação de entrada: Split de letras + Stagger ───
      if (headerRef.value) {
        const chars = headerRef.value.querySelectorAll('.char')
        const subtitleSpans = headerRef.value.querySelectorAll('.word')

        // Estado inicial: cada letra abaixo (dentro do overflow:hidden do pai → invisível)
        gsap.set(chars, { yPercent: 110, opacity: 0, rotateX: -40 })
        gsap.set(subtitleSpans, { y: 18, opacity: 0 })

        const reset = () => {
          gsap.killTweensOf([chars, subtitleSpans])
          gsap.set(chars, { yPercent: 110, opacity: 0, rotateX: -40 })
          gsap.set(subtitleSpans, { y: 18, opacity: 0 })
        }

        ScrollTrigger.create({
          trigger: headerRef.value,
          start: 'top 90%',
          onEnter: () => {
            // Letras sobem com stagger lento, efeito suave e cinematográfico
            gsap.to(chars, {
              yPercent: 0,
              opacity: 1,
              rotateX: 0,
              duration: 1.4,
              stagger: 0.055,
              ease: 'expo.out',
            })
            // Palavras do subtítulo entram em cascata logo depois
            gsap.to(subtitleSpans, {
              y: 0,
              opacity: 1,
              duration: 1.0,
              stagger: 0.06,
              delay: 0.8,
              ease: 'power3.out',
            })
          },
          onLeaveBack: () => {
            // Reseta ao sair pela parte de cima → animação reproduz novamente na próxima entrada
            reset()
          }
        })
      }

      // ─── Scroll horizontal pinado ───
      const trackWidth = trackRef.value.scrollWidth
      const windowWidth = window.innerWidth
      const scrollDistance = trackWidth - windowWidth + (windowWidth * 0.1)

      if (trackWidth > windowWidth) {
        gsap.to(trackRef.value, {
          x: -scrollDistance,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'bottom bottom',
            end: () => `+=${scrollDistance}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          }
        })
      }
    }, sectionRef.value || undefined)
  }, 100)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <section id="projects" ref="sectionRef" class="bg-black text-white overflow-hidden py-20 md:py-32 relative z-10 w-full min-h-screen flex flex-col justify-center border-t border-white/5">
    
    <!-- Header com animação de entrada -->
    <div ref="headerRef" class="container mx-auto px-6 md:px-12 2xl:px-24 mb-16 md:mb-24">
      
      <!-- Título: cada letra é um span animável, dentro de um overflow-hidden por linha -->
      <h2 class="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wide leading-tight mb-6" aria-label="Projetos Recentes">
        <span 
          v-for="(line, lineIdx) in titleLines" 
          :key="lineIdx" 
          class="title-line block overflow-hidden"
        >
          <span
            v-for="(char, charIdx) in line.chars"
            :key="charIdx"
            class="char inline-block text-transparent bg-clip-text"
            :style="{
              backgroundImage: `linear-gradient(90deg, #ffffff ${charIdx * (100 / line.chars.length)}%, #9ca3af 100%)`,
              transformOrigin: 'bottom center',
              perspective: '600px'
            }"
          >{{ char }}</span>
        </span>
      </h2>

      <!-- Subtítulo: cada palavra é um span animável -->
      <div class="border-l-2 border-[#A3FF12] pl-6 mt-6 max-w-sm md:max-w-3xl">
        <p class="font-sans text-sm md:text-xl text-gray-400 font-light leading-relaxed" aria-label="Uma seleção dos meus projetos recentes, demonstrando minha experiência em desenvolvimento web e design.">
          <span 
            v-for="(word, i) in subtitleWords" 
            :key="i" 
            class="word inline-block mr-[0.3em]"
          >{{ word }}</span>
        </p>
      </div>
    </div>

    <!-- Pinned Scrolling Container -->
    <div class="flex overflow-visible pl-6 md:pl-12 2xl:pl-24 w-full relative">
      <!-- Track -->
      <div ref="trackRef" class="flex gap-8 md:gap-12 flex-nowrap w-max pr-[20vw]">
        
        <!-- Project Cards -->
        <div v-for="(project, index) in projects" :key="project.id" 
             class="group relative w-[85vw] sm:w-[65vw] md:w-[45vw] lg:w-[35vw] xl:w-[28vw] flex-shrink-0 rounded-[2rem] overflow-hidden bg-[#0A0A0A] border border-white/10 hover:border-[#A3FF12]/60 transition-all duration-700 cursor-pointer shadow-2xl shadow-black/50">
          
          <!-- Image -->
          <div class="relative w-full aspect-[4/3] overflow-hidden bg-zinc-900">
            <div class="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-40 transition-opacity duration-700"></div>
            <img :src="project.image" :alt="project.title" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" />
            
            <!-- Badge -->
            <div class="absolute top-6 right-6 z-20">
              <span class="px-4 py-2 rounded-full text-[10px] sm:text-xs font-sans font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-white uppercase tracking-[0.15em]">
                {{ project.category }}
              </span>
            </div>
          </div>
          
          <!-- Content -->
          <div class="p-8 md:p-10 font-sans flex flex-col relative z-20">
            <h3 class="text-3xl md:text-4xl font-normal mb-4 font-['Changa_One'] tracking-wider text-white group-hover:text-[#A3FF12] transition-colors duration-500">
              {{ project.title }}
            </h3>
            <p class="text-gray-400 text-sm md:text-base leading-relaxed mb-8 flex-grow font-light">
              {{ project.description }}
            </p>
            
            <div class="flex items-center text-sm md:text-base font-medium text-[#A3FF12] transition-colors duration-300 w-fit pb-1 border-b border-[#A3FF12]/40 group-hover:border-[#A3FF12]">
              <span class="mr-3 tracking-wide uppercase text-xs md:text-sm font-bold">Ver Projeto</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 transform group-hover:translate-x-2 transition-transform duration-500 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
          
          <!-- Glow effect -->
          <div class="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-[#A3FF12]/0 to-[#A3FF12]/0 group-hover:from-[#A3FF12]/15 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        </div>
        
      </div>
    </div>
  </section>
</template>


<style scoped>
/* Garante que as letras não quebrem linha inesperadamente */
.title-line {
  white-space: nowrap;
}

.char {
  will-change: transform, opacity;
  display: inline-block;
}

.word {
  will-change: transform, opacity;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
