---
title: AI Cursusassistent
---

# AI Cursusassistent

::: info Activatie van de AI Tutor vereist
Om gebruik te kunnen maken van de **AI Tutor** in deze cursus, dien je eerst eenmalig een gratis Google Gemini API-sleutel en jouw voornaam in te stellen.

Vul jouw gegevens in bij het configuratiepaneel [verderop op deze pagina](#jouw-assistent-instellen). Zodra jouw sleutel is opgeslagen, verdwijnt het uitroepteken en kan je de AI Tutor op elk gewenst moment oproepen via de knop in de navigatiebalk bovenaan of met de sneltoets <kbd>Ctrl</kbd> + <kbd>I</kbd>.
:::

## Wat is de AI Cursusassistent?

Tijdens het leren van HTML5 en CSS3 kom je ongetwijfeld momenten tegen waarop je vastloopt: een CSS-eigenschap die niet doet wat je verwacht, een tag waarvan je de exacte werking wilt weten, of een foutmelding in de browserconsole.

Om je hierbij direct te ondersteunen, beschikt Web Essentials over een ingebouwde virtuele AI-tutor. Deze assistent maakt gebruik van **Google Gemini** via de officiële `@google/genai` bibliotheek.

De assistent is speciaal afgestemd op de leerstof van het eerste jaar ICT aan Thomas More Campus Geel. Hij geeft geen kant-en-klare oplossingen om klakkeloos over te nemen, maar legt concepten stap voor stap uit en helpt je zelf ontdekken waar een fout in jouw code zit.

::: tip Waarom een eigen API-sleutel?
Google stelt via **Google AI Studio** een zeer royale gratis laag beschikbaar voor studenten en ontwikkelaars. Door je eigen sleutel te gebruiken, heb je volledige controle over jouw gegevens, beschik je over jouw eigen quotum en leer je meteen werken met professionele AI-ontwikkelaarstools van Google.
:::

## Stappenplan: Jouw gratis API-sleutel aanmaken

Het aanmaken van een API-sleutel duurt minder dan twee minuten en is volledig gratis:

1. **Ga naar Google AI Studio:**
   Surf naar [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).

2. **Meld je aan:**
   Meld je aan met jouw Google-account.

3. **Genereer een nieuwe sleutel:**
   Klik op de blauwe knop **Create API key** (of **API-sleutel maken**). Kies een projectnaam of accepteer het standaard voorgestelde project.

4. **Kopieer de sleutel:**
   Er verschijnt een lange tekstreeks die begint met `AIzaSy...`. Klik op het kopieericoon om de sleutel naar jouw klembord te kopiëren.

::: warning Deel jouw sleutel nooit
Een API-sleutel is strikt persoonlijk. Deel jouw sleutel nooit met medestudenten en plaats hem nooit in een openbare GitHub repository.
:::

## Jouw assistent instellen

Vul hieronder jouw gegevens en API-sleutel in. De sleutel wordt uitsluitend lokaal in de browser van jouw eigen laptop bewaard (`localStorage`). Er worden geen sleutels naar een centrale server van Thomas More verzonden.

<AiAssistantSetup />

## Hoe gebruik je de assistent effectief?

Zodra jouw API-sleutel is opgeslagen, wordt de knop **AI Tutor** in de hoofdnavigatiebalk bovenaan actief (direct rechts naast het zoekveld). 

Als je hierop klikt (of de sneltoets <kbd>Ctrl</kbd> + <kbd>I</kbd> gebruikt), schuift het chatvenster direct open aan de rechterzijde van het scherm. Je hoeft de huidige pagina dus nooit te verlaten om een vraag te stellen.

### 1. Paginacontekst benutten

De assistent weet automatisch welk hoofdstuk je momenteel leest. Als je bijvoorbeeld op de pagina over [Tabellen](/html/tabellen) zit, kan je direct een gerichte vraag stellen zoals:

> *"Waarom moet de caption tag direct na het openen van table staan?"*

De tutor weet meteen dat het over de tabelstructuur in HTML gaat en stemt zijn uitleg daarop af.

### 2. Code debuggen en fouten opsporen

Als een oefening niet naar wens werkt, kopieer je jouw HTML- of CSS-code en plak je deze in het invoerveld. Formuleer een duidelijke vraag:

> *"Mijn afbeelding staat niet netjes gecentreerd op het scherm. Wat doe ik hier fout?"*
> 
> ```html
> <div class="banner">
>   <img src="foto.webp" alt="Campus Geel">
> </div>
> ```

De tutor analyseert jouw code, legt uit waarom de standaard weergave van een afbeelding (inline) dit gedrag veroorzaakt, en geeft gerichte tips om het probleem met CSS op te lossen.

### 3. Het chatvenster aanpassen en formatteren

Je kan het chatvenster flexibel afstemmen op jouw werkwijze en schermgrootte:
- **Vensterbreedte aanpassen:** Beweeg jouw muis over de linkerzijde van het geopende venster. De cursor verandert in een horizontaal pijltje. Sleep naar links om het venster breder te maken (handig bij lange stukken code) of naar rechts om het smaller te maken. Dubbelklik op de scheidingslijn om terug te keren naar de standaardbreedte. Jouw voorkeursbreedte wordt automatisch onthouden.
- **Rijke opmaak:** Antwoorden van de virtuele tutor bevatten duidelijke tussenkopjes, genummerde stappen, opsommingen en syntax-gekleurde codeblokken, zodat de uitleg prettig leest.

## Beveiliging en privacy

- **Lokale opslag:** Jouw sleutel en eventuele voornaam worden uitsluitend bewaard in het lokale geheugen van jouw browser (`localStorage`).
- **Direct wissen:** Wil je jouw sleutel of naam verwijderen? Klik in de instellingen op **Sleutel wissen**. Alle lokale gegevens worden dan onmiddellijk gewist.
- **Geen cookies of tracking:** De Web Essentials cursus gebruikt geen advertentiecookies of tracking. De communicatie verloopt rechtstreeks tussen jouw browser en de API-servers van Google.
