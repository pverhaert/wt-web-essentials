# TODO

## Handmating op te lossen

- [ ] Iets van zelftestjes voorzien? Welke vorm? Globaal of per hoofdstuk?
- [ ] Browser begint trager te reageren naargelang en meerdere fullscreen sandboxes open staan. Oplossing nodig?
- [ ] Extra AI mogelijkheden in de cursus tekst zelf voorzien? Bv: bij sandboxes om een gedetailleerde toelichting  te krijgen?
- [ ] Kunnen we iets met WebMCP in Chrome doen?
- [x] AI Tutor: probleem "Op welke pagina in de cursus hebben we dispaly: flow-root besproken?" opgelost via automatische llms.txt / course-topics.json generator en verrijkte systemInstruction in useAiTutor.ts

## Door agens op te lossen

- [x] AGENTS.md opspliten in /agents/skills (met bets parctice voorbeelden)
- [x] In CodeSandbox.vue en FullscreenSandbox.vue werken externe links nu betrouwbaar via een nieuw tabblad met een duidelijke pedagogische toelichting indien target="_blank" ontbreekt.
- [x] In CodeSandbox.vue en FullscreenSandbox.vue de inspringing automatisch herstellen bij openen en plakken, met een knop 'Inspringing herstellen'. Dit herstelt alleen de inspringing van bestaande regels.
- [x] In FullscreenSandbox.vue in de lokale versie per lijn via de gutter regelnummers de regelmarkering (highlight) toggelen. Handig bij het aanpassen van voorbeelden; de markeringen worden direct meegenomen in de IDE Export.
