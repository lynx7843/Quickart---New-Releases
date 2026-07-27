# QuickArt

An AI and AR powered e-commerce platform that helps buyers make better purchase decisions and gives sellers smarter tools to present their products.

QuickArt combines a conventional storefront with a conversational AI assistant, a virtual try-on pipeline, and in-browser 3D and AR product viewing, so customers can evaluate an item realistically before committing to a purchase.

---

## Table of Contents

- [Attribution](#attribution)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Preview](#preview)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Related Repositories](#related-repositories)
- [Future Enhancements](#future-enhancements)

---

## Attribution

This project is based on the original **QuickArt** project by **kdsmaduranga**:

**https://github.com/kdsmaduranga/Quickart**

Full credit for the original concept, design direction, and foundational implementation belongs to the original author and contributors. This repository is a derivative work that builds on that foundation with additional features and fixes.

---

## Features

### AI Capabilities

| Feature | Description |
| --- | --- |
| AI Chatbot | Round-the-clock customer support, product questions, and order tracking assistance |
| Voice Assistant | Search the catalogue and navigate the platform using voice commands |
| Virtual Try-On | Generates a preview of a garment worn by the customer, with a fit assessment per size |

### AR and 3D Capabilities

| Feature | Description |
| --- | --- |
| Virtual Room View | Place furniture and decor into a real room to judge scale and fit before buying |
| 3D Product Viewer | Rotate, zoom, and inspect products from every angle directly in the browser |

### Commerce

| Feature | Description |
| --- | --- |
| Accounts and Roles | Customer, Seller, and Admin roles with JWT-based authentication |
| Catalogue | Product browsing, category filtering, and keyword search |
| Cart and Orders | Persistent per-user cart, order placement, and order cancellation |
| Seller Tools | Product listing, inventory management, and image uploads |
| Admin Dashboard | Store management and oversight of listings |

---

## Tech Stack

### Frontend

| Component | Technology |
| --- | --- |
| Framework | React 19 |
| Build tool | Vite 8 |
| Routing | React Router 7 |
| 3D and AR | Three.js, React Three Fiber, Drei, React Three XR |
| Icons | Lucide React |
| Editor components | Craft.js |

### Backend

| Component | Technology |
| --- | --- |
| Language | Java 17 |
| Framework | Spring Boot 3.2.3 |
| Security | Spring Security with JWT (JJWT) |
| Data access | Spring Data MongoDB |
| Build tool | Maven (wrapper included) |

### Services and Infrastructure

| Component | Technology |
| --- | --- |
| Database | MongoDB (Atlas or local) |
| Media storage | Cloudinary |
| Conversational AI | Google Gemini |
| Virtual try-on model | Replicate (IDM-VTON) |
| AR asset hosting | Amazon S3 |

---

## Preview

Screenshots of the QuickArt web interface.

| Home | Categories | Cart |
| :---: | :---: | :---: |
| ![Home Screen](img/home.png) | ![Category Page](img/categories.png) | ![Cart](img/cart.png) |
| **AI Chatbot** | **AR Try-On** | **User Profile** |
| ![AI Chatbot](img/ai.png) | ![AR Features](img/fiton.png) | ![User Profile](img/profile.png) |

---

## Prerequisites

Install the following before setting up the project:

| Requirement | Version | Notes |
| --- | --- | --- |
| Java Development Kit | 17 or later | Required to build and run the backend |
| Node.js | 20.19 or later | Required by Vite 8 |
| MongoDB | 6.0 or later | A local instance or a MongoDB Atlas cluster |
| Maven | Not required | The `mvnw` / `mvnw.cmd` wrapper is included in `backend/` |

You will also need accounts for the third-party services listed under [Environment Variables](#environment-variables). The application starts without the optional keys, but the AI and try-on features will be unavailable.

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/lynx7843/Quickart---New-Releases.git
cd Quickart---New-Releases
```

### 2. Configure the backend environment

Create a file named `.env` in the **repository root** (the same directory as this README) using the template in [Environment Variables](#environment-variables).

The backend imports this file at startup through `spring.config.import` in `backend/src/main/resources/application.properties`. It is parsed as a Java properties file, which is why two of the keys use dotted names while the rest use uppercase environment-style names. Both forms are required exactly as shown.

The root `.env` is listed in `.gitignore` and must never be committed.

### 3. Configure the frontend environment

```bash
cd frontend
cp .env.example .env
```

The defaults in `.env.example` work for local development. Only variables prefixed with `VITE_` are exposed to the browser bundle, and they are read through `import.meta.env`.

### 4. Prepare the database

Either start a local MongoDB instance, or create a free MongoDB Atlas cluster and copy its connection string into `spring.data.mongodb.uri` in the root `.env`. The application creates the required collections automatically on first use.

---

## Environment Variables

### Backend — root `.env`

All values below are placeholders. Replace them with your own credentials.

```properties
# ---------------------------------------------------------------
# Database
# ---------------------------------------------------------------
# A local instance or an Atlas connection string.
spring.data.mongodb.uri=mongodb+srv://quickart:examplepassword@cluster0.example.mongodb.net/quickart?retryWrites=true&w=majority

# ---------------------------------------------------------------
# Authentication
# ---------------------------------------------------------------
# Base64-encoded signing key. Must decode to at least 32 bytes for HS256.
# Generate one with:
#   openssl rand -base64 48
jwt.secret=c3VwZXJzZWNyZXQtZGV2LWtleS1jaGFuZ2UtbWUtMTIzNDU2Nzg5MA==

# ---------------------------------------------------------------
# Cloudinary - product and try-on image hosting
# ---------------------------------------------------------------
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=exampleSecretAbcdefghijklmnop

# ---------------------------------------------------------------
# Google Gemini - chatbot and image generation
# ---------------------------------------------------------------
GEMINI_API_KEY=AIzaSyEXAMPLE0000000000000000000000000

# ---------------------------------------------------------------
# Replicate - virtual try-on inference
# ---------------------------------------------------------------
REPLICATE_API_TOKEN=r8_EXAMPLE000000000000000000000000000000

# ---------------------------------------------------------------
# Optional
# ---------------------------------------------------------------
ANTHROPIC_API_KEY=sk-ant-api03-EXAMPLE000000000000000000
HUGGINGFACE_API_TOKEN=hf_EXAMPLE00000000000000000000000000

# Comma-separated browser origins allowed to call the API.
# Defaults to local development hosts when omitted.
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Which values the application requires:

| Variable | Required | Purpose |
| --- | --- | --- |
| `spring.data.mongodb.uri` | Yes | Database connection |
| `jwt.secret` | Yes | Signs and verifies authentication tokens |
| `CLOUDINARY_CLOUD_NAME` | Yes | Image hosting |
| `CLOUDINARY_API_KEY` | Yes | Image hosting |
| `CLOUDINARY_API_SECRET` | Yes | Signs upload requests; never exposed to the browser |
| `GEMINI_API_KEY` | Yes | Chatbot and image generation |
| `REPLICATE_API_TOKEN` | No | Virtual try-on; the feature reports an error without it |
| `ANTHROPIC_API_KEY` | No | Reserved for future use |
| `HUGGINGFACE_API_TOKEN` | No | Reserved for future use |
| `CORS_ALLOWED_ORIGINS` | No | Override for deployed environments |

### Frontend — `frontend/.env`

```properties
# Backend base path. "/api" is proxied to http://localhost:8080 by vite.config.js.
VITE_API_BASE_URL=/api

# AR and 3D asset buckets (public S3).
VITE_AR_IMAGE_BASE_URL=https://your-bucket.s3.eu-north-1.amazonaws.com
VITE_AR_MODEL_BASE_URL=https://your-bucket.s3.eu-north-1.amazonaws.com

# Cloudinary cloud name. This is a public identifier and is safe to ship in the
# bundle; uploads are authorised by a signature fetched from the backend.
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

---

## Running the Application

The backend and frontend run as two separate processes. Start the backend first.

### Start the backend

```bash
cd backend
./mvnw spring-boot:run
```

On Windows:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The API is served at `http://localhost:8080` under the `/api/v1` path.

Run this command from inside `backend/` so the root `.env` resolves correctly.

### Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The application is served at `http://localhost:5173`. The Vite dev server proxies `/api` to the backend on port 8080, so no CORS configuration is needed during local development.

### Accounts and roles

Register a new account from the sign-up page. Choose the Customer or Seller role during registration; a Seller account unlocks product listing and inventory management. The Admin role is assigned automatically to the designated administrator email address.

Passwords must be 8 to 64 characters and include an uppercase letter, a lowercase letter, a number, and a special character.

---

## Building for Production

### Backend

```bash
cd backend
./mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
cd frontend
npm run build
```

The optimised bundle is written to `frontend/dist`. Serve it with any static host, and set `VITE_API_BASE_URL` to the deployed API origin before building.

When deploying, set `CORS_ALLOWED_ORIGINS` to the public site origin, for example `https://quickart.example.com`.

---

## Testing

```bash
cd backend
./mvnw test
```

```bash
cd frontend
npm run lint
```

---

## Project Structure

```
Quickart---New-Releases/
├── backend/                  Spring Boot API
│   └── src/main/java/com/example/backend/
│       ├── config/           Security and CORS configuration
│       ├── controller/       REST endpoints
│       ├── dto/              Request and response payloads
│       ├── model/            MongoDB documents
│       ├── repository/       Spring Data repositories
│       ├── security/         JWT issuing and request filtering
│       └── service/          Business logic and integrations
├── frontend/                 React single-page application
│   └── src/
│       ├── assets/           Page components, styles, and images
│       └── pages/            Shared context providers
├── img/                      Screenshots used in this README
└── .env                      Backend secrets (not committed)
```

---

## Related Repositories

| Project | Repository |
| --- | --- |
| Original QuickArt project | https://github.com/kdsmaduranga/Quickart |
| QuickArt mobile application | https://github.com/lynx7843/Quickart-mobile |

---

## Future Enhancements

- Personalised AI product recommendations
- Advanced seller analytics dashboard
- Multi-language support
- Expanded AR catalogue coverage
