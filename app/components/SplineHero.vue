<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, shallowRef } from 'vue';
import { Application } from '@splinetool/runtime';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const splineApp = shallowRef<Application | null>(null);
const isLoading = ref(true);

// Estado para os textos que queremos injetar (personalize aqui depois)
const siteText = {
    headline: 'Building future-proof digital solutions',
    subheadline: 'Crafting high-end experiences for modern brands.',
    cta: "Let's innovate",
    secondaryCta: 'Our projects'
};

onMounted(async () => {
    if (canvasRef.value) {
        try {
            // Inicialização padrão segura
            splineApp.value = new Application(canvasRef.value);
            
            // Carrega a cena primeiro
            await splineApp.value.load('https://prod.spline.design/jUkquMk7CSGnJQOf/scene.splinecode');
            console.log('✅ Spline Hero: Carregado!');
            
            isLoading.value = false;

            // Otimizações aplicadas APÓS o carregamento para evitar crashes
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
                // Se o método existir na sua versão da runtime, ele aplica, senão ignora
                if ((splineApp.value as any).setPixelRatio) {
                    (splineApp.value as any).setPixelRatio(1);
                }
            }
            console.log('✅ Spline Hero: Cena carregada!');
            isLoading.value = false;

            // Tenta forçar a remoção via API interna se existir
            if ((splineApp.value as any).setLogoVisible) {
                (splineApp.value as any).setLogoVisible(false);
            }

            const allObjects = splineApp.value.getAllObjects();
            
            // Garantia: Esconder qualquer texto que tenha sobrado na cena
            allObjects.forEach(obj => {
                if (obj.name && obj.name.toLowerCase().includes('text')) {
                    obj.visible = false;
                }
            });

            // 🛑 TRAVA DE MOVIMENTO E ZOOM 🛑
            // Bloqueia eventos de clique e scroll de chegarem à Spline,
            // travando o fundo na posição e permitindo que o site role normalmente.
            const preventAction = (e: Event) => {
                e.stopImmediatePropagation();
            };
            
            canvasRef.value.addEventListener('wheel', preventAction, { capture: true });
            canvasRef.value.addEventListener('pointerdown', preventAction, { capture: true });
            canvasRef.value.addEventListener('mousedown', preventAction, { capture: true });
            canvasRef.value.addEventListener('touchstart', preventAction, { capture: true });

            // 🎯 CAÇADOR DE MARCA D'ÁGUA (Agressivo)
            // Remove o logo do Spline mesmo que ele tente reaparecer ou esteja em Shadow DOM
            const hideSplineLogo = () => {
                const query = 'a[href*="spline.design"], .spline-watermark, #spline-logo';
                // 1. Procura no DOM principal
                document.querySelectorAll(query).forEach(el => (el as HTMLElement).style.display = 'none');
                
                // 2. Procura em possíveis Shadow DOMs (comum em Web Components)
                const allElements = document.querySelectorAll('*');
                allElements.forEach(el => {
                    if (el.shadowRoot) {
                        el.shadowRoot.querySelectorAll(query).forEach(sEl => (sEl as HTMLElement).style.display = 'none');
                    }
                });
            };

            const interval = setInterval(hideSplineLogo, 100);
            (window as any)._splineCleaner = interval;

        } catch (error) {
            console.error('❌ Erro ao carregar cena Spline:', error);
        }
    }
});

onBeforeUnmount(() => {
    if ((window as any)._splineCleaner) {
        clearInterval((window as any)._splineCleaner);
    }
    if (splineApp.value) {
        // Limpar recursos ao desmontar
    }
});
</script>

<template>
    <div class="spline-wrapper w-full h-full relative overflow-hidden bg-black">
        <!-- Overlay de carregamento elegante -->
        <Transition name="fade">
            <div v-if="isLoading" class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#030708]">
                <div class="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p class="text-white/50 font-mono text-sm tracking-widest uppercase">Initializing 3D Environment</p>
            </div>
        </Transition>

        <canvas ref="canvasRef" class="w-full h-full" />
        
        <!-- Gradiente suave por cima para ajudar na leitura se necessário -->
        <div class="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/40" />
    </div>
</template>

<style scoped>
.spline-wrapper {
    cursor: default;
}

.fade-leave-active {
    transition: opacity 0.8s ease;
}
.fade-leave-to {
    opacity: 0;
}

/* Garante que o canvas não tenha scrollbars */
canvas {
    outline: none;
    -webkit-tap-highlight-color: transparent;
    /* O TRUQUE: Faz o canvas ser levemente maior para empurrar o logo para fora */
    width: calc(100% + 100px) !important;
    height: calc(100% + 100px) !important;
    position: absolute;
    bottom: -50px !important;
    right: -50px !important;
}

</style>
