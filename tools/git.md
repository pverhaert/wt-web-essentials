---
title: Git Basics
---

# Git Basics

Bij het bouwen van websites en applicaties pas je voortdurend bestanden aan, test je nieuwe ideeën en werk je vaak samen met anderen. Zonder versiebeheer ontstaan er al snel onoverzichtelijke mappen vol bestanden zoals `index-v2-definitief.html` en raak je bij een vergissing gemakkelijk code kwijt. Met Git houd je elke aanpassing nauwkeurig bij in een geordende tijdslijn, wissel je moeiteloos tussen eerdere versies en bewaar je jouw projecten veilig online op GitHub.

## Leerdoelen

Na dit hoofdstuk kan je:

- Uitleggen wat een versiebeheersysteem is en het verschil tussen Git en GitHub benoemen
- Git downloaden, installeren en jouw gebruikersgegevens eenmalig globaal configureren via de terminal
- Een professioneel GitHub-account aanmaken en het gratis GitHub Student Developer Pack activeren met je Thomas More-studentenmailadres
- De vier zones van Git (werkmap, staging area, lokaal archief en remote repository) van elkaar onderscheiden
- Ongewenste bestanden en mappen van editors (zoals `.idea/` en `.vscode/`) uitsluiten van versiebeheer met een `.gitignore`-bestand
- Een professioneel `README.md`-bestand opstellen om jouw repository te documenteren op GitHub
- De kerncommando's `git clone`, `git status`, `git add`, `git commit`, `git push` en `git pull` correct toepassen
- Jouw Git-workflow visualiseren en controleren via de interactieve webapp ITF Git Workflow

## Wat is versiebeheer?

<dfn title="Software die wijzigingen in bestanden doorheen de tijd bijhoudt, zodat je altijd kunt zien wie wat wanneer heeft aangepast en terug kunt keren naar eerdere versies">Versiebeheer</dfn> (in het Engels *version control*) vormt het fundament van modern software- en webontwikkeling. In plaats van bestanden handmatig te kopiëren of te hernoemen, legt een versiebeheersysteem gestructureerde momentopnames van je volledige project vast.

In de cursus maken we onderscheid tussen twee complementaire technologieën:

