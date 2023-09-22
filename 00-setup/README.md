# Workshop setup

This setup guide will walk you through the prerequisites needed for the workshop. This setup process is crucial to ensure the remaining exercises function as expected.

## Get started

1. Install dependencies

   ```
   yarn
   ```

2. Generate a secret.

   ```
   yarn rw g secret
   ```

3. Copy the secret from the previous step and add it to your `.env` at the root of this `00-setup` directory as the `SESSION_SECRET`. Your `.env` file should look similar to the following:

   ```
   SESSION_SECRET=VALUE_FROM_PREVIOUS_STEP
   ```

4. Apply the database schema to your database.

   ```
   yarn rw prisma migrate dev
   ```

5. Seed the database with Spotify data.

   ```
   yarn rw prisma db seed
   ```

   > NOTE: If you'd like to customize the user or device information for the workshop, see the [workshop config](#workshop-config) section for more information. This should be done before running seeds.

6. Start the app

```
yarn rw dev
```

If everything works as expected, you should see a home screen with the contents of this README.

## Workshop config

You can personalize this workshop experience by modifying the workshop config. This step is not required, though highly encouraged to get the most of your experience.

This configuration allows you to set your display name, avatar, and device information used for playback.

### Applying changes

Changes to the configuration can be applied by running the seed script. If you've already run the seed script, running it again will update this information.

```sh
yarn rw prisma db seed
```

### Customizing your user

You can customize both your display name and your avatar. This will show up in the user dropdown once logged in.

To customize your username, update the `displayName` property. By default this will be "RedwoodConf Attendee".

```toml
[user]

displayName = "RedwoodConf Attendee"
```

To customize your avatar, add an image to `web/public/avatar.png`. By default, the `web/public/defaultAvatar.png` will be used. Adding this file will require you to [apply changes](#applying-changes) to the database by running the seed script, otherwise the default avatar will be displayed.

### Customizing your device

To replicate the Spotify UI, the app displays a device for playback. If you'd like to customize the name and/or type of this device in the UI, update the `name` and `type` properties in the config.

By default, the `name` will be set to "My Computer" and the `type` to "computer".

```toml
[device]

name = "My Computer"
type = "computer"
```

## You're done 🎉

To make sure everything is working, [log into](http://localhost:8910/login) the app. Once logged in, the app should resemble the authenticated Spotify UI complete with the data you configured in the workshop config.

Each exercise uses the database and workshop configuration completed in this phase.
