// ═══════════════════════════════════════════════════════════════════
// FACULTY ADMINISTRATION TOOL — DATABASE SCHEMA (DBML)
// Generated from: src/app/**  ·  Target: dbdiagram.io
// ═══════════════════════════════════════════════════════════════════
// Phase 1 — Core · Auth · HR · Attendance
// Phase 2 — Finance · Legal
// Phase 3 — Academic · Research · Committees · Grievance
// Phase 4 — Transport · Hostel · Student
// Phase 5 — Maintenance · Logistics · Enums · Table Groups
// ═══════════════════════════════════════════════════════════════════

Project faculty_admin_tool {
  database_type: 'PostgreSQL'
  Note: '''
    # Faculty Administration Tool
    Multi-role campus administration system covering HR, Finance,
    Academic, Transport, Hostel, Student, and Maintenance domains.
  '''
}

// ─────────────────────────────────────────────────────────────
// PHASE 1 — CORE · AUTH · HR · ATTENDANCE
// Source: AuthContext.jsx, ProbationView.jsx, ProfileView.jsx,
//         AttendanceMonitorView.jsx, RegularizationView.jsx,
//         LeaveAppView.jsx, AttendanceView.jsx
// ─────────────────────────────────────────────────────────────

// ┌──────────────────────────────┐
// │   1.1  CORE / AUTH           │
// └──────────────────────────────┘

Table roles {
  id            int       [pk, increment, note: 'Primary key']
  name          varchar   [unique, not null, note: 'super_admin | faculty | hostel_admin | transport_admin | driver | student | maintenance_staff']
  description   varchar
  is_active     boolean   [default: true]
  created_at    timestamp [default: `now()`]
  updated_at    timestamp
}

Table users {
  id            int       [pk, increment]
  role_id       int       [ref: > roles.id, not null]
  email         varchar   [unique, not null]
  password_hash varchar   [not null, note: 'bcrypt / argon2 hash']
  name          varchar   [not null]
  avatar_url    varchar
  is_active     boolean   [default: true]
  last_login    timestamp
  created_at    timestamp [default: `now()`]
  updated_at    timestamp
}

// ┌──────────────────────────────┐
// │   1.2  DEPARTMENTS           │
// └──────────────────────────────┘

Table departments {
  id            int       [pk, increment]
  name          varchar   [unique, not null, note: 'CSE, ECE, Mechanical, Civil, Science, Electrical…']
  code          varchar   [unique, not null, note: 'Short code e.g. CSE']
  hod_id        int       [ref: > faculty_profiles.id, note: 'Head of Department']
  faculty_count int       [default: 0]
  is_active     boolean   [default: true]
  created_at    timestamp [default: `now()`]
  updated_at    timestamp
}

// ┌──────────────────────────────┐
// │   1.3  FACULTY PROFILES      │
// └──────────────────────────────┘
// Source: ProfileView.jsx → PROFILE mock object

Table faculty_profiles {
  id              int       [pk, increment]
  user_id         int       [ref: - users.id, not null, note: 'One-to-one with users']
  emp_id          varchar   [unique, not null, note: 'e.g. FAC-2012-047']
  name            varchar   [not null]
  email           varchar   [not null]
  phone           varchar
  department_id   int       [ref: > departments.id, not null]
  designation     varchar   [not null, note: 'Lecturer | Asst. Prof | Assoc. Prof | Professor']
  grade           varchar   [note: 'e.g. Grade 13A']
  qualification   varchar
  specialization  varchar
  dob             date
  gender          varchar   [note: 'Male | Female | Other']
  category        varchar   [note: 'General | OBC | SC | ST']
  address         text
  emergency_contact varchar
  joining_date    date      [not null]
  status          varchar   [not null, default: 'Active', note: 'Active | On Leave | Resigned | Retired | Terminated']
  avatar_url      varchar
  created_at      timestamp [default: `now()`]
  updated_at      timestamp
}

// ┌──────────────────────────────┐
// │   1.4  LEAVE MANAGEMENT      │
// └──────────────────────────────┘
// Source: LeaveAppView.jsx → BALANCE_INIT, LEAVES_INIT, LEAVE_TYPES

Table leave_types {
  id              int       [pk, increment]
  name            varchar   [unique, not null, note: 'Casual Leave | Medical Leave | Earned Leave | On-Duty']
  short_code      varchar   [unique, note: 'CL | ML | EL | OD']
  default_balance int       [not null, note: 'Default annual allocation']
  carry_forward   boolean   [default: false]
  is_active       boolean   [default: true]
}

Table leave_balances {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  leave_type_id   int       [ref: > leave_types.id, not null]
  academic_year   varchar   [not null, note: 'e.g. 2025-26']
  total_allocated int       [not null]
  used            int       [default: 0]
  balance         int       [not null]
  carry_forwarded int       [default: 0]

  indexes {
    (faculty_id, leave_type_id, academic_year) [unique]
  }
}

Table leave_requests {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  leave_type_id   int       [ref: > leave_types.id, not null]
  start_date      date      [not null]
  end_date        date      [not null]
  days            int       [not null]
  reason          text      [not null]
  status          varchar   [not null, default: 'Pending', note: 'Pending | Approved | Rejected | Cancelled']
  approved_by     int       [ref: > faculty_profiles.id, note: 'HOD / Admin who approved']
  rejection_reason text
  applied_at      timestamp [default: `now()`]
  resolved_at     timestamp
}

// ┌──────────────────────────────┐
// │   1.5  ATTENDANCE SYSTEM     │
// └──────────────────────────────┘
// Source: AttendanceMonitorView.jsx → LOGS_INIT, DEVICES_INIT, SHIFTS_INIT,
//         SWAPS_INIT, GEO_LOGS_INIT

Table biometric_devices {
  id              varchar   [pk, note: 'e.g. DEV-001']
  name            varchar   [not null, note: 'Main Gate Biometric, Library RFID Reader, etc.']
  ip_address      varchar   [not null]
  type            varchar   [not null, note: 'Fingerprint | Face Recognition | RFID']
  status          varchar   [not null, default: 'Online', note: 'Online | Offline | Maintenance']
  last_sync       timestamp
  location        varchar
  firmware_ver    varchar
  created_at      timestamp [default: `now()`]
}

Table shifts {
  id              varchar   [pk, note: 'e.g. S1, S2, S3']
  name            varchar   [not null, note: 'General Shift | Morning Shift | Night Shift']
  start_time      time      [not null]
  end_time        time      [not null]
  grace_minutes   int       [default: 10]
  type            varchar   [not null, note: 'Fixed | Rotational | Allowance Eligible']
  faculty_count   int       [default: 0, note: 'Number of faculty assigned']
  is_active       boolean   [default: true]
}

Table attendance_logs {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  date            date      [not null]
  time_in         time
  time_out        time
  device_id       varchar   [ref: > biometric_devices.id]
  location        varchar   [note: 'Main Block, Mech Block, ECE Block…']
  status          varchar   [not null, note: 'Present | Absent | On Leave | Half Day | Late']
  is_late         boolean   [default: false]
  shift_id        varchar   [ref: > shifts.id]
  created_at      timestamp [default: `now()`]

  indexes {
    (faculty_id, date) [unique]
  }
}

Table shift_swap_requests {
  id              int       [pk, increment]
  requestor_id    int       [ref: > faculty_profiles.id, not null]
  department      varchar
  current_shift_id  varchar [ref: > shifts.id, not null]
  requested_shift_id varchar [ref: > shifts.id, not null]
  swap_date       date      [not null]
  reason          text      [not null]
  status          varchar   [not null, default: 'Pending', note: 'Pending | Approved | Rejected']
  approved_by     int       [ref: > faculty_profiles.id]
  created_at      timestamp [default: `now()`]
}

