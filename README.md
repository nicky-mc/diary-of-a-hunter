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

⚠️ Contribution Guidelines
If you have encountered a new entity, survived an attack, or uncovered a piece of the conspiracy surrounding the Mother's Fire, submit a Pull Request.

Rules of Engagement:

Accessibility is Non-Negotiable: All images must have descriptive alt text detailing the creature's appearance and weaknesses. Screen readers save lives.

Contrast Matters: Do not alter the core #5C3A21 (Leather) and #F4ECD8 (Cream) color palette without checking WCAG contrast ratios.

No Unverified Lore: Stick to the facts. The shadows are deceptive enough without us lying to each other.

Stay sharp. Stay alive.
