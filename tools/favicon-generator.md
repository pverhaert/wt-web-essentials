---
title: Favicon Generator
---

# Favicon Generator (.ico)

Met deze ingebouwde tool genereer je rechtstreeks in je webbrowser een volwaardig, multi-resolutie `favicon.ico`-bestand voor jouw website.

::: tip Waarom een .ico-bestand?
Hoewel moderne browsers ook SVG- en PNG-favicons ondersteunen, zoeken zoekmachines, crawlers en oudere browsers standaard naar `favicon.ico` in de hoofdmap van je website. Door een geldig `.ico`-bestand te voorzien, vermijd je 404-foutmeldingen in je webserverlogboeken.
:::

<FaviconGenerator />

## Hoe gebruik je deze tool?

1. **Afbeelding kiezen:** Klik op het uploadvak om een afbeelding te selecteren (PNG, JPG, WebP of SVG). Zorg bij voorkeur voor een vierkante verhouding (1:1). Je kan ook op de knop **Gebruik voorbeeld** klikken om het Thomas More-logo te testen.
2. **Kwaliteit en formaten controleren:** De tool genereert automatisch de drie essentiële icoonresoluties in één bestand:
   - **16&times;16 pixels:** Voor weergave in compacte browsertabbladen.
   - **32&times;32 pixels:** Voor scherpere tabbladen en bladwijzerbalken op standaardschermen.
   - **48&times;48 pixels:** Voor snelkoppelingen op het bureaublad en schermen met hoge pixeldichtheid.
3. **Downloaden:**
   - Klik op **Download favicon.ico** om het samengestelde bestand te downloaden.
   - Optioneel kan je ook een losse **PNG (32&times;32)** downloaden als moderne fallback.
4. **Plaatsen in je HTML-code:**
   Kopieer het gegenereerde codefragment en plak dit in het `<head>`-gedeelte van je pagina.

::: info Volledig lokaal en privacyvriendelijk
De conversie gebeurt volledig in je browser via JavaScript en de HTML5 Canvas API. Er wordt geen enkel bestand geüpload naar een externe server.
:::
