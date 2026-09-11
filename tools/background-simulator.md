---
title: Background Simulator
---

# Background & Hero Banner Simulator

Met deze interactieve tool experimenteer je met CSS-achtergronden (`background-image`, `background-size`, `background-position` en `background-repeat`) en ontdek je hoe je professionele hero-banners bouwt met donkere kleurverloop-overlays.

::: info Onderdeel van de CSS Afbeeldingen module
Deze tool sluit rechtstreeks aan bij de theorie uit het hoofdstuk [CSS Afbeeldingen & Achtergronden](/css/afbeeldingen).
:::

## Interactieve Simulator

Kies hieronder de gewenste achtergrondgrootte (`cover`, `contain` of `auto`), bepaal het ankerpunt met het positierooster, test verschillende schermbreedtes en schakel de donkere verlooplaag in voor optimaal contrast:

<BackgroundHeroSimulator />

## Belangrijkste inzichten over CSS Achtergronden

Bij het stylen van banners en secties met CSS-achtergronden zijn dit de gouden regels:

### 1. Altijd `background-color` als veilige terugval
Stel altijd een achtergrondkleur in die aansluit bij de foto. Mocht de foto door een trage netwerkverbinding vertraging oplopen of ontbreken, dan blijft witte tekst altijd perfect leesbaar voor de bezoeker.

### 2. De winnende combinatie voor headers: `center / cover`
Met `background-size: cover` en `background-position: center` vult de achtergrond altijd het volledige vlak, ongeacht of de bezoeker surft via een breed 4K-scherm of een compacte smartphone.

### 3. De verkorte notatie (Shorthand)
Met de CSS-eigenschap `background` bundel je alles in één compacte regel:
```css
.hero {
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)),
              url('banner.webp') center / cover no-repeat #1e2d5a;
}
```
Let hierbij op de verplichte schuine streep (`/`) tussen de positie en de grootte.
