# Trader Website

Professional trading business website with a responsive frontend and a Node.js/Express backend for lead capture and email notifications.

## Project Structure

```text
trader-website
|
+- frontend
|  +- index.html
|  +- style.css
|  +- script.js
|
+- backend
   +- server.js
   +- package.json
   +- .env.example
```

## Features

- Modern dark-theme trading business website
- Responsive layout for mobile, tablet, and desktop
- Smooth scrolling navigation and animated reveals
- Services, achievements, market, and contact sections
- TradingView advanced chart and live ticker widgets
- Client inquiry form with frontend validation
- Express API with Nodemailer email delivery
- CORS, environment-based configuration, and structured error handling

## Local Setup

### 1. Frontend

Open [frontend/index.html](frontend/index.html) directly in a browser for design review, or serve it locally with any static server.

If you want a simple local static server with Node installed:

```bash
npx serve frontend
```

### 2. Backend

```bash
cd backend
npm install
copy .env.example .env
```

Fill the `.env` values, then start the API:

```bash
npm run dev
```

The backend runs by default on `http://localhost:5000`.

## Environment Variables

Use [backend/.env.example](backend/.env.example) as the template.

- `PORT`: Express server port
- `EMAIL_HOST`: SMTP host, for example `smtp.gmail.com`
- `EMAIL_PORT`: SMTP port, for example `587`
- `EMAIL_SECURE`: `true` for SSL or `false` for TLS upgrade
- `EMAIL_USER`: SMTP username
- `EMAIL_PASS`: SMTP password or app password
- `EMAIL_TO`: Trader email that receives inquiries
- `EMAIL_FROM`: Sender address shown in outgoing mail
- `CORS_ORIGIN`: Comma-separated list of allowed frontend origins

## Deployment Instructions

### 1. Host the Frontend on GitHub Pages or Netlify

#### Option A: GitHub Pages

1. Push the project to GitHub.
2. If you want to publish only the frontend, place the contents of `frontend` in a dedicated branch or configure a build/deploy action that publishes the `frontend` folder.
3. In your GitHub repository settings, open `Pages`.
4. Select the deployment source and point it to the branch/folder that contains the frontend files.
5. After deployment, GitHub Pages will provide a public URL.
6. Update the API URL inside [frontend/script.js](frontend/script.js) by replacing `https://your-render-service.onrender.com` with your real Render backend URL.

#### Option B: Netlify

1. Sign in to Netlify and click `Add new site`.
2. Import the GitHub repository or drag and drop the `frontend` folder.
3. If using Git integration, set the publish directory to `frontend`.
4. Deploy the site.
5. After deployment, update the production API URL in [frontend/script.js](frontend/script.js) if needed.

### 2. Host the Node.js Backend on Render

1. Push the project to GitHub.
2. In Render, create a new `Web Service`.
3. Connect your GitHub repository.
4. Set the root directory to `backend`.
5. Use these values:
   - Build command: `npm install`
   - Start command: `npm start`
6. Add environment variables from [backend/.env.example](backend/.env.example).
7. Deploy the service.
8. Copy the generated Render URL, for example `https://your-service.onrender.com`.

### 3. Connect the Frontend Form to the Backend API

1. Open [frontend/script.js](frontend/script.js).
2. Find the `productionApiBaseUrl` value.
3. Replace `https://your-render-service.onrender.com` with the real Render URL.
4. Add your frontend domain to the backend `CORS_ORIGIN` variable on Render.
5. Redeploy or refresh both services after the update.

### 4. Test Email Delivery

1. Confirm the backend health route is working: `https://your-render-service.onrender.com/api/health`.
2. Submit the contact form from the live frontend.
3. Verify the success response shown on the page.
4. Check the trader inbox configured in `EMAIL_TO`.
5. If no mail arrives, verify SMTP credentials, spam folder, and Render environment variables.

### 5. Add a Custom Domain

#### Frontend custom domain

1. In GitHub Pages or Netlify, open domain settings.
2. Add your domain such as `www.yourtradingbrand.com`.
3. Update DNS records at your domain registrar as instructed by the hosting provider.
4. Enable HTTPS once DNS propagation completes.

#### Backend custom domain

1. In Render, open your web service settings.
2. Add an API subdomain such as `api.yourtradingbrand.com`.
3. Point your DNS records to Render as instructed.
4. Update [frontend/script.js](frontend/script.js) so the production API URL uses the custom API domain.

## Real-Use Checklist

- Replace placeholder contact details, WhatsApp number, and social links
- Replace demo headlines with your preferred financial news feed if needed
- Update business copy with the trader's real credentials and compliance-approved messaging
- Test the form locally and after deployment
- Verify SMTP provider limits and security requirements
