<template>
  <section id="differentials" ref="sectionRef" class="bg-[#0B0D12] text-white relative z-10 w-full border-t border-white/5">
    
    <!-- Background overlay -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-[#A3FF12]/5 blur-[150px] rounded-full"></div>
      <div class="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 blur-[150px] rounded-full"></div>
    </div>

    <!-- WRAPPER DESKTOP: dois containers lado a lado -->
    <div ref="wrapperRef" class="diff-wrapper max-w-[1440px] mx-auto w-full px-6 md:pl-16 md:pr-[120px] lg:pl-20 lg:pr-[140px] xl:pl-24 xl:pr-[160px] relative z-10">

      <!-- COLUNA ESQUERDA (desktop: pinada via GSAP | mobile: hidden) -->
      <div ref="leftRef" class="diff-left hidden min-[1138px]:flex flex-col justify-center">
        <div class="flex items-center gap-4 mb-6 gs-reveal-diff">
          <div class="w-12 h-[1px] bg-[#A3FF12]"></div>
          <span class="text-[#A3FF12] font-mono text-sm tracking-[0.3em] uppercase">Diferenciais</span>
        </div>
        <h2 class="text-[clamp(1.8rem,4vw,5.5rem)] font-display uppercase leading-[0.95] tracking-tight gs-reveal-diff">
          De sites a <br>
          <span class="text-transparent stroke-text italic text-[clamp(2.2rem,5vw,6.5rem)]">sistemas:</span><br>
          <span class="text-white/80 text-[clamp(1rem,2vw,2.5rem)] mt-4 block leading-[1.2] lowercase font-sans font-semibold">tudo pensado para fazer seu negócio crescer.</span>
        </h2>
      </div>

      <!-- COLUNA DIREITA: lista que rola normalmente -->
      <div ref="rightRef" class="diff-right px-6 md:px-0 md:pl-16 lg:pl-24 py-24 md:py-[30vh] flex flex-col gap-24 md:gap-40">
        
        <!-- Título visível somente no MOBILE / TABLET (<= 1137px) -->
        <div class="min-[1138px]:hidden mb-12 md:mb-20">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-[1px] bg-[#A3FF12]"></div>
            <span class="text-[#A3FF12] font-mono text-xs tracking-[0.3em] uppercase">Diferenciais</span>
          </div>
          <!-- Aumentamos as clamps do título para ficar bem mais visível -->
          <h2 class="text-[clamp(3rem,9vw,5.5rem)] font-display uppercase leading-[0.95] tracking-tight">
            De sites a <br>
            <span class="text-transparent stroke-text italic text-[clamp(3.5rem,10vw,6.5rem)]">sistemas:</span><br>
            <span class="text-white/80 text-[clamp(1.2rem,3vw,2rem)] mt-4 block leading-[1.2] lowercase font-sans font-semibold">tudo pensado para fazer seu negócio crescer.</span>
          </h2>
        </div>

        <!-- Lista de diferenciais -->
        <div v-for="(item, index) in differentials" :key="index" 
             class="diff-item w-full z-10 relative">
          
          <!-- Card Visual Interno -->
          <div class="diff-card bg-[#0B0D12] border border-[#A3FF12]/30 rounded-[32px] p-8 md:p-12 shadow-[0_0_40px_rgba(0,0,0,0.9)] flex flex-col gap-3 md:gap-4 w-full origin-top relative overflow-hidden group hover:border-[#A3FF12]/80 transition-colors duration-500">
            
            <!-- Efeito de brilho interno sutil -->
            <div class="absolute inset-0 bg-gradient-to-br from-[#A3FF12]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <span class="text-5xl md:text-7xl font-display text-white/10 leading-none diff-number relative z-10">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <h3 class="text-2xl md:text-3xl font-sans font-bold uppercase tracking-tight text-white mt-2 diff-title relative z-10">
              {{ item.title }}
            </h3>
            <p class="text-slate-400 font-sans text-base md:text-lg leading-relaxed max-w-lg diff-desc relative z-10">
              {{ item.description }}
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
const wrapperRef = ref<HTMLElement | null>(null)
const leftRef    = ref<HTMLElement | null>(null)
const rightRef   = ref<HTMLElement | null>(null)

let ctx: gsap.Context | undefined

const differentials = [
  { title: 'Resultado acima de estética',           description: 'Seja um site ou um sistema, tudo é pensado para gerar retorno real — mais clientes, mais eficiência, mais faturamento.' },
  { title: 'Performance que impacta o negócio',     description: 'Aplicações rápidas, leves e bem estruturadas. Isso reduz abandono e melhora a experiência em qualquer projeto.' },
  { title: 'Experiência moderna e diferenciada',    description: 'Interfaces com animações, interações e até 3D quando faz sentido — sempre com foco em usabilidade.' },
  { title: 'Sistemas sob medida',                   description: 'Nada de solução genérica. Desenvolvo sistemas personalizados para resolver problemas reais do seu negócio.' },
  { title: 'Pensamento estratégico antes do código',description: 'Entendo seu processo, seu público e seus objetivos antes de construir qualquer solução.' },
  { title: 'Automação que economiza tempo e escala',description: 'Desenvolvo automações e integrações que eliminam tarefas manuais, conectam ferramentas e deixam seu processo rodando no automático.' },
  { title: 'Tecnologia como vantagem competitiva',  description: 'Uso ferramentas modernas e IA para desenvolver mais rápido e entregar soluções mais inteligentes.' }
  
]

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  setTimeout(() => {
    // Agora o layout de desktop (2 colunas) só ativa a partir de 1138px
    const isDesktop = window.innerWidth >= 1138

    ctx = gsap.context(() => {

      // ─── Animação de entrada do título esquerdo ───
      gsap.fromTo('.gs-reveal-diff',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.value, start: 'top 75%' }
        }
      )

      // ─── DESKTOP: pin da coluna esquerda via GSAP ───
      if (isDesktop && leftRef.value && rightRef.value) {
        ScrollTrigger.create({
          trigger: rightRef.value,   // ancora no container direito
          start: 'top top',          // quando o topo da direita chega ao topo da viewport
          end: 'bottom bottom',      // termina quando o fundo da direita chega ao fundo da viewport
          pin: leftRef.value,        // pina o elemento esquerdo
          pinSpacing: false,         // não adiciona espaço extra
          invalidateOnRefresh: true,
        })
      }

      // ─── Reveal progressivo + Highlight para cada item ───
      const items = gsap.utils.toArray<HTMLElement>('.diff-item')

      items.forEach((item, index) => {
        const card = item.querySelector('.diff-card')
        
        // Empilhamento via GSAP Pin (resolve conflito do CSS sticky com Lenis)
        // Cada card vai fixar em uma altura visivelmente maior que o anterior, criando uma cascata mais espaçada.
        ScrollTrigger.create({
          trigger: item,
          start: `top ${15 + (index * 4.5)}%`, // Aumentado de 2% para 4.5% de espaçamento entre as cartas
          endTrigger: rightRef.value,
          end: 'bottom center', // Solta o pin no final da seção
          pin: item,
          pinSpacing: false,
        })

        // Reveal: IMPORTANTE animar o '.diff-card' interno
        gsap.fromTo(card,
          { y: 80, opacity: 0, filter: 'blur(8px)' },
          {
            y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 95%',
              end: 'top 50%',
              toggleActions: 'play none none reverse'
            }
          }
        )

        // Highlight dinâmico (cores dos textos)
        gsap.fromTo(item.querySelector('.diff-number'),
          { color: 'rgba(255,255,255,0.05)' },
          {
            color: 'rgba(163,255,18,0.6)', duration: 0.5,
            scrollTrigger: {
              trigger: item,
              start: 'top 60%',
              toggleActions: 'play none none reverse'
            }
          }
        )
        
        gsap.fromTo(item.querySelector('.diff-title'),
          { color: 'rgba(255,255,255,0.4)' },
          {
            color: '#ffffff', duration: 0.5,
            scrollTrigger: {
              trigger: item,
              start: 'top 60%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })

    }, sectionRef.value || undefined)
  }, 150)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Changa+One:ital@0;1&family=Outfit:wght@300;400;600;700&display=swap');

.font-display  { font-family: 'Changa One', sans-serif; }
.font-sans     { font-family: 'Outfit', sans-serif; }

.stroke-text {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
  text-shadow: none;
}

/* ── Layout dois containers ── */
.diff-wrapper {
  display: flex;
  flex-direction: column;
}

@media (min-width: 1138px) {
  .diff-wrapper {
    flex-direction: row;
    align-items: flex-start;
  }

  /* Esquerda: largura fixa, altura da viewport (GSAP cuida do pin) */
  .diff-left {
    width: 45%;
    flex-shrink: 0;
    height: 100vh; /* altura para o GSAP calcular o pin corretamente */
  }

  /* Direita: ocupa o restante */
  .diff-right {
    flex: 1;
    min-width: 0;
  }
}

/* ── Items da lista ── */
.diff-item {
  transform-origin: left center;
  will-change: transform, opacity, filter;
}
</style>
