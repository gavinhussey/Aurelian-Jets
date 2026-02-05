# Connect aurelianjets.com (GoDaddy) to Railway

One guide: Railway first, then GoDaddy. Goal: **aurelianjets.com** and **www.aurelianjets.com** open your site, and the address bar shows **your domain**, not Railway.

---

## Part 1: Railway

### 1.1 Open your project

1. Log in to [Railway](https://railway.app).
2. Open the project that has your Aurelian Jets site.
3. Click the **service** (e.g. aurelian-jets).

### 1.2 Add custom domain (www only)

1. Go to the **Settings** tab.
2. Find **Networking** → **Public Networking**.
3. Under **Custom Domain**:
   - If **aurelianjets.com** (no www) is listed and says "Waiting for DNS", **remove it** (trash icon). GoDaddy can't do what Railway needs for the root.
   - Click **+ Custom Domain** (or **Add custom domain**).
   - Enter **exactly:** `www.aurelianjets.com`
   - Save / Add.

### 1.3 Copy the CNAME target

1. After adding **www.aurelianjets.com**, Railway shows a DNS instruction.
2. Click **Show DNS records** (or similar).
3. You’ll see something like:
   - **Type:** CNAME  
   - **Name:** www (or www.aurelianjets.com)  
   - **Value / Target:** `xxxxxxxx.up.railway.app` (e.g. `om9wzr4t.up.railway.app`)
4. **Copy that Value** (the `xxxx.up.railway.app`). You’ll use it in GoDaddy.
5. Leave **Target port** as **8080** (or whatever your app uses). Don’t change unless you know you need to.

Railway part is done. Leave this tab open if you need the CNAME value again.

---

## Part 2: GoDaddy – DNS

### 2.1 Open DNS for aurelianjets.com

1. Log in to [GoDaddy](https://godaddy.com).
2. Go to **My Products** → find **aurelianjets.com** → **DNS** (or **Manage DNS**).

### 2.2 Set the www CNAME (point www to Railway)

1. In the **DNS records** list, find the row where **Type** is **CNAME** and **Name** is **www**.
2. **If that row exists:**
   - Click **Edit** (pencil).
   - Set **Value** (or “Points to”) to the Railway value you copied, e.g. `om9wzr4t.up.railway.app`
   - No `https://`, no trailing slash. Just the hostname.
   - **Save.**
3. **If there is no www CNAME:**
   - Click **Add New Record** (or **Add**).
   - **Type:** CNAME  
   - **Name:** www  
   - **Value:** `om9wzr4t.up.railway.app` (or whatever Railway showed)  
   - **TTL:** 1 Hour (or default).  
   - **Save.**

Do **not** add a CNAME for **@** (root). GoDaddy doesn’t support that; the root will be handled by forwarding in the next part.

### 2.3 Don’t touch these

- **A** records for **@** – leave as is.  
- **NS** and **SOA** – don’t delete or edit.  
- **CNAME** for **www** – only edit as above; don’t delete.

---

## Part 3: GoDaddy – Forwarding (root → www)

This makes **aurelianjets.com** (no www) redirect to **www.aurelianjets.com** so the address bar shows your domain.

### 3.1 Open Forwarding

1. Still in the **aurelianjets.com** management.
2. Click the **Forwarding** tab (next to **DNS Records**).

### 3.2 Set domain forwarding

1. Under **Domain**, if **aurelianjets.com** is already listed, click **Edit**. Otherwise click **Add Forwarding** for the domain.
2. Set:
   - **From:** aurelianjets.com (root domain).
   - **Destination / To:** `https://www.aurelianjets.com`  
     Use **https://** and **www** so the bar shows your domain.
   - **Forward type:** **Permanent (301)**.
   - **Forward with masking:** **Off** (unchecked).
3. **Save.**

Important: the destination must be **https://www.aurelianjets.com**, not `https://aurelian-jets-production.up.railway.app`. That way the URL in the browser stays on your domain.

---

## Part 4: Wait and test

1. **Wait:** DNS/forwarding can take from a few minutes up to about an hour (sometimes longer). GoDaddy often says up to 48 hours; it’s usually faster.
2. **In Railway:** After a while, **www.aurelianjets.com** in Custom Domain should show a **green check** (no longer “Waiting for DNS”).
3. **Test in the browser:**
   - Open **https://www.aurelianjets.com**  
     → Should load your site and the bar should stay **www.aurelianjets.com**.
   - Open **https://aurelianjets.com**  
     → Should redirect to **https://www.aurelianjets.com** and the bar should show **www.aurelianjets.com**.

If you still see “Connection not private” or Railway “Waiting for DNS”, wait a bit longer and try again; DNS can be slow. If it’s still wrong after 1–2 hours, double‑check the **www** CNAME value in GoDaddy matches Railway exactly (no typo, no extra `https://`).

---

## Quick reference

| Where        | What to do |
|-------------|------------|
| **Railway** | Add custom domain **www.aurelianjets.com** only. Copy the CNAME target (e.g. `om9wzr4t.up.railway.app`). |
| **GoDaddy DNS** | **www** CNAME → Railway target (e.g. `om9wzr4t.up.railway.app`). Do not add CNAME for @. |
| **GoDaddy Forwarding** | **aurelianjets.com** → **https://www.aurelianjets.com**, Permanent (301), masking off. |

Result: **aurelianjets.com** and **www.aurelianjets.com** both open your site, and the address bar always shows **aurelianjets.com** (after redirect) or **www.aurelianjets.com**.
