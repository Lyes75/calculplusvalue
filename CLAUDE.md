# Simulateur Plus-Value Immobilière

## Contexte
Outil gratuit de calcul de plus-value immobilière pour le marché français. Monétisation par affiliation (CGP, estimation immobilière, SCPI/assurance-vie) et display.

## Stack
* Next.js 14+ (App Router)
* TypeScript
* Recharts (graphiques)
* Vercel (hébergement)
* Pas de base de données — tout est calculé côté client

## Structure
```
app/
  layout.tsx          → Metadata SEO + structure HTML
  page.tsx            → Import dynamique du simulateur
  simulator.tsx       → Composant principal (calcul + UI + CTA + PDF)
  mentions-legales/
    page.tsx           → Page mentions légales
  sitemap.ts          → Sitemap XML dynamique
public/
  robots.txt
  favicon.ico
```

## Règles fiscales implémentées
* IR : 19% sur PV nette après abattement (art. 150 VC CGI)
* PS : 17,2% sur PV nette après abattement (barème distinct)
* Surtaxe : 2% à 6% si PV nette IR > 50 000€ (art. 1609 nonies G)
* Abattement IR : 6%/an de la 6e à la 21e année, 4% la 22e → exonération à 22 ans
* Abattement PS : 1,65%/an de la 6e à la 21e, 1,60% la 22e, 9%/an de la 23e à la 30e → exonération à 30 ans
* Forfait frais acquisition : 7,5% du prix d'achat
* Forfait travaux : 15% du prix d'achat si détention > 5 ans
* Résidence principale : exonération totale

## Monétisation
* Blocs CTA affiliation contextuels après les résultats
* Capture email via modale (webhook n8n en backend)
* Export PDF du rapport (print natif navigateur)
* AdSense/Ezoic en complément

## Domaine
calculplusvalue.fr (ou variante à confirmer)

## Commandes
```bash
npm run dev          # Dev local sur :3000
npm run build        # Build production
vercel deploy --prod # Déploiement
```
