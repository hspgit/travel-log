# Travel Log

A personal travel companion app built with Nuxt, Turso, and better-auth. Log your trips, pin locations on an interactive map, and save memories with photos.

## Setup

1.  **Clone the repository**

2.  **Environment Setup**
    Copy the example environment file and fill in your credentials:

    ```bash
    cp .env.example .env
    ```

3.  **Install Dependencies**

    ```bash
    pnpm install
    ```

4.  **Database Setup**
    Start your local database (Turso/LibSQL) or connect to cloud:
    ```bash
    pnpm run dev:db
    ```
    _(In a separate terminal)_ push the schema:
    ```bash
    pnpm drizzle-kit push
    ```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm run dev
```

## Production

Build the application for production:

```bash
pnpm run build
```

Locally preview production build:

```bash
pnpm run preview
```

## Features & Workflow

### Core Features

- **Authentication**: Secure login via GitHub and Google.
- **Interactive Map**: Visualize your travels with a fully interactive map interface.
- **Dark/Light Mode**: Seamless theme switching.
- **Location Management**:
    - **Smart Search**: Easily find and pin locations globally.
    - **Hierarchical Logging**: Organize trips by major **Locations** (e.g., "Paris Trip") and granular **Location Logs** (e.g., "Eiffel Tower", "Louvre Museum").
    - **Time Tracking**: Record start and end times for each visit.
- **Rich Media**:
    - **Image Uploads**: Attach photos to your location logs.
    - **Secure Storage**: Images are stored securely via S3 with signed URLs.

### User Workflow

1.  **Sign In**: Log in to access your personal dashboard.
2.  **Create a Trip (Location)**: Search for and save a major destination (e.g., a city or region) to start a new collection.
3.  **Log Your Visits**: Inside a location, add specific spots you visited.
4.  **Add Details**: Record the dates/times and upload memorable photos for each spot.
5.  **Review**: Visualize your entire journey on the map or browse through your timeline.
