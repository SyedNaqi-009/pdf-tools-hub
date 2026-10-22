# dopdf Backend — Server-Side PDF Processing Microservice

This microservice provides containerized server-side PDF operations for `dopdf` (`https://www.dopdfconverter.online`), designed for continuous zero-downtime deployment on **Railway**.

---

## Architecture & Features

- **Runtime:** Node.js 20 LTS (Alpine Linux Container)
- **Framework:** Express with pure in-memory streaming via `multer` (no disk writes, zero data leakage)
- **PDF Engine:** `pdf-lib` compiled binary manipulations
- **Healthcheck Route:** `GET /health` with HTTP 200 response and JSON uptime payload
- **CORS:** Configured for `https://www.dopdfconverter.online` and local development

---

## Railway Deployment Guide

> **Note on Railway Availability:**
> As noted in the master instructions, Railway has experienced platform-side incidents. When the Railway platform is operating normally, use either of the following methods to deploy this backend:

### Option A: Railway GitHub Integration (Recommended)
1. Go to your [Railway Dashboard](https://railway.app/).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select this repository.
4. Set the **Root Directory** to `backend`.
5. Railway will automatically detect `railway.json` and `Dockerfile`.
6. Add the environment variables listed below in the project **Variables** tab.
7. Click **Deploy**.

### Option B: Railway CLI
```bash
cd backend
railway login
railway init
railway up
```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Service listening port (injected automatically by Railway) | `8080` |
| `NODE_ENV` | Runtime environment | `production` |
| `FRONTEND_URL` | Allowed origin for CORS | `https://www.dopdfconverter.online` |

---

## Endpoints

- `GET /health` — Microservice healthcheck
- `POST /api/pdf/merge` — Server-side PDF concatenation (multipart `files`)
- `POST /api/pdf/compress` — Server-side PDF stream optimization (multipart `file`)
- `POST /api/pdf/rotate` — Server-side page rotation (multipart `file`, body `angle`)
- `POST /api/pdf/watermark` — Server-side text watermark (multipart `file`, body `text`)

---

## Frontend Integration Note

The Next.js frontend on Vercel is 100% self-sufficient using client-side WebAssembly. When the Railway service is live, set `NEXT_PUBLIC_API_BASE_URL=https://your-railway-service.up.railway.app` on Vercel to seamlessly enable hybrid offloading for heavy operations.
