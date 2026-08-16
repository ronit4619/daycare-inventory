// Initial Daycare & Babysitter Inventory Dataset with Users, Unit Costs, Batches, and Usage History
export const initialOrganization = {
  id: "org_daycare_01",
  name: "Sunshine Kids Daycare & Preschool",
  created_at: new Date().toISOString()
};

export const initialUsers = [
  {
    id: "user_admin_01",
    organization_id: "org_daycare_01",
    email: "director@sunshinekids.com",
    full_name: "Sarah Jenkins",
    role: "ADMIN", // Full access: Costs, Budgets, Analytics, Category Admin, Delete
    avatar: "👩‍💼"
  },
  {
    id: "user_staff_01",
    organization_id: "org_daycare_01",
    email: "alex@sunshinekids.com",
    full_name: "Alex Rivera",
    role: "STAFF", // Staff view: Scan, Quick Log, Decrement, Restock
    avatar: "👨‍🏫"
  },
  {
    id: "user_staff_02",
    organization_id: "org_daycare_01",
    email: "emma@sunshinekids.com",
    full_name: "Emma Watson",
    role: "STAFF",
    avatar: "👩‍🏫"
  }
];

export const initialCategories = [
  { id: "cat_01", name: "Diapering & Care", icon: "👶", color: "#6366f1" },
  { id: "cat_02", name: "Feeding & Nutrition", icon: "🍼", color: "#10b981" },
  { id: "cat_03", name: "Durable Equipment", icon: "🧸", color: "#a855f7" },
  { id: "cat_04", name: "Sanitation & First Aid", icon: "🧼", color: "#06b6d4" },
  { id: "cat_05", name: "Crafts & Learning", icon: "🎨", color: "#ec4899" }
];

const getPastDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

const getFutureDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const initialItems = [
  {
    id: "item_01",
    organization_id: "org_daycare_01",
    name: "Diapers (Size 3 - Gentle Touch)",
    category: "Diapering & Care",
    item_type: "CONSUMABLE",
    age_group: "INFANT",
    unit: "packs",
    unit_cost: 28.99,
    current_quantity: 4,
    par_level: 10,
    barcode: "036000291452",
    batches: [
      { id: "b1", quantity: 4, expiration_date: null }
    ],
    custom_attributes: { brand: "Pampers" },
    created_at: new Date().toISOString()
  },
  {
    id: "item_02",
    organization_id: "org_daycare_01",
    name: "Sensitive Baby Wipes (Unscented)",
    category: "Diapering & Care",
    item_type: "CONSUMABLE",
    age_group: "ALL",
    unit: "packs",
    unit_cost: 14.50,
    current_quantity: 14,
    par_level: 8,
    barcode: "036000312010",
    batches: [
      { id: "b1", quantity: 6, expiration_date: getFutureDate(120) },
      { id: "b2", quantity: 8, expiration_date: getFutureDate(180) }
    ],
    custom_attributes: { brand: "Huggies" },
    created_at: new Date().toISOString()
  },
  {
    id: "item_03",
    organization_id: "org_daycare_01",
    name: "Infant Milk Formula (Gentlease Powder)",
    category: "Feeding & Nutrition",
    item_type: "CONSUMABLE",
    age_group: "INFANT",
    unit: "cans",
    unit_cost: 22.99,
    current_quantity: 6,
    par_level: 5,
    barcode: "300871365412",
    batches: [
      { id: "b1", quantity: 2, expiration_date: getFutureDate(4) },
      { id: "b2", quantity: 4, expiration_date: getFutureDate(90) }
    ],
    custom_attributes: { brand: "Enfamil" },
    created_at: new Date().toISOString()
  },
  {
    id: "item_04",
    organization_id: "org_daycare_01",
    name: "Organic Toddler Oat Snacks (Banana)",
    category: "Feeding & Nutrition",
    item_type: "CONSUMABLE",
    age_group: "TODDLER",
    unit: "boxes",
    unit_cost: 4.75,
    current_quantity: 12,
    par_level: 6,
    barcode: "852657003014",
    batches: [
      { id: "b1", quantity: 4, expiration_date: getFutureDate(10) },
      { id: "b2", quantity: 8, expiration_date: getFutureDate(120) }
    ],
    custom_attributes: { brand: "Happy Baby" },
    created_at: new Date().toISOString()
  },
  {
    id: "item_05",
    organization_id: "org_daycare_01",
    name: "Whole Whole Milk (Organic 1-Gal)",
    category: "Feeding & Nutrition",
    item_type: "CONSUMABLE",
    age_group: "TODDLER",
    unit: "bottles",
    unit_cost: 5.25,
    current_quantity: 3,
    par_level: 4,
    barcode: "070038300012",
    batches: [
      { id: "b1", quantity: 1, expiration_date: getFutureDate(-2) },
      { id: "b2", quantity: 2, expiration_date: getFutureDate(12) }
    ],
    custom_attributes: { brand: "Horizon" },
    created_at: new Date().toISOString()
  },
  {
    id: "item_06",
    organization_id: "org_daycare_01",
    name: "Silicone Waterproof Bibs (Pack of 4)",
    category: "Durable Equipment",
    item_type: "DURABLE",
    age_group: "ALL",
    unit: "sets",
    unit_cost: 16.99,
    current_quantity: 6,
    par_level: 3,
    barcode: "843210100912",
    batches: [
      { id: "b1", quantity: 6, expiration_date: null }
    ],
    custom_attributes: { washable: true },
    created_at: new Date().toISOString()
  },
  {
    id: "item_07",
    organization_id: "org_daycare_01",
    name: "Hospital Grade Surface Disinfectant Spray",
    category: "Sanitation & First Aid",
    item_type: "CONSUMABLE",
    age_group: "ALL",
    unit: "bottles",
    unit_cost: 11.20,
    current_quantity: 1,
    par_level: 4,
    barcode: "019200742761",
    batches: [
      { id: "b1", quantity: 1, expiration_date: getFutureDate(45) }
    ],
    custom_attributes: { safety_standard: "EPA Approved" },
    created_at: new Date().toISOString()
  }
];

