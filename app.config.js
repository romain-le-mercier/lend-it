module.exports = {
  expo: {
    name: "Lend It",
    slug: "lending-tracker",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/appstore.png",
    userInterfaceStyle: "dark",
    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#0F172A"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.lendit.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/playstore.png",
        backgroundColor: "#0F172A"
      },
      package: "com.lendit.app"
    },
    web: {
      favicon: "./assets/logo.png"
    },
    plugins: [
      "expo-notifications"
    ],
    extra: {
      eas: {
        projectId: "b1068eba-3dd2-46ad-a396-ee528713ff8b"
      }
    }
  }
};