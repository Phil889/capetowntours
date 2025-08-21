# Creating a New Supabase Project - Step by Step

## 1. Create the Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"** button
3. Fill in the form:
   - **Name**: `capetowntours` (no spaces or special characters)
   - **Database Password**: Create a strong password and **save it**
   - **Region**: Choose **US East** or **Central EU**
   - **Pricing Plan**: Free tier is fine
4. Click **"Create new project"**

## 2. Wait for Setup
- It should take 1-2 minutes
- You'll see "Setting up project..." 
- Wait until you see the project dashboard

## 3. Get Your Credentials
Once the project is ready:

1. Go to **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL**: (looks like `https://xxxxx.supabase.co`)
   - **anon public** key: (starts with `eyJ...`)
   - **service_role** key: (in the secret section, also starts with `eyJ...`)

## 4. Update Your Environment Variables

Paste your new credentials below (I'll update the files for you):

```
NEXT_PUBLIC_SUPABASE_URL=your_new_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_new_anon_key_here  
SUPABASE_SERVICE_ROLE_KEY=your_new_service_role_key_here
```

## 5. Create Database Tables

Once your project is ready, go to:
1. **SQL Editor** (in the left sidebar)
2. Click **New Query**
3. I'll provide the SQL to create the tours table

---

**Let me know when you have the new project created and I'll help you update everything!**
