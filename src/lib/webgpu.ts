export type BrowserInfo = {
  browser: "Chrome" | "Edge" | "Firefox" | "Safari" | "Unknown";
  version: number;
  platform: "Mac" | "Windows" | "Linux" | "Mobile" | "Unknown";
};

const MIN_SUPPORTED = {
  Chrome: 113,
  Edge: 113,
  Firefox: 141, // Update according to your requirement
  Safari: 18,
};

export function getBrowserInfo(): BrowserInfo {
  const ua = navigator.userAgent;
    console.log("ua", ua);
  // Platform
  let platform: BrowserInfo["platform"] = "Unknown";

  if (/Mac/i.test(ua)) {
    platform = "Mac";
  } else if (/Windows/i.test(ua)) {
    platform = "Windows";
  } else if (/Linux/i.test(ua)) {
    platform = "Linux";
  }

  if (/Android|iPhone|iPad/i.test(ua)) {
    platform = "Mobile";
  }
  console.log("platform", platform)

  // Browser

  if (/Edg\/(\d+)/.test(ua)) {
    console.log("Edge");
    return {
      browser: "Edge",
      version: Number(ua.match(/Edg\/(\d+)/)?.[1]),
      platform,
    };
  }

  if (/Chrome\/(\d+)/.test(ua)) {
    console.log("Chrome");
    return {
      browser: "Chrome",
      version: Number(ua.match(/Chrome\/(\d+)/)?.[1]),
      platform,
    };
  }

  if (/Firefox\/(\d+)/.test(ua)) {
    console.log("Firefox");
    return {
      browser: "Firefox",
      version: Number(ua.match(/Firefox\/(\d+)/)?.[1]),
      platform,
    };
  }

  if (/Version\/(\d+).+Safari/.test(ua)) {
    console.log("Safari");
    return {
      browser: "Safari",
      version: Number(ua.match(/Version\/(\d+)/)?.[1]),
      platform,
    };
  }

  return {
    browser: "Unknown",
    version: 0,
    platform,
  };
}

export function isBrowserSupported(info: BrowserInfo) {
    console.log("info", info);
  switch (info.browser) {
    case "Chrome":
      return info.version >= MIN_SUPPORTED.Chrome;

    case "Edge":
      return info.version >= MIN_SUPPORTED.Edge;

    case "Firefox":
      return info.version >= MIN_SUPPORTED.Firefox;

    case "Safari":
      return info.version >= MIN_SUPPORTED.Safari;

    default:
      return false;
  }
}

export async function isWebGPUSupported() {
    console.log("navigator.gpu", navigator.gpu);
  if (!navigator.gpu) {
    return false;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();
    console.log("adapter", adapter);
    return !!adapter;
  } catch {
    return false;
  }
}

/**
 * Optional:
 * Replace this with your actual game initialization.
 */
export async function canInitializeGame() {
  try {
    // Example:
    // await initGameEngine();

    return true;
  } catch {
    return false;
  }
}

export async function canPlayPreview() {
  const info = getBrowserInfo();

  // Don't allow mobile
  if (info.platform === "Mobile") {
    return {
      supported: false,
      reason: "Mobile device",
      info,
    };
  }

  // Browser/version check
  if (!isBrowserSupported(info)) {
    return {
      supported: false,
      reason: "Unsupported browser/version",
      info,
    };
  }

  // WebGPU
  const gpu = await isWebGPUSupported();

  if (!gpu) {
    return {
      supported: false,
      reason: "WebGPU unavailable",
      info,
    };
  }

  // Optional game initialization
  const game = await canInitializeGame();

  if (!game) {
    return {
      supported: false,
      reason: "Game initialization failed",
      info,
    };
  }

  return {
    supported: true,
    reason: "",
    info,
  };
}