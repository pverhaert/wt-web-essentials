<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Search, X, Check, Copy, Info } from '@lucide/vue'

interface Props {
  tall?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tall: false,
})

interface RawEmoji {
  hexcode: string
  label: string
  unicode: string
  group?: number
  order?: number
  tags?: string[]
}

interface EmojiEntry {
  hexcode: string
  unicode: string
  labelNl: string
  labelEn: string
  group: number
  order: number
  searchText: string
  htmlEntity: string
  codePoint: string
}

const CATEGORIES: Array<{ id: number | 'all'; label: string; sample: string }> = [
  { id: 'all', label: 'Alles', sample: '✨' },
  { id: 0, label: 'Smileys', sample: '😀' },
  { id: 1, label: 'Mensen', sample: '👋' },
  { id: 3, label: 'Dieren & natuur', sample: '🌿' },
  { id: 4, label: 'Eten & drinken', sample: '🍕' },
  { id: 5, label: 'Reizen', sample: '🚀' },
  { id: 6, label: 'Activiteiten', sample: '⚽' },
  { id: 7, label: 'Objecten', sample: '💻' },
  { id: 8, label: 'Symbolen', sample: '❤️' },
  { id: 9, label: 'Vlaggen', sample: '🏁' },
]

const PAGE_SIZE = 240
const RECENT_KEY = 'we_recent_emojis_v1'

const isLoading = ref(true)
const loadError = ref('')
const allEmojis = ref<EmojiEntry[]>([])
const query = ref('')
const activeCategory = ref<number | 'all'>('all')
const copyMode = ref<'emoji' | 'html'>('emoji')
const visibleLimit = ref(PAGE_SIZE)
const activeEmoji = ref<EmojiEntry | null>(null)
const copiedHex = ref('')
const copiedValue = ref('')
const recentHexcodes = ref<string[]>([])

let copyTimeout: ReturnType<typeof setTimeout> | null = null

function hexToHtmlEntity(hexcode: string): string {
  return hexcode
    .split('-')
    .map((part) => `&#x${part};`)
    .join('')
}

function hexToCodePoint(hexcode: string): string {
  return hexcode
    .split('-')
    .map((part) => `U+${part}`)
    .join(' ')
}

function loadRecents() {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      recentHexcodes.value = parsed.filter((x): x is string => typeof x === 'string').slice(0, 12)
    }
  } catch {
    // Negeer opslagfouten in private mode
  }
}

function saveRecent(hexcode: string) {
  const next = [hexcode, ...recentHexcodes.value.filter((h) => h !== hexcode)].slice(0, 12)
  recentHexcodes.value = next
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {
    // Negeer opslagfouten in private mode
  }
}

onMounted(async () => {
  loadRecents()
  try {
    const [nlMod, enMod] = await Promise.all([
      import('emojibase-data/nl/compact.json'),
      import('emojibase-data/en/compact.json'),
    ])
    const nlData = (nlMod.default ?? nlMod) as RawEmoji[]
    const enData = (enMod.default ?? enMod) as RawEmoji[]

    const enByHex = new Map<string, RawEmoji>()
    for (const item of enData) {
      enByHex.set(item.hexcode, item)
    }

    const entries: EmojiEntry[] = []
    for (const item of nlData) {
      if (typeof item.group !== 'number' || item.group === 2) continue
      const enItem = enByHex.get(item.hexcode)
      const labelNl = item.label || enItem?.label || ''
      const labelEn = enItem?.label || ''
      const tagsNl = item.tags ? item.tags.join(' ') : ''
      const tagsEn = enItem?.tags ? enItem.tags.join(' ') : ''

      entries.push({
        hexcode: item.hexcode,
        unicode: item.unicode,
        labelNl,
        labelEn,
        group: item.group,
        order: item.order ?? 99999,
        searchText: `${labelNl} ${labelEn} ${tagsNl} ${tagsEn} ${item.hexcode}`.toLowerCase(),
        htmlEntity: hexToHtmlEntity(item.hexcode),
        codePoint: hexToCodePoint(item.hexcode),
      })
    }

    entries.sort((a, b) => a.order - b.order)
    allEmojis.value = entries
    if (entries.length > 0) {
      activeEmoji.value = entries[0]
    }
  } catch (err) {
    loadError.value = 'Kon de emojilijst niet laden. Vernieuw de pagina om het opnieuw te proberen.'
    console.error('[EmojiPicker] Fout bij laden van emojibase-data:', err)
  } finally {
    isLoading.value = false
  }
})

