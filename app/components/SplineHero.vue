<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, shallowRef } from 'vue';
import { Application } from '@splinetool/runtime';
import { useWindowSize } from '@vueuse/core';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const splineApp = shallowRef<Application | null>(null);
const isLoading = ref(true);

const { width } = useWindowSize();
// Consideramos telas menores que 768px como Mobile
const isMobileDevice = ref(false);

onMounted(async () => {
    isMobileDevice.value = window.innerWidth < 768;

    // Se for mobile, ignoramos o carregamento pesado do Spline!
    if (isMobileDevice.value) {
        isLoading.value = false;
        return; // Sai da função precocemente
    }

    // Carregamento do Spline interativo apenas no Computador
    if (canvasRef.value) {
        try {
            splineApp.value = new Application(canvasRef.value);
            
            await splineApp.value.load('https://prod.spline.design/jUkquMk7CSGnJQOf/scene.splinecode');
            console.log('✅ Spline Hero: Cena interativa carregada no Desktop!');
            
            isLoading.value = false;

            // 🛑 TRAVA DE MOVIMENTO E ZOOM 🛑
            const preventAction = (e: Event) => {
                e.stopImmediatePropagation();
            };
            canvasRef.value.addEventListener('wheel', preventAction, { capture: true });
            canvasRef.value.addEventListener('pointerdown', preventAction, { capture: true });
            canvasRef.value.addEventListener('mousedown', preventAction, { capture: true });

            // 🎯 CAÇADOR DE MARCA D'ÁGUA (Agressivo)
            const hideSplineLogo = () => {
                const query = 'a[href*="spline.design"], .spline-watermark, #spline-logo';
                document.querySelectorAll(query).forEach(el => (el as HTMLElement).style.display = 'none');
                
                document.querySelectorAll('*').forEach(el => {
                    if (el.shadowRoot) {
                        el.shadowRoot.querySelectorAll(query).forEach(sEl => (sEl as HTMLElement).style.display = 'none');
                    }
                });
            };

            const interval = setInterval(hideSplineLogo, 100);
            (window as any)._splineCleaner = interval;

        } catch (error) {
            console.error('❌ Erro ao carregar cena Spline:', error);
            isLoading.value = false;
        }
    }
});

onBeforeUnmount(() => {
    if ((window as any)._splineCleaner) {
        clearInterval((window as any)._splineCleaner);
    }
    if (splineApp.value) {
        if (typeof splineApp.value.dispose === 'function') {
            splineApp.value.dispose();
        }
    }
});
</script>

<template>
    <div class="spline-wrapper w-full h-full relative overflow-hidden bg-black">
        <!-- Overlay de carregamento elegante -->
        <Transition name="fade">
            <div v-if="isLoading" class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#030708]">
                <div class="w-12 h-12 border-2 border-[#A3FF12] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p class="text-white/50 font-mono text-sm tracking-widest uppercase">Initializing Environment</p>
            </div>
        </Transition>

        <!-- FALLBACK VIDEO PARA MOBILE (Super Leve) -->
        <video 
            v-if="isMobileDevice"
            src="/fundo-mobile.mp4" 
            autoplay 
            loop 
            muted 
            playsinline 
            class="absolute inset-0 w-full h-full object-cover z-0"
        ></video>

        <!-- SPLINE 3D PARA DESKTOP -->
        <canvas v-else ref="canvasRef" class="w-full h-full z-0" />
        
        <!-- Gradiente suave por cima para ajudar na leitura -->
        <div class="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10" />
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
