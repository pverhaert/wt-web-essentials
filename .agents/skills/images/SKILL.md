---
name: images
description: >
  Richtlijnen voor het gebruik van afbeeldingen in de Web Essentials cursus.
  Beschrijft formaten, alt-tekst, mapstructuur en medium-zoom integratie.
  Gebruik deze skill wanneer je afbeeldingen toevoegt aan een cursuspagina.
---

# Skill: Afbeeldingen

## Basisregel

Gebruik afbeeldingen uitsluitend om concepten te verduidelijken, nooit puur als decoratie. Elke afbeelding moet een directe relatie hebben met de omliggende tekst.

## Bestandsformaten

| Formaat | Gebruik voor | Voordeel |
|---|---|---|
| WebP | Foto's, screenshots | Kleine bestandsgrootte, brede browserondersteuning |
| SVG | Diagrammen, iconen, illustraties | Schaalbaar zonder kwaliteitsverlies |
| PNG | Afbeeldingen met transparantie, schema's | Verliesvrije compressie |
| JPEG | Foto's (als WebP niet beschikbaar) | Goede compressie voor foto's |

**Voorkeursvolgorde:** WebP > SVG > PNG > JPEG

## Mapstructuur

Sla afbeeldingen op in een `images/`-map **naast** het bijbehorende `.md`-bestand:

```
html/
  afbeeldingen.md
  images/
    rasterafbeelding-voorbeeld.webp
    vectorafbeelding-voorbeeld.svg

css/
  box-model.md
  images/
    box-model-diagram.svg
    margin-padding-verschil.webp
```

## Gebruik in markdown

```markdown
![Beschrijving van de afbeelding](./images/naam-van-afbeelding.webp)
```

### Regels voor `alt`-tekst

- Schrijf een beschrijvende alt-tekst: wat ziet de student op de afbeelding?
- Gebruik geen generieke teksten zoals "afbeelding", "screenshot" of "diagram"
- Beschrijf de informatie die de afbeelding overbrengt

**Goed:**
```markdown
![Schematische weergave van het CSS box model met content, padding, border en margin](./images/box-model.svg)
```

**Fout:**
```markdown
![afbeelding](./images/box-model.svg)
![](./images/box-model.svg)
```

## Medium-zoom

Afbeeldingen worden automatisch zoombaar via de medium-zoom-integratie van VitePress. De student kan op elke afbeelding klikken voor een vergroot overzicht. Geen extra configuratie nodig.

## Naamgeving van afbeeldingsbestanden

Volg dezelfde naamgevingsconventies als voor `.md`-bestanden:
- Kleine letters
- Koppeltekens in plaats van spaties of underscores
- Beschrijvende, Nederlandstalige namen

**Goed:** `box-model-diagram.svg`, `lettertypestapel-voorbeeld.webp`

**Fout:** `BoxModel.svg`, `afb1.png`, `screenshot_2024.webp`
