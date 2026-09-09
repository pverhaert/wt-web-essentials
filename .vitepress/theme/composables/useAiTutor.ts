import { ref, computed } from 'vue'
import { GoogleGenAI } from '@google/genai'

export interface ChatMessage {
  id: string
  role: 'user' | 'model'
  content: string
  timestamp: number
}

export interface ModelOption {
  id: string
  name: string
}

const STORAGE_KEYS = {
  API_KEY: 'we_gemini_api_key',
  STUDENT_NAME: 'we_student_name',
  SELECTED_MODEL: 'we_gemini_model',
  CHAT_HISTORY: 'we_chat_history',
}

const DEFAULT_MODELS: ModelOption[] = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Aanbevolen, snel & betrouwbaar)' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (Diepe redenering)' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Hoge beschikbaarheid)' },
]

// Gedeelde reactieve staat over alle instanties van useAiTutor
const apiKey = ref('')
const studentName = ref('')
const selectedModel = ref('gemini-2.5-flash')
const availableModels = ref<ModelOption[]>([...DEFAULT_MODELS])
const messages = ref<ChatMessage[]>([])
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const isInitialized = ref(false)
const isDrawerOpen = ref(false)

export function useAiTutor() {
  const init = () => {
    if (isInitialized.value || typeof window === 'undefined') return

    apiKey.value = localStorage.getItem(STORAGE_KEYS.API_KEY) || ''
    studentName.value = localStorage.getItem(STORAGE_KEYS.STUDENT_NAME) || ''
    selectedModel.value = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL) || 'gemini-2.5-flash'

    try {
      const savedHistory = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY)
      if (savedHistory) {
        messages.value = JSON.parse(savedHistory)
      }
    } catch (e) {
      console.warn('Kon chatgeschiedenis niet laden:', e)
    }

    if (apiKey.value) {
      fetchModels()
    }

    isInitialized.value = true
  }

  const hasApiKey = computed(() => !!apiKey.value.trim())

  const maskedApiKey = computed(() => {
    const key = apiKey.value.trim()
    if (!key) return ''
    if (key.length <= 10) return '••••••••'
    return key.slice(0, 6) + '••••••••' + key.slice(-4)
  })

  const saveApiKey = async (key: string): Promise<boolean> => {
    const cleanKey = key.trim()
    if (!cleanKey) return false

    apiKey.value = cleanKey
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.API_KEY, cleanKey)
    }

    await fetchModels()
    return true
  }

  const clearApiKey = () => {
    apiKey.value = ''
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.API_KEY)
    }
  }

  const saveStudentName = (name: string) => {
    const cleanName = name.trim()
    studentName.value = cleanName
    if (typeof window !== 'undefined') {
      if (cleanName) {
        localStorage.setItem(STORAGE_KEYS.STUDENT_NAME, cleanName)
      } else {
        localStorage.removeItem(STORAGE_KEYS.STUDENT_NAME)
      }
    }
  }

  const clearStudentName = () => {
    studentName.value = ''
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.STUDENT_NAME)
    }
  }

  const saveSelectedModel = (modelId: string) => {
    selectedModel.value = modelId
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, modelId)
    }
  }

  const testApiKey = async (testKey: string): Promise<{ success: boolean; message: string }> => {
    try {
      const ai = new GoogleGenAI({ apiKey: testKey.trim() })
      const res = await ai.models.generateContent({
        model: selectedModel.value || 'gemini-2.5-flash',
        contents: 'Test verbinding. Antwoord kort met "OK".',
      })
      if (res.text) {
        return { success: true, message: 'Verbinding met Gemini API succesvol tot stand gebracht!' }
      }
      return { success: false, message: 'Geen geldig antwoord ontvangen van de API.' }
    } catch (err: any) {
      console.error('Fout bij testen van API-sleutel:', err)
      const errDetail = err?.message || 'Onbekende fout'
      if (errDetail.includes('API_KEY_INVALID') || errDetail.includes('403') || errDetail.includes('401')) {
        return { success: false, message: 'De opgegeven API-sleutel is ongeldig of niet geautoriseerd.' }
      }
      return { success: false, message: `Verbindingsfout: ${errDetail}` }
    }
  }

  const fetchModels = async () => {
    if (!apiKey.value) return
    try {
      const ai = new GoogleGenAI({ apiKey: apiKey.value })
      const response = await ai.models.list({ config: { pageSize: 50 } })
      const fetchedList: ModelOption[] = []

      for await (const m of response) {
        const rawName = m.name || ''
        const id = rawName.replace(/^models\//, '')
        const displayName = m.displayName || id

        // Enkel Gemini Flash en Gemini Pro modellen tonen (conform wens van docent)
        const isGeminiFlashOrPro =
          id.startsWith('gemini') &&
          (id.includes('flash') || id.includes('pro')) &&
          !id.includes('embedding') &&
          !id.includes('imagen') &&
          !id.includes('image') &&
          !id.includes('tts') &&
          !id.includes('whisper') &&
          !id.includes('realtime') &&
          !id.includes('audio') &&
          !id.includes('robotics') &&
          !id.includes('custom')

        if (isGeminiFlashOrPro) {
          fetchedList.push({
            id,
            name: `${displayName} (${id})`,
          })
        }
      }

      if (fetchedList.length > 0) {
        // Sorteer: Flash modellen eerst, dan Pro modellen, nieuwste versies bovenaan
        fetchedList.sort((a, b) => {
          const aIsFlash = a.id.includes('flash')
          const bIsFlash = b.id.includes('flash')
          if (aIsFlash && !bIsFlash) return -1
          if (!aIsFlash && bIsFlash) return 1
          return b.id.localeCompare(a.id)
        })

        availableModels.value = fetchedList
        // Indien het huidige geselecteerde model niet meer voorkomt of een verouderde latest-alias is, kies gemini-2.5-flash
        if (!fetchedList.some((m) => m.id === selectedModel.value) || selectedModel.value.includes('latest')) {
          const defaultChoice =
            fetchedList.find((m) => m.id === 'gemini-2.5-flash')?.id ||
            fetchedList.find((m) => m.id.includes('2.5') && m.id.includes('flash'))?.id ||
            fetchedList.find((m) => m.id.includes('flash'))?.id ||
            fetchedList[0].id
          saveSelectedModel(defaultChoice)
        }
      }
    } catch (err) {
      console.warn('Kon actuele modellenlijst niet ophalen:', err)
    }
  }

  const saveChatHistory = () => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages.value))
    } catch (e) {
      console.warn('Kon chatgeschiedenis niet opslaan:', e)
    }
  }

  const clearChat = () => {
    messages.value = []
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY)
    }
  }

  const executeGenerate = async (
    pageContext?: { title: string; path: string }
  ): Promise<boolean> => {
    errorMessage.value = null
    isLoading.value = true

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey.value })

      const systemInstruction = `Je bent de virtuele AI-tutor voor het opleidingsonderdeel 'Web Essentials' aan Thomas More Hogeschool (Campus Geel, IT Factory).
De doelgroep bestaat uit eerstejaarsstudenten ICT zonder voorkennis van programmeren of webontwikkeling.
${studentName.value ? `De student waarmee je praat heet ${studentName.value}. Spreek de student vriendelijk en bemoedigend aan met de voornaam.` : ''}
${pageContext ? `De student bekijkt momenteel de cursuspagina: "${pageContext.title}" (route: ${pageContext.path}). Gebruik deze context indien de vraag betrekking heeft op het huidige onderwerp.` : ''}

Didactische richtlijnen voor jouw antwoorden:
1. Spreek altijd in correct, helder Nederlands en gebruik consequent de jij-vorm (geen "u" of "jullie").
2. Leg technische begrippen altijd meteen begrijpelijk uit bij de eerste vermelding.
3. Begeleid de student didactisch (scaffolding): leg denkstappen uit, geef hints en toon compacte, duidelijke codefragmenten. Kauw grotere opdrachten of huiswerktaken niet zomaar integraal voor, maar laat de student zelf nadenken.
4. Focus strikt op moderne standaarden: HTML5 en CSS3 conform de cursus. Vermeld geen frameworks zoals React, Vue, Angular, Bootstrap of Tailwind tenzij de student er expliciet naar informeert.
5. Houd codevoorbeelden minimaal, semantisch correct en werkend.
6. Geen emoji's in je uitleg. Geen en-streepjes of em-streepjes als leestekens in lopende zinnen.
7. Gebruik in voorbeelden uitsluitend Thomas More Campus Geel (Kleinhoefstraat 4, 2440 Geel).`

      // Converteer voorgaande berichten naar het formaat voor de Gemini API
      // We nemen maximaal de laatste 12 berichten mee voor een compacte context
      const historySlice = messages.value.slice(-12)

      // Voeg opeenvolgende berichten met dezelfde rol samen zodat de Gemini API dit altijd accepteert
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = []
      for (const m of historySlice) {
        if (contents.length > 0 && contents[contents.length - 1].role === m.role) {
          contents[contents.length - 1].parts.push({ text: m.content })
        } else {
          contents.push({
            role: m.role,
            parts: [{ text: m.content }],
          })
        }
      }

      const response = await ai.models.generateContent({
        model: selectedModel.value || 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
        },
      })

      const replyText = response.text || 'Ik kon helaas geen antwoord formuleren op deze vraag.'

      const modelMsg: ChatMessage = {
        id: 'msg_' + Date.now() + '_model',
        role: 'model',
        content: replyText,
        timestamp: Date.now(),
      }

      messages.value.push(modelMsg)
      saveChatHistory()
      return true
    } catch (err: any) {
      console.error('Fout bij communicatie met Gemini API:', err)
      const rawMsg = err?.message || 'Er is een onbekende fout opgetreden.'

      let parsedMessage = rawMsg
      try {
        const json = typeof rawMsg === 'string' && rawMsg.trim().startsWith('{') ? JSON.parse(rawMsg) : null
        if (json?.error?.message) {
          parsedMessage = json.error.message
        }
      } catch {}

      if (rawMsg.includes('API_KEY_INVALID') || rawMsg.includes('403') || rawMsg.includes('401')) {
        errorMessage.value =
          'Jouw API-sleutel lijkt ongeldig of niet geautoriseerd te zijn. Controleer je instellingen.'
      } else if (rawMsg.includes('RESOURCE_EXHAUSTED') || rawMsg.includes('429')) {
        errorMessage.value =
          'Het quotum voor dit model is tijdelijk bereikt (max. 15 verzoeken/minuut). Schakel in de instellingen over naar een ander model of probeer zo dadelijk opnieuw.'
      } else if (rawMsg.includes('503') || rawMsg.includes('UNAVAILABLE') || rawMsg.includes('high demand')) {
        errorMessage.value =
          'Dit Gemini-model ondervindt momenteel een tijdelijke piekbelasting bij Google (503). Probeer het over enkele ogenblikken opnieuw.'
      } else {
        errorMessage.value = `Fout: ${parsedMessage}`
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  const sendMessage = async (
    userText: string,
    pageContext?: { title: string; path: string }
  ): Promise<boolean> => {
    const text = userText.trim()
    if (!text || !apiKey.value || isLoading.value) return false

    // Voeg gebruikersbericht toe
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now() + '_user',
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }
    messages.value.push(userMsg)
    saveChatHistory()

    return await executeGenerate(pageContext)
  }

  const retryLastMessage = async (
    pageContext?: { title: string; path: string }
  ): Promise<boolean> => {
    if (isLoading.value || !apiKey.value || messages.value.length === 0) return false
    return await executeGenerate(pageContext)
  }

  const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value
  }

  const openDrawer = () => {
    isDrawerOpen.value = true
  }

  const closeDrawer = () => {
    isDrawerOpen.value = false
  }

  return {
    apiKey,
    hasApiKey,
    maskedApiKey,
    studentName,
    selectedModel,
    availableModels,
    messages,
    isLoading,
    errorMessage,
    isDrawerOpen,
    toggleDrawer,
    openDrawer,
    closeDrawer,
    init,
    saveApiKey,
    clearApiKey,
    saveStudentName,
    clearStudentName,
    saveSelectedModel,
    testApiKey,
    fetchModels,
    sendMessage,
    retryLastMessage,
    clearChat,
  }
}
