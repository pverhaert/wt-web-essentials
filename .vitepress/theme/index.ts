import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick, h } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import './style.css'
import CodeSandbox from './components/CodeSandbox.vue'
import FullscreenSandbox from './components/FullscreenSandbox.vue'
import ProgressIndicator from './components/ProgressIndicator.vue'
import BackToTop from './components/BackToTop.vue'
import CanIUse from './components/CanIUse.vue'
import ImageFormatComparator from './components/ImageFormatComparator.vue'
import AiAssistant from './components/AiAssistant.vue'
import AiAssistantNavButton from './components/AiAssistantNavButton.vue'
import AiAssistantSetup from './components/AiAssistantSetup.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import PwaNotification from './components/PwaNotification.vue'
import ImageCarousel from './components/ImageCarousel.vue'
import FaviconGenerator from './components/FaviconGenerator.vue'
import MiniColorPicker from './components/MiniColorPicker.vue'
import ColorConverter from './components/ColorConverter.vue'
import LineHeightGame from './components/LineHeightGame.vue'
import GoogleFontsSimulator from './components/GoogleFontsSimulator.vue'
import DisplayVisualizer from './components/DisplayVisualizer.vue'
import TableWorkbench from './components/TableWorkbench.vue'
import ButtonBuilder from './components/ButtonBuilder.vue'
import VerticalAlignLab from './components/VerticalAlignLab.vue'
import ObjectFitSimulator from './components/ObjectFitSimulator.vue'
import BackgroundHeroSimulator from './components/BackgroundHeroSimulator.vue'
import PositioningSimulator from './components/PositioningSimulator.vue'
import FlexAxisViewer from './components/FlexAxisViewer.vue'
import FlexAlignmentLab from './components/FlexAlignmentLab.vue'
import FlexGrowShrinkVisualizer from './components/FlexGrowShrinkVisualizer.vue'
import StorybookCard from './components/StorybookCard.vue'
import PageSummary from './components/PageSummary.vue'
import PageSummaryModal from './components/PageSummaryModal.vue'
import TermTooltip from './components/TermTooltip.vue'
import NotFound from './NotFound.vue'
import {
  Info,
  Lightbulb,
  TriangleAlert,
  OctagonAlert,
  CircleAlert,
} from '@lucide/vue'

export default {
  extends: DefaultTheme,
  NotFound,

  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => [
        h(BackToTop),
        h(PageSummaryModal),
        h(AiAssistant),
        h(ConfirmModal),
        h(AiAssistantNavButton),
        h(PwaNotification),
        h(TermTooltip),
      ],
    })
  },

  enhanceApp({ app, router }: { app: any; router: any }) {
    // Registreer globale componenten
    app.component('CodeSandbox', CodeSandbox)
    app.component('FullscreenSandbox', FullscreenSandbox)
    app.component('ProgressIndicator', ProgressIndicator)
    app.component('CanIUse', CanIUse)
    app.component('ImageFormatComparator', ImageFormatComparator)
    app.component('AiAssistant', AiAssistant)
    app.component('AiAssistantNavButton', AiAssistantNavButton)
    app.component('AiAssistantSetup', AiAssistantSetup)
    app.component('PwaNotification', PwaNotification)
    app.component('ImageCarousel', ImageCarousel)
    app.component('FaviconGenerator', FaviconGenerator)
    app.component('MiniColorPicker', MiniColorPicker)
    app.component('ColorConverter', ColorConverter)
    app.component('LineHeightGame', LineHeightGame)
    app.component('GoogleFontsSimulator', GoogleFontsSimulator)
    app.component('DisplayVisualizer', DisplayVisualizer)
    app.component('TableWorkbench', TableWorkbench)
    app.component('ButtonBuilder', ButtonBuilder)
    app.component('VerticalAlignLab', VerticalAlignLab)
    app.component('ObjectFitSimulator', ObjectFitSimulator)
    app.component('BackgroundHeroSimulator', BackgroundHeroSimulator)
    app.component('PositioningSimulator', PositioningSimulator)
    app.component('FlexAxisViewer', FlexAxisViewer)
    app.component('FlexAlignmentLab', FlexAlignmentLab)
    app.component('FlexGrowShrinkVisualizer', FlexGrowShrinkVisualizer)
    app.component('StorybookCard', StorybookCard)
    app.component('PageSummary', PageSummary)

    // Registreer Lucide iconen
    app.component('LucideInfo', Info)
    app.component('LucideLightbulb', Lightbulb)
    app.component('LucideTriangleAlert', TriangleAlert)
    app.component('LucideOctagonAlert', OctagonAlert)
    app.component('LucideCircleAlert', CircleAlert)

    // CSS View Transitions bij paginawissels (SPA navigatie)
    if (typeof window !== 'undefined') {
      let finishTransition: (() => void) | null = null

      router.onBeforePageLoad = () => {
        if (finishTransition) {
          finishTransition()
          finishTransition = null
        }

        if (
          'startViewTransition' in document &&
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
          return new Promise<void>((ready) => {
            const updatePromise = new Promise<void>((resolve) => {
              finishTransition = resolve
            })
            document.startViewTransition(() => updatePromise)
            ready()
          })
        }
      }

      router.onAfterRouteChanged = () => {
        if (finishTransition) {
          nextTick(() => {
            if (finishTransition) {
              finishTransition()
              finishTransition = null
            }
          })
        }
      }
    }
  },

  setup() {
    const route = useRoute()

    const initZoom = () => {
      // Initialiseer medium-zoom op alle afbeeldingen in de hoofdinhoud
      // Afbeeldingen met klasse .no-zoom of binnen .image-carousel worden overgeslagen
      mediumZoom('.VPDoc .main img:not(.no-zoom):not(.image-carousel img)', {
        background: 'transparent',
        margin: 24,
      })
    }

    onMounted(() => {
      initZoom()

      // Zorg voor een zachte, vloeiende scroll wanneer een student op een ankerlink in de inhoudsopgave (outline) klikt
      window.addEventListener(
        'click',
        (e: MouseEvent) => {
          if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

          const target = e.target as HTMLElement | null
          const outlineLink = target?.closest('.outline-link') as HTMLAnchorElement | null
          if (!outlineLink) return

          const href = outlineLink.getAttribute('href')
          if (!href || !href.includes('#')) return

          const hash = href.slice(href.indexOf('#'))
          const targetId = decodeURIComponent(hash.slice(1))
          const targetEl = document.getElementById(targetId)

          if (targetEl) {
            e.preventDefault()
            // Pas URL netjes aan zonder abrupte sprong
            history.pushState(null, '', hash)
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        },
        { capture: true }
      )
    })

    // Herinitialiseer bij paginawissels (SPA routing)
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  },
}
