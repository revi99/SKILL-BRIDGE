# Render Deployment Guide for SkillBridge Portal

This project is configured as a full-stack unified web service for Render. A single Render Web Service builds both the frontend and backend, serves the frontend SPA static files, and routes all `/api/*` endpoints.

---

## 1. Prerequisites (Free MongoDB Atlas Database)

Render servers run in cloud containers and do not run a local MongoDB instance. You need a free cloud MongoDB URI:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free **M0 Cluster**.
2. Go to **Network Access** > Click **Add IP Address** > Select **Allow Access from Anywhere (`0.0.0.0/0`)**.
3. Go to **Database Access** > Click **Add New Database User** > Create a username and password (e.g., `dbAdmin` and a secure password).
4. Click **Database** > **Connect** > Choose **Drivers** > Copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/collab_portal?retryWrites=true&w=majority
   ```
   *(Replace `<username>` and `<password>` with your database user credentials)*.

---

## 2. Push Code to GitHub

Open terminal and run:

```bash
# Add your GitHub repository remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# Rename branch to main if needed
git branch -M main

# Push code to GitHub
git push -u origin main
```

---

## 3. Deploy to Render

### Option A: 1-Click Blueprint (Recommended)

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > Select **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect [`render.yaml`](file:///c:/Users/ravi1/Desktop/stud/render.yaml).
5. When prompted for `MONGODB_URI`, paste your MongoDB Atlas connection string.
6. Click **Apply**. Render will automatically build and deploy!

---

### Option B: Manual Web Service Setup

If you prefer manual configuration:

1. In Render Dashboard, click **New +** > **Web Service**.
2. Connect your GitHub repository.
3. Configure the following fields:
   - **Name**: `skillbridge-portal`
   - **Language**: `Node`
   - **Branch**: `main`
   - **Root Directory**: *(Leave completely blank - uses project root)*
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Expand **Advanced** > **Environment Variables** and add:
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `NODE_VERSION` | `20` |
   | `MONGODB_URI` | `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/collab_portal?retryWrites=true&w=majority` |
   | `JWT_SECRET` | *(Any random 32+ character string)* |
5. Click **Deploy Web Service**.

---

## 4. (Optional) Populate Demo Data on Render

Once your service is deployed, you can seed the demo accounts and postings:
1. In Render Dashboard, go to your Web Service > **Shell**.
2. Run:
   ```bash
   npm run seed
   ```
3. Your Render deployment is now seeded with demo students, industry recruiters, and academicians!
