---
title: Semantiscope
description: Visualiseer en controleer de semantische HTML5-structuur en koppenhiërarchie van je webpagina met de Semantiscope Chrome-extensie.
---

# Semantiscope

**Semantiscope** is een handige Chrome-extensie die speciaal is ontworpen om de semantische structuur van een webpagina visueel in kaart te brengen.

## Belangrijkste mogelijkheden

- **Koppenhiërarchie:** De extensie bouwt een overzichtelijke, interactieve boomstructuur van alle koppen (`<h1>` tot en met `<h6>`) op de pagina.
- **Semantische context:** Bij elke kop toont Semantiscope het bovenliggende semantische element, zoals `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>` of `<footer>`.
- **Foutdetectie:** Als je een niveau in de koppenstructuur overslaat (bijvoorbeeld van `<h2>` meteen naar `<h4>`), plaatst Semantiscope een duidelijke waarschuwingsmarkering zodat je de structuurfout direct herkent en kunt oplossen.

## Installatie

Installeer de extensie gratis via de [Chrome Web Store pagina van Semantiscope](https://chromewebstore.google.com/detail/semantiscope/bfjbbdpfodmgbkoeliepdimkmijifele).

<ImageCarousel
  title="Semantiscope Chrome Extensie"
  :thumbnails="true"
  :nav="true"
  :dots="true"
  :auto="true"
  aspectRatio="16/10"
>
  <img src="./extensions/semantiscope_1.webp" alt="Koppenhiërarchie en boomstructuur inspecteren" />
  <img src="./extensions/semantiscope_2.webp" alt="Semantische context en bovenliggende containers" />
  <img src="./extensions/semantiscope_3.webp" alt="Foutdetectie bij overgeslagen kopniveaus" />
  <img src="./extensions/semantiscope_4.webp" alt="Volledig visueel overzicht van de paginastructuur" />
  <img src="./extensions/semantiscope_5.webp" alt="Elementendetails en waarschuwingen" />
</ImageCarousel>
