import GLib from "gi://GLib";
import * as Utils from "resource:///com/github/Aylur/ags/utils.js";
import userOverrides from "../../user_options.js";

// Default options.
// Add overrides in ~/.config/ags/user_options.js
let configOptions = {
  // General stuff
  ai: {
    defaultGPTProvider: "openai",
    defaultTemperature: 0.9,
    enhancements: true,
    useHistory: true,
    safety: true,
    writingCursor: " ...", // Warning: Using weird characters can mess up Markdown rendering
    proxyUrl: null, // Can be "socks5://127.0.0.1:9050" or "http://127.0.0.1:8080" for example. Leave it blank if you don't need it.
  },
  animations: {
    choreographyDelay: 35,
    durationSmall: 110,
    durationLarge: 180,
  },
  appearance: {
    autoDarkMode: {
      // Turns on dark mode in certain hours. Time in 24h format
      enabled: false,
      from: "18:10",
      to: "6:10",
    },
    keyboardUseFlag: true, // Use flag emoji instead of abbreviation letters
    layerSmoke: false,
    layerSmokeStrength: 0.2,
    barRoundCorners: 1, // 0: No, 1: Yes
    fakeScreenRounding: 1, // 0: None | 1: Always | 2: When not fullscreen
    gammastepTemperature: false, // custom example: "4250", false for location based
  },
  apps: {
    bluetooth: "blueberry",
    imageViewer: "loupe",
    network: 'XDG_CURRENT_DESKTOP="gnome" gnome-control-center wifi',
    settings: 'XDG_CURRENT_DESKTOP="gnome" gnome-control-center',
    taskManager: "gnome-system-monitor",
    // taskManager: "foot --title 'btop' -- fish -c 'btop'",
    terminal: "foot", // This is only for shell actions
    vpn: 'XDG_CURRENT_DESKTOP="gnome" gnome-control-center network',
  },
  battery: {
    low: 20,
    critical: 10,
    warnLevels: [20, 15, 10],
    warnTitles: ["Low battery", "Very low battery", "Critical Battery"],
    warnMessages: [
      "Plug in the charger",
      "Please plug in the charger.",
      "PLUG THE CHARGER ALREADY",
    ],
    suspendThreshold: 5,
    suspendDelay: 30,
    preventWakeUp: false, // prevent wake up until battery is above suspend threshold
    disableNotification: false, // disable Woke up from Suspension notification
  },
  brightness: {
    // Object of controller names for each monitor, either "brightnessctl" or "ddcutil" or "auto"
    // 'default' one will be used if unspecified
    // Examples
    // 'eDP-1': "brightnessctl",
    // 'DP-1': "ddcutil",
    controllers: {
      default: "auto",
    },
  },
  cheatsheet: {
    keybinds: {
      configPath: "", // Path to hyprland keybind config file. Leave empty for default (~/.config/hypr/hyprland/keybinds.conf)
    },
  },
  gaming: {
    crosshair: {
      size: 10,
      color: "rgba(109,134,153,1)",
    },
  },
  i18n: {
    langCode: "", // Customize the locale, such as zh_CN, Optional value references "~/.config/ags/i18n/locales/"
    extraLogs: false,
  },
  monitors: {
    scaleMethod: "division", // Either "division" [default] or "gdk"
  },
  music: {
    preferredPlayer: "plasma-browser-integration",
    enableMusicWidget: false,
  },
  onScreenKeyboard: {
    layout: "qwerty_latam", // See modules/onscreenkeyboard/onscreenkeyboard.js for available layouts
  },
  overview: {
    scale: 0.18, // Relative to screen size
    numOfRows: 2,
    numOfCols: 5,
    wsNumScale: 0.09,
    wsNumMarginScale: 0.07,
  },
  sidebar: {
    ai: {
      extraGptModels: {
        oxygen3: {
          name: "Oxygen (GPT-3.5)",
          logo_name: "ai-oxygen-symbolic",
          description:
            "An API from Tornado Softwares\nPricing: Free: 100/day\nRequires you to join their Discord for a key",
          base_url: "https://app.oxyapi.uk/v1/chat/completions",
          key_get_url: "https://discord.com/invite/kM6MaCqGKA",
          key_file: "oxygen_key.txt",
          model: "gpt-3.5-turbo",
        },
      },
    },
    image: {
      columns: 2,
      batchCount: 20,
      allowNsfw: false,
    },
    pages: {
      order: ["apis", "tools"],
      apis: {
        order: ["gemini", "gpt"],
      },
    },
  },
  search: {
    enableFeatures: {
      actions: true,
      commands: true,
      mathResults: true,
      directorySearch: true,
      aiSearch: false,
      webSearch: true,
    },
    engineBaseUrl: "https://duckduckgo.com/?q=",
    excludedSites: [""],
  },
  time: {
    // See https://docs.gtk.org/glib/method.DateTime.format.html
    // Here's the 12h format: "%I:%M%P"
    // For seconds, add "%S" and set interval to 1000
    format: "%I:%M %p",
    interval: 5000,
    dateFormatLong: "%b %e", // On bar
    dateInterval: 5000,
    dateFormat: "%d/%m", // On notif time
  },
  weather: {
    city: "",
    preferredUnit: "C", // Either C or F
    onlyIcon: false, // only weather icon
    short: true, // hides "feels like"
    spacing: false, // toggle hexpand
  },
  workspaces: {
    shown: 6,
  },
  dock: {
    enabled: true,
    hiddenThickness: 5,
    pinnedApps: ["org.gnome.Nautilus", "zen"],
    layer: "top",
    monitorExclusivity: true, // Dock will move to other monitor along with focus if enabled
    searchPinnedAppIcons: false, // Try to search for the correct icon if the app class isn't an icon name
    trigger: ["client-added", "client-removed"], // client_added, client_move, workspace_active, client_active
    // Automatically hide dock after `interval` ms since trigger
    autoHide: [
      {
        trigger: "client-added",
        interval: 500,
      },
      {
        trigger: "client-removed",
        interval: 500,
      },
    ],
  },
  // Longer stuff
  icons: {
    // Find the window's icon by its class with levenshteinDistance
    // The file names are processed at startup, so if there
    // are too many files in the search path it'll affect performance
    // Example: ['/usr/share/icons/Tela-nord/scalable/apps']
    searchPaths: [""],
    symbolicIconTheme: {
      dark: "Adwaita",
      light: "Adwaita",
    },
    substitutions: {
      "code-url-handler": "visual-studio-code",
      Code: "visual-studio-code",
      cs2: "steam_icon_730",
      "GitHub Desktop": "github-desktop",
      "Minecraft* 1.20.1": "minecraft",
      "gnome-tweaks": "org.gnome.tweaks",
      "dev.zed.Zed": "zed",
      "pavucontrol-qt": "pavucontrol",
      wps: "wps-office2019-kprometheus",
      wpsoffice: "wps-office2019-kprometheus",
      "zen-alpha": "zen-browser",
      "": "image-missing",
    },
    regexSubstitutions: [
      {
        regex: /^steam_app_(\d+)$/,
        replace: "steam_icon_$1",
      },
    ],
  },
  bar: {
    // Array of bar modes for each monitor. Hit Ctrl+Alt+Slash to cycle.
    // Modes: "normal", "focus" (workspace indicator only), "nothing"
    // Example for four monitors: ["normal", "focus", "normal", "nothing"]
    monitors: ["normal"],
    // Change Order to reorder, remove to hide
    // Options: "snip", "picker", "keyboard"
    utilities: ["picker"],
    // Options: "ram", "cpu", "network", "swap"
    systemResources: ["ram", "cpu"],
    network: {
      hideText: true,
    },
    indicators: [
      //    "vpn",
      "keyboardLayout",
      "notifications",
      "network",
      "bluetooth",
      "bluetoothDevices",
      "weather",
      "utilities",
      "battery",
    ],
    bluetooth: {
      hideonconnect: true, // hide icon if devices are connected
      noPercentage: false, // hide battery percentage
      weatherIconOnlyOnConnect: true, // change weather display based on Bluetooth connection
    },
  },
  keybinds: {
    // Format: Mod1+Mod2+key. CaSe SeNsItIvE!
    // Modifiers: Shift Ctrl Alt Hyper Meta
    // See https://docs.gtk.org/gdk3/index.html#constants for the other keys (they are listed as KEY_key)
    overview: {
      altMoveLeft: "Ctrl+b",
      altMoveRight: "Ctrl+f",
      deleteToEnd: "Ctrl+k",
    },
    sidebar: {
      apis: {
        nextTab: "Page_Down",
        prevTab: "Page_Up",
      },
      options: {
        // Right sidebar
        nextTab: "Page_Down",
        prevTab: "Page_Up",
      },
      pin: "Ctrl+p",
      cycleTab: "Ctrl+Tab",
      nextTab: "Ctrl+Page_Down",
      prevTab: "Ctrl+Page_Up",
    },
    cheatsheet: {
      keybinds: {
        nextTab: "Page_Down",
        prevTab: "Page_Up",
      },
      nextTab: "Ctrl+Page_Down",
      prevTab: "Ctrl+Page_Up",
      cycleTab: "Ctrl+Tab",
    },
  },
};

// Override defaults with user's options
let optionsOkay = true;
function overrideConfigRecursive(
  userOverrides,
  configOptions = {},
  check = true,
) {
  for (const [key, value] of Object.entries(userOverrides)) {
    if (configOptions[key] === undefined && check) {
      optionsOkay = false;
    } else if (typeof value === "object" && !(value instanceof Array)) {
      if (
        key === "substitutions" ||
        key === "regexSubstitutions" ||
        key === "extraGptModels"
      ) {
        overrideConfigRecursive(value, configOptions[key], false);
      } else overrideConfigRecursive(value, configOptions[key]);
    } else {
      configOptions[key] = value;
    }
  }
}
overrideConfigRecursive(userOverrides, configOptions);
if (!optionsOkay)
  Utils.timeout(2000, () =>
    Utils.execAsync([
      "notify-send",
      "Update your user options",
      "One or more config options don't exist",
      "-a",
      "ags",
    ]).catch(print),
  );

globalThis["userOptions"] = configOptions;
export default configOptions;
