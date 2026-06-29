# Calista Inmobiliaria — site web

Site statique **Astro** + admin **Sveltia CMS** + images sur **Cloudinary**, déployé sur **Netlify**.
Toute l'interface visible est en espagnol ; les commentaires du code sont en français.

L'idée centrale : **ta mère saisit chaque bien une seule fois** dans l'admin.
Les pages (Comprar, Alquilar, Desarrollos, Terrenos, Exclusivos) ne sont que des
**vues filtrées** de la même liste. Pas de double saisie. Les images ne touchent
**jamais** Git — elles vivent sur Cloudinary.

---

## 1. Lancer le site en local

```bash
npm install
npm run dev      # http://localhost:4321
```

Pour vérifier la version finale avant déploiement :

```bash
npm run build    # génère le dossier dist/
npm run preview
```

---

## 2. Les 5 choses à personnaliser

| Quoi | Fichier | Détail |
|------|---------|--------|
| Coordonnées de l'agence | `src/lib/site.ts` | nom, slogan, **numéro WhatsApp**, email, téléphone |
| Nom du « cloud » Cloudinary | `src/lib/site.ts` (`cloudinaryCloudName`) + `public/admin/config.yml` | visible dans ton dashboard Cloudinary |
| Dépôt GitHub de l'admin | `public/admin/config.yml` (`repo: owner/repo`) | ex. `louis/calista-web` |
| URL finale du site | `astro.config.mjs` (`SITE`) | sert au sitemap et aux aperçus de partage |
| Villes proposées | `src/lib/site.ts` + `public/admin/config.yml` | la liste des `options` sous `ciudad` |

> ⚠️ **Numéro WhatsApp** : format international sans `+`, sans espaces, sans le `0`.
> Pour 0981 123 456 → `595981123456`.

---

## 3. Comment ta mère ajoute un bien

1. Elle va sur `https://[le-site]/admin/`
2. Elle se connecte (bouton **Login with GitHub** — voir §5)
3. **Propiedades → New** : elle remplit le formulaire (titre, prix, ville, photos…)
4. Elle clique **Publish**. Le site se régénère tout seul en ~1 minute.

Les cases à cocher décident où le bien apparaît :
- **¿Destacado en la portada?** → mis en avant sur l'accueil
- **¿Cartera Exclusiva?** → page Exclusivos
- **¿Es un desarrollo / pozo?** → page Nuevos Desarrollos
- Le **tipo = Terreno** → page Terrenos
- L'**operación** (Venta/Alquiler) → Comprar ou Alquilar

Pour retirer un bien sans le supprimer : passer l'**estado** à *Vendido* ou *Alquilado*
(il s'affiche grisé) — ou le supprimer carrément.

Les **photos** se chargent depuis l'onglet **Cloudinary** du sélecteur d'images.
La première photo est la couverture.

---

## 4. Cloudinary (hébergement des images)

1. Crée un compte gratuit sur cloudinary.com
2. Dans le dashboard, repère ton **Cloud name** et ta **API Key**
3. Renseigne-les dans `public/admin/config.yml` (section `media_libraries.cloudinary`)
   et le `cloudinaryCloudName` dans `src/lib/site.ts`
4. Côté Cloudinary, autorise l'upload non signé OU configure la clé selon ta préférence

Le site optimise automatiquement chaque image (format WebP/AVIF, redimensionnement,
compression) via `src/lib/cloudinary.ts`. Tu n'as rien à faire de plus.

---

## 5. Déploiement (GitHub + Netlify) et connexion à l'admin

1. Pousse ce dossier sur un dépôt **GitHub**.
2. Sur **Netlify** : *Add new site → Import from GitHub*, choisis le dépôt.
   Build command et publish sont déjà définis dans `netlify.toml` (`npm run build` → `dist`).
3. **Authentification de l'admin** (pour que ta mère puisse se connecter) — l'option
   la plus simple est l'**OAuth GitHub via Netlify** :
   - Crée une *GitHub OAuth App* (Settings → Developer settings → OAuth Apps)
     avec l'URL de callback de Netlify.
   - Renseigne le Client ID / Secret dans Netlify (*Site settings → Access control → OAuth*).
   - Résultat : bouton **Login with GitHub** en 1 clic dans `/admin/`.
   - Ta mère a besoin d'un compte GitHub (gratuit) — c'est inévitable avec un CMS
     basé sur Git, mais elle ne touchera jamais à Git directement.

   *Alternative sans Netlify OAuth* : le petit service gratuit
   `sveltia-cms-auth` sur Cloudflare Workers fait le même travail. Voir la doc Sveltia.

4. Le **formulaire de contact** fonctionne tout seul : Netlify détecte le formulaire
   et t'envoie les messages (onglet *Forms* du dashboard). Gratuit dans ton offre.

---

## 6. Structure du projet

```
src/
├─ content.config.ts      ← le schéma d'un bien (la "forme" des données)
├─ content/biens/*.md     ← les biens (5 exemples fournis, à supprimer)
├─ lib/                   ← config centrale + helpers (prix, WhatsApp, Cloudinary, géo)
├─ components/            ← carte de bien, galerie, carte Leaflet, filtres, header/footer
├─ layouts/Layout.astro   ← gabarit commun + métadonnées de partage
└─ pages/                 ← accueil, les 5 listings, historia, contacto, détail d'un bien
public/
├─ admin/                 ← Sveltia CMS (index.html + config.yml)
└─ demo/                  ← images d'exemple (à remplacer par les vraies via Cloudinary)
```

La **carte** utilise Leaflet + OpenStreetMap (gratuit, sans clé API ni carte bancaire).
Elle affiche un **cercle approximatif** plutôt qu'un point exact — choix volontaire
pour la confidentialité de l'adresse.

---

## 7. Prochaines étapes faciles (quand tu voudras)

- Pages dédiées **Vender** et **Administración de alquileres** (aujourd'hui regroupées
  dans la bande « Para propietarios » de l'accueil + le formulaire de contact).
  Ce sont des pages éditoriales simples à ajouter sur le modèle de `historia.astro`.
- Filtre par **prix** ou tri (la base est déjà là dans `BienesFiltrados.astro`).
- Version **portugais** si tu vises aussi les acheteurs brésiliens (Sveltia gère l'i18n).

---

## Remarques

- Les 5 biens dans `src/content/biens/` et les images de `public/demo/` sont des
  **exemples** : supprime-les une fois les vrais biens chargés.
- Le numéro WhatsApp (`595981000000`), le `cloud_name`, le `repo` et l'URL du site
  sont des **valeurs à remplacer** — repérables par les `TU_…` / `owner/repo` / commentaires.
