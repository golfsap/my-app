# Notes app 📝

Mobile application written using React Native and Typescript using an [Expo](https://expo.dev) project.

## About

The application contains three pages: home page, note page and comment page. The home page displays a login button which authenticates the user through Auth0 Open ID connect (OIDC)configurations.

Once the user is successfully authenticated, an id_token is stored securely using SecureStore from expo-secure-store for native platforms or local storage for the web. This token is then used in the authorization for every API endpoint.

The application allows users to view, create and delete their notes and its associated comments using the API specified.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

_This project uses development build to correctly configure the Redirect URIs used in the login mechanism._
