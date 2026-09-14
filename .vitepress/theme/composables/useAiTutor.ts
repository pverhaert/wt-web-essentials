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

// Gedeelde reactieve staat over alle instanties van useAiTutor
const apiKey = ref('')
const studentName = ref('')
const selectedModel = ref('')
const availableModels = ref<ModelOption[]>([])
const messages = ref<ChatMessage[]>([])
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const isInitialized = ref(false)
const isDrawerOpen = ref(false)
const courseLlmsContext = ref<string>('')

async function loadCourseContext() {
  if (courseLlmsContext.value || typeof window === 'undefined') return
  try {
    const res = await fetch('/llms.txt')
    if (res.ok) {
      const txt = await res.text()
      // Bewaar een schone versie van de sitemap & speciale technische verwijzingen
      courseLlmsContext.value = txt
    }
  } catch (e) {
    console.warn('Kon /llms.txt niet laden voor AI context:', e)
  }
}

export function useAiTutor() {
  const init = () => {
    if (typeof window === 'undefined') return

    // Altijd de meest actuele waarden uit localStorage ophalen
    const storedKey = localStorage.getItem(STORAGE_KEYS.API_KEY) || ''
    const storedName = localStorage.getItem(STORAGE_KEYS.STUDENT_NAME) || ''
    const storedModel = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL) || ''

    apiKey.value = storedKey
    studentName.value = storedName

    if (storedModel) {
      selectedModel.value = storedModel
    }

    if (!isInitialized.value) {
      try {
        const savedHistory = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY)
        if (savedHistory) {
          messages.value = JSON.parse(savedHistory)
        }
      } catch (e) {
        console.warn('Kon chatgeschiedenis niet laden:', e)
      }

      // Luister naar storage wijzigingen tussen tabs of vensters
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEYS.SELECTED_MODEL && e.newValue) {
          selectedModel.value = e.newValue
        }
        if (e.key === STORAGE_KEYS.STUDENT_NAME) {
          studentName.value = e.newValue || ''
        }
        if (e.key === STORAGE_KEYS.API_KEY) {
          apiKey.value = e.newValue || ''
        }
      })

      if (apiKey.value) {
        fetchModels()
      }

      loadCourseContext()

      isInitialized.value = true
    }
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
      // Valideer de sleutel via models.list() i.p.v. een specifiek model aan te roepen
      // Zo kan een uitgefaseerd model nooit een valse foutmelding veroorzaken
      const response = await ai.models.list({ config: { pageSize: 10 } })
      let hasModels = false
      for await (const _ of response) {
        hasModels = true
        break
      }
      if (hasModels) {
        return { success: true, message: 'Verbinding met Gemini API succesvol tot stand gebracht!' }
      }
      return { success: false, message: 'Geen modellen beschikbaar voor deze API-sleutel.' }
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

        // Enkel Gemini Flash en Gemini Pro modellen tonen (geen versie 2.x, geen Omni, geen speciale modellen)
        const isGeminiFlashOrPro =
          id.startsWith('gemini') &&
          !id.includes('2.') &&
          (id.includes('flash') || id.includes('pro')) &&
          !id.includes('omni') &&
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

        // Controleer of de huidige selectie nog steeds geldig en actief is bij Google
        const currentSelected = selectedModel.value
        const isStillValid = currentSelected && fetchedList.some((m) => m.id === currentSelected)

        if (!isStillValid) {
          // Kies automatisch het beste beschikbare Flash-model
          const bestChoice =
            fetchedList.find((m) => m.id.includes('flash') && !m.id.includes('lite'))?.id ||
            fetchedList.find((m) => m.id.includes('flash'))?.id ||
            fetchedList[0].id
          saveSelectedModel(bestChoice)
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

      if (!courseLlmsContext.value) {
        await loadCourseContext()
      }

      const systemInstruction = `Je bent de virtuele AI-tutor voor het opleidingsonderdeel 'Web Essentials' aan Thomas More Hogeschool (Campus Geel, IT Factory).
De doelgroep bestaat uit eerstejaarsstudenten ICT zonder voorkennis van programmeren of webontwikkeling.
${studentName.value ? `De student waarmee je praat heet ${studentName.value}. Spreek de student vriendelijk en bemoedigend aan met de voornaam.` : ''}
${pageContext ? `De student bekijkt momenteel de cursuspagina: "${pageContext.title}" (route: ${pageContext.path}). Gebruik deze context indien de vraag betrekking heeft op het huidige onderwerp.` : ''}

${courseLlmsContext.value ? `Hieronder vind je de officiële inhoudsopgave, onderwerpenmatrix en technische verwijzingen van de cursus Web Essentials:
---
${courseLlmsContext.value}
---` : ''}

Didactische richtlijnen voor jouw antwoorden:
1. Spreek altijd in correct, helder Nederlands en gebruik consequent de jij-vorm (geen "u" of "jullie").
2. Leg technische begrippen altijd meteen begrijpelijk uit bij de eerste vermelding.
3. Begeleid de student didactisch (scaffolding): leg denkstappen uit, geef hints en toon compacte, duidelijke codefragmenten. Kauw grotere opdrachten of huiswerktaken niet zomaar integraal voor, maar laat de student zelf nadenken.
4. Focus strikt op moderne standaarden: HTML5 en CSS3 conform de cursus. Vermeld geen frameworks zoals React, Vue, Angular, Bootstrap of Tailwind tenzij de student er expliciet naar informeert.
5. Wanneer een student vraagt waar een bepaalde tag, eigenschap of techniek in de cursus staat (bijvoorbeeld display: flow-root, flexbox, box-sizing, transformaties):
   - Raadpleeg dan altijd de bovenstaande cursusstructuur en technische verwijzingen.
   - Geef direct het exacte hoofdstuk en link daar naartoe met een Markdown-link (bijv. "Dat bespreken we in het hoofdstuk [Afbeeldingen & Achtergronden](/css/afbeeldingen#het-probleem-van-de-inzakkende-container-clearfix) bij de uitleg over clearfix en float.").
   - Leg kort uit waarom het juist in dát hoofdstuk aan bod komt.
6. Houd codevoorbeelden minimaal, semantisch correct en werkend.
7. Geen emoji's in je uitleg. Geen en-streepjes of em-streepjes als leestekens in lopende zinnen.
8. Gebruik in voorbeelden uitsluitend Thomas More Campus Geel (Kleinhoefstraat 4, 2440 Geel).`

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

      // Bepaal het actieve model dynamisch uit de selectie of de geladen modellenlijst
      let activeModel = selectedModel.value
      if (!activeModel && availableModels.value.length > 0) {
        activeModel =
          availableModels.value.find((m) => m.id.includes('flash') && !m.id.includes('lite'))?.id ||
          availableModels.value.find((m) => m.id.includes('flash'))?.id ||
          availableModels.value[0].id
      }

      if (!activeModel) {
        errorMessage.value = 'Er is geen actief Gemini-model geselecteerd of beschikbaar. Klik op "Actuele modellen ophalen".'
        return false
      }

      const response = await ai.models.generateContent({
        model: activeModel,
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
