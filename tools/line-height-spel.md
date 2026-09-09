---
title: Line-height Spel
---

# Line-height Spel

## Wat is line-height?

De `line-height`-eigenschap (de eigenschap voor regelafstand) bepaalt hoeveel verticale ruimte er tussen twee tekstregels staat. Een juiste regelafstand maakt tekst prettiger en gemakkelijker leesbaar.

```css
p {
  line-height: 1.5;
}
```

::: info Eenheden voor line-height
De meest gebruikte notatie is een **getal zonder eenheid** (bijv. `1.5`). Dat getal wordt vermenigvuldigd met de `font-size` om de effectieve regelafstand te berekenen. Bij een `font-size` van 16 px geeft `line-height: 1.5` dus een regelafstand van 24 px.
:::

## Ontdek jouw ideale regelafstand

Hieronder zie je meerdere tekstblokken, elk met een andere `line-height`. Klik op de blokken die je **het minst mooi of het minst leesbaar** vindt. Zo elimineer je blok per blok totdat er nog één overblijft: jouw persoonlijke voorkeur.

<LineHeightGame />

## Richtlijnen van typografen

Professionele typografen en de WCAG-richtlijnen (de internationale richtlijnen voor webtoegankelijkheid) geven de volgende aanbevelingen:

| Waarde | Gebruik |
|--------|---------|
| `1` | Geen regelafstand; tekst plakt op elkaar. Vermijd dit voor lopende tekst. |
| `1.2` | Geschikt voor koppen (`<h1>` tot `<h3>`). |
| `1.4` | Minimum voor lopende tekst. |
| **`1.5`** | **Veelgebruikte standaard voor lopende tekst.** |
| `1.618` | De gulden snede (verhouding uit de Fibonacci-rij). Wordt ook wel de perfecte verhouding genoemd. |
| `2` | Dubbele regelafstand; nuttig voor conceptdocumenten of grote lettertypes. |
| `> 2` | Te ruim voor normaal gebruik. |

::: tip Gulden snede en leesbaarheid
De waarden `1.5` en `1.618` liggen dicht bij elkaar. Veel studenten kiezen spontaan voor een van deze twee. Dat is geen toeval: onze ogen vinden verhoudingen die in de natuur terugkomen (zoals de gulden snede) van nature prettig.
:::