watch([query, activeCategory], () => {
  visibleLimit.value = PAGE_SIZE
})

const recentEmojis = computed(() => {
  if (recentHexcodes.value.length === 0 || allEmojis.value.length === 0) return []
  const byHex = new Map(allEmojis.value.map((e) => [e.hexcode, e]))
  return recentHexcodes.value
    .map((hex) => byHex.get(hex))
    .filter((e): e is EmojiEntry => Boolean(e))
})

const filteredEmojis = computed(() => {
  const q = query.value.trim().toLowerCase()
  const tokens = q ? q.split(/\s+/).filter(Boolean) : []

  return allEmojis.value.filter((item) => {
    if (!tokens.length && activeCategory.value !== 'all' && item.group !== activeCategory.value) {
      return false
    }
    if (tokens.length && activeCategory.value !== 'all' && item.group !== activeCategory.value) {
      return false
    }
    if (tokens.length) {
      return tokens.every((t) => item.searchText.includes(t) || item.unicode === t)
    }
    return true
  })
})

const displayedEmojis = computed(() => {
  return filteredEmojis.value.slice(0, visibleLimit.value)
})

const hasMore = computed(() => filteredEmojis.value.length > visibleLimit.value)

function showMore() {
  visibleLimit.value += PAGE_SIZE
}

async function copyEmoji(item: EmojiEntry) {
  activeEmoji.value = item
  const valueToCopy = copyMode.value === 'html' ? item.htmlEntity : item.unicode

  try {
    await navigator.clipboard.writeText(valueToCopy)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = valueToCopy
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }

  saveRecent(item.hexcode)
  copiedHex.value = item.hexcode
  copiedValue.value = valueToCopy

  if (copyTimeout) clearTimeout(copyTimeout)
  copyTimeout = setTimeout(() => {
    copiedHex.value = ''
  }, 1800)
}
</script>

