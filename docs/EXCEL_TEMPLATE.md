# Excel File Templates

Both files live in the same Google Drive folder shared with your service
account. Column names are case-insensitive and spaces are ignored, but keep
them in this order for clarity.

## 1. `employees.xlsx` — sheet name: `Employees`

| username | password   | name        | role   |
|----------|-----------|-------------|--------|
| jsmith   | Passw0rd! | John Smith  | Admin  |
| amehta   | Sales123  | Aisha Mehta | Viewer |

- `username` / `password` — checked at login (plain text match).
- `name` — shown in the top-right of the app after login.
- `role` — reserved for future use (e.g. hiding Settings for non-admins).

## 2. `sales_data.xlsx` — three sheets

### Sheet `Stores`
| store_id | store_name        | brand       | company        | country      | region | status | opened_date |
|----------|-------------------|-------------|-----------------|--------------|--------|--------|-------------|
| ST-001   | Dubai Hills       | Brand A     | Company Alpha   | UAE          | Dubai  | Active | 2021-03-01  |
| ST-002   | Doha Festival City| Brand A     | Company Alpha   | Qatar        | Doha   | Active | 2020-11-15  |

- `status` should be `Active` or `Inactive` — drives the Store Directory
  filter.
- `region` is the country/city grouping used in the "Contribution by Region"
  chart.

### Sheet `Sales`
| date       | store_id | brand   | net_revenue | orders | discounts | channel            |
|------------|----------|---------|-------------|--------|-----------|--------------------|
| 2026-01-05 | ST-001   | Brand A | 45210       | 280    | 1200      | Dine-In            |
| 2026-01-05 | ST-002   | Brand A | 31900       | 190    | 800       | Delivery & Takeaway|

- One row per store per day (or per transaction — the backend aggregates
  either way).
- `channel` powers the Channel Mix chart; use exactly `Dine-In` or
  `Delivery & Takeaway` (or edit `services/excelService.js` if you use
  different channel names).

### Sheet `Brands`
| brand   | logo_url                              | company        |
|---------|----------------------------------------|-----------------|
| Brand A | https://.../brand-a-logo.png          | Company Alpha   |
| Brand B | https://.../brand-b-logo.png          | Company Beta    |

- `logo_url` is used for the brand image buttons on the Company Overview
  page. If left blank, the app shows a generated initial-letter badge
  instead.

A sample generator script is at `docs/generate_sample_excels.py` if you want
to produce test files with fake data before connecting real ones.
