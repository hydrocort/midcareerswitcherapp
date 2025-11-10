# Setup Guide for New Machine (WSL 2.0)

This guide will walk you through setting up the Mid Career Switcher App on a new WSL 2.0 machine using a virtual environment, starting from after you've successfully cloned the repository from GitHub.

## Prerequisites

Before starting, ensure you have:
- WSL 2.0 installed and running
- Git installed
- Repository cloned to your local machine

---

## Step 1: Install Node.js and npm

We'll use Node Version Manager (nvm) to install Node.js in an isolated environment.

### 1.1 Install nvm

```bash
# Download and install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# Activate nvm (or restart your terminal)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

### 1.2 Verify nvm installation

```bash
nvm --version
```

You should see a version number (e.g., `0.39.5`).

### 1.3 Install Node.js 18+

```bash
# Install Node.js (LTS version recommended)
nvm install 18

# Use the installed version
nvm use 18

# Set it as default
nvm alias default 18
```

### 1.4 Verify Node.js and npm installation

```bash
node --version   # Should show v18.x.x
npm --version    # Should show 9.x.x or similar
```

---

## Step 2: Navigate to Project Directory

```bash
cd /path/to/midcareerswitcherapp
```

Replace `/path/to/midcareerswitcherapp` with the actual path where you cloned the repository.

---

## Step 3: Install Project Dependencies

Install all Node.js dependencies specified in `package.json`:

```bash
npm install
```

This will create a `node_modules` folder with all required packages.

---

## Step 4: Set Up Environment Variables

### 4.1 Create environment file

```bash
touch .env.local
```

### 4.2 Add API keys and configuration

Open `.env.local` in your preferred editor and add the following:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o

# ElevenLabs API Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=your_voice_id_here

# Database Configuration
DATABASE_URL=file:./dev.db
```

### 4.3 Get your API keys

**OpenAI API Key:**
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in `.env.local`

**ElevenLabs API Key:**
1. Go to https://elevenlabs.io/
2. Sign up or log in
3. Go to your profile/settings
4. Find your API key
5. Copy the key and paste it in `.env.local`

**ElevenLabs Voice ID:**
1. In your ElevenLabs dashboard
2. Go to Voices section
3. Select a voice you want to use
4. Copy the Voice ID
5. Paste it in `.env.local`

### 4.4 (Optional) Change the AI Model

You can use different OpenAI models by changing `OPENAI_MODEL`:
- `gpt-4o` - Most capable (default)
- `gpt-4o-mini` - Faster and cheaper
- `gpt-3.5-turbo` - Cheapest option

---

## Step 5: Set Up Database

The project uses SQLite with Prisma ORM.

### 5.1 Generate Prisma Client

```bash
npx prisma generate
```

This generates the Prisma client based on your schema.

### 5.2 Initialize Database

```bash
npx prisma db push
```

This creates the SQLite database file (`dev.db`) and sets up all tables.

### 5.3 Verify Database Setup

```bash
ls -la prisma/
```

You should see a `dev.db` file in the `prisma` directory.

---

## Step 6: Create Required Directories

The application stores audio files. Ensure the directory exists:

```bash
mkdir -p public/audio
```

---

## Step 7: Run the Application

### 7.1 Start Development Server

```bash
npm run dev
```

You should see output similar to:

```
   ▲ Next.js 15.5.6
   - Local:        http://localhost:3000
   - Ready in 2.3s
```

### 7.2 Access the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

---

## Step 8: Verify Installation

Test the application:

1. **Home Page**: Should load without errors
2. **New Conversation**: Click "New Conversation"
3. **Upload Resume**: Try uploading a test resume (PDF or DOCX)
4. **Database**: Check that conversations are being saved

---

## Additional Configuration

### Setting nvm to Load Automatically

Add these lines to your `~/.bashrc` or `~/.zshrc`:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

Then reload your shell:

```bash
source ~/.bashrc  # or source ~/.zshrc
```

### Automatically Use Project Node Version

You can create a `.nvmrc` file in the project root:

```bash
echo "18" > .nvmrc
```

Now, whenever you `cd` into the project directory, run:

```bash
nvm use
```

---

## Troubleshooting

### Issue: `command not found: nvm`

**Solution**: Restart your terminal or run:

```bash
source ~/.bashrc  # or ~/.zshrc
```

### Issue: Database connection errors

**Solution**: Delete and recreate the database:

```bash
rm prisma/dev.db
npx prisma db push
```

### Issue: Port 3000 already in use

**Solution**: Use a different port:

```bash
PORT=3001 npm run dev
```

Then access at `http://localhost:3001`

### Issue: Missing dependencies errors

**Solution**: Clear cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Prisma errors

**Solution**: Regenerate Prisma client:

```bash
npx prisma generate
npx prisma db push
```

### Issue: API key errors

**Solution**: Double-check your `.env.local` file:
- Ensure no extra spaces around the `=` sign
- Ensure no quotes around the API keys
- Verify the keys are correct from your API dashboards

---

## Project Structure Overview

```
midcareerswitcherapp/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   ├── components/          # React components
│   ├── conversation/        # Conversation pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── lib/                     # Utility libraries
│   ├── prisma.ts           # Database client
│   ├── openai.ts           # OpenAI integration
│   ├── elevenlabs.ts       # ElevenLabs integration
│   └── documentParser.ts   # PDF/DOCX parsing
├── prisma/                  # Database
│   ├── schema.prisma       # Database schema
│   └── dev.db              # SQLite database
├── public/                  # Static files
│   └── audio/              # Audio recordings
├── .env.local              # Environment variables (create this)
├── package.json            # Node.js dependencies
└── tsconfig.json           # TypeScript configuration
```

---

## Useful Commands

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
```

### Database

```bash
npx prisma studio           # Open Prisma Studio (database GUI)
npx prisma db push          # Sync database schema
npx prisma generate         # Regenerate Prisma client
npx prisma migrate dev      # Create migration (advanced)
```

### Node Version Management

```bash
nvm list                    # List installed Node versions
nvm use 18                  # Switch to Node 18
nvm install 18              # Install Node 18
nvm alias default 18        # Set default Node version
```

---

## Next Steps

Once everything is running:

1. **Read the README.md** for detailed usage instructions
2. **Check USAGE_CHECKLIST.md** (if available) for features
3. **Review CONFIGURATION.md** (if available) for advanced settings
4. **Test all features**:
   - Resume upload
   - Job description analysis
   - Interview question generation
   - Voice recording and transcription
   - Feedback generation

---

## Security Notes

- **Never commit `.env.local`** to version control (it should be in `.gitignore`)
- **Keep your API keys secret** - don't share them
- **Monitor API usage** - both OpenAI and ElevenLabs have usage costs
- **Set spending limits** on your API accounts to avoid unexpected charges

---

## Getting Help

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review error messages carefully
3. Check the project's **README.md** for additional information
4. Verify all environment variables are set correctly
5. Ensure you have the latest dependencies: `npm install`

---

## Summary Checklist

- [ ] Install nvm
- [ ] Install Node.js 18+ via nvm
- [ ] Navigate to project directory
- [ ] Run `npm install`
- [ ] Create `.env.local` with API keys
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push`
- [ ] Create `public/audio` directory
- [ ] Run `npm run dev`
- [ ] Test application at `http://localhost:3000`

---

**You're all set!** Your Mid Career Switcher App should now be running on your new machine. Happy coding! 🚀

