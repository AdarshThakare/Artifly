# 📘 Project Documentation: Artisans Empowerment Website (Prototype)

## 🎯 Project Vision

The **Artisans Empowerment Website** aims to provide simple digital tools that help local artisans showcase their crafts, tell authentic stories, and connect with wider markets.  
We are combining **AI** with **modern frontend development** to create a platform that:

- Simplifies the **upload and organization** of craft photos.
- Uses **AI to generate tags, descriptions, and backstories** for discoverability.
- Provides **voice-based interactions** for accessibility and ease of use.
- Will eventually **connect artisans with buyers, marketplaces, and communities**.

---

## ✅ Features Implemented (Prototype)

### 1\. 📂 File Uploader (Craft Photos)

- **Drag-and-drop image uploader** with preview functionality.
- Supports both **drag & drop** and **file picker** options.
- Uploads **up to 5 images at a time**.
- Displays images in a **grid view with thumbnails**.
- Artisans can **remove individual images** before submission.

🔧 **Tech Used**

- React (functional components + hooks)
- TailwindCSS (utility-first styling)
- `lucide-react` (icon library)

---

### 2\. 🧩 Custom UI Components

Since this is a plain **React prototype** (not Next.js + shadcn/ui), we built reusable UI components:

- **Card Component** → Used to group sections (e.g., uploader, preview area).
- **Button Component** → Ensures consistent style and interactions across UI.

---

### 3\. 🛠️ Future-Ready Hooks

The current uploader is structured to support **seamless AI integrations**:

- **AI Image Recognition** → Auto-generate craft tags (e.g., “Handwoven Basket, Bamboo, Traditional Art”).
- **AI Story Builder** → Auto-generate descriptions or backstories for craft items.
- **SEO Tagging** → Improve visibility on search engines and artisan marketplaces.

---

## 🔜 Features in Pipeline

Planned integrations for the next development phases:

### 🤖 AI Image Recognition

- Identifies craft types and suggests categories/tags.
- Helps artisans describe products effectively without typing.

### ✍️ AI Story Builder

- Generates human-like stories about crafts.
- Example:  
  _“This handwoven bamboo basket reflects three generations of weaving tradition from Assam.”_

### 🎙️ Voice Recognition (Accessibility)

- Enables artisans to **search, describe, and upload using voice commands**.
- Especially useful for artisans with limited literacy or digital familiarity.

---

## 🛠️ Tech Stack

- **Frontend:** React + TailwindCSS
- **Icons:** lucide-react
- **Future AI Integrations (planned):**

  - Google Cloud Vision API → Image Recognition
  - Google Cloud Speech-to-Text → Voice Recognition
  - Google Cloud Natural Language → Story/Tag Generation

---

## 📂 Current Project Structure

```bash
/src
  /components
    FileUploader.jsx   # Drag-drop uploader with preview & remove option
    Card.jsx           # Reusable card container
    Button.jsx         # Reusable button component
  App.jsx              # Root component, integrates all features
  index.css            # TailwindCSS styles
```

---

## 🌍 Impact on Artisans

- **Ease of Use:** Simple drag-and-drop for photo uploads.
- **Discoverability:** AI-generated tags & stories increase online visibility.
- **Accessibility:** Voice features lower barriers for artisans unfamiliar with typing.
- **Cultural Preservation:** AI Story Builder captures traditions and heritage behind crafts.
