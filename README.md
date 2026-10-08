# AniFlix — Premium Anime Streaming Platform & CMS Studio

AniFlix is a production-ready, dark cinematic anime streaming platform and SaaS content management system. It features real-time discovery, a customizable HTML5 streaming video player with skip points and speed controls, live continue-watching progress synchronization, airing schedules, community reactions, and an enterprise-grade administration dashboard.

---

## 1. Features

### Public Streaming Experience
- **Cinematic Dark Design**: Crafted with an obsidian backdrop (`#05080D`), deep navy surfaces (`#0D1722`), emerald/cyan highlights (`#00E5A8`, `#14B8FF`), and glassmorphism.
- **Dynamic Hero Spotlight**: Full-width auto-playing banner carousel with HD badges, rating stars, synopsis, and instant watch actions.
- **Advanced Video Streaming Player**:
  - HTML5 video playback with multi-resolution indicators (1080p, 720p, 480p).
  - Playback speed adjustment (0.75x, 1x, 1.25x, 1.5x, 2x).
  - One-click **Skip Intro** (configured at 85s–175s) and **Skip Outro**.
  - Auto-next episode progression.
  - Picture-in-Picture (PiP) and Fullscreen toggle.
  - Full keyboard shortcuts (`Space` to toggle play, `Left`/`Right` to seek 10s, `F` for fullscreen, `M` to mute, `N` for next episode).
  - Graceful backup stream failover with automatic retry.
- **Continue Watching & Progress Sync**: Throttled playback tracking that stores exact seconds and percentage watched so viewers can resume instantly.
- **Personal Watchlist ("My List")**: Add, remove, and filter bookmarked anime series.
- **Airing Timetable & Reminders**: Weekly schedule of simulcast releases (UTC) with alert reminder toggles.
- **Instant Search**: Instant debounced query parsing by English title, Japanese romanji/kanji, studio, or genre tags, complete with recent search history and popular keywords.
- **Interactive Ratings & Community Discussions**:
  - 5-star interactive rating widget with live weighted averages.
  - Sanitized comments with likes, reporting, and moderation controls.
- **Progressive Web App (PWA)**: Complete with `manifest.json`, service worker caching (`sw.js`), and offline fallback.

### Administrative CMS Studio (`/admin`)
- **Executive SaaS Dashboard**: KPI metric cards (Total Anime, Episodes, Users, Watch Sessions, Streamed Hours, Active Users, Reports) and daily/weekly/monthly charts.
- **Anime Catalogue Management**: Full CRUD data table with bulk selection, status/type filters, search, pagination, and deletion safety dialogs.
- **Episode Library Management**: Add episodes, configure video streams, backup URLs, subtitles, and intro/outro timestamps.
- **JSON Bulk Import Engine**: Robust validator and ingester that transforms JSON datasets into anime titles and streaming episodes with preview and error checking.
- **Hero Carousel Manager**: Control homepage spotlight slides, backdrop images, callout tags, and priorities.
- **Homepage Layout CMS**: Reorder content rails, rename sections, adjust item limits, and toggle visibility.
- **User Directory & RBAC Security**: Manage user roles (`superadmin`, `admin`, `editor`, `moderator`, `user`), ban/unban accounts, and audit viewing metrics.
- **Moderation Queue**: Review flagged comments and community reports.
- **Audit Activity Trail**: Comprehensive chronological logging of all administrative actions.
- **Platform Settings & Database Tools**: Announcement banner controls, maintenance mode switch, and one-click demo data reset.

---

## 2. Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide Icons, Motion
- **Database & Auth**: Firebase Realtime Database & Firebase Authentication (with transparent local persistence in Demo Mode)
- **Deployment**: Node.js / Express / Cloud Run / PWA

---

## 3. Folder Structure

