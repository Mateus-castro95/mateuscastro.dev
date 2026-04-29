import { ref } from 'vue'

export const useContactForm = () => {
  const form = ref({
    name: '',
    email: '',
    message: ''
  })

  const isSubmitting = ref(false)
  const isSuccess = ref(false)
  const error = ref<string | null>(null)

  const submitForm = async () => {
    // Evita envios duplicados
    if (isSubmitting.value) return

    isSubmitting.value = true
    error.value = null

    try {
      // --- CONFIGURAÇÃO REAL ---
      const FORMSPREE_ID = 'mnjwazkj' 
      
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(form.value)
      })

      if (response.ok) {
        isSuccess.value = true
        form.value = { name: '', email: '', message: '' }
      } else {
        throw new Error('Falha ao enviar')
      }
    } catch (err) {
      error.value = 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente ou entre em contato via WhatsApp.'
      console.error('Form error:', err)
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    form,
    isSubmitting,
    isSuccess,
    error,
    submitForm
  }
}
