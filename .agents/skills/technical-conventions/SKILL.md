---
name: technical-conventions
description: >
  Technische naamgevingsconventies, frontmatter-regels en linkrichtlijnen
  voor de Web Essentials cursus. Gebruik deze skill bij het aanmaken van
  nieuwe bestanden, het schrijven van interne links of het instellen van
  frontmatter.
---

# Skill: Technische richtlijnen en naamgeving

## Bestandsnamen

| Regel | Correct | Fout |
|---|---|---|
| Kleine letters | `box-model.md` | `BoxModel.md` |
| Koppeltekens, geen underscores | `speciale-tekens.md` | `speciale_tekens.md` |
| Koppeltekens, geen spaties | `media-queries.md` | `media queries.md` |
| Nederlands | `hyperlinks.md` | `links.md` |

Voorbeelden van correcte bestandsnamen:
- `box-model.md`
- `speciale-tekens.md`
- `media-queries.md`
- `2d-transformaties.md`
- `webfonts.md`

## Frontmatter

Elke cursuspagina begint met YAML-frontmatter. De `---` mogen **uitsluitend** in de frontmatter staan, nooit als visuele scheiding tussen secties van de pagina.

**Goed:**
```yaml
---
title: Box Model & Randen
---
```

**Fout (extra velden):**
```yaml
---
title: Box Model & Randen
author: AI
date: 2024-01-01
---
```

**Fout (--- als scheiding verderop in de pagina):**
```markdown
---
title: Hyperlinks
---

# Hyperlinks

## Interne links

...

---

## Externe links
```

## Interne links

Gebruik altijd **relatieve paden** voor interne links binnen de cursus. Gebruik nooit absolute URL's naar de live site.

**Goed:**
```markdown
[Basistags](./basistags)
[Ga naar CSS3](/css/)
[Box Model](../css/box-model)
```

**Fout:**
```markdown
[Basistags](https://wt-web-essentials.netlify.app/html/basistags)
[Basistags](/html/basistags.html)
```

## Externe links

Externe links naar documentatie en tools zijn toegestaan en worden aangemoedigd. Gebruik een beschrijvende linktekst, niet de kale URL.

**Goed:**
```markdown
Meer informatie op [MDN Web Docs](https://developer.mozilla.org/nl/docs/Web/HTML/Element/table).
```

**Fout:**
```markdown
Meer informatie op https://developer.mozilla.org/nl/docs/Web/HTML/Element/table.
```

### Aanbevolen externe bronnen

- **MDN Web Docs** (https://developer.mozilla.org) — voor HTML-tags, CSS-eigenschappen en JavaScript
- **W3C** (https://www.w3.org) — voor officiële webstandaarden
- **Google Fonts** (https://fonts.google.com) — voor webfonts
- **Can I Use** (https://caniuse.com) — voor browserondersteuning

## Mapstructuur cursuspagina's

```
html/
  index.md          ← /html/
  basistags.md      ← /html/basistags
  afbeeldingen.md   ← /html/afbeeldingen
  hyperlinks.md     ← /html/hyperlinks
  speciale-tekens.md
  lijsten.md
  tabellen.md
  images/           ← afbeeldingen voor HTML-hoofdstukken

css/
  index.md          ← /css/
  lettertypen.md
  webfonts.md
  kleuren.md
  variabelen.md
  lijsten.md
  tabellen.md
  box-model.md
  display.md
  afbeeldingen.md
  positionering.md
  flexbox.md
  grid.md
  media-queries.md
  2d-transformaties.md
  transities.md
  animaties.md
  3d-transformaties.md
  images/           ← afbeeldingen voor CSS-hoofdstukken

tools/
  phpstorm.md
  git.md
  devtools.md
  ai-assistent.md
  ...
```
