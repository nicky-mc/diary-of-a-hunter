# 📖 Diary of a Hunter

> *"The truth burns. So do I. My name is Amber Thessaily, and this is the frontline."*

Most people walk through life half-asleep. They think the scratching at the window is a stray cat. They think the shadow in the alley is just a trick of the light. They’re wrong. Monsters are real, and they are preparing for a war humanity doesn't even know it's fighting.

This repository contains the source code for the digital archive, Bestiary, and survival guide known as **Diary of a Hunter**. It is built to be fast, indestructible, and accessible—because if you can't read the weak points of a Midnight Realm stalker on your phone while running for your life, this code is useless.

---

## 🗡️ The Arsenal (Tech Stack)

This sanctuary was forged with the following tools:

* **Next.js (App Router):** The skeleton. Fast, server-rendered, and reliable.
* **React & Tailwind CSS:** The muscle. Highly responsive, custom styling.
* **shadcn/ui:** The armor. Rock-solid, strictly accessible (WCAG AAA compliant) components that don't break when you need them most.
* **Aceternity UI / Framer Motion:** The magic. Unnatural, glowing animations and transitions to mirror the supernatural threats we track.
* **MongoDB & Mongoose:** The vault. A flexible NoSQL database to store messy, evolving monster lore and field notes.
* **NextAuth.js:** The wards. Strict authentication protocols to keep the dark things out of the CMS.

---

## 🩸 Initialization Protocols

If you need to clone this archive and run it locally, follow these steps exactly. Do not skip the wards.

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/diary-of-a-hunter.git](https://github.com/yourusername/diary-of-a-hunter.git)
cd diary-of-a-hunter
```
2. Install Dependencies
```Bash
npm install
```
3. Establish the Connection (Environment Variables)
Create a .env.local file in the root directory. You will need your own keys to access the databases.

```Code snippet
MONGODB_URI="your_mongodb_connection_string"
NEXTAUTH_SECRET="generate_a_random_secure_string"
NEXTAUTH_URL="http://localhost:3000"
```
4. Boot the Local Server
```Bash
npm run dev
```
Open http://localhost:3000 in your browser. If you see the leather and the cream text, the wards are holding.
Pushed (`abbb624`).

## Custom Font uploader

1. Click **Admin** in the nav → log in
2. Click the new **Fonts** card on the dashboard
3. Fill in:
   - **Display Name**: how it appears in the dropdown (e.g. "Eldritch Display")
   - **Weight**: dropdown of all standard weights + a Variable option
   - **Style**: Normal or Italic
   - **Font File**: click to browse, pick a `.woff2` file
4. Click **Install Font** — done

The font is immediately available in the rich-text editor's font-family dropdown under an "Uploaded fonts" group. No restart, no rebuild, no env variables to touch.

## What happens under the hood

```
User picks file → FontUploadForm POSTs multipart to /api/fonts
                                          ↓
                  Server validates + slugifies the name
                                          ↓
                  cloudinary.uploader.upload_stream (resource_type: "raw")
                                          ↓
                  Save { name, family, fileUrl, weight, style } to MongoDB
                                          ↓
                  Return 201 → form refreshes the page (router.refresh)
                                          ↓
On every subsequent request:
  CustomFontStyles (root layout) → fetch all fonts → emit @font-face
  Toolbar useEffect → fetch /api/fonts → merge into dropdown
```

## What the admin UI looks like

The fonts list shows each font with a live preview rendered using that font:

```
┌─────────────────────────────────────────────────────┐
│ Eldritch Display                                    │
│ family: eldritch-display · weight: 400 · normal · 38KB │
│                                                     │
│ The quick brown fox jumps over the lazy dog         │   ← rendered with the actual font
│                                            [Remove] │
└─────────────────────────────────────────────────────┘
```

## Supported file types

| Format | Extension | Recommendation |
|---|---|---|
| **WOFF2** | `.woff2` | ✅ Strongly preferred — best compression, all modern browsers |
| WOFF | `.woff` | Older fallback, supported but ~30% larger |
| TrueType | `.ttf` | Works, but no compression — large files |
| OpenType | `.otf` | Works, but no compression — large files |

Recommend `.woff2` to the user — most font sites (Google Fonts, FontShare, etc.) offer it directly.

## Where the fonts get stored

- **File**: Cloudinary as raw asset at `doah/fonts/<slug>.woff2`
- **Metadata**: MongoDB `fonts` collection
- **CSS**: Generated fresh on every page render — no caching surprises

## Limitations to flag

1. **One file per family right now** — uploading the bold and regular as separate entries works but each gets its own family slug (`eldritch-display-regular`, `eldritch-display-bold`). To have one family with multiple weights, we'd need to extend the schema to support multiple file URLs per Font. Tell me if you want that.
2. **No font preview before upload** — the preview only renders after the font is installed. Adding a "drag to preview" step is doable but adds complexity.
3. **Public read** — `/api/fonts` is public so the editor on the admin side and the public detail pages can both fetch the list. The actual font files on Cloudinary are also public (necessary — your readers' browsers need to download them). If you ever need locked-down fonts, that's a different setup.

Pull `abbb624`, restart dev, and have a go. Drop a `.woff2` in at `/admin/fonts` and watch it appear in the editor instantly.

⚠️ Contribution Guidelines
If you have encountered a new entity, survived an attack, or uncovered a piece of the conspiracy surrounding the Mother's Fire, submit a Pull Request.

Rules of Engagement:

Accessibility is Non-Negotiable: All images must have descriptive alt text detailing the creature's appearance and weaknesses. Screen readers save lives.

Contrast Matters: Do not alter the core #5C3A21 (Leather) and #F4ECD8 (Cream) color palette without checking WCAG contrast ratios.

No Unverified Lore: Stick to the facts. The shadows are deceptive enough without us lying to each other.

Stay sharp. Stay alive.
