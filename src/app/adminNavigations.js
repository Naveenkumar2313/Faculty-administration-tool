// src/app/adminNavigations.js
export const adminNavigations = [
    { name: "Admin Dashboard", path: "/admin/dashboard", icon: "dashboard" },
    
    { label: "APPROVALS & REQUESTS", type: "label" },
    {
      name: "HR Approvals",
      icon: "people",
      children: [
        { name: "Leave Requests", path: "/admin/hr/leaves", iconText: "LR" },
        { name: "Attendance Regularization", path: "/admin/hr/attendance", iconText: "AR" }
      ]
    },
    {
      name: "Finance & Claims",
      icon: "attach_money",
      children: [
        { name: "Reimbursement Claims", path: "/admin/finance/claims", iconText: "RC" },
        { name: "Payroll Processing", path: "/admin/finance/payroll", iconText: "PP" }
      ]
    },
    
    { label: "MASTER DATA", type: "label" },
    {
      name: "Asset Management",
      icon: "inventory",
      children: [
        { name: "Asset Master", path: "/admin/logistics/assets", iconText: "AM" },
        { name: "Stock Register", path: "/admin/logistics/stock", iconText: "SR" }
      ]
    },
    {
      name: "Research Admin",
      icon: "school",
      children: [
        { name: "Grant Oversight", path: "/admin/research/grants", iconText: "GO" },
        { name: "Publication Repository", path: "/admin/research/publications", iconText: "PR" }
      ]
    }
  ];