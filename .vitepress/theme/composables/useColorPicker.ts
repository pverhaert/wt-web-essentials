import { WidgetType, EditorView, Decoration, type DecorationSet, ViewPlugin, type ViewUpdate } from '@codemirror/view'
import { RangeSetBuilder, type Extension } from '@codemirror/state'

/**
 * Regex voor het herkennen van geldige CSS-kleurnotaties in code:
 * 1. HEX: #rgb, #rgba, #rrggbb, #rrggbbaa
 * 2. RGB/RGBA: rgb(...) of rgba(...)
 * 3. HSL/HSLA: hsl(...) of hsla(...)
 * 4. OKLCH: oklch(...)
 */
const COLOR_REGEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b|(?:rgba?|hsla?|oklch)\([^)]+\)/g

type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch'

interface RGBA {
  r: number // 0 - 255
  g: number // 0 - 255
  b: number // 0 - 255
  a: number // 0 - 1
}

interface HSV {
  h: number // 0 - 360
  s: number // 0 - 100
  v: number // 0 - 100
}

/**
 * Converteert sRGB (0-1) naar linear sRGB
 */
function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

/**
 * Converteert RGBA (0-255) naar OKLCH: L (0-1), C (0-0.4), H (0-360)
 */
function rgbToOklch(r: number, g: number, b: number): { l: number; c: number; h: number } {
  const lr = srgbToLinear(r / 255)
  const lg = srgbToLinear(g / 255)
  const lb = srgbToLinear(b / 255)

  // Naar Oklab LMS
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_

  const C = Math.sqrt(a * a + b_ * b_)
  let H = Math.atan2(b_, a) * (180 / Math.PI)
  if (H < 0) H += 360

  return {
    l: Math.round(L * 1000) / 1000,
    c: Math.round(C * 1000) / 1000,
    h: Math.round(H * 10) / 10,
  }
}

/**
 * Converteert RGBA naar HSL
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min

  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  }
}

function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  s /= 100
  v /= 100

  const i = Math.floor((h / 60) % 6)
  const f = h / 60 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)

  let r = 0, g = 0, b = 0
  switch (i) {
    case 0: r = v; g = t; b = p; break
    case 1: r = q; g = v; b = p; break
    case 2: r = p; g = v; b = t; break
    case 3: r = p; g = q; b = v; break
    case 4: r = t; g = p; b = v; break
    case 5: r = v; g = p; b = q; break
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

/**
 * Parseert een CSS-kleurstring naar RGBA
 */
function parseCssColorToRgba(str: string): { rgba: RGBA; format: ColorFormat } {
  const trimmed = str.trim().toLowerCase()

  // Formaat detecteren
  let format: ColorFormat = 'hex'
  if (trimmed.startsWith('rgb')) format = 'rgb'
  else if (trimmed.startsWith('hsl')) format = 'hsl'
  else if (trimmed.startsWith('oklch')) format = 'oklch'

  // HEX
  if (trimmed.startsWith('#')) {
    let clean = trimmed.slice(1)
    let a = 1
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('')
    } else if (clean.length === 4) {
      a = parseInt(clean[3] + clean[3], 16) / 255
      clean = clean.slice(0, 3).split('').map(c => c + c).join('')
    } else if (clean.length === 8) {
      a = parseInt(clean.slice(6, 8), 16) / 255
      clean = clean.slice(0, 6)
    }

    return {
      rgba: {
        r: parseInt(clean.slice(0, 2), 16) || 0,
        g: parseInt(clean.slice(2, 4), 16) || 0,
        b: parseInt(clean.slice(4, 6), 16) || 0,
        a: Math.round(a * 100) / 100,
      },
      format,
    }
  }

  // Gebruik browser canvas / element om rgb/hsl/oklch veilig te ontleden
  if (typeof document !== 'undefined') {
    try {
      const dummy = document.createElement('div')
      dummy.style.color = trimmed
      document.body.appendChild(dummy)
      const computed = window.getComputedStyle(dummy).color
      document.body.removeChild(dummy)

      // computed is altijd rgb(r, g, b) of rgba(r, g, b, a)
      const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
      if (match) {
        return {
          rgba: {
            r: parseInt(match[1], 10),
            g: parseInt(match[2], 10),
            b: parseInt(match[3], 10),
            a: match[4] !== undefined ? Math.round(parseFloat(match[4]) * 100) / 100 : 1,
          },
          format,
        }
      }
    } catch {
      // Fallback
    }
  }

  return {
    rgba: { r: 232, g: 119, b: 34, a: 1 },
    format: 'hex',
  }
}

