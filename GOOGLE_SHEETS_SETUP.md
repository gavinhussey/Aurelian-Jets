# Google Sheets Integration Setup

## Quick Setup Guide

### Step 1: Prepare Your Google Sheet

1. Open your Google Sheet (or create a new one).
2. Create a sheet tab named exactly: **"Aurelian Air — Early Access"** (or update `SHEET_NAME` in the script to match your tab name).
3. Set up these columns in **row 1** in this exact order:

   | A | B | C | D | E | F | G | H |
   |---|---|-------|-----|------|--------------|--------|--------|
   | **Timestamp** | **Full Name** | **Email Address** | **City** | **State** | **Phone Number** | **Source** | **Status** |

   - **Timestamp** — When the request was submitted (filled by the form)
   - **Full Name** — Required
   - **Email Address** — Required
   - **City** — Optional
   - **State** — Optional
   - **Phone Number** — Optional
   - **Source** — Auto-filled (e.g. AurelianJets.com)
   - **Status** — Leave blank for your own use

### Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions** > **Apps Script**
2. Delete any existing code
3. Copy the entire contents of **`google-apps-script.js`** from this project
4. Paste it into the Apps Script editor
5. **Update the Spreadsheet ID** (around line 21):
   - In your sheet URL: `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit`
   - Set: `const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';`
6. **Optional:** Set your email for new-request notifications (around line 291):
   ```javascript
   var recipientEmail = 'your-email@example.com';
   ```
7. Save the project (Ctrl+S or Cmd+S)
8. Name the project (e.g. "Aurelian Jets Form Handler")

### Step 3: Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description:** e.g. "Aurelian Jets Form Handler"
   - **Execute as:** **Me**
   - **Who has access:** **Anyone** (so the website can submit)
5. Click **Deploy**
6. **Copy the Web App URL**

### Step 4: Update index.html

1. Open **`index.html`**
2. Find the line with `GOOGLE_SCRIPT_URL` (around line 595)
3. Replace the URL with the Web App URL you copied
4. Save the file

### Step 5: Test

1. Open your site (or `index.html` locally)
2. Fill out the form: **Full Name**, **Email Address**, and optionally City, State, Phone
3. Click **Request Access**
4. Check your Google Sheet — a new row should appear with the same data

---

## Form fields (current)

The site sends:

- **Full Name** * (required)
- **Email Address** * (required)
- **City** (optional)
- **State** (optional)
- **Phone Number** (optional)

Plus: **Timestamp**, **Source** (AurelianJets.com), and **Status** (empty).

---

## Troubleshooting

- **Form doesn’t submit:** Check the browser console (F12), confirm the Web App URL in `index.html`, and that the Apps Script is deployed with "Anyone" access.
- **Data not in sheet:** Check the sheet tab name matches `SHEET_NAME` in the script, and that the **first row** has the column headers in the order above.
- **Wrong columns:** Ensure the script’s `COLUMNS` array in `google-apps-script.js` matches the headers in your sheet exactly.

---

## Security

- The Web App URL is public; the script only handles POST requests and appends rows.
- Keep the Google Sheet private; only you (and anyone you share it with) can see the data.
