<div align="center">

# 📚 Biblioteca

**Gestione completa di una biblioteca: catalogo, noleggi e programma fedeltà.**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

</div>

---

## 📖 Descrizione

**Biblioteca** è un'applicazione web full stack che permette agli utenti di consultare il catalogo, noleggiare libri e accumulare punti fedeltà a ogni restituzione, mentre gli amministratori gestiscono libri e noleggi da un pannello dedicato.

Il progetto è composto da un **backend** REST (Node.js, Express, Prisma) e da un **frontend** React, con autenticazione basata su sessione, interfaccia bilingue (italiano e inglese) e design responsive.

<!-- Facoltativo: aggiungi qui uno screenshot dell'app
<p align="center">
  <img src="docs/screenshot.png" alt="Anteprima di Biblioteca" width="800">
</p>
-->

## ✨ Funzionalità

### 👤 Per gli utenti

- 🔐 **Registrazione e login** con cookie di sessione e password protette con bcrypt
- 📖 **Catalogo libri** con disponibilità in tempo reale, ricerca e filtro per genere
- 🔄 **Noleggio di 14 giorni** e restituzione, con aggiornamento automatico delle copie
- 📋 **Noleggi attivi e storico**, con stato "Scaduto" calcolato automaticamente
- 🎁 **Carta fedeltà:** 10 punti a ogni restituzione, con storico dei movimenti

### 🛠️ Per gli amministratori

- 📊 **Dashboard** con statistiche
- 📚 **Gestione dei libri**
- 🗂️ **Elenco dei noleggi** con filtro per stato

### 🌍 Generale

- 🇮🇹 🇬🇧 **Interfaccia in italiano e inglese**
- 📱 **Design responsive**

## 🛠️ Tecnologie

| Livello | Strumenti |
|---|---|
| **Frontend** | React, TypeScript, Vite, MUI, React Router, Axios, i18next |
| **Backend** | Node.js, Express 5, TypeScript, Prisma 7 |
| **Database** | MySQL |
| **Sicurezza** | bcrypt, express-session, helmet, express-rate-limit |

## 🔒 Regole di business

- Solo gli utenti autenticati possono noleggiare
- Un libro con zero copie disponibili non può essere noleggiato (controllo anche lato server, atomico)
- Noleggio e restituzione avvengono in **transazione**, quindi copie, stato e punti restano coerenti
- Un utente può restituire solo i propri noleggi
- Un libro con noleggi in corso o con storico non può essere eliminato
- Le rotte `/admin/*` sono riservate agli amministratori, sia nel frontend sia nel backend

## 📁 Struttura del progetto

```
Biblioteca/
├── backend-biblioteca/
│   └── src/
│       ├── config/        # Client Prisma
│       ├── controllers/   # Gestione delle richieste HTTP
│       ├── middleware/    # Autenticazione e ruoli
│       ├── routes/        # Definizione delle rotte
│       ├── services/      # Logica di business
│       └── scripts/       # Seed e creazione admin
└── frontend-biblioteca/
    └── src/
        └── api/ components/ context/ hooks/ i18n/ layout/ pages/ routes/ types/ utils/
```

## 🚀 Come avviare il progetto

### Requisiti

- [Node.js](https://nodejs.org/) 20 o superiore
- [MySQL](https://www.mysql.com/) installato e **in esecuzione**
- [Git](https://git-scm.com/)

### 1. Clona il repository

```bash
git clone https://github.com/NOME-UTENTE/NOME-REPOSITORY.git
cd NOME-REPOSITORY
```

### 2. Crea il database

```sql
CREATE DATABASE biblioteca_db;
```

### 3. Configura e avvia il backend

```bash
cd backend-biblioteca
npm install
cp .env.example .env     # poi modifica i valori nel file .env
npx prisma generate
npx prisma migrate dev
npm run dev
```

Il server parte su `http://localhost:3000`.

> ⚠️ **Importante: client Prisma.** Il client Prisma **non è incluso nel repository**: viene creato automaticamente a partire dallo schema. Dopo aver scaricato il progetto devi generarlo con:
>
> ```bash
> npx prisma generate
> ```
>
> Senza questo passaggio il backend non parte e compaiono errori di import del client Prisma. Ripeti il comando ogni volta che modifichi il file `prisma/schema.prisma`.

### 4. Carica i dati iniziali

Dalla cartella `backend-biblioteca`, con MySQL acceso:

```bash
# catalogo di esempio (13 libri)
npx tsx src/scripts/seed.ts

# crea un amministratore (scegli email e password tue)
npx tsx src/scripts/creaAdmin.ts admin@biblioteca.it UnaPasswordSicura123
```

> 💡 Sostituisci email e password dell'esempio con credenziali tue.

### 5. Avvia il frontend

In un secondo terminale:

```bash
cd frontend-biblioteca
npm install
cp .env.example .env
npm run dev
```

L'app è raggiungibile su `http://localhost:5173`.

## 🔐 Variabili d'ambiente

| Variabile | Dove | Descrizione |
|---|---|---|
| `PORT` | backend | Porta del server (default 3000) |
| `CLIENT_URL` | backend | Indirizzo del frontend, per CORS |
| `SESSION_SECRET` | backend | Chiave per firmare i cookie di sessione |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | backend | Connessione a MySQL |
| `VITE_API_URL` | frontend | Indirizzo del backend |

I file `.env` contengono dati riservati e sono esclusi da Git. Come modello usa i file `.env.example` presenti in `backend-biblioteca/` e `frontend-biblioteca/`.

## 🗺️ Sviluppi futuri

- [ ] Tabella DataGrid nelle pagine admin Libri e Noleggi
- [ ] Modifica dei libri direttamente dal pannello admin
- [ ] Passaggio a HTTPS con cookie `secure: true` per la produzione

> **Nota:** in sviluppo i cookie di sessione usano `secure: false`. In produzione va abilitato HTTPS e impostato `secure: true`.

---

<div align="center">

Se il progetto ti è piaciuto, lascia una ⭐ al repository!

</div>
