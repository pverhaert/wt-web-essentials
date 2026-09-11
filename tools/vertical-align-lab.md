---
title: Vertical-align Lab
---

# Vertical-align Lab: Kaarten & Kolommen Uitlijnen

Met deze interactieve tool onderzoek je waarom kaarten en kolommen met `display: inline-block` plotseling scheef naar beneden zakken zodra een van de kaarten meer tekst bevat, en hoe je dit eenvoudig oplost met de juiste `vertical-align`.

::: info Onderdeel van de lay-out modules
Deze tool sluit rechtstreeks aan bij de theorie en Oefening 3 uit het hoofdstuk [CSS Display](/css/display).
:::

## Interactieve Simulator

Voeg extra tekst toe aan Kaart 2 en schakel tussen `baseline` (standaard browsergedrag) en `top` (de industriestandaard) om het verschil met eigen ogen te zien:

<VerticalAlignLab />

## Belangrijkste inzichten over `vertical-align`

### 1. Waarom verspringen kaarten standaard?
Omdat `inline-block` elementen worden behandeld alsof het letters in een tekstregel zijn, hanteert de browser standaard de regel `vertical-align: baseline`. Hierbij lijnt de browser de **allerlaatste tekstregel** van elke kaart uit op één gezamenlijke horizontale basislijn. Heeft één kaart meer tekst, dan zakt die kaart omlaag om zijn onderste regel gelijk te leggen met de buurkaarten!

### 2. De gouden regel: `vertical-align: top`
Door aan jouw kaartenklasse expliciet `vertical-align: top;` toe te voegen, dwing je af dat alle kaarten strak uitlijnen langs de bovenkant van de regel. Zo blijven alle titels, koppen en bovenranden netjes waterpas op één lijn, ongeacht de hoeveelheid inhoud binnenin de kaart.
