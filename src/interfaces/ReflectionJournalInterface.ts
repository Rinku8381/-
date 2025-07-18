// Platform detection utility for Seraphine Hybrid V1
// Detects current runtime environment and available features

export interface PlatformInfo {
  runtime: "web" | "electron" | "capacitor" | "react-native";
  os: "ios" | "android" | "windows" | "macos" | "linux" | "unknown";
  device: "mobile" | "tablet" | "desktop";
  features: {
    pwa: boolean;
    offline: boolean;
    push: boolean;
    haptics: boolean;
    fileSystem: boolean;
    camera: boolean;
    geolocation: boolean;
    biometric: boolean;
  };
}

export class PlatformDetector {
  private static instance: PlatformDetector;
  private platformInfo: PlatformInfo | null = null;

  private constructor() {}

  public static getInstance(): PlatformDetector {
    if (!PlatformDetector.instance) {
      PlatformDetector.instance = new PlatformDetector();
    }
    return PlatformDetector.instance;
  }

  public async detectPlatform(): Promise<PlatformInfo> {
    if (this.platformInfo) {
      return this.platformInfo;
    }

    const runtime = this.detectRuntime();
    const os = this.detectOS();
    const device = this.detectDevice();
    const features = await this.detectFeatures(runtime);

    this.platformInfo = {
      runtime,
      os,
      device,
      features,
    };

    return this.platformInfo;
  }

  private detectRuntime(): PlatformInfo["runtime"] {
    // Check for Electron
    if (typeof window !== "undefined" && window.electronAPI) {
      return "electron";
    }

    // Check for Capacitor
    if (typeof window !== "undefined" && (window as any).Capacitor) {
      return "capacitor";
    }

    // Check for React Native
    if (
      typeof navigator !== "undefined" &&
      navigator.product === "ReactNative"
    ) {
      return "react-native";
    }

    // Default to web
    return "web";
  }

  private detectOS(): PlatformInfo["os"] {
    if (typeof navigator === "undefined") {
      return "unknown";
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();

    if (/iphone|ipad|ipod/.test(userAgent)) {
      return "ios";
    }

    if (/android/.test(userAgent)) {
      return "android";
    }

    if (/win/.test(platform)) {
      return "windows";
    }

    if (/mac/.test(platform)) {
      return "macos";
    }

    if (/linux/.test(platform)) {
      return "linux";
    }

    return "unknown";
  }

  private detectDevice(): PlatformInfo["device"] {
    if (typeof window === "undefined") {
      return "desktop";
    }

    const userAgent = navigator.userAgent.toLowerCase();

    // Check for tablet first (more specific)
    if (
      /ipad/.test(userAgent) ||
      (/android/.test(userAgent) && !/mobile/.test(userAgent)) ||
      (window.innerWidth >= 768 && window.innerWidth < 1024)
    ) {
      return "tablet";
    }

    // Check for mobile
    if (
      /mobile|iphone|ipod|android.*mobile/.test(userAgent) ||
      window.innerWidth < 768
    ) {
      return "mobile";
    }

    return "desktop";
  }

  private async detectFeatures(
    runtime: PlatformInfo["runtime"],
  ): Promise<PlatformInfo["features"]> {
    const features: PlatformInfo["features"] = {
      pwa: false,
      offline: false,
      push: false,
      haptics: false,
      fileSystem: false,
      camera: false,
      geolocation: false,
      biometric: false,
    };

    // Service Worker (PWA features)
    if ("serviceWorker" in navigator) {
      features.pwa = true;
      features.offline = true;
    }

    // Push notifications
    if ("Notification" in window && "PushManager" in window) {
      features.push = true;
    }

    // Haptics
    if (runtime === "capacitor") {
      // Capacitor provides haptics
      features.haptics = true;
    } else if (runtime === "web" && "vibrate" in navigator) {
      // Web vibration API
      features.haptics = true;
    }

    // File System
    if (runtime === "electron" || runtime === "capacitor") {
      features.fileSystem = true;
    } else if (
      "showOpenFilePicker" in window ||
      "webkitRequestFileSystem" in window
    ) {
      features.fileSystem = true;
    }

    // Camera
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      features.camera = true;
    }

    // Geolocation
    if ("geolocation" in navigator) {
      features.geolocation = true;
    }

    // Biometric (platform-specific)
    if (runtime === "capacitor" || runtime === "react-native") {
      // These platforms can support biometric authentication
      features.biometric = true;
    } else if (
      runtime === "web" &&
      "credentials" in navigator &&
      "webauthn" in window
    ) {
      // WebAuthn support
      features.biometric = true;
    }

    return features;
  }

