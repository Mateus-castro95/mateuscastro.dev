<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, shallowRef } from 'vue';
import { Application } from '@splinetool/runtime';
import { useWindowSize } from '@vueuse/core';
import { gsap } from 'gsap';

const emit = defineEmits(['loaded']);

const wrapperRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);
const splineApp = shallowRef<Application | null>(null);
const showOverlay = ref(true);
const loadProgress = ref(0);

// Refs para animação do GSAP
const overlayRef = ref<HTMLDivElement | null>(null);
const loadingContentRef = ref<HTMLDivElement | null>(null);
const progressBarRef = ref<HTMLDivElement | null>(null);

let observer: IntersectionObserver | null = null;

const { width } = useWindowSize();
// Consideramos telas menores que 768px como Mobile
const isMobileDevice = ref(false);

onMounted(async () => {
    // Fake progress bar logic
    let fakeProgress = 0;
    const progressInterval = setInterval(() => {
        if (fakeProgress < 90) {
            fakeProgress += Math.random() * 5 + 2;
            if (fakeProgress > 90) fakeProgress = 90;
            loadProgress.value = fakeProgress;
        }
    }, 100);

    const finishLoading = () => {
        clearInterval(progressInterval);
        loadProgress.value = 100;
        
        setTimeout(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    showOverlay.value = false;
                    emit('loaded');
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('app-loaded'));
                    }
                }
            });

            // 1. O texto e a barra somem com classe (GSAP)
            if (loadingContentRef.value && progressBarRef.value) {
                tl.to([loadingContentRef.value, progressBarRef.value], {
                    opacity: 0,
                    y: -20,
                    duration: 0.6,
                    ease: 'power3.inOut'
                });
            }

            // 2. A tela preta inteira desliza para cima revelando o Hero (estilo Awwards)
            if (overlayRef.value) {
                tl.to(overlayRef.value, {
                    yPercent: -100,
                    duration: 1.4,
                    ease: 'expo.inOut'
                }, "-=0.3"); // Começa um pouco antes do fade acabar
            }

        }, 500); // Segura 500ms no 100% para o usuário ver
    };

    isMobileDevice.value = window.innerWidth < 768;

    // Se for mobile, ignoramos o carregamento pesado do Spline!
    if (isMobileDevice.value) {
        setTimeout(() => {
            finishLoading();
        }, 1500);
        
        // Safari iOS Hack: Força o play programaticamente
        setTimeout(() => {
            if (videoRef.value) {
                videoRef.value.play().catch(err => console.log('Safari Autoplay Prevented:', err));
            }
        }, 100);
    } else if (canvasRef.value) {
        // Carregamento do Spline interativo apenas no Computador
        try {
            splineApp.value = new Application(canvasRef.value);
            
            await splineApp.value.load('https://prod.spline.design/jUkquMk7CSGnJQOf/scene.splinecode');
            console.log('✅ Spline Hero: Cena interativa carregada no Desktop!');
            
            finishLoading();

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
            finishLoading();
        }
    }

    // 🚀 OTIMIZAÇÃO DE PERFORMANCE: Pausar quando fora da tela
    setTimeout(() => {
        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Visível: Reproduzir
                    if (isMobileDevice.value && videoRef.value) {
                        videoRef.value.play().catch(() => {});
                    } else if (splineApp.value && typeof (splineApp.value as any).play === 'function') {
                        (splineApp.value as any).play();
                    }
                } else {
                    // Invisível: Pausar para liberar GPU
                    if (isMobileDevice.value && videoRef.value) {
                        videoRef.value.pause();
                    } else if (splineApp.value && typeof (splineApp.value as any).stop === 'function') {
                        (splineApp.value as any).stop();
                    }
                }
            });
        }, { rootMargin: '100px', threshold: 0 });

        if (wrapperRef.value) {
            observer.observe(wrapperRef.value);
        }
    }, 500); // Aguarda a montagem inicial
});

onBeforeUnmount(() => {
    if (observer) {
        observer.disconnect();
    }
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
    <div ref="wrapperRef" class="spline-wrapper w-full h-full relative overflow-hidden bg-black">
        <!-- Overlay de carregamento GSAP Premium -->
        <div v-if="showOverlay" ref="overlayRef" class="fixed inset-0 z-[9999] bg-[#081201] flex flex-col items-center justify-center">
            
            <!-- Texto flutuante -->
            <div ref="loadingContentRef" class="absolute w-full px-6 md:px-16 bottom-[calc(50%+24px)] flex justify-between items-end max-w-[1440px] mx-auto left-0 right-0">
                <span class="text-white font-mono text-xs md:text-sm tracking-[0.3em] uppercase opacity-60">Bem Vindo a CW Tech!</span>
                <span class="text-[#A3FF12] font-mono text-sm md:text-base font-bold">{{ Math.round(loadProgress) }}%</span>
            </div>

            <!-- Barra de Progresso Ponta a Ponta no Centro da Tela -->
            <div ref="progressBarRef" class="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[32px] bg-white/5">
                <div class="h-full bg-[#A3FF12] shadow-[0_0_15px_rgba(163,255,18,0.6)] transition-all duration-100 ease-linear" :style="{ width: loadProgress + '%' }"></div>
            </div>
            
        </div>

        <!-- FALLBACK VIDEO PARA MOBILE (Super Leve) -->
        <video 
            v-if="isMobileDevice"
            ref="videoRef"
            src="/fundo-mobile.mp4" 
            autoplay 
            loop 
            muted 
            playsinline 
            webkit-playsinline
            disablePictureInPicture
            disableRemotePlayback
            preload="auto"
            class="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            style="pointer-events: none;"
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

/* Oculta completamente qualquer botão de play nativo (iOS/Safari) */
video::-webkit-media-controls,
video::-webkit-media-controls-start-playback-button,
video::-webkit-media-controls-play-button {
    display: none !important;
    -webkit-appearance: none !important;
}
</style>
