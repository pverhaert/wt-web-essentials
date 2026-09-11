---
title: Button Builder
---

# Button Builder: Van Hyperlink naar Actieknop

Met deze interactieve tool ontdek je stap voor stap waarom je hyperlinks (`<a>`) moet voorzien van `display: inline-block` om er professionele, gebruiksvriendelijke knoppen van te maken.

::: info Onderdeel van de lay-out modules
Deze tool sluit rechtstreeks aan bij de theorie en oefeningen uit het hoofdstuk [CSS Display](/css/display).
:::

## Interactieve Simulator

Wandel door de vier stappen van de transformatie en bekijk wat er met de omringende tekstregels gebeurt zodra er binnenruimte (`padding`) wordt toegevoegd:

<ButtonBuilder />

## Belangrijkste inzichten bij het ontwerpen van knoppen

### 1. De beginnersvalkuil: padding op een inline element
Wanneer je enkel kleuren en binnenruimte (`padding`) toevoegt aan een gewone link zónder zijn `display` aan te passen, tekent de browser de achtergrond wel, maar berekent hij **geen extra regelhoogte** in de alinea. Het resultaat is een lelijke overlap met de zin erboven en de zin eronder.

### 2. De oplossing met `display: inline-block`
Zodra je `display: inline-block` declareert, behandelt de browser het element intern als een volwaardig blok:
- Alle vier de zijden van de `padding` duwen de omringende tekstregels nu netjes weg.
- Verticale marges (`margin-top` en `margin-bottom`) worden nu wél gerespecteerd.
- Je kan de knop indien gewenst een vaste `min-width` geven zodat alle actieknoppen op een pagina even breed worden.
