# Workshop setup

This setup guide will walk you through the prerequisites needed for the workshop. This setup process is crucial to ensure the remaining exercises function as expected.

## Get started

1. Install dependencies

   ```
   yarn
   ```

2. Apply the database schema.

   ```
   yarn rw prisma migrate dev
   ```

3. Seed the database with Spotify data

   ```
   yarn rw prisma db seed
   ```

   > NOTE: If you'd like to customize some of the Spotify data that is displayed in the workshop app, see the section below on [customizing spotify data](#customize-the-spotify-data).

4. Start the app

```
yarn rw dev
```

If everything works as expected, you should see a home screen with these instructions.

## Workshop config

You can personalize this workshop experience by modifying the workshop config. This step is not required, though highly encouraged to get the most of your experience.

This configuration allows you to set your display name, name the device used to simulate playback, ensure certain albums, tracks, or playlists are synced from Spotify, as well as a starting point for saved albums and tracks.

This data is saved to the local database.

### Customizing your user

```toml
[user]

displayName = 'RedwoodConf Attendee'
```

### Customizing your device

### Customize the Spotify data