- **Git:** Het programma dat lokaal op je computer draait. Git houdt de geschiedenis van je bestanden bij, registreert verschillen per regel en laat je wijzigingen bundelen. Git werkt volledig zelfstandig, ook wanneer je computer geen internetverbinding heeft. De officiële bron en documentatie vind je op [git-scm.com](https://git-scm.com/).
- **GitHub:** Een cloudplatform dat fungeert als centrale ontmoetingsplek voor Git-projecten. Op GitHub bewaar je een kopie van je project online (een zogeheten *remote repository*). Hierdoor heb je altijd een betrouwbare back-up, toon je jouw werk aan docenten of werkgevers en werk je eenvoudig samen met studiegenoten.

## Git downloaden en installeren

Voordat je Git kunt gebruiken op je eigen computer, installeer je de officiële software voor jouw besturingssysteem.

### Stap 1: Download het installatiebestand

1. Surf naar de officiële downloadpagina: [git-scm.com/downloads](https://git-scm.com/downloads).
2. Klik op **Download for Windows** (of kies het juiste installatiepakket als je macOS of Linux gebruikt).
3. Download de meest recente 64-bit versie van het installatiebestand (bijvoorbeeld `Git-2.xx.x-64-bit.exe`).

### Stap 2: Het installatieprogramma doorlopen

Start het gedownloade installatieprogramma. De installatiewizard biedt een groot aantal instellingen:

- Voor de meeste schermen volstaat het om de **standaardinstellingen** te behouden.
- Zorg ervoor dat de optie **Git Bash** aangevinkt blijft. Git Bash is een krachtige opdrachtregelinterface waarmee je Git-commando's en Linux-stijl commando's uitvoert op Windows.
- Kies bij de vraag naar de standaardeditor voor een editor van jouw keuze (zoals PhpStorm of Notepad), of behoud de standaardsuggestie.
- Kies bij de vraag over de standaardnaam van nieuwe branches voor **Override the default branch name for new repositories** en vul hier `main` in.

### Stap 3: De installatie verifiëren

Zodra de installatiewizard klaar is, controleer je of de installatie geslaagd is:

1. Open **Git Bash** (of open de terminal in PhpStorm via <kbd>Alt</kbd> + <kbd>F12</kbd>).
2. Typ het volgende commando en druk op <kbd>Enter</kbd>:

```bash
git --version
```

Verschijnt er een versienummer in beeld (bijvoorbeeld `git version 2.48.1.windows.1`), dan is Git correct geïnstalleerd en klaar voor gebruik.

## GitHub-account en studentenvoordelen

Om jouw code online te bewaren en in te dienen voor evaluaties, heb je een account nodig op GitHub.

### Stap 1: Jouw GitHub-account aanmaken

1. Surf naar [github.com/join](https://github.com/join).
2. Kies een **professionele gebruikersnaam**. Vermijd bijnamen zoals `pixel-gamer-99`. Kies bij voorkeur voor je echte naam, zoals `voornaam-achternaam` of `voornaamachternaam`. Jouw GitHub-profiel fungeert tijdens je opleiding en latere sollicitaties als je publieke visitekaartje en portfolio.
3. Vul je officiële **Thomas More-studentenmailadres** in (bijvoorbeeld `r0123456@student.thomasmore.be`) en kies een sterk wachtwoord.
4. Voltooi de beveiligingspuzzel en klik op **Create account**.
5. Open je Thomas More-studentenmailbox, zoek de verificatiemail van GitHub en klik op de activatielink.
6. Werk je profiel bij via [github.com/settings/profile](https://github.com/settings/profile) en vul daar je voor- en achternaam in.

::: tip Bestaand GitHub-account
Heb je al een persoonlijk GitHub-account met een privé-e-mailadres? Dan hoef je geen tweede account aan te maken. Ga in GitHub naar **Settings > Emails**, voeg daar jouw Thomas More-studentenmailadres toe en verifieer dit adres. Zo behoud je jouw bestaande geschiedenis terwijl je toch in aanmerking komt voor alle onderwijsvoordelen.
:::

### Stap 2: Activeer het GitHub Student Developer Pack

GitHub biedt studenten via **GitHub Education** een royaal pakket met professionele ontwikkelaarstools en diensten ter waarde van duizenden euro's, volledig gratis zolang je studeert.

1. Zorg dat je ingelogd bent op GitHub met je geverifieerde Thomas More-mailadres.
2. Surf naar [education.github.com](https://education.github.com).
3. Klik in het navigatiemenu op **Students** en vervolgens op de knop **Sign up for Student Developer Pack** (of **Join GitHub Education**).
4. Selecteer je Thomas More-mailadres als bewijs van inschrijving.
5. Vul de schoolnaam in: **Thomas More** (Campus Geel).
6. Beantwoord kort de vraag hoe je van plan bent GitHub te gebruiken (bijvoorbeeld: *voor labo-opdrachten en webprojecten in de IT Factory*).
7. Dien je aanvraag in. Zodra de verificatie verwerkt is, ontvang je een bevestigingsmail en zijn jouw educatieve voordelen actief.

### Stap 3: Authenticatie en Windows Referentiebeheer

Wanneer je voor de eerste keer code van je computer naar GitHub stuurt, vraagt Git om jouw identiteit te controleren:

- Er verschijnt automatisch een pop-upvenster van de **Git Credential Manager**.
- Klik op **Sign in with your browser** en autoriseer de verbinding met één klik in je geopende browser.
- Windows bewaart deze veilige koppeling automatisch in het **Referentiebeheer** (in het Engels: *Windows Credential Manager*). Je hoeft daarna niet telkens opnieuw in te loggen.

::: info Gegevens aanpassen in Referentiebeheer
Moet je ooit je inloggegevens vernieuwen omdat je van wachtwoord bent veranderd of een ander account wilt gebruiken? Klik op de Windows-startknop, typ **Referentiebeheer**, open **Windows-referenties** en zoek in de lijst naar het item `git:https://github.com`. Hier kan je de opgeslagen referentie bewerken of verwijderen.
:::

## Eenmalige Git-configuratie

Voordat je jouw eerste project start, moet Git weten wie je bent. Deze auteursgegevens worden vastgelegd bij elke momentopname die je maakt.

Open Git Bash of de terminal in PhpStorm en voer onderstaande drie commando's na elkaar uit. Vervang de voorbeelden door jouw eigen naam en je Thomas More-mailadres:

```bash
git config --global user.name "Voornaam Achternaam"
git config --global user.email "r0123456@student.thomasmore.be"
git config --global init.defaultBranch main
```

Controleer daarna of jouw globale gegevens goed zijn opgeslagen met het commando:

```bash
git config --global --list
```

In de uitvoer zie je nu jouw naam, e-mailadres en `init.defaultbranch=main` verschijnen.

::: tip Zie je `master` én `main` staan bij `git config --list`?
Voer je het algemene commando `git config --list` uit, dan leest Git alle configuratiebestanden van je computer uit (zowel de systeembrede instellingen als jouw eigen persoonlijke instellingen). Omdat het installatieprogramma op Windows standaard `master` instelt op systeemniveau, zie je bovenaan vaak `init.defaultbranch=master` en pas verder onderaan jouw eigen `init.defaultbranch=main`.

In Git hebben **latere, persoonlijke instellingen altijd voorrang**. Jouw globale instelling (`main`) overschrijft de fabrieksinstelling van het systeem (`master`). Je kunt de actieve, effectieve waarde direct opvragen met:

```bash
git config --get init.defaultBranch
```
Geeft dit commando `main` als resultaat, dan staat alles helemaal juist ingesteld.
:::

::: warning Meerdere computers
Gebruik je zowel een laptop op Thomas More Campus Geel als een desktop thuis? Voer deze configuratiecommando's dan eenmalig uit op **elk afzonderlijk toestel**.
:::

## De Git-workflow: van werkmap naar GitHub

Om effectief met Git te werken, is het belangrijk om het onderliggende model te begrijpen. Git verdeelt jouw bestanden over vier opeenvolgende zones:

1. **Werkmap (Working Directory):** De map op jouw harde schijf waarin je bestanden toevoegt, bewerkt en verwijdert in je editor.
2. **Staging Area (het laadperron):** De tussenruimte waarin je aanduidt welke gewijzigde bestanden klaarstaan om opgenomen te worden in de volgende momentopname.
3. **Lokale Repository (het archief):** De verborgen map `.git` op jouw eigen computer waarin alle definitieve momentopnames (commits) lokaal worden bewaard.
4. **Remote Repository (GitHub):** De centrale opslagplaats in de cloud waar jouw project online beschikbaar is.

<GitWorkflowDiagram />

::: tip Oefen interactief met de ITF Git Workflow
Wil je de beweging van bestanden stap voor stap in actie zien zonder risico op fouten? Bezoek de interactieve visualisatietool **[ITF Git Workflow](https://itf-git-workflow.netlify.app/)**. In deze webapp simuleer je de belangrijkste Git-commando's en zie je direct hoe bestanden van je werkmap via de staging area en het lokale archief naar GitHub reizen.
:::

## De kerncommando's

Tijdens het programmeren herhaal je een vaste cyclus van commando's. Onderstaande tabel vat de belangrijkste instructies samen:

| Commando | Wanneer gebruik je het? | Wat gebeurt er? |
|---|---|---|
| `git clone <url>` | Eenmalig per project per computer | Downloadt een bestaand project van GitHub naar een lokale map op je computer |
| `git status` | Voortdurend tussendoor | Toont welke bestanden gewijzigd, klaargezet of nog niet gevolgd zijn |
| `git add <bestand>` | Zodra een logisch deel van je werk af is | Plaatst gewijzigde bestanden op het laadperron (de staging area) |
| `git commit -m "boodschap"` | Direct na het toevoegen met `git add` | Legt alle klaargezette bestanden vast in een definitieve lokale momentopname |
| `git push` | Wanneer je jouw werk online wilt bewaren of delen | Stuurt jouw lokale commits door naar het externe repository op GitHub |
| `git pull` | Bij de start van een werksessie of na wijzigingen elders | Haalt de nieuwste commits van GitHub op en voegt ze samen met je lokale werkmap |

### git clone

Wanneer de docent een startproject aanbiedt op GitHub, of wanneer je verder wilt werken aan een bestaand project op een andere computer, kopieer je het project met `git clone`.

1. Surf op GitHub naar de gewenste repository.
2. Klik op de groene knop **Code** en kopieer de getoonde HTTPS-URL.
3. Open je terminal, navigeer naar jouw projectenmap (bijvoorbeeld `cd /c/Sites`) en voer uit:

```bash
git clone https://github.com/gebruikersnaam/mijn-project.git
```

Git maakt nu een nieuwe map aan met de naam van het project en downloadt alle bestanden en de volledige historiek. Navigeer vervolgens altijd eerst in die map:

```bash
cd mijn-project
```

### git status

Met `git status` inspecteer je op elk gewenst moment de toestand van je project. Het commando geeft antwoord op drie vragen:

- Op welke tak bevind je je momenteel?
- Welke bestanden zijn gewijzigd maar staan nog niet op het laadperron (rood gekleurd)?
- Welke bestanden staan klaar in de staging area voor de volgende commit (groen gekleurd)?

Voer `git status` regelmatig uit om grip te houden op je werk:

```bash
git status
```

### git add

Nadat je bestanden hebt gemaakt of bewerkt, vertel je Git welke bestanden moeten klaarliggen voor de volgende momentopname. Dit doe je door ze toe te voegen aan de <dfn title="De wachtruimte in Git waarin je selecteert welke bestanden en wijzigingen meegaan in de eerstvolgende commit">staging area</dfn>.

Wil je een specifiek bestand toevoegen:

```bash
git add index.html
```

Wil je alle gewijzigde en nieuwe bestanden in de huidige map in één keer toevoegen:

```bash
git add .
```

Het puntje (`.`) staat voor de huidige map en alle onderliggende bestanden.

### git commit

Wanneer alle gewenste bestanden op het laadperron staan, leg je ze definitief vast met een <dfn title="Een permanente, van een uniek nummer voorziene momentopname van het project in de lokale Git-geschiedenis">commit</dfn>. Een commit is vergelijkbaar met het opslaan van een controlepunt in een videogame: je kunt er later altijd naar terugkeren.

Elke commit moet voorzien zijn van een duidelijke en beknopte beschrijving met de `-m` (message) vlag:

```bash
git commit -m "Voeg hoofdnavigatie en CSS-basisstijlen toe"
```

Richtlijnen voor een goed commit-bericht:
- Schrijf in de tegenwoordige tijd en wees specifiek over wat er veranderd is.
- Goed: `git commit -m "Herstel gebroken afbeelding in header"`
- Fout: `git commit -m "dingen aangepast"` of `git commit -m "test"`

::: warning Een commit is lokaal
Het uitvoeren van `git commit` bewaart jouw werk uitsluitend op je eigen harde schijf in de lokale `.git`-map. Jouw docent of medestudenten kunnen dit nog niet zien op GitHub totdat je het commando `git push` uitvoert.
:::

### git push

Met `git push` stuur je alle nieuwe lokale commits door naar de centrale repository op GitHub:

```bash
git push
```

Na het voltooien van dit commando zijn je aanpassingen direct zichtbaar op GitHub en staat je werk veilig in de cloud.

### git pull

Werk je op meerdere computers (bijvoorbeeld thuis en op school), of voegt de docent nieuwe opdrachten toe aan je repository? Dan gebruik je `git pull` om de meest recente versie van GitHub naar je eigen computer te halen:

```bash
git pull
```

::: warning Zorg voor een schone werkmap voor je pullt
Voer pas een `git pull` uit wanneer je eigen lokale aanpassingen eerst netjes zijn vastgelegd met `git add` en `git commit`. Zo voorkom je dat Git onbedoeld jouw niet-opgeslagen wijzigingen probeert te overschrijven en ontstaat er geen verwarring.
:::

## Bestanden negeren met .gitignore

Niet elk bestand in jouw projectmap hoort thuis in versiebeheer. Tijdens het ontwikkelen maken programma's en besturingssystemen automatisch tijdelijke bestanden en persoonlijke instellingen aan:

- **PhpStorm & Visual Studio Code:** Code-editors maken automatisch verborgen configuratiemappen aan (`.idea/` voor PhpStorm, `.vscode/` voor Visual Studio Code) met jouw persoonlijke vensterindeling, recente bestanden en lokale instellingen. Deze instellingen zijn specifiek voor jouw computer en horen niet thuis op GitHub, omdat ze conflicten veroorzaken bij andere studenten of de docent.
- **Besturingssystemen:** macOS maakt vaak verborgen `.DS_Store`-bestanden aan, en Windows bewaart miniaturen in `Thumbs.db`.
- **Grote afhankelijkheden:** In latere modules installeer je hulppakketten via npm in een map `node_modules/`. Deze map bevat duizenden bestanden en mag nooit in Git worden opgenomen.

Met een <dfn title="Een configuratiebestand in de hoofdmap van een Git-project waarin je regels vastlegt voor bestanden en mappen die Git bewust moet negeren">.gitignore-bestand</dfn> vertel je Git precies welke bestanden en mappen buiten het versiebeheer moeten blijven.

### Een .gitignore-bestand aanmaken

Maak in de hoofdmap van jouw project een nieuw bestand aan met exact de naam `.gitignore` (let op het puntje vooraan en zonder achterliggende bestandsextensie).

Plaats daarin de namen van de mappen en bestanden die Git niet mag volgen:

```text
# Editor- en IDE-instellingen
.idea/
.vscode/

# Besturingssysteembestanden
.DS_Store
Thumbs.db

# Externe bibliotheken en dependencies
node_modules/

# Tijdelijke bestanden en logboeken
*.log
```

### Syntaxisregels in .gitignore

- **Commentaar:** Regels die beginnen met een hekje (`#`) zijn commentaar en worden genegeerd.
- **Mappen uitsluiten:** Zet altijd een schuine streep (`/`) achter de mapnaam, bijvoorbeeld `.idea/`. Git negeert dan de map en alle onderliggende bestanden.
- **Jokertekens:** Met een sterretje (`*`) vang je meerdere bestanden tegelijk op. De regel `*.log` negeert bijvoorbeeld zowel `error.log` als `server.log`.
- **Specifieke bestanden:** Typ de exacte bestandsnaam, zoals `Thumbs.db` of `.DS_Store`.

::: warning Negeer bestanden vóór de eerste commit
Git negeert uitsluitend bestanden die nog niet eerder zijn toegevoegd aan het archief. Maak jouw `.gitignore` daarom altijd direct aan bij de start van een nieuw project, **vóórdat** je `git add .` uitvoert. Heb je een bestand per ongeluk toch al gecommit, dan blijft Git het volgen totdat je het expliciet uit de index verwijdert.
:::

## Git gebruiken in PhpStorm

Je hoeft tijdens het programmeren niet voortdurend te wisselen tussen PhpStorm en een los terminalvenster:

1. **Ingebouwde terminal:** Druk in PhpStorm op <kbd>Alt</kbd> + <kbd>F12</kbd> (of <kbd>Option</kbd> + <kbd>F12</kbd> op macOS) om onderaan direct de opdrachtregel te openen. Je bevindt je dan automatisch in de juiste projectmap.
2. **Visuele statuskleuren:** In het bestandsvenster links van PhpStorm herken je direct de toestand van elk bestand aan de hand van duidelijke kleuren:
   - **Rood:** Een nieuw bestand dat nog niet gevolgd wordt door Git (*untracked*).
   - **Groen:** Een bestand dat met `git add` op het laadperron is geplaatst.
   - **Blauw:** Een bestaand bestand met wijzigingen die nog niet zijn toegevoegd aan het laadperron.
   - **Normale tekstkleur:** Een bestand dat volledig up-to-date is met de laatste commit.

## Het project documenteren met README.md

Zodra je jouw project op GitHub publiceert, zien bezoekers en docenten in eerste instantie een lijst met mappen en bestanden. Zonder toelichting is het voor een buitenstaander niet duidelijk wat jouw project precies doet, wie het gemaakt heeft of hoe de website bekeken moet worden.

Daarom hoort in de hoofdmap van elk professioneel Git-project een <dfn title="Het standaard documentatiebestand in de hoofdmap van een repository dat platforms zoals GitHub automatisch als startpagina onder de bestandenlijst tonen">README.md-bestand</dfn> thuis.

### Waarom is README.md belangrijk?

- **Automatische startpagina:** GitHub herkent de bestandsnaam `README.md` automatisch en rendert de opmaak direct onder de bestandenlijst als een nette webpagina.
- **Duidelijkheid voor docenten:** Bij het indienen van labo-opdrachten of projecten aan Thomas More Campus Geel ziet de docent meteen jouw naam, studentennummer en de status van je opdrachten.
- **Eenvoudige Markdown-opmaak:** De extensie `.md` staat voor Markdown, een lichte opmaaktaal waarmee je vlot koppen (`#` en `##`), lijsten (`-`), hyperlinks (`[tekst](url)`) en codefragmenten toevoegt.

### Aanbevolen opbouw voor studentenprojecten

Maak in de hoofdmap van je project een bestand genaamd `README.md` aan. Richt het bestand overzichtelijk in volgens dit patroon:

```markdown
# Projectnaam: Mijn Eerste Website

Dit project is gemaakt in het kader van het opleidingsonderdeel Web Essentials aan Thomas More Campus Geel.

## Auteur

- **Student:** Voornaam Achternaam
- **Studentennummer:** r0123456
- **Opleiding:** Toegepaste Informatica (IT Factory)
- **Academiejaar:** 2026-2027

## Beschrijving

Een responsieve website bestaande uit een startpagina, een fotogalerij en een contactpagina, opgebouwd met semantische HTML5 en gestyled met CSS3.

## Hoe het project te openen

1. Open de projectmap in PhpStorm.
2. Start de lokale ontwikkelserver via de ingebouwde terminal met `live-server`.
3. Bekijk het resultaat in je webbrowser op `http://127.0.0.1:8080`.
```

<PageSummary>

### Syntaxis in een oogopslag

| Handeling | Commando | Toelichting |
|---|---|---|
| Project downloaden | `git clone <url>` | Kopieert een externe GitHub-repository naar jouw computer |
| Status controleren | `git status` | Toont gewijzigde en klaargezette bestanden |
| Wijzigingen klaarzetten | `git add .` | Plaatst alle gewijzigde bestanden op het laadperron |
| Momentopname maken | `git commit -m "tekst"` | Slaat klaargezette bestanden lokaal op met toelichting |
| Publiceren naar GitHub | `git push` | Verzendt lokale commits naar de externe repository |
| Up-to-date brengen | `git pull` | Haalt de nieuwste wijzigingen op van GitHub |
| Identiteit instellen | `git config --global user.name "Naam"` | Stelt je naam in voor alle toekomstige commits |
| E-mail instellen | `git config --global user.email "mail"` | Stelt je e-mailadres in voor alle toekomstige commits |

### Regels en naamgeving

- **Standaardtak:** Gebruik uitsluitend `main` als naam voor de hoofdtak van nieuwe repositories.
- **Gebruikersnaam:** Kies op GitHub een herkenbare, zakelijke naam op basis van je eigen voor- en achternaam.
- **Studentenmail:** Gebruik altijd je officiële `@student.thomasmore.be`-adres voor je educatieve GitHub-account.
- **.gitignore:** Plaats altijd direct bij de start een `.gitignore` in de hoofdmap van je project en sluit ten minste `.idea/`, `.vscode/` en systeembestanden uit.
- **README.md:** Voorzie elk repository van een `README.md` in de hoofdmap met duidelijke projectinformatie, jouw naam en je studentennummer.
- **Commit-berichten:** Schrijf actieve, duidelijke beschrijvingen die vertellen wat de commit toevoegt of herstelt.
- **Vaste volgorde:** Onthoud het vaste stappenplan: bewerken ➔ `git status` ➔ `git add .` ➔ `git commit -m "..."` ➔ `git push`.

### Veelgemaakte fouten

- Geen `.gitignore` aanmaken, waardoor de verborgen map `.idea/` van PhpStorm of `.vscode/` van VS Code op GitHub belandt en conflicteert met instellingen van medestudenten.
- Vergeten een `README.md` toe te voegen, waardoor een repository op GitHub een anonieme bestandenlijst blijft zonder toelichting voor de docent.
- Vergeten `git push` uit te voeren na een commit, waardoor de code wel lokaal bestaat maar niet zichtbaar is voor de docent op GitHub.
- De projectmap niet binnengaan met `cd projectnaam` na het clonen, waardoor Git-commando's mislukken met de melding *fatal: not a git repository*.
- Vage commit-berichten gebruiken zoals "aanpassingen" of "oefening", waardoor het later onmogelijk is om een specifieke wijziging terug te vinden.
- Bestanden tegelijk op twee verschillende computers bewerken zonder tussentijds eerst `git pull` uit te voeren, wat kan leiden tot merge-conflicten.

### Tips voor beginners

- Raadpleeg voor en na elke handeling `git status` om te verifiëren wat er precies klaarstaat en of genegeerde bestanden zoals `.idea/` netjes onzichtbaar blijven.
- Gebruik de interactieve webapp [ITF Git Workflow](https://itf-git-workflow.netlify.app/) om de logica van de verschillende zones visueel in te oefenen.
- Open de terminal in PhpStorm met <kbd>Alt</kbd> + <kbd>F12</kbd> om snel commando's in te voeren zonder je codevenster te verlaten.

</PageSummary>

## Oefeningen

### Oefening 1: Git installeren, configureren en GitHub koppelen

In deze oefening installeer je Git en configureer je jouw studentenaccount.

1. Download en installeer Git via [git-scm.com/downloads](https://git-scm.com/downloads).
2. Open Git Bash of de terminal in PhpStorm en controleer de werking met:
   ```bash
   git --version
   ```
3. Stel jouw wereldwijde Git-identiteit in met jouw eigen gegevens:
   ```bash
   git config --global user.name "Jouw Voornaam en Achternaam"
   git config --global user.email "r0123456@student.thomasmore.be"
   git config --global init.defaultBranch main
   ```
4. Controleer met `git config --global --list` of jouw naam en e-mailadres juist zijn opgeslagen en controleer met `git config --get init.defaultBranch` of de actieve tak effectief op `main` staat.
5. Maak een GitHub-account aan op [github.com](https://github.com) met je studentenmailadres en vraag het gratis **Student Developer Pack** aan via [education.github.com](https://education.github.com).

### Oefening 2: De interactieve Git-workflow verkennen

Voordat je complexe projecten aanmaakt, verken je de commando's in een veilige oefenomgeving.

1. Surf naar de webapp [ITF Git Workflow](https://itf-git-workflow.netlify.app/).
2. Bekijk de vier zones in de grafische interface: jouw werkmap, de staging area, de lokale repository en GitHub.
3. Voer in het invoerveld van de simulator achtereenvolgens de commando's uit:
   - Voeg een bestand toe aan de staging area met `git add index.html`.
   - Bekijk hoe het bestand verschuift naar het laadperron.
   - Voer een commit uit: `git commit -m "Mijn eerste interactieve commit"`.
   - Zie hoe het controlepunt in de lokale geschiedenis verschijnt.
   - Voer `git push` uit en stel vast hoe de commit naar GitHub wordt overgebracht.

### Oefening 3: Een lokaal project initialiseren, documenteren en committen

Breng de theorie in de praktijk op jouw eigen computer.

1. Maak in PhpStorm of in je bestandsverkenner een nieuwe map aan met de naam `git-oefening`.
2. Open de map in PhpStorm en open de terminal met <kbd>Alt</kbd> + <kbd>F12</kbd>.
3. Initialiseer een nieuw lokaal Git-archief met het commando:
   ```bash
   git init
   ```
4. Maak een nieuw bestand aan in de hoofdmap met exact de naam `.gitignore` en voeg daarin de volgende regels toe:
   ```text
   # Editor-instellingen
   .idea/
   .vscode/

   # Systeembestanden
   .DS_Store
   Thumbs.db
   ```
5. Maak in de hoofdmap een documentatiebestand genaamd `README.md` aan met jouw naam, studentennummer en een korte projectbeschrijving:
   ```markdown
   # Oefenproject Web Essentials

   - **Student:** Jouw Naam
   - **Studentennummer:** r0123456
   - **Campus:** Thomas More Campus Geel

   Eerste webpagina met Git-versiebeheer en documentatie.
   ```
6. Maak in PhpStorm een nieuw bestand aan genaamd `index.html` en voorzie het van een geldige HTML5-basisstructuur met een `<h1>`-titel.
7. Voer `git status` uit in de terminal. Merk op dat `index.html`, `.gitignore` en `README.md` in het rood verschijnen, maar dat de mappen `.idea/` en `.vscode/` nergens vermeld staan omdat ze netjes genegeerd worden.
8. Plaats alle niet-genegeerde bestanden in de staging area met `git add .` en voer opnieuw `git status` uit om te zien dat ze groen worden.
9. Maak je eerste lokale commit:
   ```bash
   git commit -m "Eerste opzet van project met .gitignore, README.md en index.html"
   ```
10. Voer tot slot nogmaals `git status` uit en stel vast dat de melding *nothing to commit, working tree clean* verschijnt.