export const initialUsageLogs = [
  { id: "log_01", item_id: "item_01", item_name: "Diapers (Size 3 - Gentle Touch)", quantity_used: 1, logged_at: getPastDate(0.2), user_role: "STAFF", user_name: "Emma Watson" },
  { id: "log_02", item_id: "item_01", item_name: "Diapers (Size 3 - Gentle Touch)", quantity_used: 1, logged_at: getPastDate(1.1), user_role: "STAFF", user_name: "Emma Watson" },
  { id: "log_03", item_id: "item_01", item_name: "Diapers (Size 3 - Gentle Touch)", quantity_used: 1, logged_at: getPastDate(2.3), user_role: "STAFF", user_name: "Alex Rivera" },
  { id: "log_04", item_id: "item_01", item_name: "Diapers (Size 3 - Gentle Touch)", quantity_used: 1, logged_at: getPastDate(3.0), user_role: "STAFF", user_name: "Alex Rivera" },
  { id: "log_05", item_id: "item_01", item_name: "Diapers (Size 3 - Gentle Touch)", quantity_used: 2, logged_at: getPastDate(4.2), user_role: "STAFF", user_name: "Emma Watson" },
  { id: "log_06", item_id: "item_01", item_name: "Diapers (Size 3 - Gentle Touch)", quantity_used: 1, logged_at: getPastDate(5.5), user_role: "STAFF", user_name: "Alex Rivera" },

  { id: "log_07", item_id: "item_02", item_name: "Sensitive Baby Wipes (Unscented)", quantity_used: 2, logged_at: getPastDate(0.5), user_role: "STAFF", user_name: "Emma Watson" },
  { id: "log_08", item_id: "item_02", item_name: "Sensitive Baby Wipes (Unscented)", quantity_used: 1, logged_at: getPastDate(1.8), user_role: "STAFF", user_name: "Alex Rivera" },
  { id: "log_09", item_id: "item_02", item_name: "Sensitive Baby Wipes (Unscented)", quantity_used: 2, logged_at: getPastDate(3.4), user_role: "STAFF", user_name: "Emma Watson" },
  { id: "log_10", item_id: "item_02", item_name: "Sensitive Baby Wipes (Unscented)", quantity_used: 1, logged_at: getPastDate(5.1), user_role: "STAFF", user_name: "Alex Rivera" },

  { id: "log_11", item_id: "item_03", item_name: "Infant Milk Formula (Gentlease Powder)", quantity_used: 1, logged_at: getPastDate(0.8), user_role: "STAFF", user_name: "Emma Watson" },
  { id: "log_12", item_id: "item_03", item_name: "Infant Milk Formula (Gentlease Powder)", quantity_used: 1, logged_at: getPastDate(2.5), user_role: "STAFF", user_name: "Emma Watson" },
  { id: "log_13", item_id: "item_03", item_name: "Infant Milk Formula (Gentlease Powder)", quantity_used: 1, logged_at: getPastDate(4.8), user_role: "STAFF", user_name: "Emma Watson" },

  { id: "log_14", item_id: "item_04", item_name: "Organic Toddler Oat Snacks (Banana)", quantity_used: 2, logged_at: getPastDate(1.2), user_role: "STAFF", user_name: "Alex Rivera" },
  { id: "log_15", item_id: "item_04", item_name: "Organic Toddler Oat Snacks (Banana)", quantity_used: 2, logged_at: getPastDate(3.8), user_role: "STAFF", user_name: "Alex Rivera" },

  { id: "log_16", item_id: "item_05", item_name: "Whole Whole Milk (Organic 1-Gal)", quantity_used: 1, logged_at: getPastDate(0.4), user_role: "STAFF", user_name: "Alex Rivera" },
  { id: "log_17", item_id: "item_05", item_name: "Whole Whole Milk (Organic 1-Gal)", quantity_used: 1, logged_at: getPastDate(2.1), user_role: "STAFF", user_name: "Alex Rivera" },

  { id: "log_18", item_id: "item_07", item_name: "Hospital Grade Surface Disinfectant Spray", quantity_used: 1, logged_at: getPastDate(1.5), user_role: "STAFF", user_name: "Alex Rivera" }
];

