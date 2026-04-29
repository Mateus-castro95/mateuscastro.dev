<template>
  <section id="contact" class="contact-section relative z-10 w-full py-24 md:py-32 overflow-hidden bg-[#0A0A0A]">
    
    <!-- Background Deco -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#A3FF12]/5 blur-[120px] rounded-full"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 mix-blend-overlay"></div>
    </div>

    <div class="max-w-[1440px] mx-auto w-full px-6 md:pl-16 md:pr-[120px] lg:pl-20 lg:pr-[140px] xl:pl-24 xl:pr-[160px] relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        
        <!-- Lado Esquerdo: Informações -->
        <div class="flex flex-col max-md:ml-4">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-[1px] bg-[#A3FF12]"></div>
            <span class="text-[#A3FF12] font-mono text-sm tracking-[0.3em] uppercase">Contato</span>
          </div>

          <h2 class="contact-title text-white text-5xl md:text-7xl lg:text-8xl font-display leading-[0.9] uppercase mb-12">
            VAMOS TIRAR <br />
            SUA IDEIA <br />
            <span class="text-[#A3FF12]">DO PAPEL</span>
          </h2>

          <div class="space-y-8">
            <!-- WhatsApp Link -->
            <a 
              href="https://wa.me/5547997146981" 
              target="_blank"
              class="group flex items-center gap-6 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-[#A3FF12]/10 hover:border-[#A3FF12]/30 transition-all duration-500 max-w-sm"
            >
              <div class="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-white group-hover:text-[#A3FF12] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                  <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.274-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.062-.301-.15-1.265-.464-2.409-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.098-.202.049-.39-.029-.54-.075-.15-.671-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.21 2.095 3.18 5.077 4.46.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.195-.57-.345z"/>
                  <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.005c6.585 0 11.948-5.336 11.951-11.893 0-3.176-1.24-6.16-3.481-8.453zM12.045 21.67h-.004c-1.77 0-3.508-.47-5.025-1.357l-.36-.214-3.73.968.995-3.616-.235-.37c-.97-1.528-1.482-3.29-1.482-5.093C2.206 7.214 6.626 2.81 12.05 2.81c2.617.001 5.077 1.015 6.924 2.854 1.847 1.838 2.864 4.28 2.864 6.883-.004 5.394-4.425 9.123-9.793 9.123z"/>
                </svg>
              </div>
              <div>
                <p class="text-white/70 text-xs font-mono uppercase tracking-widest mb-1">WhatsApp</p>
                <p class="text-[#A3FF12] font-medium">Falar com Mateus</p>
              </div>
            </a>

            <!-- Social Links -->
            <div class="flex items-center gap-4">
              <a href="https://github.com/Mateus-castro95" target="_blank" class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300">
                <Github class="w-5 h-5" />
              </a>
              <a href="#" class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300">
                <Linkedin class="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/mateus.castro_dev" target="_blank" class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300">
                <Instagram class="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <!-- Lado Direito: Formulário com Contorno Neon -->
        <div class="relative">
          <!-- Decorativo atrás do form -->
          <div class="absolute -inset-1 bg-[#A3FF12]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <form @submit.prevent="submitForm" class="relative bg-black/40 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500" :class="{ 'border-[#A3FF12]/50 shadow-[#A3FF12]/5': isSuccess }">
            <!-- Linha neon no topo do form -->
            <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#A3FF12] to-transparent" :class="isSubmitting ? 'animate-pulse opacity-100' : 'opacity-50'"></div>
            
            <div v-if="!isSuccess" class="space-y-6">
              <div class="group">
                <label class="block text-white/40 text-xs font-mono uppercase tracking-[0.2em] mb-3 ml-1">Nome Completo</label>
                <input 
                  v-model="form.name"
                  type="text" 
                  required
                  placeholder="Seu nome"
                  class="w-full bg-white/[0.03] border border-white/10 rounded-lg px-5 py-4 text-white outline-none focus:border-[#A3FF12] focus:ring-1 focus:ring-[#A3FF12]/30 transition-all duration-300 placeholder:text-white/10"
                />
              </div>

              <div class="group">
                <label class="block text-white/40 text-xs font-mono uppercase tracking-[0.2em] mb-3 ml-1">E-mail Corporativo</label>
                <input 
                  v-model="form.email"
                  type="email" 
                  required
                  placeholder="seu@email.com"
                  class="w-full bg-white/[0.03] border border-white/10 rounded-lg px-5 py-4 text-white outline-none focus:border-[#A3FF12] focus:ring-1 focus:ring-[#A3FF12]/30 transition-all duration-300 placeholder:text-white/10"
                />
              </div>

              <div class="group">
                <label class="block text-white/40 text-xs font-mono uppercase tracking-[0.2em] mb-3 ml-1">Mensagem</label>
                <textarea 
                  v-model="form.message"
                  rows="4" 
                  required
                  placeholder="Conte-me sobre o seu desafio..."
                  class="w-full bg-white/[0.03] border border-white/10 rounded-lg px-5 py-4 text-white outline-none focus:border-[#A3FF12] focus:ring-1 focus:ring-[#A3FF12]/30 transition-all duration-300 placeholder:text-white/10 resize-none"
                ></textarea>
              </div>

              <!-- Erro -->
              <p v-if="error" class="text-red-400 text-xs font-mono bg-red-400/10 p-3 rounded border border-red-400/20">
                {{ error }}
              </p>

              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="w-full bg-[#A3FF12] disabled:bg-[#A3FF12]/50 disabled:cursor-not-allowed text-black font-bold py-5 rounded-lg uppercase tracking-widest text-sm hover:bg-[#b4ff3d] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(163,255,18,0.2)] hover:shadow-[0_0_30px_rgba(163,255,18,0.4)] flex items-center justify-center gap-3"
              >
                <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
                {{ isSubmitting ? 'Enviando...' : 'Enviar Mensagem' }}
              </button>
            </div>

            <!-- Mensagem de Sucesso -->
            <div v-else class="py-12 flex flex-col items-center text-center animate-fade-in">
              <div class="w-20 h-20 bg-[#A3FF12]/20 rounded-full flex items-center justify-center mb-6 border border-[#A3FF12]/30">
                <CheckCircle2 class="w-10 h-10 text-[#A3FF12]" />
              </div>
              <h3 class="text-white text-2xl font-display uppercase mb-2">Mensagem Enviada!</h3>
              <p class="text-white/60 text-sm max-w-[250px] mx-auto">
                Obrigado pelo contato. Responderei o mais breve possível.
              </p>
              <button 
                @click="isSuccess = false"
                class="mt-8 text-[#A3FF12] text-xs font-mono uppercase tracking-widest hover:underline"
              >
                Enviar outra mensagem
              </button>
            </div>
          </form>
        </div>

      </div>

      <!-- Footer Credits -->
      <div class="mt-24 pt-12 border-t border-[#A3FF12]/10 text-center">
        <p class="text-white/70 font-mono text-[clamp(10px,2vw,16px)] uppercase tracking-[0.2em] sm:tracking-[0.4em] whitespace-nowrap overflow-hidden text-ellipsis">
          Desenvolvido por <span class="text-[#A3FF12]/70">Mateus Castro</span> ©
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { MessageCircle, Github, Linkedin, Instagram, Loader2, CheckCircle2 } from 'lucide-vue-next'
import { useContactForm } from '../composables/useContactForm'

const { form, isSubmitting, isSuccess, error, submitForm } = useContactForm()
</script>

<style scoped>
.font-display {
  font-family: 'Changa One', sans-serif;
}

input:focus, textarea:focus {
  background-color: rgba(163, 255, 18, 0.05);
}

@media (min-width: 1024px) and (max-width: 1175px) {
  .contact-title {
    font-size: 4rem !important;
  }
}
</style>