  public isWeb(): boolean {
    return this.platformInfo?.runtime === "web";
  }

  public isElectron(): boolean {
    return this.platformInfo?.runtime === "electron";
  }

  public isCapacitor(): boolean {
    return this.platformInfo?.runtime === "capacitor";
  }

  public isReactNative(): boolean {
    return this.platformInfo?.runtime === "react-native";
  }

  public isMobile(): boolean {
    return this.platformInfo?.device === "mobile";
  }

  public isTablet(): boolean {
    return this.platformInfo?.device === "tablet";
  }

  public isDesktop(): boolean {
    return this.platformInfo?.device === "desktop";
  }

  public isIOS(): boolean {
    return this.platformInfo?.os === "ios";
  }

  public isAndroid(): boolean {
    return this.platformInfo?.os === "android";
  }

  public hasFeature(feature: keyof PlatformInfo["features"]): boolean {
    return this.platformInfo?.features[feature] || false;
  }

  public getOptimalUIConfig() {
    if (!this.platformInfo) {
      throw new Error("Platform not detected. Call detectPlatform() first.");
    }

    const { device, runtime, os } = this.platformInfo;

    return {
      // Layout
      showSidebar: device === "desktop",
      showBottomTabs: device === "mobile",
      showTopTabs: device === "tablet",

      // Interactions
      useHoverEffects: device === "desktop",
      useTouchOptimization: device === "mobile" || device === "tablet",
      enableSwipeGestures: device === "mobile",

      // Platform-specific UI
      useNativeScrollbars: runtime === "electron",
      useSystemChrome: runtime === "electron",
      hideAddressBar: runtime === "capacitor" || runtime === "react-native",

      // OS-specific
      useSystemAccentColor: os === "windows",
      useCupertinoStyle: os === "ios",
      useMaterialDesign: os === "android",

      // Performance
      enableVirtualization: device === "mobile",
      reduceAnimations: device === "mobile" && runtime === "web",
      optimizeImages: device === "mobile",
    };
  }
}

// Singleton instance
export const platformDetector = PlatformDetector.getInstance();

// React hook for platform detection
export const usePlatform = () => {
  const [platformInfo, setPlatformInfo] = React.useState<PlatformInfo | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    platformDetector.detectPlatform().then((info) => {
      setPlatformInfo(info);
      setIsLoading(false);
    });
  }, []);

  return {
    platformInfo,
    isLoading,
    isWeb: platformInfo?.runtime === "web",
    isElectron: platformInfo?.runtime === "electron",
    isCapacitor: platformInfo?.runtime === "capacitor",
    isReactNative: platformInfo?.runtime === "react-native",
    isMobile: platformInfo?.device === "mobile",
    isTablet: platformInfo?.device === "tablet",
    isDesktop: platformInfo?.device === "desktop",
    isIOS: platformInfo?.os === "ios",
    isAndroid: platformInfo?.os === "android",
    hasFeature: (feature: keyof PlatformInfo["features"]) =>
      platformInfo?.features[feature] || false,
    getOptimalUIConfig: () => platformDetector.getOptimalUIConfig(),
  };
};

// Import React for the hook
import React from "react";