export function getItemSummary(item) {
  if (!item.batches || item.batches.length === 0) {
    return {
      totalQuantity: item.current_quantity ?? 0,
      earliestExpiration: item.expiration_date || null,
      activeBatches: []
    };
  }

  const activeBatches = item.batches.filter(b => b.quantity > 0);
  const totalQuantity = activeBatches.reduce((sum, b) => sum + b.quantity, 0);

  const expiringBatches = activeBatches
    .filter(b => b.expiration_date)
    .sort((a, b) => new Date(a.expiration_date) - new Date(b.expiration_date));

  const earliestExpiration = expiringBatches.length > 0 ? expiringBatches[0].expiration_date : null;

  return {
    totalQuantity,
    earliestExpiration,
    activeBatches
  };
}

export function calculateBurnRate(item, usageLogs = [], lookbackDays = 7) {
  if (item.item_type === 'DURABLE') {
    return {
      isDurable: true,
      dailyBurnRate: 0,
      daysRemaining: null,
      runOutDate: null,
      totalUsedInPeriod: 0
    };
  }

  const summary = getItemSummary(item);
  const currentQty = summary.totalQuantity;

  const now = new Date();
  const cutoff = new Date();
  cutoff.setDate(now.getDate() - lookbackDays);

  const recentLogs = usageLogs.filter(log => {
    return log.item_id === item.id && new Date(log.logged_at) >= cutoff;
  });

  const totalUsedInPeriod = recentLogs.reduce((sum, log) => sum + Number(log.quantity_used || 0), 0);

  if (totalUsedInPeriod === 0) {
    return {
      dailyBurnRate: 0,
      daysRemaining: null,
      runOutDate: null,
      totalUsedInPeriod: 0
    };
  }

  const dailyBurnRate = Number((totalUsedInPeriod / lookbackDays).toFixed(2));

  if (dailyBurnRate <= 0) {
    return {
      dailyBurnRate: 0,
      daysRemaining: null,
      runOutDate: null,
      totalUsedInPeriod
    };
  }

  const daysRemaining = Math.max(0, Math.round(currentQty / dailyBurnRate));

  const runOutDateObj = new Date();
  runOutDateObj.setDate(now.getDate() + daysRemaining);
  const runOutDate = runOutDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return {
    dailyBurnRate,
    daysRemaining,
    runOutDate,
    totalUsedInPeriod
  };
}
