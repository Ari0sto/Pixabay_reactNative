# Pixabay React Native Gallery

A mobile image gallery application built with React Native, Expo, and TypeScript. The application integrates with the Pixabay REST API to provide image browsing, search, filtering, favorites, and local user profile management.

The project uses a modular architecture with React Navigation, Context API, AsyncStorage, and a centralized theme system.

## Features

### Image Gallery

* Browse a feed of high-quality images from Pixabay.
* Infinite scrolling with paginated API requests.
* Responsive image grid adapted to different screen sizes.
* Open images in a dedicated detailed view.

### Search and Filtering

* Search images by keywords.
* Browse images using predefined categories such as:

  * Nature
  * Cars
  * Animals
  * Space
  * and others.
* Search and category filtering use a mutually exclusive interface to keep the search experience simple and predictable.

### Image Details

The detailed image screen provides:

* High-resolution image preview.
* Image author information.
* Number of views.
* Number of likes.
* Number of downloads.
* Image tags.
* Ability to add or remove the image from favorites.

### Favorites

* Add images to favorites from different screens.
* Favorites are available globally throughout the application.
* State is managed using React Context API.
* Favorites are persisted locally using AsyncStorage.

### User Profile

* Local user profile management.
* Select a profile avatar from the device's media library.
* Avatar selection is handled using `expo-image-picker`.

### Navigation

The application uses a nested navigation architecture:

* Bottom tab navigation for the main application sections.
* Native stack navigation for detailed screens and overlays.

### Theming

The project includes a centralized theme system based on a custom `useTheme` hook.

This approach allows the application to:

* Keep colors and styling consistent across screens.
* Dynamically apply theme-dependent styles.
* Easily introduce Light/Dark mode switching in the future.

## Tech Stack

| Technology         | Purpose                             |
| ------------------ | ----------------------------------- |
| React Native       | Mobile application framework        |
| Expo               | Development and runtime environment |
| TypeScript         | Static typing                       |
| React Navigation   | Application navigation              |
| React Context API  | Global state management             |
| AsyncStorage       | Local data persistence              |
| Pixabay REST API   | Image data and search               |
| Fetch API          | Network requests                    |
| expo-image-picker  | Selecting images from the device    |
| @expo/vector-icons | Icons and interface elements        |

## Project Structure

```text
.
├── src/
│   ├── api/
│   │   └── API requests and Pixabay configuration
│   │
│   ├── components/
│   │   └── Reusable UI components
│   │       ├── SearchBar
│   │       ├── ImageCard
│   │       └── CategoryList
│   │
│   ├── context/
│   │   └── Global state providers
│   │       └── FavoritesContext
│   │
│   ├── navigation/
│   │   └── Navigation and screen flow configuration
│   │
│   ├── screens/
│   │   ├── Gallery
│   │   ├── Search
│   │   ├── Favorites
│   │   ├── Profile
│   │   └── ImageDetails
│   │
│   ├── types/
│   │   └── Shared TypeScript interfaces and types
│   │
│   └── theme.ts
│       └── Centralized theme and color configuration
│
├── .env
├── package.json
└── README.md
```

The exact structure may vary depending on the current project configuration.

## Getting Started

### Prerequisites

Before running the project, make sure you have:

* Node.js installed.
* npm or Yarn installed.
* Expo Go installed on a physical Android or iOS device, or an Android/iOS emulator.
* A free Pixabay API key.

You can obtain a Pixabay API key from the official Pixabay API documentation:

https://pixabay.com/api/docs/

### Installation

Clone the repository:

```bash
git clone https://github.com/Ari0sto/Pixabay_reactNative
```

Navigate to the project directory:

```bash
cd PixabayGallery
```

Install the project dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory of the project:

```text
EXPO_PUBLIC_PIXABAY_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual Pixabay API key.

Do not commit your `.env` file to the repository if it contains private credentials.

### Running the Application

Start the Expo development server:

```bash
npx expo start
```

After the development server starts, Expo will display a QR code.

You can then:

* Scan the QR code using the Camera app on iOS.
* Scan the QR code using Expo Go on Android.
* Run the application using an available Android or iOS emulator.

## API

The application uses the Pixabay REST API to retrieve image data.

The API key is provided through the following environment variable:

```text
EXPO_PUBLIC_PIXABAY_API_KEY
```

API requests are handled inside the `/src/api` directory.

The application uses Pixabay data for:

* Image feeds.
* Keyword searches.
* Category-based filtering.
* Image metadata.
* Author statistics.
* Image tags.

For API limits, request parameters, and available endpoints, refer to the official Pixabay API documentation:

https://pixabay.com/api/docs/

## State Management

Global application state is managed using React Context API.

The favorites system is implemented through `FavoritesContext`, which provides access to the current favorites and actions for adding or removing images.

Favorites are also persisted locally using AsyncStorage, allowing them to remain available after the application is restarted.

The general data flow is:

```text
User Action
    |
    v
FavoritesContext
    |
    +----> Application UI
    |
    +----> AsyncStorage
```

## Navigation Architecture

The application combines two React Navigation navigators.

### Bottom Tabs

The main application sections are organized using bottom tab navigation.

Typical sections include:

* Gallery
* Search
* Favorites
* Profile

### Native Stack

A native stack navigator is used for screens that require a separate navigation layer, such as the image details screen.

The general navigation structure is:

```text
Root Stack
    |
    +---- Main Tabs
    |      |
    |      +---- Gallery
    |      +---- Search
    |      +---- Favorites
    |      +---- Profile
    |
    +---- Image Details
```

## Theming

The application uses a centralized theme configuration located in:

```text
src/theme.ts
```

Components can access the current theme through the custom `useTheme` hook.

Centralizing theme values makes it easier to maintain consistent styling and add additional themes without rewriting individual components.

## Development

The project is written in TypeScript and follows a modular structure.

When adding new functionality, reusable UI elements should be placed in:

```text
src/components
```

Global state should be implemented in:

```text
src/context
```

API-related functionality should be kept in:

```text
src/api
```

Navigation changes should be made in:

```text
src/navigation
```

Shared TypeScript definitions should be placed in:

```text
src/types
```

This separation helps keep the application maintainable as new features are added.

## License

This project is intended for educational and development purposes.

The application uses the Pixabay API and its associated content. Refer to Pixabay's terms of service and API documentation for information about API usage and content licensing.
