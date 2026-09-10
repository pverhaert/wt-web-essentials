---
title: Kleurenomzetter
---

# CSS Kleurenomzetter

Met deze interactieve webapp zet je kleuren direct om tussen alle moderne en klassieke CSS-notatiesystemen: HEX (6 en 8 tekens), RGB / RGBA, HSL / HSLA, OKLCH en de officiële CSS-kleurnamen.

::: info Onderdeel van de kleurenmodule
Deze omzetter sluit rechtstreeks aan bij de theorie uit het hoofdstuk [CSS Kleuren](/css/kleuren).
:::

## Live Kleurenomzetter

Kies een kleur met behulp van de ingebouwde kleurenkiezer, pas de transparantie (alfa) aan of selecteer een van de themakleuren van Thomas More. Kopieer met één klik de exacte CSS-notatie naar jouw klembord voor gebruik in PhpStorm.

<ColorConverter />

## Overzicht van de ondersteunde notaties

Wanneer je een kleur selecteert, berekent de omzetter automatisch alle equivalente notatiewijzen:

### 1. Hexadecimaal (HEX)
- **6-cijferige HEX (`#RRGGBB`):** De meest gebruikte notatie op het web. Twee hexadecimale cijfers per kleurkanaal (rood, groen, blauw) van `00` (0) tot `ff` (255).
- **8-cijferige HEX (`#RRGGBBAA`):** Breidt de standaard hex-code uit met twee extra cijfers voor de alfawaarde (transparantie), waarbij `00` staat voor volledig doorzichtig en `ff` voor 100% dekkend.
- **3-cijferige verkorte notatie (`#RGB`):** Enkel mogelijk wanneer beide tekens per kanaal identiek zijn (bijvoorbeeld `#ee8822` wordt verkort tot `#e82`).

### 2. RGB en RGBA
- **Klassiek decimaal:** `rgb(232, 119, 34)` waarbij elk kanaal een decimaal getal tussen `0` en `255` krijgt.
- **Met transparantie:** `rgba(232, 119, 34, 0.85)` met een alfawaarde tussen `0` (volledig transparant) en `1` (volledig dekkend).
- **Moderne spatiesyntax:** `rgb(232 119 34 / 0.85)` met spaties tussen de kleurkanalen en een schuine streep (`/`) voor het alfakanaal.

### 3. HSL (Hue, Saturation, Lightness)
- **Tinthoek (Hue):** De hoek op de kleurencirkel van `0deg` tot `360deg` (0° = rood, 120° = groen, 240° = blauw).
- **Verzadiging (Saturation):** Van `0%` (volledig grijs) tot `100%` (de meest felle en zuivere kleur).
- **Lichtheid (Lightness):** Van `0%` (zwart) via `50%` (de pure kleur) tot `100%` (wit). Ideaal om snel lichte tinten of donkere schaduwtinten af te leiden.

### 4. OKLCH (Perceptueel uniform)
- **L (Lightness):** De werkelijk door het menselijk oog waargenomen helderheid. Twee kleuren met dezelfde `L`-waarde ogen voor onze hersenen even helder, ongeacht de kleurtoon.
- **C (Chroma):** De kleurkracht en zuiverheid.
- **H (Hue):** De hoek op de kleurencirkel van `0` tot `360`.

### 5. Benoemde kleuren (Named Colors)
- Wanneer jouw geselecteerde kleur exact overeenkomt met een van de 148 officiële Engelse CSS-kleurnamen (zoals `chocolate`, `tomato`, `navy` of `white`), toont de omzetter automatisch deze benaming.
