# LL126 Field Inspector App

**Capitol Compliance** — Production-ready parapet inspection field app.

Inspectors open this on their phone while on-site. The app pulls building data from the ClickUp project task, walks through an 8-step inspection wizard, captures photos/video/signature, and writes everything back to ClickUp on submit.

---

## How It Works

1. **Inspector receives a dispatch link** via email:
   `https://your-app.vercel.app/inspect?taskId=86ey99gg0`

2. **App loads building data** from the ClickUp task (address, BIN, BBL, entity, etc.)

3. **Inspector walks 8 steps:**
   - Dispatch confirmation (verify building info)
   - Parapet materials & past repairs
   - North / East / South / West elevation (condition, defects, notes, photos)
   - Observation summary (hazard, FISP score, 360 video)
   - Inspector sign-off (name, firm, signature)

4. **On submit, 3 API calls fire:**
   - Upload all photos and video as task attachments
   - Update all custom fields (conditions, info, materials, score, etc.)
   - Flip Project Phase from "Dispatched" → "Inspected"

5. **Offline safety:** If signal drops, data saves locally and retries automatically.

---

## Deploy to Vercel (20 minutes, all in browser)

### Step 1: Create a GitHub Account & Repo

1. Go to [github.com](https://github.com) → Sign up (free)
2. Click **+** (top right) → **New repository**
3. Name it `ll126-field-app`, click **Create repository**
4. On the next page, click **"uploading an existing file"**
5. **Drag and drop** all the files from this zip into the upload area
6. Click **Commit changes**

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Sign Up** → **Continue with GitHub**
2. Click **Add New Project**
3. Find `ll126-field-app` → click **Import**
4. Leave all settings as default → click **Deploy**
5. Wait ~60 seconds. You'll get a URL like `ll126-field-app.vercel.app`

### Step 3: Add Your ClickUp API Token

1. In **ClickUp**: avatar (bottom left) → **Settings** → **Apps** → **Generate** API Token → copy it
2. In **Vercel**: go to your project → **Settings** → **Environment Variables**
3. Add:
   - **Name:** `CLICKUP_API_TOKEN`
   - **Value:** paste your token
4. Click **Save**
5. Go to **Deployments** → click **...** on the latest → **Redeploy**

### Step 4 (Optional): Custom Domain

To use `field.capitolcompliance.co` instead of the Vercel URL:

1. In Vercel: **Settings** → **Domains** → type your subdomain → **Add**
2. In your DNS provider: add a CNAME record pointing to `cname.vercel-dns.com`
3. Vercel handles SSL automatically

---

## Project Structure

```
ll126-field-app/
├── src/
│   ├── app/
│   │   ├── layout.js          # Root HTML layout
│   │   ├── page.js            # Home page (landing)
│   │   ├── globals.css        # Tailwind + custom styles
│   │   ├── inspect/
│   │   │   └── page.js        # Main inspection page
│   │   └── api/
│   │       └── task/[taskId]/
│   │           ├── route.js         # GET task data from ClickUp
│   │           ├── field/route.js   # POST set custom field
│   │           └── attachment/route.js  # POST upload file
│   ├── components/
│   │   ├── InspectionWizard.jsx    # Main wizard orchestrator
│   │   ├── steps/                  # One component per wizard step
│   │   │   ├── DispatchConfirmation.jsx
│   │   │   ├── ParapetConstruction.jsx
│   │   │   ├── ElevationInspection.jsx  # Reused for N/E/S/W
│   │   │   ├── ObservationSummary.jsx
│   │   │   └── InspectorSignOff.jsx
│   │   └── ui/                     # Reusable UI components
│   │       ├── PhotoCapture.jsx
│   │       ├── SignaturePad.jsx
│   │       └── ProgressBar.jsx
│   └── lib/
│       ├── fieldConfig.js    # All ClickUp field IDs & option UUIDs
│       ├── api.js            # Client-side API helpers
│       └── offlineStore.js   # localStorage offline persistence
├── package.json
├── next.config.mjs
├── tailwind.config.js
├── postcss.config.js
├── .env.local.example
├── .gitignore
└── README.md
```

---

## Custom Field Reference

All field IDs in `src/lib/fieldConfig.js` are wired to the **Projects** list in Client Space.

### Read on Load
| Field | Type | ID |
|-------|------|----|
| Address | Location | `4a0d22c4-...` |
| BIN | Number | `6f7bc095-...` |
| BBL | Number | `eecd4918-...` |
| Date of Inspection | Date | `c772070d-...` |
| Entity | Short Text | `d9759cde-...` |
| Client Contact | Email | `9f71b221-...` |
| Billing Address | Short Text | `b3e37e90-...` |

### Written on Submit
| Field | Type |
|-------|------|
| Parapet Materials | Dropdown (7 options) |
| Past Repairs | Multi Line Text |
| N/E/S/W Parapet Condition | Dropdown (3 options each) |
| N/E/S/W Parapet Info | Multi Line Text |
| N/E/S/W Parapet | Attachment (photos) |
| 360 Video | Attachment |
| Parapet Score | Emoji (Safe/SWARMP/Unsafe) |
| Inspector Signature | Signature |
| Project Phase | Dropdown → set to "Inspected" |

---

## Notes

- **API token security:** The token is stored as a Vercel environment variable and only used in server-side API routes. It never reaches the browser.
- **Offline mode:** All inspection data saves to localStorage after each step. If submit fails due to no signal, data is queued and retries automatically when the phone reconnects.
- **File uploads:** Photos upload directly to the ClickUp task. The app supports multiple photos per elevation.
- **Signature:** Drawn on a canvas, exported as PNG, and uploaded as a task attachment.

---

Built for Capitol Compliance. Questions? Check the [Parapet App Launch](https://app.clickup.com/t/86eytjkku) task in ClickUp.
