<template>
  <section id="hero" class="sticky top-0 z-0 w-full h-screen overflow-hidden bg-black selection:bg-indigo-500/30">
    <!-- Fundo 3D Spline (Exclusivo desta seção) -->
    <div class="absolute inset-0 z-0">
      <ClientOnly>
        <SplineHero @loaded="startHeroAnimation" />
      </ClientOnly>
    </div>

    <!-- Conteúdo da Seção -->
    <div class="relative z-10 w-full h-full">
      <div class="max-w-[1440px] mx-auto w-full h-full px-6 md:pl-16 md:pr-[120px] lg:pl-20 lg:pr-[140px] xl:pl-24 xl:pr-[160px] flex flex-col justify-center items-start pointer-events-none">
      <div class="mt-4 md:mt-8 max-w-[90%]">
        <h1 ref="titleRef" class="text-[clamp(1.5rem,7.5vw,10rem)] font-bold text-[#A3FF12] tracking-[0.1em] leading-none mb-6 font-display whitespace-nowrap uppercase">
          Mateus Castro
        </h1>
        <p :class="['text-xs sm:text-base md:text-lg lg:text-xl text-white/90 font-bold tracking-widest uppercase font-mono leading-relaxed opacity-0', isLoaded ? 'animate-fade-in' : '']" style="animation-delay: 0.8s; animation-fill-mode: both;">
          <span class="inline-block whitespace-nowrap mr-2">Desenvolvedor Full Stack |</span>
          <span class="inline-block whitespace-nowrap">Web Designer</span>
        </p>
        <div :class="['mt-16 md:mt-24 border-l-2 border-[#A3FF12] pl-6 max-w-lg opacity-0', isLoaded ? 'animate-fade-in' : '']" style="animation-delay: 0.3s">
          <p class="text-slate-400 text-sm md:text-base lg:text-lg leading-[2.2] font-sans tracking-tight">
            Desenvolvo sistemas sob medida para empresas <br />
            <span class="text-[#A3FF12] font-bold uppercase tracking-wider mt-4 inline-block">Sites 3D, animações e interações imersivas</span>
          </p>
        </div>
        </div>
      </div>
    </div>
    <!-- Indicador de Scroll -->
    <!-- Indicador de Scroll -->
    <div :class="['absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center hover:scale-110 transition-all duration-500 drop-shadow-[0_0_10px_rgba(163,255,18,0.6)]', isLoaded ? 'animate-bounce-slow opacity-100' : 'opacity-0']" style="transition-delay: 1.5s;">
      <Mouse class="text-[#A3FF12] w-8 h-8 md:w-12 md:h-12" />
      <ChevronDown class="text-[#A3FF12] w-5 h-5 md:w-8 md:h-8 -mt-2" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Mouse, ChevronDown } from 'lucide-vue-next'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(SplitText, ScrollTrigger)

const isLoaded = ref(false)
const titleRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | undefined
let split: InstanceType<typeof SplitText> | null = null
let tl: gsap.core.Timeline | null = null

const startHeroAnimation = () => {
  isLoaded.value = true
  if (tl) {
    tl.play()
  }
}