Table geo_attendance_logs {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  type            varchar   [not null, note: 'Field Visit | Remote Work | Conference']
  location        varchar   [not null, note: 'e.g. IIT Delhi Campus, Home (Approved IP)']
  coordinates     varchar   [note: 'lat/lng string e.g. 28.5459° N, 77.1927° E']
  log_time        timestamp [not null]
  status          varchar   [not null, note: 'Verified (GPS) | Verified | Pending Approval | Rejected']
  verified_by     int       [ref: > faculty_profiles.id]
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   1.6  REGULARIZATION        │
// └──────────────────────────────┘
// Source: RegularizationView.jsx → REQUESTS_INIT, HISTORY_INIT

Table attendance_regularizations {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  date            date      [not null]
  reason          varchar   [not null, note: 'Forgot ID Card | Biometric Failure | On Duty | Medical Emergency']
  document_name   varchar   [note: 'uploaded proof filename']
  document_url    varchar
  ocr_data        text      [note: 'AI-extracted text from document']
  hod_status      varchar   [default: 'Pending', note: 'Pending | Approved | Rejected']
  admin_status    varchar   [default: 'Pending', note: 'Pending | Approved | Rejected | Auto-Approved (OD)']
  leave_balance   int       [note: 'Faculty leave balance at time of request']
  is_holiday      boolean   [default: false, note: 'Flag if date falls on public holiday']
  is_duplicate    boolean   [default: false, note: 'Flag if duplicate request detected']
  action_by       varchar   [note: 'Admin | HOD | System']
  action_note     text
  created_at      timestamp [default: `now()`]
  resolved_at     timestamp
}

// ┌──────────────────────────────┐
// │   1.7  PROBATION TRACKING    │
// └──────────────────────────────┘
// Source: ProbationView.jsx → FACULTY_INIT, STATUS_META

Table probation_records {
  id                int       [pk, increment]
  faculty_id        int       [ref: > faculty_profiles.id, not null]
  join_date         date      [not null]
  probation_end     date      [not null]
  attendance_pct    decimal   [note: 'e.g. 92.0']
  feedback_score    decimal   [note: '1.0 – 5.0 scale']
  research_output   varchar   [note: 'e.g. 2 Scopus Papers, In Progress, None']
  teaching_rating   varchar   [note: 'Excellent | Good | Average | Below Avg']
  disciplinary      varchar   [default: 'None', note: 'None | 1 Warning | etc.']
  status            varchar   [not null, note: 'On Track | Due Soon | Overdue | Extended | Confirmed | Terminated']
  mentor_id         int       [ref: > faculty_profiles.id, note: 'Senior faculty mentor']
  remarks           text
  confirmed_at      timestamp
  created_at        timestamp [default: `now()`]
  updated_at        timestamp
}

// ┌──────────────────────────────┐
// │   1.8  SERVICE BOOK          │
// └──────────────────────────────┘
// Source: ProfileView.jsx → AWARDS, MEMBERSHIPS

Table faculty_awards {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  title           varchar   [not null, note: 'Best Researcher Award, Excellence in Teaching, etc.']
  year            int       [not null]
  authority       varchar   [not null, note: 'Awarding body']
  created_at      timestamp [default: `now()`]
}

Table professional_memberships {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  organization    varchar   [not null, note: 'IEEE, ACM, ISTE, CSI']
  membership_id   varchar   [note: 'e.g. 90823122, LM-8821']
  expiry_date     varchar   [note: 'Date or Lifetime']
  status          varchar   [not null, note: 'Active | Expired | Expiring']
  created_at      timestamp [default: `now()`]
}

// ─────────────────────────────────────────────────────────────
// PHASE 2 — FINANCE & LEGAL
// Source: PayrollProcessingView.jsx, PayrollView.jsx,
//         ClaimsApprovalView.jsx, ReimbursementView.jsx,
//         LoanManagementView.jsx, BondManagementView.jsx
// ─────────────────────────────────────────────────────────────

// ┌──────────────────────────────┐
// │   2.1  SALARY COMPONENTS     │
// └──────────────────────────────┘
// Source: PayrollProcessingView.jsx → calcSalary(), PayrollView.jsx → SALARY_STRUCTURE

Table salary_components {
  id              int       [pk, increment]
  name            varchar   [unique, not null, note: 'Basic Pay | DA | HRA | TA | Special Allowance | EPF | TDS | ESI | Professional Tax']
  type            varchar   [not null, note: 'earning | deduction']
  is_percentage   boolean   [default: false, note: 'true if calculated as % of basic']
  percentage      decimal   [note: 'e.g. 45 for DA at 45%, 12 for PF']
  is_taxable      boolean   [default: true]
  is_default      boolean   [default: true, note: 'Included in every payroll by default']
  sort_order      int       [default: 0]
  is_active       boolean   [default: true]
}

// ┌──────────────────────────────┐
// │   2.2  PAYROLL RECORDS       │
// └──────────────────────────────┘
// Source: PayrollProcessingView.jsx → EMPLOYEES_INIT, calcSalary()

Table payroll_records {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  month           int       [not null, note: '1-12']
  year            int       [not null]
  basic_pay       decimal   [not null]
  earned_basic    decimal   [note: 'Pro-rated for attendance']
  da              decimal
  hra             decimal
  ta              decimal
  special_allow   decimal
  gross_salary    decimal   [not null]
  pf_deduction    decimal
  esi_deduction   decimal
  tds             decimal
  loan_deduction  decimal   [default: 0]
  other_deductions decimal  [default: 0]
  total_deductions decimal  [not null]
  net_salary      decimal   [not null]
  attendance_days int
  total_days      int
  lop_days        int       [default: 0, note: 'Loss of Pay days']
  pan             varchar
  status          varchar   [not null, default: 'Draft', note: 'Draft | Computed | Locked | Disbursed']
  processed_by    int       [ref: > users.id]
  processed_at    timestamp
  disbursed_at    timestamp
  created_at      timestamp [default: `now()`]

  indexes {
    (faculty_id, month, year) [unique]
  }
}

// ┌──────────────────────────────┐
// │   2.3  PAYROLL LINE ITEMS    │
// └──────────────────────────────┘

Table payroll_line_items {
  id              int       [pk, increment]
  payroll_id      int       [ref: > payroll_records.id, not null]
  component_id    int       [ref: > salary_components.id, not null]
  type            varchar   [not null, note: 'earning | deduction']
  amount          decimal   [not null]
  label           varchar   [note: 'Display label override']
}

// ┌──────────────────────────────┐
// │   2.4  PAYROLL ADJUSTMENTS   │
// └──────────────────────────────┘
// Source: PayrollProcessingView.jsx → ADJ_HISTORY_INIT

Table payroll_adjustments {
  id              int       [pk, increment]
  payroll_id      int       [ref: > payroll_records.id, not null]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  type            varchar   [not null, note: 'Earning | Deduction']
  label           varchar   [not null, note: 'Arrears | Penalty | Exam Duty | Overtime | DA Correction']
  reason          text      [not null]
  amount          decimal   [not null, note: 'Positive for earning, negative for deduction']
  applied_by      int       [ref: > users.id]
  applied_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   2.5  ARREARS               │
// └──────────────────────────────┘
// Source: PayrollView.jsx → ARREARS

Table arrears {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  title           varchar   [not null, note: 'Pay Revision Arrear | DA Arrear | Increment Arrear']
  description     text
  amount          decimal   [not null]
  effective_date  date      [not null]
  status          varchar   [not null, default: 'Pending', note: 'Pending | Paid']
  paid_in_month   varchar   [note: 'e.g. Aug 2025']
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   2.6  EPF RECORDS           │
// └──────────────────────────────┘
// Source: PayrollView.jsx → PF_DATA

Table epf_records {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  uan             varchar   [unique, not null, note: 'Universal Account Number']
  total_balance   decimal   [not null, default: 0]
  is_active       boolean   [default: true]
  created_at      timestamp [default: `now()`]
}

Table epf_contributions {
  id              int       [pk, increment]
  epf_record_id   int       [ref: > epf_records.id, not null]
  month           varchar   [not null, note: 'e.g. Sep 2025']
  employee_share  decimal   [not null]
  employer_share  decimal   [not null]
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   2.7  TAX DOCUMENTS         │
// └──────────────────────────────┘
// Source: PayrollView.jsx → FORM16S

Table tax_documents {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  type            varchar   [not null, note: 'Form16 | Form16A | Investment Declaration']
  financial_year  varchar   [not null, note: 'e.g. 2024-25']
  generated_on    date
  file_url        varchar
  file_size       varchar
  is_locked       boolean   [default: true]
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   2.8  REIMBURSEMENT CLAIMS  │
// └──────────────────────────────┘
// Source: ClaimsApprovalView.jsx → CLAIMS_INIT, ReimbursementView.jsx → CLAIMS_INIT

Table reimbursement_claims {
  id              int       [pk, increment]
  claim_code      varchar   [unique, note: 'e.g. CLM-2024-041']
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  type            varchar   [not null, note: 'Conference | Medical | Travel (TA/DA) | Research Grant | Book Purchase | Internet/Mobile | Membership Fee']
  title           varchar
  description     text
  amount          decimal   [not null]
  distance_km     int       [note: 'For TA/DA claims']
  travel_mode     varchar   [note: 'Car | Bike | Train — for TA/DA']
  date            date      [not null]
  stage           int       [default: 0, note: '0=Submitted, 1=HOD, 2=Finance, 3=Disbursed']
  status          varchar   [not null, default: 'Submitted', note: 'Submitted | HOD Approval | Finance Check | Paid | Rejected']
  hod_note        text
  hod_approved_by varchar
  hod_approved_at date
  rejection_reason text
  processed_by    varchar
  created_at      timestamp [default: `now()`]
  resolved_at     timestamp
}

// ┌──────────────────────────────┐
// │   2.9  CLAIM DOCUMENTS       │
// └──────────────────────────────┘

Table claim_documents {
  id              int       [pk, increment]
  claim_id        int       [ref: > reimbursement_claims.id, not null]
  file_name       varchar   [not null, note: 'e.g. conf_receipt.pdf, med_bills.pdf']
  file_url        varchar   [not null]
  file_size       varchar
  uploaded_at     timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   2.10 CLAIM BUDGET TRACKER  │
// └──────────────────────────────┘
// Source: ClaimsApprovalView.jsx → BUDGETS, ReimbursementView.jsx → BUDGETS_INIT

Table claim_budget_categories {
  id              int       [pk, increment]
  category        varchar   [unique, not null, note: 'Conference & Travel | Medical Reimbursement | Internet/Mobile | Book & Journals | Membership Fees']
  allocated       decimal   [not null]
  utilized        decimal   [default: 0]
  academic_year   varchar   [not null, note: 'e.g. FY 2025-26']
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   2.11 LOAN APPLICATIONS     │
// └──────────────────────────────┘
// Source: LoanManagementView.jsx → applications

Table loan_applications {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  type            varchar   [not null, note: 'Computer Advance | Personal Loan | Housing Loan | Festival Advance | HBA']
  amount          decimal   [not null]
  purpose         text      [not null]
  tenure_months   int
  interest_rate   decimal   [note: 'e.g. 8.5']
  status          varchar   [not null, default: 'Pending', note: 'Pending | Approved | Rejected | Sanctioned']
  applied_at      timestamp [default: `now()`]
  sanctioned_at   timestamp
  sanctioned_by   int       [ref: > users.id]
}

// ┌──────────────────────────────┐
// │   2.12 ACTIVE LOANS          │
// └──────────────────────────────┘
// Source: LoanManagementView.jsx → activeLoans, PayrollView.jsx → LOANS

Table active_loans {
  id              int       [pk, increment]
  application_id  int       [ref: > loan_applications.id]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  type            varchar   [not null]
  order_no        varchar   [unique, note: 'e.g. ADV/24/034, HBA/21/007']
  principal       decimal   [not null]
  total_paid      decimal   [default: 0]
  remaining       decimal
  emi_amount      decimal   [not null]
  tenure_months   int       [not null]
  interest_rate   decimal
  start_date      date
  next_emi_date   date
  status          varchar   [not null, default: 'Active', note: 'Active | Closed']
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   2.13 SERVICE BONDS         │
// └──────────────────────────────┘
// Source: BondManagementView.jsx → BONDS_INIT, BOND_TYPES

Table service_bonds {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  type            varchar   [not null, note: 'Ph.D. Sponsorship | Study Leave Bond | Training Bond | Higher Education Bond | Foreign Deputation Bond']
  bond_value      decimal   [not null]
  start_date      date      [not null]
  end_date        date      [not null]
  document_url    varchar
  status          varchar   [not null, default: 'Active', note: 'Active | Expiring Soon | Completed | Released']
  released_by     int       [ref: > users.id]
  released_at     timestamp
  remarks         text
  created_at      timestamp [default: `now()`]
  updated_at      timestamp
}

// ┌──────────────────────────────┐
// │   2.14 NOC REQUESTS          │
// └──────────────────────────────┘
// Source: BondManagementView.jsx → NOC_INIT

Table noc_requests {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  purpose         varchar   [not null, note: 'Part-time PhD Enrolment | Consultancy Project | Foreign University Visit | Conference Presentation']
  organization    varchar   [not null, note: 'Target org e.g. IIT Delhi, TechCorp Inc., MIT USA']
  requested_date  date      [not null]
  status          varchar   [not null, default: 'Pending', note: 'Pending | Approved | Rejected']
  approved_by     int       [ref: > users.id]
  remarks         text
  created_at      timestamp [default: `now()`]
  resolved_at     timestamp
}

// ─────────────────────────────────────────────────────────────
// PHASE 3 — ACADEMIC · RESEARCH · COMMITTEES · GRIEVANCE
// Source: PromotionsView.jsx, TransfersView.jsx,
//         CommitteeManagementView.jsx, GrievanceManagementView.jsx,
//         PbasAdminView.jsx, GrantAdminView.jsx,
//         PublicationView.jsx, GrantsView.jsx, AppraisalView.jsx,
//         EngagementView.jsx, MeetingView.jsx
// ─────────────────────────────────────────────────────────────

// ┌──────────────────────────────┐
// │   3.1  PUBLICATIONS          │
// └──────────────────────────────┘
// Source: PublicationView.jsx → PUBLICATIONS_INIT, METRICS, COAUTHORS

Table publications {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  title           varchar   [not null]
  journal         varchar   [not null]
  year            int       [not null]
  citations       int       [default: 0]
  is_scopus       boolean   [default: false]
  is_ugc_care     boolean   [default: false]
  impact_factor   decimal
  proof_uploaded  boolean   [default: false]
  proof_url       varchar
  doi             varchar
  created_at      timestamp [default: `now()`]
}

Table publication_planner {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  title           varchar   [not null]
  target_journal  varchar   [not null]
  deadline        date
  stage           varchar   [not null, note: 'Data Collection | Writing | Under Review | Accepted | Published']
  probability     varchar
  notes           text
  created_at      timestamp [default: `now()`]
}

Table co_authors {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  name            varchar   [not null]
  affiliation     varchar
  collaborations  int       [default: 0]
  orcid           varchar   [unique]
  created_at      timestamp [default: `now()`]
}

Table research_metrics {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  h_index         int       [default: 0]
  i10_index       int       [default: 0]
  total_citations int       [default: 0]
  rg_score        decimal   [default: 0]
  last_synced     timestamp
  updated_at      timestamp
}

// ┌──────────────────────────────┐
// │   3.2  PBAS / APPRAISAL      │
// └──────────────────────────────┘
// Source: AppraisalView.jsx → INIT_CAT1..3, PbasAdminView.jsx → SUBMISSIONS_INIT

Table pbas_submissions {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  academic_year   varchar   [not null, note: 'e.g. 2025-26']
  stage           int       [not null, note: 'CAS stage 1-6']
  cat1_score      decimal   [note: 'Teaching & Learning, max 100']
  cat2_score      decimal   [note: 'Co-Curricular & Extension, max 100']
  cat3_score      decimal   [note: 'Research & Publication, max 400']
  total_score     decimal
  self_score      decimal
  hod_score       decimal
  admin_score     decimal
  hod_remarks     text
  admin_remarks   text
  status          varchar   [not null, default: 'Draft', note: 'Draft | Submitted | Pending HOD | Pending Admin | Verified | Rejected']
  submitted_at    timestamp
  verified_at     timestamp
  created_at      timestamp [default: `now()`]
}

Table pbas_documents {
  id              int       [pk, increment]
  submission_id   int       [ref: > pbas_submissions.id, not null]
  category        varchar   [not null, note: 'Research | Teaching | Extension']
  file_name       varchar   [not null]
  file_url        varchar
  is_verified     boolean   [default: false]
  verified_by     int       [ref: > users.id]
  uploaded_at     timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   3.3  RESEARCH GRANTS       │
// └──────────────────────────────┘
// Source: GrantAdminView.jsx → PROJECTS_INIT, GrantsView.jsx → PROJECTS, BUDGET_HEADS

Table research_projects {
  id              varchar   [pk, note: 'e.g. PRJ-2024-01, DST-2022-441']
  pi_id           int       [ref: > faculty_profiles.id, not null, note: 'Principal Investigator']
  title           varchar   [not null]
  agency          varchar   [not null, note: 'DST-SERB | AICTE-RPS | UGC-STRIDE | ICMR | CSIR | MeitY | DBT | DRDO | ICAR']
  sanctioned_amt  decimal   [not null]
  utilized_amt    decimal   [default: 0]
  duration        varchar
  start_date      date
  end_date        date
  objectives      text
  status          varchar   [not null, default: 'Active', note: 'Active | On Track | Critical | Completed']
  report_status   varchar   [note: 'All Clear | UC Pending | Final Report Due']
  created_at      timestamp [default: `now()`]
  updated_at      timestamp
}

Table grant_budget_heads {
  id              int       [pk, increment]
  project_id      varchar   [ref: > research_projects.id, not null]
  head            varchar   [not null, note: 'Manpower | Equipment | Travel & Conference | Consumables | Contingency | Overhead']
  allocated       decimal   [not null]
  utilized        decimal   [default: 0]
}

Table grant_transactions {
  id              int       [pk, increment]
  project_id      varchar   [ref: > research_projects.id, not null]
  date            date      [not null]
  head            varchar   [not null]
  amount          decimal   [not null]
  status          varchar   [not null, note: 'Cleared | Pending']
}

Table grant_milestones {
  id              int       [pk, increment]
  project_id      varchar   [ref: > research_projects.id, not null]
  label           varchar   [not null]
  is_done         boolean   [default: false]
  completed_at    date
}

Table grant_team_members {
  id              int       [pk, increment]
  project_id      varchar   [ref: > research_projects.id, not null]
  name            varchar   [not null]
  role            varchar   [not null, note: 'Principal Investigator | Co-Investigator | Project Research Fellow | JRF | Research Associate']
  faculty_id      int       [ref: > faculty_profiles.id, note: 'NULL for non-faculty members']
  join_date       date
  status          varchar   [default: 'Active']
}

Table grant_deliverables {
  id              int       [pk, increment]
  project_id      varchar   [ref: > research_projects.id, not null]
  title           varchar   [not null]
  type            varchar   [not null, note: 'Software | Research Output | Dataset | Prototype | Report | Patent']
  status          varchar   [not null, default: 'Pending', note: 'Pending | In Progress | Completed']
  due_date        date
  completed_at    date
}

Table grant_reports {
  id              int       [pk, increment]
  project_id      varchar   [ref: > research_projects.id, not null]
  title           varchar   [not null]
  due_date        date      [not null]
  status          varchar   [not null, default: 'Pending', note: 'Pending | Submitted']
  file_url        varchar
  submitted_at    timestamp
}

Table grant_approvals {
  id              int       [pk, increment]
  project_id      varchar   [ref: > research_projects.id, not null]
  pi_id           int       [ref: > faculty_profiles.id, not null]
  type            varchar   [not null, note: 'Utilization Certificate (UC) | Fund Release Request']
  amount          decimal   [not null]
  date            date
  status          varchar   [not null, default: 'Pending Review', note: 'Pending Review | Approved | Rejected']
  document_url    varchar
  agency          varchar
  created_at      timestamp [default: `now()`]
}

Table grant_applications {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  title           varchar   [not null]
  agency          varchar   [not null]
  submitted_date  date
  status          varchar   [not null, default: 'Under Review', note: 'Under Review | Shortlisted | Approved | Rejected']
  feedback        text
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   3.4  COMMITTEES            │
// └──────────────────────────────┘
// Source: CommitteeManagementView.jsx → committees, meetings, resolutions, actionItems

Table committees {
  id              int       [pk, increment]
  name            varchar   [unique, not null, note: 'IQAC, Grievance Redressal, Cultural Committee, etc.']
  type            varchar   [not null, note: 'Statutory | Advisory | Ad-Hoc']
  chair_id        int       [ref: > faculty_profiles.id]
  convener_id     int       [ref: > faculty_profiles.id]
  secretary_id    int       [ref: > faculty_profiles.id]
  term_start      date
  term_end        date
  effectiveness   int       [note: '0-100 score']
  max_consecutive_terms int [default: 2]
  cooling_off_period varchar [note: 'e.g. 6 months']
  status          varchar   [not null, default: 'Active', note: 'Active | Expiring Soon | Expired | Dissolved']
  created_at      timestamp [default: `now()`]
}

Table committee_members {
  id              int       [pk, increment]
  committee_id    int       [ref: > committees.id, not null]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  role            varchar   [not null, note: 'Chairperson | Convener | Secretary | Member']
  join_date       date
  term_end        date
  attendance_total int      [default: 0]
  attendance_present int    [default: 0]
  attendance_pct  decimal
  contributions   int       [default: 0]
  coi_declared    boolean   [default: false, note: 'Conflict of Interest declaration']
  coi_date        date
  status          varchar   [not null, default: 'Active', note: 'Active | Inactive | Rotated Out']
}

// ┌──────────────────────────────┐
// │   3.5  MEETINGS              │
// └──────────────────────────────┘

Table committee_meetings {
  id              int       [pk, increment]
  committee_id    int       [ref: > committees.id, not null]
  title           varchar   [not null]
  date            date      [not null]
  time            time
  duration_min    int       [note: 'Duration in minutes']
  room            varchar
  video_link      varchar
  convener_id     int       [ref: > faculty_profiles.id]
  is_recurring    boolean   [default: false]
  rsvp_required   boolean   [default: false]
  status          varchar   [not null, default: 'Scheduled', note: 'Scheduled | Completed | Cancelled']
  next_meeting_date date
  created_at      timestamp [default: `now()`]
}

Table meeting_agenda {
  id              int       [pk, increment]
  meeting_id      int       [ref: > committee_meetings.id, not null]
  topic           varchar   [not null]
  duration_min    int
  presenter       varchar
  sort_order      int       [default: 0]
}

Table meeting_attendance {
  id              int       [pk, increment]
  meeting_id      int       [ref: > committee_meetings.id, not null]
  member_id       int       [ref: > committee_members.id, not null]
  status          varchar   [not null, note: 'Present | Absent | Excused | Late']
}

Table meeting_minutes {
  id              int       [pk, increment]
  meeting_id      int       [ref: > committee_meetings.id, not null]
  version         int       [not null, default: 1]
  content         text
  status          varchar   [not null, default: 'Draft', note: 'Draft | Under Review | Approved']
  modified_by     int       [ref: > users.id]
  approved_by     int       [ref: > users.id]
  approved_date   date
  file_url        varchar
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   3.6  RESOLUTIONS & VOTES   │
// └──────────────────────────────┘

Table resolutions {
  id              varchar   [pk, note: 'e.g. RES-001']
  meeting_id      int       [ref: > committee_meetings.id, not null]
  committee_id    int       [ref: > committees.id, not null]
  text            text      [not null]
  proposed_by     int       [ref: > faculty_profiles.id]
  proposed_date   date
  voting_method   varchar   [note: 'Show of Hands | Secret Ballot | Electronic']
  votes_for       int       [default: 0]
  votes_against   int       [default: 0]
  abstain         int       [default: 0]
  quorum_required int       [note: 'Percentage required']
  quorum_achieved decimal
  quorum_status   varchar   [note: 'Met | Not Met | Pending']
  status          varchar   [not null, default: 'Voting Open', note: 'Voting Open | Passed | Failed | Withdrawn']
  implementation_status varchar [note: 'Pending | In Progress | Completed']
  responsible_officer varchar
  created_at      timestamp [default: `now()`]
}

Table resolution_votes {
  id              int       [pk, increment]
  resolution_id   varchar   [ref: > resolutions.id, not null]
  voter_id        int       [ref: > faculty_profiles.id, not null]
  vote            varchar   [not null, note: 'For | Against | Abstain']
  voted_at        timestamp [default: `now()`]

  indexes {
    (resolution_id, voter_id) [unique]
  }
}

// ┌──────────────────────────────┐
// │   3.7  ACTION ITEMS          │
// └──────────────────────────────┘

Table action_items {
  id              varchar   [pk, note: 'e.g. ACT-001']
  meeting_id      int       [ref: > committee_meetings.id, not null]
  committee_id    int       [ref: > committees.id, not null]
  description     text      [not null]
  assigned_to     int       [ref: > faculty_profiles.id, not null]
  due_date        date
  priority        varchar   [not null, note: 'Critical | High | Medium | Low']
  status          varchar   [not null, default: 'Open', note: 'Open | In Progress | Completed | Overdue']
  completion_date date
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   3.8  GRIEVANCE SYSTEM      │
// └──────────────────────────────┘
// Source: GrievanceManagementView.jsx → TICKETS_INIT, HISTORY_INIT

Table grievance_tickets {
  id              varchar   [pk, note: 'e.g. TKT-2026-001']
  category        varchar   [not null, note: 'Harassment | Facilities | Salary | Discrimination | Policy | Other']
  priority        varchar   [not null, note: 'High | Medium | Low']
  filed_by        varchar   [not null, note: 'Faculty name or Anonymous']
  faculty_id      int       [ref: > faculty_profiles.id, note: 'NULL for anonymous']
  department      varchar
  description     text      [not null]
  assigned_to     varchar   [not null, note: 'e.g. Dr. S. Nair (ICC), HR Head, Ombudsperson']
  sla_days        int       [note: 'Days remaining in SLA']
  status          varchar   [not null, default: 'Open', note: 'Open | Under Review | Proposed Resolution | Closed']
  resolution_note text
  resolved_by     varchar
  created_at      timestamp [default: `now()`]
  resolved_at     timestamp
}

Table grievance_timeline {
  id              int       [pk, increment]
  ticket_id       varchar   [ref: > grievance_tickets.id, not null]
  date            date      [not null]
  event           text      [not null]
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   3.9  PROMOTIONS            │
// └──────────────────────────────┘
// Source: PromotionsView.jsx → FACULTY_LIST, PROMOTION_HISTORY_INIT

Table promotions {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  from_designation varchar  [not null]
  to_designation  varchar   [not null, note: 'Sr. Asst. Professor | Assoc. Professor | Professor | Professor & HOD | Dean']
  from_pay        decimal
  to_pay          decimal
  from_level      int
  to_level        int
  effective_date  date      [not null]
  order_no        varchar   [unique, note: 'e.g. PRO/26/001']
  pbas_score      int       [note: 'PBAS API score at time of promotion']
  service_years   int
  status          varchar   [not null, default: 'Pending', note: 'Pending | Active | Cancelled']
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   3.10 TRANSFERS & EXIT      │
// └──────────────────────────────┘
// Source: TransfersView.jsx → FACULTY_LIST, EXIT_REQUESTS_INIT,
//         TRANSFER_HISTORY, CLEARANCE_ITEMS, HANDOVER_ITEMS

Table transfers {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  from_dept       varchar   [not null]
  to_dept         varchar   [not null]
  from_campus     varchar
  to_campus       varchar
  type            varchar   [not null, note: 'Interdept. | Campus | Deputation']
  effective_date  date
  new_hod         varchar
  status          varchar   [not null, default: 'Pending', note: 'Pending | Completed']
  created_at      timestamp [default: `now()`]
}

Table exit_requests {
  id              int       [pk, increment]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  type            varchar   [not null, note: 'Resignation | Retirement | VRS']
  requested_date  date      [not null]
  basic_pay       decimal
  service_years   int
  pending_leaves  int
  progress_pct    int       [default: 0, note: 'Clearance completion percentage']
  status          varchar   [not null, default: 'Pending', note: 'Pending | Processing | Completed | Cancelled']
  created_at      timestamp [default: `now()`]
}

Table exit_clearance {
  id              int       [pk, increment]
  exit_request_id int       [ref: > exit_requests.id, not null]
  item_key        varchar   [not null, note: 'library | laptop | finance | idCard | email | hod']
  label           varchar   [not null]
  is_cleared      boolean   [default: false]
  cleared_by      int       [ref: > users.id]
  cleared_at      timestamp
}

Table exit_handover {
  id              int       [pk, increment]
  exit_request_id int       [ref: > exit_requests.id, not null]
  item_key        varchar   [not null, note: 'laptop | labKeys | library | idCard | files | software']
  label           varchar   [not null]
  is_handed_over  boolean   [default: false]
  received_by     int       [ref: > users.id]
  handed_at       timestamp
}

// ─────────────────────────────────────────────────────────────
// PHASE 4 — TRANSPORT · HOSTEL · STUDENT
// Source: transportAdminShared.js, driverShared.js,
//         studentShared.js, RoomAllocations.jsx,
//         EntryExitLog.jsx, DailyMenu.jsx, FeeCollection.jsx,
//         EscalateToMaintenance.jsx, + all Transport-admin & Driver views
// ─────────────────────────────────────────────────────────────

// ┌──────────────────────────────┐
// │   4.1  VEHICLES / BUSES      │
// └──────────────────────────────┘
// Source: transportAdminShared.js → buses

Table vehicles {
  id              varchar   [pk, note: 'e.g. B-01']
  reg_number      varchar   [unique, not null, note: 'e.g. KA-01-AB-1234']
  capacity        int       [not null, default: 50]
  make            varchar   [note: 'Ashok Leyland | Tata | Eicher | BharatBenz | Mahindra']
  year            int
  fuel_level_pct  int
  mileage_km      int       [default: 0]
  last_service    date
  next_service    date
  insurance_expiry date
  fitness_expiry  date
  gps_device_id   varchar   [unique]
  status          varchar   [not null, default: 'In Service', note: 'On Route | Idle | Maintenance | In Service']
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   4.2  ROUTES                │
// └──────────────────────────────┘
// Source: transportAdminShared.js → routes

Table transport_routes {
  id              varchar   [pk, note: 'e.g. R-01']
  name            varchar   [not null, note: 'e.g. Route 1 - City Center']
  stops           int       [not null]
  distance_km     decimal
  duration_min    int
  frequency       varchar   [note: 'e.g. Every 20 min']
  first_trip      time
  last_trip       time
  vehicle_id      varchar   [ref: > vehicles.id]
  students_on_route int     [default: 0]
  status          varchar   [not null, default: 'Active', note: 'Active | Maintenance | Suspended']
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   4.3  DRIVERS               │
// └──────────────────────────────┘
// Source: transportAdminShared.js → drivers, driverShared.js → currentUser

Table drivers {
  id              varchar   [pk, note: 'e.g. D-01, DRV-1024']
  name            varchar   [not null]
  phone           varchar
  license_number  varchar   [unique, not null]
  license_expiry  date
  vehicle_id      varchar   [ref: > vehicles.id]
  shift           varchar   [note: 'Morning (6AM–2PM) | Evening (2PM–10PM)']
  experience      varchar
  address         text
  emergency_contact varchar
  join_date       date
  rating          decimal   [default: 0]
  violations      int       [default: 0]
  status          varchar   [not null, default: 'Active', note: 'Active | Off-Duty | Suspended']
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   4.4  DRIVER ATTENDANCE     │
// └──────────────────────────────┘
// Source: transportAdminShared.js → driverAttendance

Table driver_attendance {
  id              int       [pk, increment]
  driver_id       varchar   [ref: > drivers.id, not null]
  date            date      [not null]
  status          varchar   [not null, note: 'Present | Absent | Late | On Leave']
  check_in        time
  check_out       time
  shift           varchar

  indexes {
    (driver_id, date) [unique]
  }
}

// ┌──────────────────────────────┐
// │   4.5  DRIVER LEAVE          │
// └──────────────────────────────┘
// Source: driverShared.js → leaveApplications

Table driver_leaves {
  id              varchar   [pk, note: 'e.g. L-112']
  driver_id       varchar   [ref: > drivers.id, not null]
  type            varchar   [not null, note: 'Sick Leave | Casual Leave | Earned Leave']
  from_date       date      [not null]
  to_date         date      [not null]
  reason          text
  status          varchar   [not null, default: 'Pending', note: 'Pending | Approved | Rejected']
  applied_on      date
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   4.6  SCHEDULES & TRIPS     │
// └──────────────────────────────┘
// Source: transportAdminShared.js → schedules, driverShared.js → todaySchedule, tripHistory

Table transport_schedules {
  id              varchar   [pk, note: 'e.g. SCH-001']
  route_id        varchar   [ref: > transport_routes.id, not null]
  vehicle_id      varchar   [ref: > vehicles.id]
  driver_id       varchar   [ref: > drivers.id]
  departure_time  time      [not null]
  arrival_time    time
  trip_type       varchar   [not null, note: 'Pickup | Return']
  passengers      int       [default: 0]
  status          varchar   [not null, default: 'Scheduled', note: 'Scheduled | Active | Completed']
}

Table trip_history {
  id              varchar   [pk, note: 'e.g. TRP-801']
  driver_id       varchar   [ref: > drivers.id, not null]
  route_id        varchar   [ref: > transport_routes.id]
  vehicle_id      varchar   [ref: > vehicles.id]
  date            date      [not null]
  trip_type       varchar   [not null, note: 'Pickup | Drop-off']
  passengers      int
  duration_min    int
  status          varchar   [not null, default: 'Completed']
}

// ┌──────────────────────────────┐
// │   4.7  GPS / LIVE TRACKING   │
// └──────────────────────────────┘
// Source: transportAdminShared.js → liveTracking

Table gps_tracking {
  id              int       [pk, increment]
  vehicle_id      varchar   [ref: > vehicles.id, not null]
  route_id        varchar   [ref: > transport_routes.id]
  driver_id       varchar   [ref: > drivers.id]
  latitude        decimal   [not null]
  longitude       decimal   [not null]
  speed_kmh       int
  current_stop    varchar
  next_stop       varchar
  eta_min         int
  passengers      int
  status          varchar   [note: 'On Time | Delayed']
  recorded_at     timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   4.8  BUS PASSES            │
// └──────────────────────────────┘
// Source: transportAdminShared.js → students (bus pass), faculty (bus pass)

Table bus_passes {
  id              int       [pk, increment]
  holder_type     varchar   [not null, note: 'Student | Faculty']
  holder_id       varchar   [not null, note: 'Student or Faculty reference ID']
  name            varchar   [not null]
  department      varchar
  route_id        varchar   [ref: > transport_routes.id]
  pickup_stop     varchar
  pass_type       varchar   [not null, note: 'Annual | Semester']
  amount_paid     decimal
  expiry_date     date
  status          varchar   [not null, default: 'Active', note: 'Active | Expired | Pending | Renewed']
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   4.9  FUEL LOGS             │
// └──────────────────────────────┘
// Source: transportAdminShared.js → fuelLogs, driverShared.js → fuelLogs

Table fuel_logs {
  id              varchar   [pk, note: 'e.g. FUEL-001, FL-502']
  vehicle_id      varchar   [ref: > vehicles.id, not null]
  driver_id       varchar   [ref: > drivers.id]
  date            date      [not null]
  litres          decimal   [not null]
  cost_per_litre  decimal
  total_cost      decimal   [not null]
  odometer_km     int
  station         varchar
  efficiency_kmpl decimal
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   4.10 VEHICLE MAINTENANCE   │
// └──────────────────────────────┘
// Source: transportAdminShared.js → maintenanceRecords

Table vehicle_maintenance {
  id              varchar   [pk, note: 'e.g. MNT-001']
  vehicle_id      varchar   [ref: > vehicles.id, not null]
  type            varchar   [not null, note: 'Oil Change | Brake Inspection | Tire Replacement | Engine Tune-up | AC Service | Battery Check | Transmission Service | Full Service']
  scheduled_date  date      [not null]
  completed_date  date
  cost            decimal
  vendor          varchar
  odometer_km     int
  notes           text
  status          varchar   [not null, default: 'Scheduled', note: 'Scheduled | In Progress | Completed | Due Soon | Overdue']
}

// ┌──────────────────────────────┐
// │   4.11 BUS CONDITION REPORTS │
// └──────────────────────────────┘
// Source: driverShared.js → conditionReports

Table bus_condition_reports {
  id              varchar   [pk, note: 'e.g. BCR-305']
  vehicle_id      varchar   [ref: > vehicles.id, not null]
  driver_id       varchar   [ref: > drivers.id, not null]
  date            date      [not null]
  time            time
  tires           varchar   [note: 'Good | Needs Attention | Critical']
  brakes          varchar   [note: 'Good | Needs Attention | Critical']
  lights          varchar   [note: 'Good | Needs Attention | Critical']
  fluids          varchar   [note: 'Good | Needs Attention | Critical']
  overall_status  varchar   [not null, note: 'Good | Needs Attention | Critical']
  notes           text
}

// ┌──────────────────────────────┐
// │   4.12 INCIDENTS             │
// └──────────────────────────────┘
// Source: transportAdminShared.js → incidents, driverShared.js → reportedIncidents

Table transport_incidents {
  id              varchar   [pk, note: 'e.g. INC-001']
  driver_id       varchar   [ref: > drivers.id, not null]
  vehicle_id      varchar   [ref: > vehicles.id]
  date            date      [not null]
  time            time
  type            varchar   [not null, note: 'Minor Collision | Traffic Violation | Passenger Complaint | Mechanical Failure | Route Deviation | Speed Violation | Vehicle Breakdown | Traffic Incident']
  severity        varchar   [not null, note: 'Low | Medium | High | Critical']
  description     text
  location        varchar
  action_taken    text
  status          varchar   [not null, default: 'Open', note: 'Open | In Progress | Closed | Resolved']
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   4.13 ROUTE DEVIATION ALERTS│
// └──────────────────────────────┘
// Source: transportAdminShared.js → deviationAlerts

Table route_deviation_alerts {
  id              varchar   [pk, note: 'e.g. DEV-001']
  vehicle_id      varchar   [ref: > vehicles.id, not null]
  route_id        varchar   [ref: > transport_routes.id, not null]
  driver_id       varchar   [ref: > drivers.id]
  timestamp       timestamp [not null]
  deviation_km    decimal
  severity        varchar   [not null, note: 'Normal | Critical']
  reason          varchar
  location        varchar   [note: 'Lat/Lng coordinates']
  status          varchar   [not null, default: 'Open', note: 'Open | Closed']
}

// ─────────────────────────────────────────────────────────────
// HOSTEL DOMAIN
// ─────────────────────────────────────────────────────────────

// ┌──────────────────────────────┐
// │   4.14 HOSTEL BLOCKS & ROOMS │
// └──────────────────────────────┘
// Source: RoomAllocations.jsx, OccupancyStatus.jsx

Table hostel_blocks {
  id              int       [pk, increment]
  name            varchar   [unique, not null, note: 'e.g. Block A, Block B']
  type            varchar   [not null, note: 'Boys | Girls']
  total_rooms     int       [not null]
  warden_name     varchar
  created_at      timestamp [default: `now()`]
}

Table hostel_rooms {
  id              int       [pk, increment]
  block_id        int       [ref: > hostel_blocks.id, not null]
  room_number     varchar   [not null, note: 'e.g. A-101']
  capacity        int       [not null, default: 3]
  current_occupancy int     [default: 0]
  status          varchar   [not null, default: 'Available', note: 'Available | Full | Under Maintenance']

  indexes {
    (block_id, room_number) [unique]
  }
}

// ┌──────────────────────────────┐
// │   4.15 STUDENTS              │
// └──────────────────────────────┘
// Source: studentShared.js → currentStudent

Table students {
  id              varchar   [pk, note: 'e.g. ST-2023-0145']
  name            varchar   [not null]
  course          varchar   [not null]
  department      varchar
  year            int
  phone           varchar
  email           varchar   [unique]
  blood_group     varchar
  mess_plan       varchar   [note: 'Standard (Veg + Non-Veg) | Veg Only | Special']
  bus_pass_id     varchar   [note: 'BP-xxxx']
  parking_pass    varchar   [note: 'Valid | None']
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   4.16 ROOM ALLOCATIONS      │
// └──────────────────────────────┘
// Source: RoomAllocations.jsx → allocations

Table room_allocations {
  id              int       [pk, increment]
  student_id      varchar   [ref: > students.id, not null]
  room_id         int       [ref: > hostel_rooms.id, not null]
  bed_number      varchar   [note: 'e.g. Bed 1, Bed 2']
  check_in_date   date      [not null]
  check_out_date  date
  status          varchar   [not null, default: 'Allocated', note: 'Allocated | Pending | Vacated']
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   4.17 ENTRY / EXIT LOGS     │
// └──────────────────────────────┘
// Source: EntryExitLog.jsx → initialLogs

Table hostel_entry_exit_logs {
  id              int       [pk, increment]
  student_id      varchar   [ref: > students.id, not null]
  hostel_block    varchar   [not null]
  date            date      [not null]
  time            time      [not null]
  direction       varchar   [not null, note: 'In | Out']
  pass_type       varchar   [not null, note: 'Regular | Night Out | Home Visit | Emergency']
  gate            varchar
  status          varchar   [not null, default: 'On Time', note: 'On Time | Late Entry | Overstaying | Flagged']
  comments        text
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   4.18 EXIT PASSES (STUDENT) │
// └──────────────────────────────┘
// Source: studentShared.js → mockExitPasses

Table student_exit_passes {
  id              varchar   [pk, note: 'e.g. EP-402']
  student_id      varchar   [ref: > students.id, not null]
  purpose         text      [not null]
  out_time        timestamp [not null]
  expected_in     timestamp [not null]
  actual_in       timestamp
  status          varchar   [not null, default: 'Pending', note: 'Pending | Approved | Rejected | Expired']
  applied_on      date
}

// ┌──────────────────────────────┐
// │   4.19 NIGHTLY ATTENDANCE    │
// └──────────────────────────────┘
// Source: NightlyAttendance.jsx, studentShared.js → mockAttendance

Table hostel_nightly_attendance {
  id              int       [pk, increment]
  student_id      varchar   [ref: > students.id, not null]
  date            date      [not null]
  status          varchar   [not null, note: 'Present | Absent']
  time            time

  indexes {
    (student_id, date) [unique]
  }
}

// ┌──────────────────────────────┐
// │   4.20 MESS MENUS            │
// └──────────────────────────────┘
// Source: DailyMenu.jsx → initialWeeklyMenu

Table mess_menus {
  id              int       [pk, increment]
  hostel_type     varchar   [not null, note: 'Common | Boys | Girls']
  day_of_week     varchar   [not null, note: 'Monday..Sunday']
  breakfast       text
  lunch           text
  snacks          text
  dinner          text
  effective_from  date
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   4.21 MEAL PLANS            │
// └──────────────────────────────┘
// Source: MealPlans.jsx

Table meal_plans {
  id              int       [pk, increment]
  name            varchar   [not null, note: 'Standard (Veg + Non-Veg) | Veg Only | Special']
  price_per_month decimal   [not null]
  description     text
  is_active       boolean   [default: true]
}

// ┌──────────────────────────────┐
// │   4.22 FOOD INVENTORY        │
// └──────────────────────────────┘
// Source: FoodInventory.jsx

Table food_inventory {
  id              int       [pk, increment]
  item_name       varchar   [not null]
  category        varchar   [not null, note: 'Grains | Dairy | Vegetables | Spices | Oils | Others']
  quantity         decimal   [not null]
  unit            varchar   [not null, note: 'kg | litre | units']
  reorder_level   decimal
  supplier        varchar
  last_restocked  date
  status          varchar   [default: 'In Stock', note: 'In Stock | Low Stock | Out of Stock']
}

// ┌──────────────────────────────┐
// │   4.23 MESS FEEDBACK         │
// └──────────────────────────────┘
// Source: ResidentFeedback.jsx, studentShared.js

Table mess_feedback {
  id              int       [pk, increment]
  student_id      varchar   [ref: > students.id, not null]
  date            date      [not null]
  meal_type       varchar   [not null, note: 'Breakfast | Lunch | Snacks | Dinner']
  rating          int       [not null, note: '1-5']
  comment         text
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   4.24 HOSTEL COMPLAINTS     │
// └──────────────────────────────┘
// Source: EscalateToMaintenance.jsx, studentShared.js → mockComplaints

Table hostel_complaints {
  id              varchar   [pk, note: 'e.g. CMP-004, COMP-101']
  student_id      varchar   [ref: > students.id, not null]
  block_room      varchar   [not null, note: 'e.g. Boys A, Rm 101']
  category        varchar   [not null, note: 'Electrical | Plumbing | Carpentry | General']
  description     text      [not null]
  priority        varchar   [not null, default: 'Medium', note: 'Low | Medium | High']
  date            date      [not null]
  escalated_to    varchar   [note: 'Campus Maintenance | Electrical Dept | Plumbing Dept | External Contractor']
  escalation_notes text
  status          varchar   [not null, default: 'Open', note: 'Open | In Progress | Escalated | Resolved']
  resolved_at     timestamp
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   4.25 HOSTEL FEES           │
// └──────────────────────────────┘
// Source: FeeCollection.jsx → MOCK_DUES

Table hostel_fees {
  id              int       [pk, increment]
  student_id      varchar   [ref: > students.id, not null]
  block           varchar   [not null]
  term            varchar   [not null, note: 'e.g. Spring 2024']
  total_amount    decimal   [not null]
  paid_amount     decimal   [default: 0]
  due_amount      decimal   [default: 0]
  status          varchar   [not null, default: 'Unpaid', note: 'Paid | Partial | Unpaid']
  created_at      timestamp [default: `now()`]
}

Table hostel_fee_receipts {
  id              int       [pk, increment]
  fee_id          int       [ref: > hostel_fees.id, not null]
  amount          decimal   [not null]
  payment_method  varchar   [note: 'Cash | UPI | Bank Transfer | Card']
  receipt_number  varchar   [unique]
  paid_at         timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   4.26 FACILITY BOOKINGS     │
// └──────────────────────────────┘
// Source: studentShared.js → mockBookings

Table facility_bookings {
  id              varchar   [pk, note: 'e.g. BK-802']
  student_id      varchar   [ref: > students.id, not null]
  space           varchar   [not null, note: 'Study Room B | Tennis Court 1 | etc.']
  date            date      [not null]
  time_slot       varchar   [not null, note: 'e.g. 06:00 PM - 08:00 PM']
  status          varchar   [not null, default: 'Upcoming', note: 'Upcoming | Completed | Cancelled']
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   4.27 ANNOUNCEMENTS         │
// └──────────────────────────────┘
// Source: studentShared.js → mockAnnouncements

Table announcements {
  id              int       [pk, increment]
  title           varchar   [not null]
  content         text      [not null]
  type            varchar   [not null, note: 'Academic | Hostel | Event | Transport | General']
  date            date      [not null]
  target_audience varchar   [default: 'All', note: 'All | Students | Faculty | Drivers']
  created_by      int       [ref: > users.id]
  created_at      timestamp [default: `now()`]
}

// ─────────────────────────────────────────────────────────────
// PHASE 5 — LOGISTICS · MAINTENANCE STAFF · INSIGHTS & SYSTEM
// Source: AssetAdminView.jsx, AssetMaintenanceView.jsx,
//         RoomBookingAdminView.jsx, maintenanceShared.js,
//         CommunicationAdminView.jsx, NotificationHistory.jsx,
//         IntegrationSettingsView.jsx, RBACSettingsView.jsx,
//         DeviceManagement.jsx, EmailTemplatesView.jsx,
//         CustomReportBuilder.jsx, ReportsView.jsx
// ─────────────────────────────────────────────────────────────

// ┌──────────────────────────────┐
// │   5.1  CAMPUS ASSETS         │
// └──────────────────────────────┘
// Source: AssetAdminView.jsx → ASSETS_INIT, ASSET_TYPES

Table campus_assets {
  id              varchar   [pk, note: 'e.g. AST-001']
  name            varchar   [not null]
  type            varchar   [not null, note: 'Laptop | Equipment | Furniture | Vehicle | Software | Other']
  serial_number   varchar   [unique]
  assigned_to     varchar   [note: 'User name or location, e.g. Dr. Sarah Smith, Classroom 301']
  location        varchar
  value           decimal
  purchase_date   date
  warranty_expiry date
  notes           text
  status          varchar   [not null, default: 'In Stock', note: 'Assigned | Active | In Stock | Maintenance | Disposed']
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   5.2  ASSET TRANSFERS       │
// └──────────────────────────────┘
// Source: AssetAdminView.jsx → TRANSFERS_INIT

Table asset_transfers {
  id              int       [pk, increment]
  asset_id        varchar   [ref: > campus_assets.id, not null]
  from_holder     varchar   [not null]
  to_holder       varchar   [not null]
  date            date      [not null]
  reason          varchar   [note: 'Faculty Exit | Relocation | New Allocation | Upgrade']
  remarks         text
  status          varchar   [not null, default: 'Pending Approval', note: 'Pending Approval | Approved | Rejected']
  approved_by     int       [ref: > users.id]
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   5.3  ASSET VERIFICATION    │
// └──────────────────────────────┘
// Source: AssetMaintenanceView.jsx → vStats, MISSING_ASSETS_INIT

Table asset_verification_drives {
  id              int       [pk, increment]
  financial_year  varchar   [not null, note: 'e.g. 2025-26']
  total_assets    int       [not null]
  verified_count  int       [default: 0]
  missing_count   int       [default: 0]
  deadline        date
  status          varchar   [not null, default: 'Not Started', note: 'Not Started | In Progress | Completed']
  initiated_by    int       [ref: > users.id]
  created_at      timestamp [default: `now()`]
}

Table missing_assets {
  id              int       [pk, increment]
  drive_id        int       [ref: > asset_verification_drives.id, not null]
  asset_id        varchar   [ref: > campus_assets.id, not null]
  last_known_location varchar
  department      varchar
  last_verified   date
  status          varchar   [not null, default: 'Unaccounted', note: 'Unaccounted | Reported Lost | Recovered']
  reported_at     timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   5.4  MAINTENANCE TICKETS   │
// └──────────────────────────────┘
// Source: AssetMaintenanceView.jsx → TICKETS_INIT, TECHNICIANS

Table asset_maintenance_tickets {
  id              varchar   [pk, note: 'e.g. TKT-501']
  asset_id        varchar   [ref: > campus_assets.id]
  asset_name      varchar   [not null]
  issue           varchar   [not null]
  reported_by     varchar   [not null]
  department      varchar
  date            date      [not null]
  priority        varchar   [not null, default: 'Medium', note: 'High | Medium | Low']
  technician      varchar   [note: 'Internal staff or vendor name']
  status          varchar   [not null, default: 'Open', note: 'Open | In Progress | Resolved']
  resolved_at     timestamp
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   5.5  AMC CONTRACTS         │
// └──────────────────────────────┘
// Source: AssetMaintenanceView.jsx → AMC_INIT

Table amc_contracts {
  id              int       [pk, increment]
  vendor          varchar   [not null]
  assets_covered  varchar   [not null, note: 'e.g. Laptops — 50 Units']
  expiry_date     date      [not null]
  contract_value  decimal
  status          varchar   [not null, default: 'Active', note: 'Active | Expiring Soon | Expired | Renewed']
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   5.6  ROOM / VENUE BOOKING  │
// └──────────────────────────────┘
// Source: RoomBookingAdminView.jsx → ROOMS_INIT, REQUESTS_INIT, UTILIZATION

Table bookable_rooms {
  id              int       [pk, increment]
  name            varchar   [unique, not null, note: 'Conference Hall A | Seminar Hall | Lab 3']
  capacity        int       [not null]
  floor           varchar
  features        text      [note: 'JSON or CSV: Projector, AC, Wi-Fi, Sound System, etc.']
  bookings_this_month int   [default: 0]
  status          varchar   [not null, default: 'Active', note: 'Active | Under Maintenance | Decommissioned']
  created_at      timestamp [default: `now()`]
}

Table room_booking_requests {
  id              int       [pk, increment]
  room_id         int       [ref: > bookable_rooms.id, not null]
  faculty_id      int       [ref: > faculty_profiles.id, not null]
  date            date      [not null]
  time_slot       varchar   [not null, note: 'e.g. 10:00 AM – 12:00 PM']
  purpose         varchar   [not null]
  attendees       int
  is_recurring    boolean   [default: false]
  admin_comment   text
  status          varchar   [not null, default: 'Pending', note: 'Pending | Approved | Rejected | Conflict']
  created_at      timestamp [default: `now()`]
}

Table room_utilization {
  id              int       [pk, increment]
  room_id         int       [ref: > bookable_rooms.id, not null]
  month           varchar   [not null, note: 'e.g. 2026-02']
  utilization_pct int       [note: '0-100']
  peak_hours      varchar   [note: 'e.g. Mon–Fri 10–12']
}

// ┌──────────────────────────────┐
// │   5.7  MAINTENANCE STAFF     │
// └──────────────────────────────┘
// Source: maintenanceShared.js → currentStaff

Table maintenance_staff {
  id              varchar   [pk, note: 'e.g. MNT-40291']
  name            varchar   [not null]
  trade           varchar   [not null, note: 'Electrician | Plumber | Carpenter | General']
  phone           varchar
  status          varchar   [not null, default: 'Active', note: 'Active | On Leave | Inactive']
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   5.8  WORK ORDERS           │
// └──────────────────────────────┘
// Source: maintenanceShared.js → mockWorkOrders, MyWorkOrders.jsx, UpdateWorkStatus.jsx

Table work_orders {
  id              varchar   [pk, note: 'e.g. WO-2026-031']
  staff_id        varchar   [ref: > maintenance_staff.id]
  location        varchar   [not null]
  issue           text      [not null]
  priority        varchar   [not null, default: 'Medium', note: 'High | Medium | Low']
  deadline        varchar
  date            date      [not null]
  status          varchar   [not null, default: 'Pending', note: 'Pending | In Progress | Completed']
  completed_at    timestamp
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   5.9  MATERIAL REQUESTS     │
// └──────────────────────────────┘
// Source: maintenanceShared.js → mockMaterialLogs

Table material_requests {
  id              varchar   [pk, note: 'e.g. REQ-012']
  work_order_id   varchar   [ref: > work_orders.id, not null]
  items           text      [not null, note: 'e.g. 1x 5-step Regulator, Wire tape']
  date            date      [not null]
  status          varchar   [not null, default: 'Pending', note: 'Pending | Approved | Rejected']
  approved_by     int       [ref: > users.id]
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   5.10 MAINTENANCE ATTENDANCE│
// └──────────────────────────────┘
// Source: MarkAttendance.jsx

Table maintenance_attendance {
  id              int       [pk, increment]
  staff_id        varchar   [ref: > maintenance_staff.id, not null]
  date            date      [not null]
  status          varchar   [not null, note: 'Checked-In | Absent']
  check_in        time
  check_out       time

  indexes {
    (staff_id, date) [unique]
  }
}

// ┌──────────────────────────────┐
// │   5.11 MAINTENANCE LEAVE     │
// └──────────────────────────────┘
// Source: LeaveApplication.jsx

Table maintenance_leaves {
  id              int       [pk, increment]
  staff_id        varchar   [ref: > maintenance_staff.id, not null]
  type            varchar   [not null, note: 'Sick Leave | Casual Leave | Earned Leave']
  from_date       date      [not null]
  to_date         date      [not null]
  reason          text
  status          varchar   [not null, default: 'Pending', note: 'Pending | Approved | Rejected']
  created_at      timestamp [default: `now()`]
}

// ─────────────────────────────────────────────────────────────
// INSIGHTS & SYSTEM DOMAIN
// ─────────────────────────────────────────────────────────────

// ┌──────────────────────────────┐
// │   5.12 COMMUNICATION CAMPAIGNS│
// └──────────────────────────────┘
// Source: CommunicationAdminView.jsx → HISTORY_INIT, CHANNELS_DEF

Table communication_campaigns {
  id              int       [pk, increment]
  title           varchar   [not null]
  message         text      [not null]
  target_type     varchar   [not null, note: 'All Faculty | Specific Department | HODs Only | Research Committee | Custom Filter']
  department      varchar
  channels        varchar   [not null, note: 'CSV: Email, App, SMS, WhatsApp']
  is_scheduled    boolean   [default: false]
  scheduled_at    timestamp
  is_recurring    boolean   [default: false]
  frequency       varchar   [note: 'Daily | Weekly | Fortnightly | Monthly']
  has_poll        boolean   [default: false]
  poll_question   text
  poll_options    text      [note: 'JSON array of options']
  stats_sent      int       [default: 0]
  stats_delivered int       [default: 0]
  stats_read      int       [default: 0]
  stats_clicked   int       [default: 0]
  status          varchar   [not null, default: 'Draft', note: 'Draft | Sent | Scheduled | Active']
  created_by      int       [ref: > users.id]
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   5.13 INBOX / FEEDBACK      │
// └──────────────────────────────┘
// Source: CommunicationAdminView.jsx → FEEDBACK_INIT

Table communication_inbox {
  id              int       [pk, increment]
  from_name       varchar   [not null]
  from_faculty_id int       [ref: > faculty_profiles.id]
  department      varchar
  subject         varchar   [not null]
  message         text      [not null]
  date            date      [not null]
  status          varchar   [not null, default: 'Unread', note: 'Unread | Read | Replied']
  reply_text      text
  replied_at      timestamp
}

// ┌──────────────────────────────┐
// │   5.14 AUTO-ALERTS           │
// └──────────────────────────────┘
// Source: CommunicationAdminView.jsx → ALERTS_INIT

Table auto_alert_rules {
  id              int       [pk, increment]
  name            varchar   [not null, note: 'e.g. Probation Ending Alert, Low Leave Balance']
  trigger_condition varchar [not null, note: 'e.g. 30 days before, < 3 CL remaining']
  recipient       varchar   [not null, note: 'HR Head + Faculty | Faculty | All Faculty | Individual Faculty']
  is_active       boolean   [default: true]
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   5.15 NOTIFICATION HISTORY  │
// └──────────────────────────────┘
// Source: NotificationHistory.jsx

Table notification_history {
  id              int       [pk, increment]
  campaign_id     int       [ref: > communication_campaigns.id]
  alert_rule_id   int       [ref: > auto_alert_rules.id]
  recipient_id    int       [ref: > users.id]
  channel         varchar   [not null, note: 'Email | App | SMS | WhatsApp']
  title           varchar
  body            text
  status          varchar   [not null, default: 'Sent', note: 'Sent | Delivered | Read | Failed | Bounced']
  sent_at         timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   5.16 EMAIL TEMPLATES       │
// └──────────────────────────────┘
// Source: EmailTemplatesView.jsx

Table email_templates {
  id              int       [pk, increment]
  name            varchar   [not null, note: 'e.g. Welcome Email, Leave Approved, Salary Slip']
  subject         varchar   [not null]
  body_html       text      [not null]
  category        varchar   [note: 'HR | Finance | Academic | System']
  placeholders    text      [note: 'JSON: {{name}}, {{date}}, etc.']
  is_active       boolean   [default: true]
  last_edited_by  int       [ref: > users.id]
  updated_at      timestamp
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   5.17 RBAC — ROLES          │
// └──────────────────────────────┘
// Source: RBACSettingsView.jsx → ROLES_DATA, PERMISSIONS_MATRIX

Table rbac_roles {
  id              int       [pk, increment]
  name            varchar   [unique, not null, note: 'Super Admin | HR Manager | Finance Controller | Academic Dean | Legal Officer | Logistics Manager | HOD']
  description     text
  user_count      int       [default: 0]
  created_at      timestamp [default: `now()`]
}

Table rbac_permissions {
  id              int       [pk, increment]
  role_id         int       [ref: > rbac_roles.id, not null]
  module          varchar   [not null, note: 'HR & Payroll | Finance | Research (PBAS) | Logistics | Legal | Settings']
  access_level    varchar   [not null, note: 'RW | R | -']

  indexes {
    (role_id, module) [unique]
  }
}

Table rbac_user_assignments {
  id              int       [pk, increment]
  user_id         int       [ref: > users.id, not null]
  role_id         int       [ref: > rbac_roles.id, not null]
  department      varchar
  assigned_at     timestamp [default: `now()`]

  indexes {
    (user_id, role_id) [unique]
  }
}

// ┌──────────────────────────────┐
// │   5.18 SYSTEM INTEGRATIONS   │
// └──────────────────────────────┘
// Source: IntegrationSettingsView.jsx → INITIAL_INTEGRATIONS

Table system_integrations {
  id              varchar   [pk, note: 'e.g. bio-1, gps-1, pay-1']
  category        varchar   [not null, note: 'biometric | gps | payment']
  name            varchar   [not null]
  provider        varchar
  location        varchar   [note: 'Physical location for biometric devices']
  ip_address      varchar
  port            varchar
  webhook_url     varchar
  gateway         varchar   [note: 'Razorpay | Stripe | CCAvenue']
  mode            varchar   [note: 'Test | Live']
  currency        varchar
  api_calls_day   varchar
  last_sync       varchar
  is_active       boolean   [default: true]
  status          varchar   [not null, default: 'Connected', note: 'Connected | Disconnected | Warning | Active | Disabled']
  updated_at      timestamp
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   5.19 DEVICE MANAGEMENT     │
// └──────────────────────────────┘
// Source: DeviceManagement.jsx

Table managed_devices {
  id              int       [pk, increment]
  device_name     varchar   [not null]
  device_type     varchar   [not null, note: 'Biometric Terminal | GPS Tracker | Network Switch | Server | CCTV']
  serial_number   varchar   [unique]
  ip_address      varchar
  location        varchar
  firmware_version varchar
  last_heartbeat  timestamp
  status          varchar   [not null, default: 'Online', note: 'Online | Offline | Maintenance']
  created_at      timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   5.20 CUSTOM REPORTS        │
// └──────────────────────────────┘
// Source: CustomReportBuilder.jsx, ReportsView.jsx

Table saved_reports {
  id              int       [pk, increment]
  title           varchar   [not null]
  description     text
  module          varchar   [not null, note: 'HR | Finance | Academic | Logistics | Transport | Hostel']
  filters         text      [note: 'JSON: date range, department, status, etc.']
  columns         text      [note: 'JSON: selected columns']
  chart_type      varchar   [note: 'Bar | Line | Pie | Table']
  is_scheduled    boolean   [default: false]
  schedule_freq   varchar   [note: 'Daily | Weekly | Monthly']
  last_run        timestamp
  created_by      int       [ref: > users.id, not null]
  created_at      timestamp [default: `now()`]
}

Table report_exports {
  id              int       [pk, increment]
  report_id       int       [ref: > saved_reports.id, not null]
  format          varchar   [not null, note: 'PDF | Excel | CSV']
  file_url        varchar
  generated_by    int       [ref: > users.id]
  generated_at    timestamp [default: `now()`]
}

// ┌──────────────────────────────┐
// │   5.21 AUDIT LOG             │
// └──────────────────────────────┘

Table audit_log {
  id              int       [pk, increment]
  user_id         int       [ref: > users.id, not null]
  action          varchar   [not null, note: 'CREATE | UPDATE | DELETE | LOGIN | LOGOUT | EXPORT | APPROVE | REJECT']
  entity_type     varchar   [not null, note: 'Table name or module']
  entity_id       varchar
  old_value       text      [note: 'JSON snapshot before change']
  new_value       text      [note: 'JSON snapshot after change']
  ip_address      varchar
  user_agent      varchar
  performed_at    timestamp [default: `now()`]
}

// ═════════════════════════════════════════════════════════════
// END OF SCHEMA — ALL 5 PHASES COMPLETE
// Total Tables: ~120
// ═════════════════════════════════════════════════════════════



