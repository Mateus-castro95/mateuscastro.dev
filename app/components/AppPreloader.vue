<script setup lang="ts">
const emit = defineEmits(['enter'])
const isVisible = ref(true)

const onEnter = () => {
  isVisible.value = false
  emit('enter')
}
</script>

<template>
  <Transition name="fade">
    <div v-if="isVisible" class="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      <button 
        @click="onEnter"
        class="px-8 py-2 border border-white/20 hover:border-white transition-all duration-300"
      >
        <span class="text-white text-[10px] font-mono tracking-[0.5em] uppercase">
          Enter
        </span>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.fade-leave-active {
  transition: opacity 1.5s ease-in-out;
}
.fade-leave-to {
  opacity: 0;
}
</style>
