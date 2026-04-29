<template>
  <section id="process" ref="sectionRef" class="bg-[#0A0C10] text-white relative z-10 w-full overflow-hidden min-h-[100svh] flex items-center justify-center border-t border-white/5">
    
    <!-- Background overlay (Noise e Gradient) -->
    <div class="absolute inset-0 pointer-events-none z-0">
      <!-- Glow superior -->
      <div class="absolute top-[-10%] left-[20%] w-[60%] h-[30%] bg-[#A3FF12]/10 blur-[120px] rounded-full"></div>
      <!-- Glow inferior direito -->
      <div class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#A3FF12]/5 blur-[150px] rounded-full"></div>
      <div class="absolute inset-0 noise-bg opacity-[0.03]"></div>
    </div>

    <div class="w-full max-w-[1440px] mx-auto px-6 md:pl-16 md:pr-[120px] lg:pl-20 lg:pr-[140px] xl:pl-24 xl:pr-[160px] h-full relative z-10 flex flex-col pt-24 md:pt-32 pb-20">
      
      <!-- Título fixo no topo -->
      <div class="absolute top-24 left-6 md:left-16 lg:left-20 xl:left-24 z-20 process-header pr-6 md:pr-[120px] lg:pr-[140px] xl:pr-[160px]">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-[1px] bg-[#A3FF12]"></div>
          <span class="text-[#A3FF12] font-mono text-xs md:text-sm tracking-[0.3em] uppercase">Nosso Fluxo</span>
        </div>
        <h2 class="uppercase text-[clamp(1.3rem,6vw,3rem)] font-sans font-bold tracking-tight text-white/90 max-w-2xl min-[1250px]:max-w-4xl leading-[1.1]">
          UM PROCESSO CLARO,<br class="max-[734px]:block min-[735px]:hidden"> 
          PENSADO PARA<br class="block">
          <span class="text-transparent stroke-text italic">
            ENTREGAR<br class="max-[605px]:block min-[606px]:hidden"> 
            RESULTADOS
          </span>
        </h2>
      </div>

      <!-- Container das colisões -->
      <div class="relative w-full flex-1 flex items-center justify-center min-h-[60vh] mt-32 md:mt-24">
        
        <div 
          v-for="(item, index) in steps" 
          :key="index"
          class="proc-step absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16 w-full"
        >
          <!-- Bloco Esquerdo (Título e Número) -->
          <div class="proc-left w-full md:w-1/2 flex flex-col justify-end md:justify-center items-center md:items-end text-center md:text-right px-4 pb-4 md:pb-0 h-1/2 md:h-auto border-b border-[#A3FF12]/30 md:border-b-0 md:border-r border-dashed">
            <span class="text-[#A3FF12] font-display text-[clamp(4rem,10vw,8rem)] leading-none mb-2 md:mb-4 opacity-20">
              {{ item.num }}
            </span>
            <h3 class="font-display uppercase text-[clamp(1.8rem,4vw,3.5rem)] leading-[0.95] text-white relative z-10">
              {{ item.title }}
            </h3>
          </div>

          <!-- Bloco Direito (Descrição) -->
          <div class="proc-right w-full md:w-1/2 flex items-start md:items-center justify-center md:justify-start px-4 pt-4 md:pt-0 h-1/2 md:h-auto">
            <p class="text-slate-400 font-sans text-[clamp(1rem,1.8vw,1.4rem)] leading-relaxed max-w-md text-center md:text-left font-medium">
              {{ item.desc }}
            </p>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | undefined

const steps = [
  { num: '01', title: 'Imersão no negócio', desc: 'Eu entendo seu mercado, seu público e seus objetivos antes de qualquer decisão técnica.' },
  { num: '02', title: 'Estratégia e estrutura', desc: 'Defino a arquitetura do site ou sistema, fluxos e como a solução vai gerar resultado.' },
  { num: '03', title: 'Design e experiência', desc: 'Crio uma interface moderna, intuitiva e alinhada com o posicionamento da sua marca.' },
  { num: '04', title: 'Desenvolvimento', desc: 'Transformo tudo em uma solução rápida, funcional e escalável.' },
  { num: '05', title: 'Entrega e evolução', desc: 'Publicação, ajustes finais e suporte para garantir que o projeto continue performando.' }
]

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  setTimeout(() => {
    ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: '+=4500', // 4500px de scroll para acomodar os 5 passos com folga
          pin: true,
          scrub: 1.5, // Suavidade na rolagem
          anticipatePin: 1
        }
      })

      const stepElements = gsap.utils.toArray<HTMLElement>('.proc-step')

      stepElements.forEach((step, i) => {
        const left = step.querySelector('.proc-left')
        const right = step.querySelector('.proc-right')

        // Estado inicial: Fora da tela e invisíveis
        gsap.set(left, { xPercent: -50, opacity: 0 })
        gsap.set(right, { xPercent: 50, opacity: 0 })
        gsap.set(step, { zIndex: stepElements.length - i }) // Garante ordem de empilhamento

        // ENTRADA (Colisão)
        tl.addLabel(`step_${i}_enter`)
          .to(left, { xPercent: 0, opacity: 1, duration: 1.5, ease: 'power3.out' }, `step_${i}_enter`)
          .to(right, { xPercent: 0, opacity: 1, duration: 1.5, ease: 'power3.out' }, `step_${i}_enter`)

        // ESPAÇO DE LEITURA (Mantém na tela por um tempo)
        // Adicionamos um tempo vazio na timeline antes da saída
        tl.addLabel(`step_${i}_hold`, '+=2.0')

        // SAÍDA (Apenas se não for o último passo)
        if (i < stepElements.length - 1) {
          tl.addLabel(`step_${i}_leave`, '+=0')
            .to(step, { 
              scale: 0.85, 
              opacity: 0, 
              yPercent: -10, 
              duration: 1.2, 
              ease: 'power2.inOut' 
            }, `step_${i}_leave`)
        }
      })

      // Animação do cabeçalho principal
      gsap.fromTo('.process-header', 
        { y: -30, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 1.5, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

    }, sectionRef.value || undefined)
  }, 150)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Changa+One:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');

.font-display { font-family: 'Changa One', sans-serif; }
.font-sans    { font-family: 'Outfit', sans-serif; }

.stroke-text {
  -webkit-text-stroke: 1px rgba(163, 255, 18, 0.4);
  text-shadow: 0 0 20px rgba(163, 255, 18, 0.2);
}

.noise-bg {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
</style>
