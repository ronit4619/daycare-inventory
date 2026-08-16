# Implementation Plan: Daycare & Babysitter Inventory + Supply Tracking System

An intuitive, mobile-responsive, PWA-ready web application built **specifically for Daycares & Babysitters** to track supplies, log usage, monitor low-stock levels, predict burn rates, log price history, and manage costs per child. 

> **Future-Proof Architectural Note**: Under the hood, database entities use clean, adaptable schema patterns (`organization_id`, `targets`, `custom_attributes`) so if you ever choose to adapt the platform for mechanics, clinics, or other businesses in the future, you can do so easily without needing to refactor the database.

---

## 1. Core Focus: Daycare & Babysitter Experience

The entire user interface is tailored specifically for daycare staff, babysitters, and daycare managers:

- **Quick Supply Tracking**:
  - Diapers (Size 1-6), Wipes, Formula, Milk, Snacks, Bibs, Gloves, Cleaning Supplies.
- **Target Tracking**:
  - Enrolled Children / Infants / Toddlers.
- **Alert System**:
  - 🟡 **Low Stock Par Level Alert** (e.g. Diapers < 25 packs).
  - ⏳ **Expiration Warning** (e.g. Formula/Milk/Medication expiring within 7/14 days).
- **Camera Barcode Scanner**:
  - Quick 1-tap scan to log diaper usage or scan new supply items.
- **Manual Price & Vendor Tracking**:
  - Compare prices paid at Costco, Target, Walmart, Amazon over time.

---

## 2. Multi-Tenant Ready Schema (`organization_id` on every table)

```mermaid
erDiagram
    ORGANIZATIONS ||--o{ USERS : manages
    ORGANIZATIONS ||--o{ CATEGORIES : categorizes
    ORGANIZATIONS ||--o{ ITEMS : tracks
    ORGANIZATIONS ||--o{ CHILDREN : enrolls
    CATEGORIES ||--o{ ITEMS : classifies
    ITEMS ||--o{ ITEM_BATCHES : has_lots
    ITEMS ||--o{ USAGE_LOGS : records_usage
    CHILDREN ||--o{ USAGE_LOGS : used_by
    ITEMS ||--o{ PRICE_LOGS : tracks_cost

    ORGANIZATIONS {
        uuid id PK
        string name
        timestamp created_at
    }

    USERS {
        uuid id PK
        uuid organization_id FK
        string email
        string full_name
        string role "ADMIN | STAFF"
        timestamp created_at
    }

    CHILDREN {
        uuid id PK
        uuid organization_id FK
        string name
        string age_group "INFANT | TODDLER | PRESCHOOL"
        jsonb custom_attributes
    }

    CATEGORIES {
        uuid id PK
        uuid organization_id FK
        string name
        string type "CONSUMABLE | DURABLE"
        string icon
        string color
    }

    ITEMS {
        uuid id PK
        uuid organization_id FK
        uuid category_id FK
        string name
        string barcode
        string unit "count | oz | box | pack | roll"
        numeric current_quantity
        numeric par_level "low stock threshold"
        jsonb custom_attributes
        timestamp created_at
    }

    ITEM_BATCHES {
        uuid id PK
        uuid organization_id FK
        uuid item_id FK
        numeric quantity
        date expiration_date
        string lot_number
    }

    USAGE_LOGS {
        uuid id PK
        uuid organization_id FK
        uuid item_id FK
        uuid child_id FK "optional"
        uuid user_id FK
        numeric quantity_used
        timestamp logged_at
        string notes
    }

    PRICE_LOGS {
        uuid id PK
        uuid organization_id FK
        uuid item_id FK
        uuid user_id FK
        string store_name
        numeric price_paid
        numeric quantity_purchased
        numeric unit_cost
        timestamp logged_at
    }
```

---

## 3. Phased Development Roadmap (Vertical Slices)

We build iteratively starting with the core thin slice:

- **Slice 1 (Core Thin Slice)**:
  - Add item (Name, Unit, Par Level, Initial Quantity).
  - Quick Usage Log (`-1 Used`).
  - Low-Stock Alert flag when item drops below set par level.
- **Slice 2 (Daycare Supply Categories)**:
  - Categories (Consumable vs Durable, Age Group tags: Infant, Toddler, Preschool).
  - Category search & filter pills.
- **Slice 3 (Expiration Date Tracking)**:
  - Expiration date tracking for formula, food, and medication.
  - Expiry alert warning dashboard.
- **Slice 4 (Camera Barcode Scanning)**:
  - Integrated browser camera scanner modal with audio beep feedback.
- **Slice 5 (Manual Price History & Store Logging)**:
  - Store price logging (Store name, total price, unit cost).
  - Vendor cost history chart (Costco vs Target vs Amazon).
- **Slice 6 (Burn-Rate & Cost-per-Child Analytics)**:
  - Burn-rate forecasting ("Will run out in N days").
  - Cost per child / week report.
- **Slice 7 (User Roles & Auth)**:
  - Admin view (Costs, Budget, User Management) vs Staff view (Quick Log & Barcode Scan).

---

## Verification Plan

### Automated Tests
- Test usage decrement logic and low-stock alert triggers.
- Test expiry date calculation.
- Test database schema compliance (`organization_id` everywhere).

### Manual Verification
- Test item creation, quick log button, and instant low-stock badge trigger.
- Test camera barcode scanner integration.
- Verify cost-per-child metrics and vendor price history displays.
