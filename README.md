# YouTube Metadata Automator

An open-source Node.js CLI tool that automatically updates a YouTube video's title and description based on its real-time metrics (e.g., view count).

## Features

- **Automated Metadata Updates**: Dynamically injects video statistics (views, likes, comments) into your video title and description.
- **OAuth2 Authentication**: Securely authenticates with the YouTube Data API and stores refresh tokens locally so you only need to authorize once.
- **Ready for Scheduling**: Designed to be easily run via cron jobs or other scheduling mechanisms.

## Prerequisites

1.  **Node.js**: Ensure you have [Node.js](https://nodejs.org/) installed (v14 or higher recommended).
2.  **Google Cloud Project**: You will need a Google Cloud Project with the **YouTube Data API v3** enabled.
3.  **OAuth Credentials**: You must create OAuth 2.0 Client IDs (Desktop App type) to get your `CLIENT_ID` and `CLIENT_SECRET`.

### Getting Google Cloud API Credentials

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  Navigate to **APIs & Services > Library** and enable the **YouTube Data API v3**.
4.  Go to **APIs & Services > Credentials**.
5.  Click **Create Credentials > OAuth client ID**.
6.  Set the Application type to **Desktop app**.
7.  Copy your `Client ID` and `Client Secret`.

## Installation

1.  Clone this repository:
    ```bash
    git clone https://github.com/yourusername/youtube-metadata-automator.git
    cd youtube-metadata-automator
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## Configuration

1.  Copy the example environment file to `.env`:
    ```bash
    cp .env.example .env
    ```
2.  Open the `.env` file and populate it with your credentials and preferences:

    ```env
    CLIENT_ID=your_client_id
    CLIENT_SECRET=your_client_secret
    REDIRECT_URI=http://localhost

    VIDEO_ID=your_video_id
    TITLE_TEMPLATE=This video has {views} views!
    DESCRIPTION_TEMPLATE=Check out the stats: {views} views, {likes} likes!
    ```

    *Available Placeholders*: `{views}`, `{likes}`, `{comments}`

## Usage

### 1. Initial Authentication

Before running the main script, you need to authorize the application to access your YouTube account.

Run the following command:
```bash
npm run auth
```
1.  The console will output an authorization URL.
2.  Open this URL in your web browser.
3.  Sign in with the Google account that owns the YouTube channel.
4.  Grant the requested permissions.
5.  After granting permission, the browser may redirect to `localhost` (which will likely fail to load) or show a code. Copy the `code` parameter from the URL.
6.  Paste the code back into the terminal.

This will generate a `tokens.json` file, so you won't need to authenticate again.

### 2. Updating the Video

To fetch the latest metrics and update the video metadata, simply run:

```bash
npm start
```

You can set up a cron job on your server or local machine to run this command periodically.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License (CC-BY-NC-SA-4.0).
