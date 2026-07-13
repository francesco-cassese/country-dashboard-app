# Country Dashboard App

> ⚠️ **Progetto personale in fase di sviluppo.** Realizzato per mettere in pratica e consolidare competenze full-stack (React, Node.js/Express, MySQL). Non è ancora completo e potrebbe contenere funzionalità parziali o in via di rifinitura.

Dashboard web per esplorare i paesi del mondo tramite [REST Countries API](https://restcountries.com/), con possibilità di consultare informazioni sui vari stati e salvarli come preferiti.

## Indice

- [Motivazione](#motivazione)
- [Stack Tecnologico](#stack-tecnologico)
- [Prerequisiti](#prerequisiti)
- [Installazione](#installazione)
- [Utilizzo](#utilizzo)
- [Struttura del progetto](#struttura-del-progetto)
- [Contributi](#contributi)
- [Licenza](#licenza)

## Motivazione

Questo repository nasce come esercizio pratico per sperimentare un'architettura full-stack completa: un backend Node.js/Express che espone dati paginati da un'API esterna e li combina con una persistenza MySQL per i preferiti, e un frontend React che consuma queste API con aggiornamenti ottimistici. L'obiettivo principale è didattico: testare pattern, librerie e best practice apprese, non fornire un prodotto finito.

## Stack Tecnologico

**Frontend**
- [React 19](https://react.dev/)
- [React Router](https://reactrouter.com/) per il routing (Dashboard, dettaglio paese, preferiti)
- [Vite](https://vitejs.dev/) come build tool e dev server
- CSS Modules per lo styling
- ESLint per il linting

**Backend**
- [Node.js](https://nodejs.org/) con moduli ES (`type: module`)
- [Express 5](https://expressjs.com/)
- [MySQL](https://www.mysql.com/) tramite `mysql2`
- [cors](https://www.npmjs.com/package/cors)

**Gestione pacchetti**
- [pnpm](https://pnpm.io/)

## Prerequisiti

- [Node.js](https://nodejs.org/) v18 o superiore
- [pnpm](https://pnpm.io/) v11 o superiore
- Un'istanza [MySQL](https://www.mysql.com/) attiva e raggiungibile
- Una chiave API valida per [REST Countries](https://restcountries.com/)

## Installazione

Il progetto è diviso in due workspace indipendenti: `backend` e `frontend`. Installa le dipendenze in entrambi.

```bash
# Backend
cd backend
pnpm install

# Frontend
cd ../frontend
pnpm install
```

### Configurazione variabili d'ambiente

Copia i file `.env.example` in `.env` in entrambe le cartelle e valorizza le variabili richieste.

**backend/.env**

```
# Server
PORT=3000

# Database (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=tuo_utente_db
DB_PASSWORD=tua_password_db
DB_DATABASE=dashboard_db

KEY_REST_COUNTRIES=api_key_di_restcountries
```

**frontend/.env**

```
VITE_API_URL_BACKEND= url dove girerà il backend
```

### Setup del database

Esegui lo script SQL presente in [backend/database/schema.sql](backend/database/schema.sql) sulla tua istanza MySQL per creare il database e la tabella dei preferiti.

## Utilizzo

Avvia backend e frontend in due terminali separati.

**Backend**

```bash
cd backend
pnpm start   # avvio standard
pnpm watch   # avvio con reload automatico (node --watch)
```

**Frontend**

```bash
cd frontend
pnpm dev
```

Per generare la build di produzione del frontend:

```bash
cd frontend
pnpm build
```

L'app frontend sarà disponibile all'indirizzo indicato da Vite (di default `http://localhost:5173`), mentre il backend risponderà sulla porta configurata in `PORT` (default `3000`).

### Pagine e navigazione

Il frontend usa React Router con tre rotte principali, condivise da un layout comune con header e navbar:

- `/` – Dashboard con l'elenco paginato dei paesi
- `/countries/:ccn3` – Dettaglio di un singolo paese
- `/favorites` – Elenco dei paesi salvati come preferiti

Lo stato dei preferiti è centralizzato in un `FavoritesContext` (esposto tramite l'hook `useFavorites`), condiviso tra Dashboard, dettaglio paese e pagina Preferiti così da restare sincronizzato senza richieste ripetute al backend.

### Caching lato backend

Le risposte dell'API esterna REST Countries (elenco paginato e dettaglio singolo paese) vengono mantenute in cache in memoria sul backend per 15 minuti, per ridurre le chiamate esterne e velocizzare le risposte.

## Struttura del progetto

```
country-dashboard-app/
├── backend/
│   ├── controllers/     # Logica delle route (countries con cache in-memory, favorites)
│   ├── database/        # Connessione MySQL e schema SQL
│   ├── middlewares/      # Validazione richieste
│   ├── routers/          # Definizione degli endpoint Express
│   └── server.js         # Entry point del server
└── frontend/
    └── src/
        ├── components/   # Componenti React (Dashboard, CountryList, CountryCard, CountryDetail, FavoritesPage, Navbar)
        ├── context/       # FavoritesContext (stato preferiti condiviso)
        ├── layouts/       # PageLayout (header, navbar, footer condivisi tra le pagine)
        ├── hooks/         # Custom hook (useCountries, useCountryDetail, useFavorites)
        └── services/      # Chiamate API e trasformazione dati
```

## Contributi

Essendo un progetto personale a scopo di apprendimento, non sono attualmente previsti contributi esterni strutturati. Suggerimenti e feedback sono comunque benvenuti tramite issue.

## Licenza

Progetto a scopo didattico. 
