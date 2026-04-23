export type BuildStepKey =
  | "cpu"
  | "mainboard"
  | "gpu"
  | "ram"
  | "ssd"
  | "hdd"
  | "case"
  | "psu"
  | "cooler"
  | "monitor"
  | "mouse"
  | "keyboard"
  | "headset";

export type BuildSelections = Record<BuildStepKey, string | null>;

export interface BuildStepConfig {
  key: BuildStepKey;
  label: string;
  icon: string;
  category?: string;
  subcategories?: string[];
}

export interface BuildPreset {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  selections: Partial<BuildSelections>;
}

export interface BuildPCConfig {
  heroBadge: string;
  pageTitle: string;
  pageDescription: string;
  presetTitle: string;
  presetDescription: string;
  stepsTitle: string;
  stepsDescription: string;
  summaryTitle: string;
  summaryDescription: string;
  steps: BuildStepConfig[];
  presets: BuildPreset[];
}

export const BUILD_PC_STORAGE_KEY = "locan_build_pc";

function hasWindow() {
  return typeof window !== "undefined";
}

export function createEmptyBuildSelections(): BuildSelections {
  return {
    cpu: null,
    mainboard: null,
    gpu: null,
    ram: null,
    ssd: null,
    hdd: null,
    case: null,
    psu: null,
    cooler: null,
    monitor: null,
    mouse: null,
    keyboard: null,
    headset: null,
  };
}

function buildDefaultBuildPCConfig(): BuildPCConfig {
  return {
    heroBadge: "Tự build cấu hình theo nhu cầu",
    pageTitle: "Build PC tại Lộc An Tech",
    pageDescription:
      "Chọn từng linh kiện theo đúng nhu cầu sử dụng, theo dõi tổng giá realtime và thêm toàn bộ cấu hình vào giỏ hàng chỉ với một lần bấm.",
    presetTitle: "Preset cấu hình mẫu",
    presetDescription: "Bắt đầu nhanh với một cấu hình gợi ý rồi tinh chỉnh theo ý bạn.",
    stepsTitle: "Chọn linh kiện",
    stepsDescription: "Chọn lần lượt các linh kiện cần thiết để hoàn thiện cấu hình của bạn.",
    summaryTitle: "Cấu hình của bạn",
    summaryDescription: "Theo dõi danh sách linh kiện đã chọn và tổng tiền theo thời gian thực.",
    steps: [
      { key: "cpu", label: "CPU", icon: "🧠", category: "linh-kien", subcategories: ["cpu"] },
      { key: "mainboard", label: "Mainboard", icon: "🟩", category: "linh-kien", subcategories: ["mainboard"] },
      { key: "gpu", label: "Card màn hình", icon: "🎮", category: "linh-kien", subcategories: ["vga"] },
      { key: "ram", label: "RAM", icon: "⚡", category: "linh-kien", subcategories: ["ram"] },
      { key: "ssd", label: "Ổ cứng SSD", icon: "💾", category: "linh-kien", subcategories: ["ssd"] },
      { key: "hdd", label: "Ổ cứng HDD", icon: "🗄️", category: "linh-kien", subcategories: ["hdd"] },
      { key: "case", label: "Case máy tính", icon: "🖥️", category: "linh-kien", subcategories: ["case"] },
      { key: "psu", label: "Nguồn máy tính", icon: "🔌", category: "linh-kien", subcategories: ["psu"] },
      { key: "cooler", label: "Tản nhiệt CPU", icon: "❄️", category: "linh-kien", subcategories: ["tan-nhiet"] },
      { key: "monitor", label: "Màn hình", icon: "📺", category: "man-hinh" },
      { key: "mouse", label: "Chuột", icon: "🖱️", category: "ngoai-vi", subcategories: ["chuot"] },
      { key: "keyboard", label: "Bàn phím", icon: "⌨️", category: "ngoai-vi", subcategories: ["ban-phim"] },
      { key: "headset", label: "Tai nghe", icon: "🎧", category: "ngoai-vi", subcategories: ["tai-nghe"] },
    ],
    presets: [
      {
        id: "office",
        name: "Văn phòng",
        description: "Ưu tiên ổn định, chạy tốt tác vụ văn phòng, học tập và làm việc hằng ngày.",
        priceLabel: "Khoảng 10 triệu",
        selections: {
          cpu: "lk1",
          mainboard: "lk5",
          ram: "lk2",
          ssd: "lk3",
          psu: "lk6",
        },
      },
      {
        id: "gaming-mid",
        name: "Gaming tầm trung",
        description: "Cấu hình cân bằng cho game esports, AAA phổ thông và nâng cấp về sau.",
        priceLabel: "Khoảng 20 triệu",
        selections: {
          cpu: "lk1",
          mainboard: "lk5",
          gpu: "lk4",
          ram: "lk10",
          ssd: "lk3",
          case: "lk7",
          psu: "lk6",
          cooler: "lk8",
        },
      },
      {
        id: "graphics-stream",
        name: "Đồ họa / Streaming",
        description: "Tối ưu cho dựng video, streaming và workflow sáng tạo cần GPU mạnh hơn.",
        priceLabel: "Khoảng 35 triệu",
        selections: {
          cpu: "lk9",
          mainboard: "lk5",
          gpu: "lk12",
          ram: "lk10",
          ssd: "lk3",
          hdd: "lk11",
          case: "lk7",
          psu: "lk6",
          cooler: "lk8",
          monitor: "mh5",
          mouse: "nv5",
          keyboard: "nv1",
          headset: "nv3",
        },
      },
    ],
  };
}

export function getBuildPCConfig(): BuildPCConfig {
  const fallback = buildDefaultBuildPCConfig();

  if (!hasWindow()) {
    return fallback;
  }

  try {
    const raw = localStorage.getItem(BUILD_PC_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BUILD_PC_STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }

    const parsed = JSON.parse(raw) as Partial<BuildPCConfig>;
    return {
      ...fallback,
      ...parsed,
      steps: parsed.steps?.length ? parsed.steps : fallback.steps,
      presets: parsed.presets?.length ? parsed.presets : fallback.presets,
    };
  } catch {
    return fallback;
  }
}

export function saveBuildPCConfig(data: BuildPCConfig) {
  if (!hasWindow()) return;
  localStorage.setItem(BUILD_PC_STORAGE_KEY, JSON.stringify(data));
}
