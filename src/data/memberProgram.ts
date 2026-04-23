export type MemberTierId = "bronze" | "silver" | "gold" | "diamond";

export interface MemberTierConfig {
  id: MemberTierId;
  icon: string;
  name: string;
  condition: string;
}

export interface MemberBenefitRow {
  id: string;
  label: string;
  bronze: string;
  silver: string;
  gold: string;
  diamond: string;
}

export interface MemberPointRule {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface MemberPromotion {
  id: string;
  title: string;
  deadlineLabel: string;
  badge: string;
  expiresAt: string;
}

export interface MemberProgramData {
  defaultLoggedInTier: MemberTierId;
  signupBonusPoints: number;
  tiers: MemberTierConfig[];
  benefits: MemberBenefitRow[];
  pointRules: MemberPointRule[];
  promotions: MemberPromotion[];
}

export const MEMBER_PROGRAM_STORAGE_KEY = "locan_member_program";

function hasWindow() {
  return typeof window !== "undefined";
}

function cloneData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

function buildDefaultMemberProgram(): MemberProgramData {
  return {
    defaultLoggedInTier: "silver",
    signupBonusPoints: 100,
    tiers: [
      { id: "bronze", icon: "🥉", name: "Đồng", condition: "Mới đăng ký" },
      { id: "silver", icon: "🥈", name: "Bạc", condition: "Mua từ 5 triệu" },
      { id: "gold", icon: "🥇", name: "Vàng", condition: "Mua từ 15 triệu" },
      { id: "diamond", icon: "💎", name: "Kim Cương", condition: "Mua từ 30 triệu" },
    ],
    benefits: [
      { id: "benefit-1", label: "Giảm giá mua hàng", bronze: "0%", silver: "2%", gold: "5%", diamond: "8%" },
      { id: "benefit-2", label: "Ưu tiên bảo hành", bronze: "❌", silver: "✅", gold: "✅", diamond: "✅" },
      { id: "benefit-3", label: "Sửa chữa ưu tiên", bronze: "❌", silver: "❌", gold: "✅", diamond: "✅" },
      { id: "benefit-4", label: "Quà sinh nhật", bronze: "❌", silver: "❌", gold: "✅", diamond: "✅" },
      { id: "benefit-5", label: "Tư vấn kỹ thuật 24/7", bronze: "❌", silver: "❌", gold: "❌", diamond: "✅" },
      {
        id: "benefit-6",
        label: "Miễn phí vệ sinh máy",
        bronze: "❌",
        silver: "1 lần/năm",
        gold: "2 lần/năm",
        diamond: "Không giới hạn",
      },
      { id: "benefit-7", label: "Điểm thưởng mỗi đơn", bronze: "1x", silver: "1.5x", gold: "2x", diamond: "3x" },
    ],
    pointRules: [
      { id: "point-1", icon: "🛒", title: "Mua hàng", description: "1.000đ = 1 điểm" },
      { id: "point-2", icon: "⭐", title: "Đánh giá sản phẩm", description: "+50 điểm/đánh giá" },
      { id: "point-3", icon: "👥", title: "Giới thiệu bạn bè", description: "+200 điểm/người" },
    ],
    promotions: [
      {
        id: "promo-1",
        title: "Giảm 500K cho thành viên Vàng khi mua Laptop",
        deadlineLabel: "30/04/2026",
        badge: "Vàng trở lên",
        expiresAt: "2026-04-30T23:59:59+07:00",
      },
      {
        id: "promo-2",
        title: "Miễn phí vệ sinh máy tháng sinh nhật",
        deadlineLabel: "Cả năm",
        badge: "Bạc trở lên",
        expiresAt: "2026-12-31T23:59:59+07:00",
      },
      {
        id: "promo-3",
        title: "Tặng tai nghe khi mua PC Gaming",
        deadlineLabel: "15/05/2026",
        badge: "Tất cả thành viên",
        expiresAt: "2026-05-15T23:59:59+07:00",
      },
    ],
  };
}

export function getMemberProgramData(): MemberProgramData {
  const fallback = buildDefaultMemberProgram();

  if (!hasWindow()) {
    return fallback;
  }

  try {
    const raw = localStorage.getItem(MEMBER_PROGRAM_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MEMBER_PROGRAM_STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }

    return {
      ...fallback,
      ...(JSON.parse(raw) as Partial<MemberProgramData>),
    };
  } catch {
    return fallback;
  }
}

export function saveMemberProgramData(data: MemberProgramData) {
  if (!hasWindow()) return;
  localStorage.setItem(MEMBER_PROGRAM_STORAGE_KEY, JSON.stringify(data));
}

export const memberProgramData = cloneData(getMemberProgramData());