/**
 * Formatteert RGBA naar de gewenste CSS-string
 */
function formatColorString(rgba: RGBA, format: ColorFormat): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0')

  switch (format) {
    case 'hex': {
      const baseHex = `#${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}`
      if (rgba.a < 1) {
        const alphaHex = Math.round(rgba.a * 255).toString(16).padStart(2, '0')
        return `${baseHex}${alphaHex}`
      }
      return baseHex
    }
    case 'rgb': {
      if (rgba.a < 1) {
        return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`
      }
      return `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`
    }
    case 'hsl': {
      const hsl = rgbToHsl(rgba.r, rgba.g, rgba.b)
      if (rgba.a < 1) {
        return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${rgba.a})`
      }
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    }
    case 'oklch': {
      const oklch = rgbToOklch(rgba.r, rgba.g, rgba.b)
      const lPercent = Math.round(oklch.l * 1000) / 10
      if (rgba.a < 1) {
        return `oklch(${lPercent}% ${oklch.c} ${oklch.h} / ${rgba.a})`
      }
      return `oklch(${lPercent}% ${oklch.c} ${oklch.h})`
    }
  }
}

/**
 * Globale referentie naar de actieve popover (singleton)
 */
let activePopover: HTMLElement | null = null
let activeCleanup: (() => void) | null = null

function closeActivePopover() {
  if (activeCleanup) {
    activeCleanup()
    activeCleanup = null
  }
  if (activePopover && activePopover.parentNode) {
    activePopover.parentNode.removeChild(activePopover)
    activePopover = null
  }
}

/**
 * Toont de IDE Color Popover met RGBA, HSL, OKLCH en Alpha slider
 */