```
├── database.rules.json         # Realtime Database RBAC & validation rules
├── index.html                  # HTML entry point with typography & PWA meta
├── metadata.json               # Application metadata and capabilities
├── package.json                # Project dependencies
├── public/
│   ├── icon-192.svg            # PWA application icons
│   ├── icon-512.svg
│   ├── manifest.json           # Web app manifest
│   ├── offline.html            # Offline fallback view
│   └── sw.js                   # Service worker cache strategy
├── scripts/
│   └── seedDemoData.ts         # Standalone CLI demo seed generator
└── src/
    ├── App.tsx                 # Master routing and layout coordination
    ├── main.tsx                # React DOM root entry
    ├── index.css               # Global theme variables, gradients, and custom scrollbars
    ├── types/
    │   └── index.ts            # Complete TypeScript domain interfaces
    ├── services/
    │   ├── firebase.ts         # Firebase SDK initialization & config verification
    │   ├── localStore.ts       # Synchronized demo & offline persistence engine
    │   ├── authService.ts      # Authentication & role management
    │   ├── animeService.ts     # Anime discovery, catalogue, and CRUD
    │   ├── episodeService.ts   # Episode stream and bulk import service
    │   ├── watchlistService.ts # Watchlist toggle and synchronization
    │   ├── historyService.ts   # Throttled watch progress & resume service
    │   ├── commentService.ts   # Comments, likes, and reports service
    │   ├── ratingService.ts    # 5-Star score computation
    │   ├── scheduleService.ts  # Airing calendar service
    │   ├── notificationService.ts # Push/in-app notification alerts
    │   ├── adminService.ts     # CMS metrics, settings, and activity logs
    │   ├── analyticsService.ts # Viewership and search query telemetry
    │   ├── searchService.ts    # Debounced multi-index search
    │   └── seedData.ts         # High-resolution anime series & episodes
    ├── context/
    │   ├── AuthContext.tsx     # Current user, roles, and fast demo role switcher
    │   ├── AnimeContext.tsx    # Global catalogue, watchlist, and continue watching
    │   └── ToastContext.tsx    # Toast notification alerts
    ├── components/
    │   ├── layout/             # Header, Sidebar, MobileNav, Footer
    │   ├── anime/              # AnimeCard, AnimeHero, AnimeRow, EpisodeList, StarRating, CommentSection
    │   ├── player/             # VideoPlayer with full controls and skip points
    │   ├── search/             # SearchModal with history and suggestions
    │   ├── auth/               # AuthModal with instant demo accounts
    │   ├── admin/              # Complete SaaS admin panel components
    │   └── common/             # Modal, ConfirmDialog, Skeleton, EmptyState
    └── pages/
        ├── HomePage.tsx        # Homepage with hero and CMS rails
        ├── AnimeDetailsPage.tsx # Series details and episodes
        ├── WatchPage.tsx       # Dedicated video player view
        ├── CatalogPage.tsx     # Filterable anime & movies catalog
        ├── GenresPage.tsx      # Genre taxonomy browsing
        ├── SchedulePage.tsx    # Simulcast weekly calendar
        ├── WatchlistPage.tsx   # Saved user watchlist
        ├── HistoryPage.tsx     # Watch history and continue watching
        ├── ProfilePage.tsx     # Account settings and preferences
        └── StaticPages.tsx     # About, Help, Terms, Privacy, DMCA
```

---

## 4. Environment Configuration

Create a `.env` file in the project root:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_DATABASE_URL="https://your-app-default-rtdb.firebaseio.com"
VITE_FIREBASE_PROJECT_ID="your-app"
VITE_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"
```

> **Demo Mode**: If Firebase environment variables are not set or incomplete, AniFlix automatically boots in **Demo Mode**. The entire app remains fully functional with local persistence—you can create anime, test episode playback, change user roles, and customize layouts without being blocked!

---

## 5. Firebase Setup Instructions

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. In **Build > Authentication**, enable the **Email/Password** sign-in provider.
3. In **Build > Realtime Database**, click **Create Database** (choose your preferred region, e.g. `us-central1`).
4. In **Project Settings > General > Your Apps**, click the Web icon (`</>`) to register a web app and copy the configuration keys into your `.env` file.
5. Deploy the security rules from `database.rules.json`:
   ```bash
   firebase deploy --only database
   ```
   Or paste the contents of `database.rules.json` directly into the **Rules** tab of your Firebase Realtime Database console and click **Publish**.

---

## 6. Admin Account Setup

### In Firebase Production:
1. Register a user in AniFlix using their email.
2. In the Firebase Realtime Database console, navigate to `users/{uid}`.
3. Change the `"role"` value from `"user"` to `"superadmin"`.
4. The user now has permanent superadmin access to the `/admin` CMS Studio.

### In Demo Mode:
- Click the profile avatar in the top right or the Auth button.
- Choose **"Superadmin"**, **"Editor"**, or **"Standard User"** from the instant demo account switcher to test different permission tiers immediately.

---

## 7. Development & Production Commands

```bash
# Install dependencies
npm install

# Start local development server (Port 3000)
npm run dev

# Compile TypeScript and build for production
npm run build

# Preview production build
npm run preview
```

---

## 8. Database Rules Summary

The included `database.rules.json` enforces:
- **Public Read Access**: Anonymous and logged-in visitors can read anime metadata, published episodes, schedule items, and hero slides.
- **User Privacy**: Users can read and write only their own watchlist (`users/{uid}/watchlist`) and playback progress (`users/{uid}/history`).
- **Role Escalation Protection**: Users cannot modify their own `"role"` node. Only administrators and superadmins can alter roles.
- **Comment Moderation**: Users can create comments and delete their own. Moderators and admins can review reports, delete comments, and issue bans.
- **Input Validation**: Required fields (e.g. `title`, `videoUrl`, comment character limits) are enforced at the database layer.

---

## 9. Known Considerations

- **Video Streaming Sources**: AniFlix plays standard web-compatible video formats (`.mp4`, `.webm`, or direct HTTPS streams). The platform utilizes authorized open demonstration streams (e.g., Blender open movie projects) by default.
- **Storage**: Thumbnails and posters utilize high-fidelity SVG/vector fallbacks if an external image URL encounters network restrictions, ensuring zero broken images.