onMounted(() => {
  ctx = gsap.context(() => {
    if (!titleRef.value) return

    // SplitText divide o h1 em spans individuais por caractere
    split = new SplitText(titleRef.value, { 
      type: 'chars',
      charsClass: 'split-char'
    })

    const chars = split.chars

    // Define perspectiva 3D no container pai e garante z-index funcionando
    gsap.set(titleRef.value, { perspective: 800 })
    gsap.set(chars, { position: 'relative', opacity: 0 }) // Tudo invisível até chegar a vez na timeline!

    tl = gsap.timeline({ delay: 0.3, paused: true })

    // 1. Letra "M" (index 0): Surge estática como um "W" (ponta cabeça), depois desvira.
    if (chars[0]) {
      // Primeiro fazemos ela aparecer instantaneamente (fade in) virada no eixo X (de ponta cabeça)
      tl.fromTo(chars[0],
        { opacity: 0, rotateX: 180 },
        { opacity: 1, rotateX: 180, duration: 0.4, ease: 'power2.out' }
      )
      // Depois fazemos o giro "de cima pra baixo" (3D Flip) para voltar ao M
      tl.to(chars[0],
        { rotateX: 0, duration: 0.9, ease: 'back.out(1.5)' },
        "+=0" // Cortamos o respiro, já vira direto
      )
    }

    // A PARTIR DAQUI: Sobreposição fluida (Cascata) para acelerar a leitura e cortar o tempo pela metade

    // 2. Letra "A" (index 1): Entra de cima
    if (chars[1]) {
      tl.fromTo(chars[1],
        { opacity: 0, y: -60 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)' },
        "-=0.6" // Começa enquanto o M ainda está virando
      )
    }

    // 3. Letra "T" (index 2): Entra de baixo.
    if (chars[2]) {
      gsap.set(chars[2], { zIndex: 10 })
      tl.fromTo(chars[2],
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)' },
        "-=0.5" // Começa enquanto o A está caindo
      )
    }

    // 4. Letra "E" (index 3): Surge "de trás" do T e desliza.
    if (chars[3]) {
      gsap.set(chars[3], { zIndex: 1 })
      tl.fromTo(chars[3],
        { opacity: 0, x: -50 }, 
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' },
        "-=0.5"
      )
    }

    // 5. Letras "U" e "S" (índices 4 e 5): Efeito "Contador Mecânico Real"
    if (chars[4] && chars[5]) {
      tl.addLabel("roleta", "-=0.4") // Dispara a roleta logo antes do E terminar de deslizar
      tl.set([chars[4], chars[5]], { opacity: 1 }, "roleta")

      // Função para injetar uma "fita de roleta" dentro do span da letra
      const setupCounter = (charEl: Element, finalChar: string, direction: 'up' | 'down') => {
        // Pega a altura precisa ou usa fallback
        const h = charEl.getBoundingClientRect().height || 80
        
        // Esconde o que vazar da letra
        gsap.set(charEl, { overflow: 'hidden', verticalAlign: 'bottom' })
        
        // Deixa a letra original invisível só para segurar a largura (placeholder)
        charEl.innerHTML = `<span style="opacity: 0;">${finalChar}</span>`
        
        const strip = document.createElement('div')
        strip.style.position = 'absolute'
        strip.style.left = '0'
        strip.style.width = '100%'
        
        // Cor neon mais suave pros números passando para dar um contraste legal
        const fakeColor = 'rgba(163, 255, 18, 0.5)'
        
        if (direction === 'up') {
          // A fita sobe: O elemento final fica embaixo, começamos do Y=0 para -H
          strip.style.top = '0'
          const items = Array(6).fill(finalChar)
          strip.innerHTML = items.map((c, i) => 
            `<div style="height: ${h}px; display:flex; align-items:center; justify-content:center; color: ${i === items.length - 1 ? 'inherit' : fakeColor};">${c}</div>`
          ).join('')
          charEl.appendChild(strip)
          return { strip, startY: 0, endY: -h * (items.length - 1) }
        } else {
          // A fita desce: O elemento final fica no topo, grudamos embaixo e vamos de Y=0 para +H
          strip.style.bottom = '0'
          const items = Array(6).fill(finalChar)
          strip.innerHTML = items.map((c, i) => 
            `<div style="height: ${h}px; display:flex; align-items:center; justify-content:center; color: ${i === 0 ? 'inherit' : fakeColor};">${c}</div>`
          ).join('')
          charEl.appendChild(strip)
          return { strip, startY: 0, endY: h * (items.length - 1) }
        }
      }

      const uData = setupCounter(chars[4], 'U', 'up')
      const sData = setupCounter(chars[5], 'S', 'down')

      // Anima a fita do 'U' rolando pelas letras clonadas
      tl.fromTo(uData.strip,
        { y: uData.startY },
        { y: uData.endY, duration: 1.5, ease: 'expo.inOut' },
        "roleta"
      )

      // Anima a fita do 'S' rolando pelas letras clonadas na direção oposta
      tl.fromTo(sData.strip,
        { y: sData.startY },
        { y: sData.endY, duration: 1.5, ease: 'expo.inOut' },
        "roleta"
      )
    }

    // 7. Letra "C" (Sexta de trás pra frente): Surge espelhada (ao contrário) e desvira girando no eixo Y
    const cIndex = chars.length - 6
    if (chars[cIndex]) {
      tl.fromTo(chars[cIndex],
        { opacity: 0, rotateY: 180 }, // Espelhada
        { opacity: 1, rotateY: 180, duration: 0.4, ease: 'power2.out' },
        "-=1.0" // Começa enquanto a roleta US ainda está rolando para ganhar tempo
      )
      // Desvira (giro 3D direita para esquerda)
      tl.to(chars[cIndex],
        { rotateY: 0, duration: 0.9, ease: 'back.out(1.5)' },
        "+=0"
      )
    }

    // 8. Letra "A" (Quinta de trás pra frente): Igual ao primeiro 'A' (de cima)
    const aIndex2 = chars.length - 5
    if (chars[aIndex2]) {
      tl.fromTo(chars[aIndex2],
        { opacity: 0, y: -60 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)' },
        "-=0.6"
      )
    }

    // 9. Letra "S" (Quarta de trás pra frente): Igual ao 'T' (de baixo, z-index alto)
    const sIndex2 = chars.length - 4
    if (chars[sIndex2]) {
      gsap.set(chars[sIndex2], { zIndex: 10 })
      tl.fromTo(chars[sIndex2],
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)' },
        "-=0.5"
      )
    }

    // 10. Letra "T" (Terceira de trás pra frente): Gira de ponta-cabeça no ar (como o 'i' do site GSAP)
    const tIndex2 = chars.length - 3
    if (chars[tIndex2]) {
      tl.fromTo(chars[tIndex2],
        { opacity: 0, y: -60, rotation: 180 }, // Começa de cima e totalmente de ponta-cabeça
        { opacity: 1, y: 0, rotation: 0, duration: 0.7, ease: 'back.out(1.5)' },
        "-=0.5"
      )
    }

    // 11. Letra "R" (Segunda de trás pra frente): Igual ao 'U' (de baixo)
    const rIndex = chars.length - 2
    if (chars[rIndex]) {
      tl.fromTo(chars[rIndex],
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)' },
        "-=0.5"
      )
    }

    // 12. Letra "O" (Última letra): Igual ao 'S' inicial (de baixo)
    const oIndex = chars.length - 1
    if (chars[oIndex]) {
      tl.fromTo(chars[oIndex],
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)' },
        "-=0.5"
      )
    }

    // 13. Efeito infinito de giros da letra 'T' após tudo terminar
    tl.add(() => {

      // Efeito Giro do T a cada 2 segundos
      const letterTCastro = chars[chars.length - 3]
      if (letterTCastro) {
        gsap.to(letterTCastro, {
          rotation: "+=360", // Soma 360 sempre, girando para sempre
          duration: 0.7, // Rotação bem rápida
          ease: "back.inOut(2)", // Bate elástico antes de girar e depois de girar
          repeat: -1, // Infinito
          repeatDelay: 3.0 // Espera cravado 3 segundos antes de dar a próxima pirueta
        })
      }
    })
  })
})

onUnmounted(() => {
  if (split) split.revert()
  if (ctx) ctx.revert()
})
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