<template>
  <div class="emoji-picker" :class="{ 'is-tall': tall }">
    <div class="emoji-picker__toolbar">
      <div class="emoji-picker__search-wrap">
        <Search :size="16" class="emoji-picker__search-icon" aria-hidden="true" />
        <input
          v-model="query"
          type="search"
          class="emoji-picker__search"
          placeholder="Zoek in Nederlands of Engels (bv. raket, hart, rocket, laptop)..."
          aria-label="Zoek emoji's"
        />
        <button
          v-if="query"
          type="button"
          class="emoji-picker__clear"
          aria-label="Zoekopdracht wissen"
          @click="query = ''"
        >
          <X :size="15" />
        </button>
      </div>

      <div class="emoji-picker__mode" role="group" aria-label="Kopieerformaat">
        <button
          type="button"
          class="emoji-picker__mode-btn"
          :class="{ 'is-active': copyMode === 'emoji' }"
          @click="copyMode = 'emoji'"
        >
          Emoji
        </button>
        <button
          type="button"
          class="emoji-picker__mode-btn"
          :class="{ 'is-active': copyMode === 'html' }"
          @click="copyMode = 'html'"
        >
          HTML-code
        </button>
      </div>
    </div>

    <div class="emoji-picker__categories" role="tablist" aria-label="Emoji-categorieën">
      <button
        v-for="cat in CATEGORIES"
        :key="String(cat.id)"
        type="button"
        role="tab"
        :aria-selected="activeCategory === cat.id"
        class="emoji-picker__cat-btn"
        :class="{ 'is-active': activeCategory === cat.id }"
        @click="activeCategory = cat.id"
      >
        <span class="emoji-picker__cat-sample" aria-hidden="true">{{ cat.sample }}</span>
        <span>{{ cat.label }}</span>
      </button>
    </div>

    <div v-if="recentEmojis.length > 0 && !query" class="emoji-picker__recent">
      <span class="emoji-picker__recent-label">Recent:</span>
      <div class="emoji-picker__recent-list">
        <button
          v-for="item in recentEmojis"
          :key="`recent-${item.hexcode}`"
          type="button"
          class="emoji-picker__item is-compact"
          :class="{ 'is-copied': copiedHex === item.hexcode }"
          :title="`${item.labelNl} (${item.labelEn})`"
          @mouseenter="activeEmoji = item"
          @focus="activeEmoji = item"
          @click="copyEmoji(item)"
        >
          {{ item.unicode }}
        </button>
      </div>
    </div>

    <div class="emoji-picker__meta">
      <span v-if="isLoading">Emoji's laden...</span>
      <span v-else-if="loadError" class="emoji-picker__error">{{ loadError }}</span>
      <span v-else>
        <strong>{{ filteredEmojis.length }}</strong>
        {{ filteredEmojis.length === 1 ? 'emoji' : "emoji's" }}
        <span class="emoji-picker__hint"> — klik op een emoji om {{ copyMode === 'html' ? 'de HTML-code' : 'hem' }} te kopiëren</span>
      </span>
      <span v-if="copiedHex" class="emoji-picker__toast" role="status" aria-live="polite">
        <Check :size="14" aria-hidden="true" />
        <span>Gekopieerd: <code>{{ copiedValue }}</code></span>
      </span>
    </div>

    <div v-if="activeCategory === 9" class="emoji-picker__flag-note" role="note">
      <Info :size="16" class="emoji-picker__flag-note-icon" aria-hidden="true" />
      <span>
        <strong>Let op op Windows:</strong> Chrome en Edge tonen landvlaggen op Windows als tweeletterige landcodes (zoals <code>BE</code> of <code>NL</code>) omdat het Windows-emojilettertype geen landvlaggen bevat. Op macOS, iOS, Android en in Firefox verschijnen wel de gekleurde vlaggen.
      </span>
    </div>

    <div v-if="!isLoading && !loadError" class="emoji-picker__grid-wrap">
      <div v-if="displayedEmojis.length > 0" class="emoji-picker__grid">
        <button
          v-for="item in displayedEmojis"
          :key="item.hexcode"
          type="button"
          class="emoji-picker__item"
          :class="{ 'is-copied': copiedHex === item.hexcode }"
          :title="`${item.labelNl}${item.labelEn ? ' / ' + item.labelEn : ''}`"
          @mouseenter="activeEmoji = item"
          @focus="activeEmoji = item"
          @click="copyEmoji(item)"
        >
          {{ item.unicode }}
        </button>
      </div>

      <div v-else class="emoji-picker__empty">
        Geen emoji's gevonden voor "<strong>{{ query }}</strong>". Probeer een ander Nederlands of Engels trefwoord.
      </div>

      <div v-if="hasMore" class="emoji-picker__more-wrap">
        <button type="button" class="emoji-picker__more-btn" @click="showMore">
          Toon meer emoji's ({{ filteredEmojis.length - visibleLimit }} resterend)
        </button>
      </div>
    </div>

    <div v-if="activeEmoji" class="emoji-picker__footer">
      <div class="emoji-picker__preview">{{ activeEmoji.unicode }}</div>
      <div class="emoji-picker__details">
        <div class="emoji-picker__name">
          <strong>{{ activeEmoji.labelNl }}</strong>
          <span v-if="activeEmoji.labelEn && activeEmoji.labelEn !== activeEmoji.labelNl" class="emoji-picker__name-en">
            ({{ activeEmoji.labelEn }})
          </span>
        </div>
        <div class="emoji-picker__codes">
          <span>Unicode: <code>{{ activeEmoji.codePoint }}</code></span>
          <span>HTML: <code>{{ activeEmoji.htmlEntity }}</code></span>
        </div>
      </div>
      <button
        type="button"
        class="emoji-picker__copy-btn"
        @click="copyEmoji(activeEmoji)"
      >
        <Check v-if="copiedHex === activeEmoji.hexcode" :size="15" aria-hidden="true" />
        <Copy v-else :size="15" aria-hidden="true" />
        <span>{{ copiedHex === activeEmoji.hexcode ? 'Gekopieerd' : 'Kopieer' }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.emoji-picker {
  margin: 1.5rem 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.emoji-picker__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.emoji-picker__search-wrap {
  position: relative;
  flex: 1 1 260px;
  display: flex;
  align-items: center;
}

.emoji-picker__search-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.emoji-picker__search {
  width: 100%;
  padding: 0.5rem 2.1rem 0.5rem 2.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.emoji-picker__search:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.emoji-picker__search::-webkit-search-cancel-button,
.emoji-picker__search::-webkit-search-decoration {
  -webkit-appearance: none;
  appearance: none;
}

.emoji-picker__clear {
  position: absolute;
  right: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
}

.emoji-picker__clear:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.emoji-picker__mode {
  display: inline-flex;
  padding: 2px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.emoji-picker__mode-btn {
  padding: 0.35rem 0.7rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.emoji-picker__mode-btn.is-active {
  background: var(--vp-c-brand-1);
  color: #ffffff;
}

.emoji-picker__categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.emoji-picker__cat-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  border: 1px solid transparent;
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;
}

.emoji-picker__cat-btn:hover {
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.emoji-picker__cat-btn.is-active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.emoji-picker__cat-sample {
  font-size: 0.95rem;
  line-height: 1;
}

.emoji-picker__recent {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  overflow-x: auto;
}

.emoji-picker__recent-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.emoji-picker__recent-list {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.emoji-picker__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
}

.emoji-picker__hint {
  color: var(--vp-c-text-3);
}

.emoji-picker__error {
  color: var(--vp-c-danger-1);
}

.emoji-picker__toast {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.18rem 0.6rem;
  border-radius: 999px;
  background: var(--vp-c-tip-soft);
  color: var(--vp-c-tip-1);
  font-weight: 600;
  font-size: 0.8rem;
}

.emoji-picker__toast code {
  font-size: 0.78rem;
  background: transparent;
  padding: 0;
  color: inherit;
}

.emoji-picker__flag-note {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  margin: 0 1rem 0.6rem;
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--vp-custom-block-info-border);
  border-radius: 8px;
  background: var(--vp-custom-block-info-bg);
  color: var(--vp-custom-block-info-text);
  font-size: 0.82rem;
  line-height: 1.45;
}

.emoji-picker__flag-note-icon {
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.emoji-picker__grid-wrap {
  max-height: 360px;
  overflow-y: auto;
  padding: 0.35rem 1rem 0.85rem;
}

.emoji-picker.is-tall .emoji-picker__grid-wrap {
  max-height: 540px;
}

.emoji-picker__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
  gap: 0.25rem;
}

.emoji-picker__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  font-size: 1.55rem;
  line-height: 1;
  cursor: pointer;
  transition: transform 0.12s ease, background-color 0.12s ease, border-color 0.12s ease;
}

.emoji-picker__item.is-compact {
  width: 34px;
  height: 34px;
  font-size: 1.25rem;
}

.emoji-picker__item:hover,
.emoji-picker__item:focus-visible {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-brand-1);
  transform: scale(1.1);
  outline: none;
}

.emoji-picker__item.is-copied {
  background: var(--vp-c-tip-soft);
  border-color: var(--vp-c-tip-1);
}

.emoji-picker__empty {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
}

.emoji-picker__more-wrap {
  display: flex;
  justify-content: center;
  padding-top: 0.85rem;
}

.emoji-picker__more-btn {
  padding: 0.45rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.emoji-picker__more-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.emoji-picker__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.emoji-picker__preview {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  font-size: 1.85rem;
  line-height: 1;
  flex-shrink: 0;
}

.emoji-picker__details {
  flex: 1 1 200px;
  min-width: 0;
}

.emoji-picker__name {
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  text-transform: capitalize;
}

.emoji-picker__name-en {
  font-weight: 400;
  color: var(--vp-c-text-2);
  text-transform: none;
}

.emoji-picker__codes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.15rem;
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
}

.emoji-picker__copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: #ffffff;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.emoji-picker__copy-btn:hover {
  opacity: 0.9;
}
</style>