function showColorPopover(
  targetEl: HTMLElement,
  initialColorStr: string,
  onColorChange: (newColorCode: string) => void
) {
  closeActivePopover()

  const parsed = parseCssColorToRgba(initialColorStr)
  let currentRgba: RGBA = { ...parsed.rgba }
  let currentFormat: ColorFormat = parsed.format
  let currentHsv: HSV = rgbToHsv(currentRgba.r, currentRgba.g, currentRgba.b)

  const popover = document.createElement('div')
  popover.className = 'cm-ide-color-popover'
  popover.setAttribute('role', 'dialog')
  popover.setAttribute('aria-label', 'Kleurenkiezer met formaten en transparantie')

  // Snelle presets
  const presets = [
    '#e87722', '#005691', '#1f2937', '#ffffff', '#000000',
    '#10b981', '#ef4444', '#f59e0b', '#6366f1', '#ec4899',
  ]

  popover.innerHTML = `
    <!-- 1. Saturation / Value vlak -->
    <div class="cm-cp-sat-val" style="background-color: hsl(${currentHsv.h}, 100%, 50%);">
      <div class="cm-cp-white"></div>
      <div class="cm-cp-black"></div>
      <div class="cm-cp-pointer" style="left: ${currentHsv.s}%; top: ${100 - currentHsv.v}%;"></div>
    </div>

    <!-- 2. Hue en Alpha Sliders + Pipet + Preview cirkel -->
    <div class="cm-cp-controls">
      <button type="button" class="cm-cp-eyedropper-btn" title="Kleur kiezen van scherm (Pipet)">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m14 7 3 3L8.5 18.5 5 19l.5-3.5L14 7z"></path>
          <path d="m16 5 1.5-1.5a1.4 1.4 0 0 1 2 0l1 1a1.4 1.4 0 0 1 0 2L19 8"></path>
        </svg>
      </button>
      <div class="cm-cp-sliders">
        <!-- Hue Slider -->
        <input type="range" class="cm-cp-hue-slider" min="0" max="360" value="${currentHsv.h}" title="Kleurtoon (Hue)" />
        <!-- Alpha Slider met schaakbord achtergrond -->
        <div class="cm-cp-alpha-track">
          <div class="cm-cp-alpha-gradient"></div>
          <input type="range" class="cm-cp-alpha-slider" min="0" max="100" value="${Math.round(currentRgba.a * 100)}" title="Transparantie (Alpha)" />
        </div>
      </div>
      <div class="cm-cp-preview-box">
        <div class="cm-cp-preview-checkered"></div>
        <div class="cm-cp-preview-color"></div>
      </div>
    </div>

    <!-- 3. Formaatwisselaar en Invoerveld -->
    <div class="cm-cp-footer">
      <button type="button" class="cm-cp-format-btn" title="Klik om te wisselen tussen HEX, RGB, HSL en OKLCH">
        <span class="cm-cp-format-text">${currentFormat.toUpperCase()}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <input type="text" class="cm-cp-color-input-text" spellcheck="false" />
    </div>

    <!-- 4. Presets -->
    <div class="cm-cp-presets">
      ${presets.map(p => `<button type="button" class="cm-cp-preset-dot" style="background-color: ${p};" data-color="${p}" title="${p}"></button>`).join('')}
    </div>
  `

  document.body.appendChild(popover)
  activePopover = popover

  // Positionering
  function updatePosition() {
    const rect = targetEl.getBoundingClientRect()
    const popWidth = 236
    const popHeight = 285

    let left = rect.left
    let top = rect.bottom + 6

    if (left + popWidth > window.innerWidth - 12) {
      left = window.innerWidth - popWidth - 12
    }
    if (left < 12) left = 12

    if (top + popHeight > window.innerHeight - 12) {
      top = rect.top - popHeight - 6
    }

    popover.style.left = `${Math.round(left)}px`
    popover.style.top = `${Math.round(top)}px`
  }

  updatePosition()

  // Elementen
  const satValBox = popover.querySelector('.cm-cp-sat-val') as HTMLElement
  const pointer = popover.querySelector('.cm-cp-pointer') as HTMLElement
  const hueSlider = popover.querySelector('.cm-cp-hue-slider') as HTMLInputElement
  const alphaSlider = popover.querySelector('.cm-cp-alpha-slider') as HTMLInputElement
  const alphaGradient = popover.querySelector('.cm-cp-alpha-gradient') as HTMLElement
  const previewColor = popover.querySelector('.cm-cp-preview-color') as HTMLElement
  const eyedropperBtn = popover.querySelector('.cm-cp-eyedropper-btn') as HTMLButtonElement
  const formatBtn = popover.querySelector('.cm-cp-format-btn') as HTMLButtonElement
  const formatText = popover.querySelector('.cm-cp-format-text') as HTMLElement
  const colorInput = popover.querySelector('.cm-cp-color-input-text') as HTMLInputElement

  // Pipet functionaliteit (EyeDropper API)
  const hasEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window
  if (!hasEyeDropper && eyedropperBtn) {
    eyedropperBtn.disabled = true
    eyedropperBtn.title = 'Pipet wordt niet ondersteund in deze browser (vereist Chrome, Edge of Opera)'
    eyedropperBtn.classList.add('is-disabled')
  }

  function updateUi(triggerCodeChange = true) {
    // 1. Herbereken RGB uit HSV
    const rgb = hsvToRgb(currentHsv.h, currentHsv.s, currentHsv.v)
    currentRgba.r = rgb.r
    currentRgba.g = rgb.g
    currentRgba.b = rgb.b

    // 2. UI-elementen bijwerken
    satValBox.style.backgroundColor = `hsl(${currentHsv.h}, 100%, 50%)`
    pointer.style.left = `${Math.max(0, Math.min(100, currentHsv.s))}%`
    pointer.style.top = `${Math.max(0, Math.min(100, 100 - currentHsv.v))}%`

    // Alpha gradient balk
    alphaGradient.style.background = `linear-gradient(to right, transparent, rgb(${rgb.r}, ${rgb.g}, ${rgb.b}))`

    // Preview
    previewColor.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${currentRgba.a})`

    // Formatteer naar huidige string
    const formatted = formatColorString(currentRgba, currentFormat)
    formatText.textContent = currentFormat.toUpperCase()
    colorInput.value = formatted

    if (triggerCodeChange) {
      onColorChange(formatted)
    }
  }

  // Initiële UI render
  updateUi(false)

  // 1. Saturation / Value slepen
  let isDraggingSatVal = false
  function handleSatValMove(e: MouseEvent | TouchEvent) {
    const rect = satValBox.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    const x = Math.max(0, Math.min(rect.width, clientX - rect.left))
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top))

    currentHsv.s = Math.round((x / rect.width) * 100)
    currentHsv.v = Math.round((1 - y / rect.height) * 100)
    updateUi(true)
  }

  satValBox.addEventListener('mousedown', (e) => {
    isDraggingSatVal = true
    handleSatValMove(e)
    e.preventDefault()
  })

  // 2. Hue Slider
  hueSlider.addEventListener('input', () => {
    currentHsv.h = parseInt(hueSlider.value, 10) || 0
    updateUi(true)
  })

  // 3. Alpha Slider
  alphaSlider.addEventListener('input', () => {
    currentRgba.a = Math.round(parseInt(alphaSlider.value, 10) / 100 * 100) / 100
    updateUi(true)
  })

  // 3b. Pipet (EyeDropper)
  if (hasEyeDropper && eyedropperBtn) {
    eyedropperBtn.addEventListener('click', async (e) => {
      e.stopPropagation()
      try {
        const eyeDropper = new (window as any).EyeDropper()
        const result = await eyeDropper.open()
        if (result && result.sRGBHex) {
          const parsed = parseCssColorToRgba(result.sRGBHex)
          // Behoud eventuele bestaande alpha
          currentRgba.r = parsed.rgba.r
          currentRgba.g = parsed.rgba.g
          currentRgba.b = parsed.rgba.b
          currentHsv = rgbToHsv(currentRgba.r, currentRgba.g, currentRgba.b)
          hueSlider.value = currentHsv.h.toString()
          updateUi(true)
        }
      } catch {
        // Gebruiker heeft pipet geannuleerd (Escape) of fout opgetreden
      }
    })
  }

  // 4. Formaatwisselaar (HEX -> RGB -> HSL -> OKLCH -> HEX)
  const formatOrder: ColorFormat[] = ['hex', 'rgb', 'hsl', 'oklch']
  formatBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    const nextIdx = (formatOrder.indexOf(currentFormat) + 1) % formatOrder.length
    currentFormat = formatOrder[nextIdx]
    updateUi(true)
  })

  // 5. Directe invoer in het tekstveld
  colorInput.addEventListener('change', () => {
    const text = colorInput.value.trim()
    const parsedInput = parseCssColorToRgba(text)
    currentRgba = { ...parsedInput.rgba }
    currentFormat = parsedInput.format
    currentHsv = rgbToHsv(currentRgba.r, currentRgba.g, currentRgba.b)
    hueSlider.value = currentHsv.h.toString()
    alphaSlider.value = Math.round(currentRgba.a * 100).toString()
    updateUi(true)
  })

  // 6. Presets
  popover.querySelectorAll('.cm-cp-preset-dot').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const color = (btn as HTMLElement).dataset.color || '#e87722'
      const parsedPreset = parseCssColorToRgba(color)
      currentRgba = { ...parsedPreset.rgba }
      currentHsv = rgbToHsv(currentRgba.r, currentRgba.g, currentRgba.b)
      hueSlider.value = currentHsv.h.toString()
      alphaSlider.value = Math.round(currentRgba.a * 100).toString()
      updateUi(true)
    })
  })

  // Globale listeners
  function onWindowMouseMove(e: MouseEvent) {
    if (isDraggingSatVal) handleSatValMove(e)
  }

  function onWindowMouseUp() {
    isDraggingSatVal = false
  }

  function onOutsideClick(e: MouseEvent) {
    if (!popover.contains(e.target as Node) && !targetEl.contains(e.target as Node)) {
      closeActivePopover()
    }
  }

  function onWindowKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') closeActivePopover()
  }

  window.addEventListener('mousemove', onWindowMouseMove)
  window.addEventListener('mouseup', onWindowMouseUp)
  window.addEventListener('scroll', updatePosition, true)
  window.addEventListener('resize', updatePosition)
  setTimeout(() => {
    window.addEventListener('click', onOutsideClick)
    window.addEventListener('keydown', onWindowKeyDown)
  }, 10)

  activeCleanup = () => {
    window.removeEventListener('mousemove', onWindowMouseMove)
    window.removeEventListener('mouseup', onWindowMouseUp)
    window.removeEventListener('scroll', updatePosition, true)
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('click', onOutsideClick)
    window.removeEventListener('keydown', onWindowKeyDown)
  }
}

/**
 * CodeMirror 6 Widget voor het interactieve kleurblokje (Color Swatch)
 */
class ColorSwatchWidget extends WidgetType {
  color: string
  from: number
  to: number

  constructor(color: string, from: number, to: number) {
    super()
    this.color = color
    this.from = from
    this.to = to
  }

  eq(other: ColorSwatchWidget): boolean {
    return this.color === other.color && this.from === other.from && this.to === other.to
  }

  toDOM(view: EditorView): HTMLElement {
    const wrap = document.createElement('span')
    wrap.className = 'cm-color-swatch-wrap'
    wrap.setAttribute('aria-hidden', 'true')

    const swatch = document.createElement('span')
    swatch.className = 'cm-color-swatch'
    swatch.style.backgroundColor = this.color
    swatch.title = `Kleur aanpassen (${this.color})`

    swatch.addEventListener('click', (e) => {
      e.stopPropagation()
      e.preventDefault()

      showColorPopover(swatch, this.color, (newColorCode) => {
        view.dispatch({
          changes: {
            from: this.from,
            to: this.to,
            insert: newColorCode,
          },
        })

        this.color = newColorCode
        this.to = this.from + newColorCode.length
        swatch.style.backgroundColor = newColorCode
        swatch.title = `Kleur aanpassen (${newColorCode})`
      })
    })

    wrap.appendChild(swatch)
    return wrap
  }

  ignoreEvent(): boolean {
    return true
  }
}

/**
 * Bouwt de decoratieset voor het zichtbare documentbereik
 */
function buildColorDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>()
  const doc = view.state.doc

  for (const { from, to } of view.visibleRanges) {
    const text = doc.sliceString(from, to)
    COLOR_REGEX.lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = COLOR_REGEX.exec(text)) !== null) {
      const matchText = match[0]
      const matchFrom = from + match.index
      const matchTo = matchFrom + matchText.length

      const widget = new ColorSwatchWidget(matchText, matchFrom, matchTo)
      builder.add(
        matchFrom,
        matchFrom,
        Decoration.widget({
          widget,
          side: -1,
        })
      )
    }
  }

  return builder.finish()
}

/**
 * ViewPlugin die kleurdecoraties beheert
 */
const colorSwatchPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet

    constructor(view: EditorView) {
      this.decorations = buildColorDecorations(view)
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = buildColorDecorations(update.view)
      }
    }

    destroy() {
      closeActivePopover()
    }
  },
  {
    decorations: (v) => v.decorations,
  }
)

/**
 * CodeMirror 6 extensie voor interactieve Color Pickers in CSS/HTML
 */
export function createColorPickerExtension(): Extension {
  return [
    colorSwatchPlugin,
    EditorView.baseTheme({
      '.cm-color-swatch-wrap': {
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle',
        position: 'relative',
        marginRight: '4px',
        marginLeft: '1px',
      },
      '.cm-color-swatch': {
        display: 'inline-block',
        width: '12px',
        height: '12px',
        borderRadius: '3px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        verticalAlign: 'middle',
        transition: 'transform 0.12s ease, box-shadow 0.12s ease',
      },
      '.cm-color-swatch:hover': {
        transform: 'scale(1.3)',
        boxShadow: '0 0 0 1.5px #e87722, 0 2px 6px rgba(0, 0, 0, 0.35)',
      },
    }),
  ]
}
