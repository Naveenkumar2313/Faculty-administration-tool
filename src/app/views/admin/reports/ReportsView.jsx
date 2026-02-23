import React, { useState, useMemo } from "react";
import {
  Box, Grid, Typography, Button, TextField, MenuItem,
  Table, TableBody, TableCell, TableHead, TableRow,
  Checkbox, ListItemText, OutlinedInput,
  FormControl, InputLabel, Select, Divider,
  Stack, Snackbar, Alert, Tooltip, InputAdornment
} from "@mui/material";
import {
  Description, PictureAsPdf, TableView, Download,
  FilterAlt, Assessment, PieChart, BarChart as BarChartIcon,
  CheckCircle, TrendingUp, School, AccountBalance,
  Gavel, Close, Refresh, Search
} from "@mui/icons-material";

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const T = {
  bg:           "#F5F7FA",
  surface:      "#FFFFFF",
  border:       "#E4E8EF",
  accent:       "#6366F1",
  accentLight:  "#EEF2FF",
  success:      "#10B981",
  successLight: "#ECFDF5",
  warning:      "#F59E0B",
  warningLight: "#FFFBEB",
  danger:       "#EF4444",
  dangerLight:  "#FEF2F2",
  purple:       "#7C3AED",
  purpleLight:  "#F5F3FF",
  amber:        "#D97706",
  amberLight:   "#FEF3C7",
  text:         "#111827",
  textSub:      "#4B5563",
  textMute:     "#9CA3AF",
};

const fHead = "Roboto, Helvetica, Arial, sans-serif";
const fBody = "Roboto, Helvetica, Arial, sans-serif";
const fMono = "Roboto, Helvetica, Arial, sans-serif";

const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
    * { box-sizing:border-box; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
    @keyframes barGrow { from{height:0} to{height:var(--h)} }
    @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
    .fu  { animation: fadeUp 0.3s ease both; }
    .fu1 { animation: fadeUp 0.3s .06s ease both; }
    .fu2 { animation: fadeUp 0.3s .12s ease both; }
    .fu3 { animation: fadeUp 0.3s .18s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background .15s; }
    .cat-btn { transition: all .15s; }
    .cat-btn:hover { transform:translateY(-1px); }
  `}</style>
);

/* ─────────────────────────────────────────
   DEPARTMENTS + DESIGNATIONS
───────────────────────────────────────── */
const DEPARTMENTS = ["CSE","ECE","Mech","Civil","Electrical","Science"];
const DESIGNATIONS = ["All","Professor","Associate Professor","Assistant Professor"];

/* ─────────────────────────────────────────
   REPORT DEFINITIONS  (3 per category)
   Each report has: id, name, vizType, columns, data fn
───────────────────────────────────────── */
const ALL_RAW = {
  CSE:        { faculty:45, attendance:92, salary:42.5, leaves:12, pubs:28, grants:3, compliance:94 },
  ECE:        { faculty:38, attendance:89, salary:36.1, leaves:9,  pubs:19, grants:2, compliance:88 },
  Mech:       { faculty:35, attendance:88, salary:35.2, leaves:11, pubs:15, grants:2, compliance:91 },
  Civil:      { faculty:25, attendance:85, salary:28.1, leaves:8,  pubs:11, grants:1, compliance:83 },
  Electrical: { faculty:20, attendance:90, salary:22.4, leaves:6,  pubs:8,  grants:1, compliance:79 },
  Science:    { faculty:18, attendance:87, salary:19.8, leaves:7,  pubs:22, grants:2, compliance:86 },
};

const makeCols = (headers) => headers;

const REPORTS = {
  HR: [
    {
      id:"hr_strength",
      name:"Faculty Strength by Department",
      vizType:"bar",
      icon:BarChartIcon,
      columns:["Department","Faculty Count","Professors","Asst. Professors"],
      getData:(depts) => depts.map(d => ({
        dept: d,
        vals: [d, ALL_RAW[d].faculty, Math.round(ALL_RAW[d].faculty*0.28), Math.round(ALL_RAW[d].faculty*0.52)],
        chart: ALL_RAW[d].faculty,
      })),
      chartKey:"chart", chartLabel:"Faculty Count", chartMax:50,
      chartColor: T.accent,
    },
    {
      id:"hr_attendance",
      name:"Monthly Attendance Summary",
      vizType:"bar",
      icon:BarChartIcon,
      columns:["Department","Avg. Attendance %","Present Days","Absent Days"],
      getData:(depts) => depts.map(d => ({
        dept: d,
        vals: [d, `${ALL_RAW[d].attendance}%`, Math.round(ALL_RAW[d].attendance*0.26), Math.round((100-ALL_RAW[d].attendance)*0.26)],
        chart: ALL_RAW[d].attendance,
      })),
      chartKey:"chart", chartLabel:"Attendance %", chartMax:100,
      chartColor: T.success,
    },
    {
      id:"hr_leave",
      name:"Leave Balance Report",
      vizType:"table",
      icon:TableView,
      columns:["Department","Avg. Leave Balance","Leaves Taken","Leaves Remaining"],
      getData:(depts) => depts.map(d => ({
        dept: d,
        vals: [d, `${ALL_RAW[d].leaves} days`, Math.round(ALL_RAW[d].leaves*0.6), Math.round(ALL_RAW[d].leaves*0.4)],
        chart: ALL_RAW[d].leaves,
      })),
      chartKey:"chart", chartLabel:"Avg. Leaves", chartMax:15,
      chartColor: T.warning,
    },
  ],
  Financial: [
    {
      id:"fin_salary",
      name:"Salary Register (Month-wise)",
      vizType:"bar",
      icon:BarChartIcon,
      columns:["Department","Monthly Payroll (₹L)","Basic Pay (₹L)","Allowances (₹L)"],
      getData:(depts) => depts.map(d => ({
        dept: d,
        vals: [d, `₹${ALL_RAW[d].salary}L`, `₹${(ALL_RAW[d].salary*0.65).toFixed(1)}L`, `₹${(ALL_RAW[d].salary*0.35).toFixed(1)}L`],
        chart: ALL_RAW[d].salary,
      })),
      chartKey:"chart", chartLabel:"Payroll ₹L", chartMax:50,
      chartColor: T.purple,
    },
    {
      id:"fin_reimburse",
      name:"Reimbursement Summary",
      vizType:"bar",
      icon:BarChartIcon,
      columns:["Department","Total Claims (₹)","Approved (₹)","Pending (₹)"],
      getData:(depts) => depts.map(d => ({
        dept: d,
        vals: [
          d,
          `₹${(ALL_RAW[d].faculty*1800).toLocaleString()}`,
          `₹${(ALL_RAW[d].faculty*1400).toLocaleString()}`,
          `₹${(ALL_RAW[d].faculty*400).toLocaleString()}`,
        ],
        chart: ALL_RAW[d].faculty*1800/1000,
      })),
      chartKey:"chart", chartLabel:"Claims (₹K)", chartMax:90,
      chartColor: T.amber,
    },
    {
      id:"fin_budget",
      name:"Budget vs Actual Expenditure",
      vizType:"bar",
      icon:BarChartIcon,
      columns:["Department","Budget (₹L)","Actual Spend (₹L)","Variance (₹L)"],
      getData:(depts) => depts.map(d => {
        const budget  = +(ALL_RAW[d].salary*1.4).toFixed(1);
        const actual  = ALL_RAW[d].salary;
        return {
          dept: d,
          vals: [d, `₹${budget}L`, `₹${actual}L`, `₹${(budget-actual).toFixed(1)}L`],
          chart: Math.round((actual/budget)*100),
        };
      }),
      chartKey:"chart", chartLabel:"Utilisation %", chartMax:100,
      chartColor: T.success,
    },
  ],
  Academic: [
    {
      id:"aca_pubs",
      name:"Publication Count by Department",
      vizType:"bar",
      icon:BarChartIcon,
      columns:["Department","Total Publications","Scopus/SCI","Conference Papers"],
      getData:(depts) => depts.map(d => ({
        dept: d,
        vals: [d, ALL_RAW[d].pubs, Math.round(ALL_RAW[d].pubs*0.55), Math.round(ALL_RAW[d].pubs*0.45)],
        chart: ALL_RAW[d].pubs,
      })),
      chartKey:"chart", chartLabel:"Publications", chartMax:30,
      chartColor: T.accent,
    },
    {
      id:"aca_grants",
      name:"Grant Portfolio Overview",
      vizType:"bar",
      icon:BarChartIcon,
      columns:["Department","Active Grants","Total Corpus (₹L)","Utilised (₹L)"],
      getData:(depts) => depts.map(d => ({
        dept: d,
        vals: [
          d,
          ALL_RAW[d].grants,
          `₹${(ALL_RAW[d].grants*35).toFixed(0)}L`,
          `₹${(ALL_RAW[d].grants*24).toFixed(0)}L`,
        ],
        chart: ALL_RAW[d].grants,
      })),
      chartKey:"chart", chartLabel:"Active Grants", chartMax:5,
      chartColor: T.success,
    },
    {
      id:"aca_pbas",
      name:"PBAS Submission Status",
      vizType:"table",
      icon:TableView,
      columns:["Department","Total Faculty","Submitted","Verified","Pending"],
      getData:(depts) => depts.map(d => {
        const total = ALL_RAW[d].faculty;
        const submitted = Math.round(total*0.78);
        const verified  = Math.round(total*0.55);
        return {
          dept: d,
          vals: [d, total, submitted, verified, total-submitted],
          chart: Math.round((submitted/total)*100),
        };
      }),
      chartKey:"chart", chartLabel:"Submission %", chartMax:100,
      chartColor: T.purple,
    },
  ],
  Compliance: [
    {
      id:"comp_policy",
      name:"Policy Compliance Rate",
      vizType:"bar",
      icon:BarChartIcon,
      columns:["Department","Compliance %","Fully Compliant","Non-Compliant"],
      getData:(depts) => depts.map(d => ({
        dept: d,
        vals: [
          d,
          `${ALL_RAW[d].compliance}%`,
          Math.round(ALL_RAW[d].faculty*(ALL_RAW[d].compliance/100)),
          Math.round(ALL_RAW[d].faculty*(1-ALL_RAW[d].compliance/100)),
        ],
        chart: ALL_RAW[d].compliance,
      })),
      chartKey:"chart", chartLabel:"Compliance %", chartMax:100,
      chartColor: T.success,
    },
    {
      id:"comp_bond",
      name:"Service Bond Status",
      vizType:"table",
      icon:TableView,
      columns:["Department","Total Faculty","Bond Active","Bond Expired","Bond Exempt"],
      getData:(depts) => depts.map(d => {
        const total = ALL_RAW[d].faculty;
        return {
          dept: d,
          vals: [
            d, total,
            Math.round(total*0.45),
            Math.round(total*0.15),
            Math.round(total*0.40),
          ],
          chart: Math.round(total*0.45),
        };
      }),
      chartKey:"chart", chartLabel:"Bond Active", chartMax:25,
      chartColor: T.warning,
    },
    {
      id:"comp_asset",
      name:"Asset Verification Status",
      vizType:"table",
      icon:TableView,
      columns:["Department","Assets Assigned","Verified","Unverified","Discrepancies"],
      getData:(depts) => depts.map(d => {
        const assets = ALL_RAW[d].faculty * 3;
        return {
          dept: d,
          vals: [
            d, assets,
            Math.round(assets*0.82),
            Math.round(assets*0.14),
            Math.round(assets*0.04),
          ],
          chart: Math.round((assets*0.82/assets)*100),
        };
      }),
      chartKey:"chart", chartLabel:"Verified %", chartMax:100,
      chartColor: T.amber,
    },
  ],
};

const CAT_META = {
  HR:         { color:T.accent,   bg:T.accentLight,  Icon:Assessment     },
  Financial:  { color:T.success,  bg:T.successLight, Icon:AccountBalance  },
  Academic:   { color:T.purple,   bg:T.purpleLight,  Icon:School         },
  Compliance: { color:T.warning,  bg:T.warningLight, Icon:Gavel           },
};

/* ─────────────────────────────────────────
   PRIMITIVE COMPONENTS
───────────────────────────────────────── */
const SCard = ({ children, sx={}, ...p }) => (
  <Box sx={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:"14px", ...sx }} {...p}>
    {children}
  </Box>
);

const SLabel = ({ children, sx={} }) => (
  <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem", fontWeight:700,
    letterSpacing:"0.08em", textTransform:"uppercase", color:T.textMute, mb:0.5, ...sx }}>
    {children}
  </Typography>
);

const TH = ({ children, align, sx={} }) => (
  <TableCell align={align} sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.68rem",
    letterSpacing:"0.06em", textTransform:"uppercase", color:T.textMute,
    borderBottom:`1px solid ${T.border}`, py:1.5, bgcolor:"#F9FAFB",
    whiteSpace:"nowrap", ...sx }}>
    {children}
  </TableCell>
);

const TD = ({ children, sx={}, align }) => (
  <TableCell align={align} sx={{ fontFamily:fBody, fontSize:"0.8rem", color:T.textSub,
    borderBottom:`1px solid ${T.border}`, py:1.6, ...sx }}>
    {children}
  </TableCell>
);

const DInput = (props) => (
  <TextField size="small" fullWidth {...props} sx={{
    "& .MuiOutlinedInput-root":{ borderRadius:"8px", fontFamily:fBody, fontSize:"0.82rem",
      bgcolor:T.surface,
      "& fieldset":{ borderColor:T.border },
      "&.Mui-focused fieldset":{ borderColor:T.accent } },
    "& .MuiInputLabel-root.Mui-focused":{ color:T.accent },
    ...props.sx
  }} />
);

/* ── SVG Bar Chart ── */
const SVGBarChart = ({ data, color, labelKey="dept", valueKey="chart", maxVal, chartLabel }) => {
  if (!data || data.length === 0) return null;
  const W   = 480;
  const H   = 180;
  const PAD = { top:16, right:16, bottom:40, left:44 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top  - PAD.bottom;
  const barW   = Math.max(18, Math.floor(chartW / data.length) - 10);
  const step   = chartW / data.length;

  return (
    <Box sx={{ width:"100%", overflowX:"auto" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", maxHeight:200, display:"block" }}>
        {/* Y-axis grid */}
        {[0,25,50,75,100].filter(v => v <= maxVal || v === 0).map(v => {
          const y = PAD.top + chartH - (v / maxVal) * chartH;
          return (
            <g key={v}>
              <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                stroke={T.border} strokeWidth="1" strokeDasharray="4 3" />
              <text x={PAD.left - 6} y={y + 4} textAnchor="end"
                fontSize="9" fill={T.textMute} fontFamily={fMono}>
                {v}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((row, i) => {
          const val  = typeof row[valueKey] === "number" ? row[valueKey] : 0;
          const pct  = Math.min(val / maxVal, 1);
          const bH   = pct * chartH;
          const x    = PAD.left + i * step + (step - barW) / 2;
          const y    = PAD.top  + chartH - bH;
          const dept = row[labelKey] || row.dept || "";
          return (
            <g key={i}>
              {/* Bar bg */}
              <rect x={x} y={PAD.top} width={barW} height={chartH}
                rx="4" fill={T.border} opacity="0.35" />
              {/* Bar fill */}
              <rect x={x} y={y} width={barW} height={bH}
                rx="4" fill={color} opacity="0.9" />
              {/* Value label on top */}
              <text x={x + barW / 2} y={Math.max(y - 4, PAD.top + 10)}
                textAnchor="middle" fontSize="9" fill={color}
                fontFamily={fMono} fontWeight="700">
                {typeof val === "number" ? (val % 1 === 0 ? val : val.toFixed(1)) : val}
              </text>
              {/* X label */}
              <text x={x + barW / 2} y={H - PAD.bottom + 14}
                textAnchor="middle" fontSize="8" fill={T.textSub}
                fontFamily={fBody}>
                {dept.length > 6 ? dept.slice(0,5)+"…" : dept}
              </text>
            </g>
          );
        })}

        {/* Axis line */}
        <line x1={PAD.left} y1={PAD.top + chartH}
          x2={W - PAD.right} y2={PAD.top + chartH}
          stroke={T.border} strokeWidth="1.5" />
        <line x1={PAD.left} y1={PAD.top}
          x2={PAD.left} y2={PAD.top + chartH}
          stroke={T.border} strokeWidth="1.5" />

        {/* Chart label */}
        <text x={PAD.left - 28} y={PAD.top + chartH / 2}
          textAnchor="middle" fontSize="8" fill={T.textMute}
          fontFamily={fBody}
          transform={`rotate(-90, ${PAD.left - 28}, ${PAD.top + chartH / 2})`}>
          {chartLabel}
        </text>
      </svg>
    </Box>
  );
};

/* ── Mini horizontal bar for table rows ── */
const MiniBar = ({ value, max, color }) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Box sx={{ flex:1, height:5, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
        <Box sx={{ height:"100%", width:`${pct}%`, borderRadius:99,
          bgcolor:color, transition:"width .8s ease" }} />
      </Box>
    </Box>
  );
};

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const ReportsView = () => {
  const [category,   setCategory]   = useState("HR");
  const [reportId,   setReportId]   = useState("");
  const [depts,      setDepts]      = useState([...DEPARTMENTS]);
  const [dateFrom,   setDateFrom]   = useState("");
  const [dateTo,     setDateTo]     = useState("");
  const [desgn,      setDesgn]      = useState("All");
  const [generated,  setGenerated]  = useState(false);
  const [snack,      setSnack]      = useState({ open:false, msg:"", severity:"success" });

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  /* Selected report definition */
  const report = useMemo(() =>
    (REPORTS[category] || []).find(r => r.id === reportId) || null,
    [category, reportId]
  );

  /* Filtered + computed preview rows */
  const previewRows = useMemo(() => {
    if (!report || !generated) return [];
    const activeDepts = depts.length > 0 ? depts : DEPARTMENTS;
    return report.getData(activeDepts);
  }, [report, generated, depts]);

  const handleGenerate = () => {
    if (!reportId) { toast("Please select a report.", "error"); return; }
    setGenerated(true);
    toast(`${report.name} generated for ${depts.length || "all"} department(s).`);
  };

  const handleReset = () => {
    setGenerated(false);
    setReportId("");
    setDepts([...DEPARTMENTS]);
    setDateFrom("");
    setDateTo("");
    setDesgn("All");
  };

  const handleExport = (format) => {
    if (!generated) { toast("Generate a report first.", "error"); return; }
    toast(`Exporting ${report?.name} as ${format}…`);
  };

  /* Switch category → clear selection + regenerate flag */
  const switchCategory = (cat) => {
    setCategory(cat);
    setReportId("");
    setGenerated(false);
  };

  const catMeta = CAT_META[category];

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ══ Header ══ */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start"
        mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Report Generation Engine
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Build, filter, preview, and export institutional reports across all domains.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2.5} alignItems="flex-start">

        {/* ══════════════════════════
            LEFT: SELECTOR + FILTERS
        ══════════════════════════ */}
        <Grid item xs={12} md={4}>
          <SCard sx={{ p:2.5, position:"sticky", top:24 }} className="fu">

            {/* Step 1 — Category */}
            <SLabel sx={{ mb:1 }}>1 · Report Category</SLabel>
            <Grid container spacing={1} mb={2.5}>
              {Object.keys(REPORTS).map(cat => {
                const m = CAT_META[cat];
                const active = category === cat;
                return (
                  <Grid item xs={6} key={cat}>
                    <Box onClick={() => switchCategory(cat)}
                      className="cat-btn"
                      sx={{
                        display:"flex", alignItems:"center", gap:1,
                        px:1.3, py:1, borderRadius:"9px", cursor:"pointer",
                        border:`1.5px solid ${active ? m.color : T.border}`,
                        bgcolor: active ? m.bg : "transparent",
                        transition:"all .15s",
                        "&:hover":{ borderColor:m.color, bgcolor:m.bg }
                      }}>
                      <Box sx={{ p:0.55, borderRadius:"6px",
                        bgcolor: active ? m.color : T.border,
                        color: active ? "#fff" : T.textMute }}>
                        <m.Icon sx={{ fontSize:13 }} />
                      </Box>
                      <Typography sx={{ fontFamily:fBody, fontWeight: active ? 700 : 600,
                        fontSize:"0.76rem", color: active ? m.color : T.textSub }}>
                        {cat}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            {/* Step 2 — Report */}
            <SLabel sx={{ mb:0.8 }}>2 · Select Report</SLabel>
            <Stack spacing={0} mb={2.5}
              sx={{ border:`1px solid ${T.border}`, borderRadius:"9px", overflow:"hidden" }}>
              {(REPORTS[category] || []).map((rep, i) => {
                const active = reportId === rep.id;
                const isLast = i === REPORTS[category].length - 1;
                const Icon = rep.icon;
                return (
                  <Box key={rep.id}
                    onClick={() => { setReportId(rep.id); setGenerated(false); }}
                    sx={{
                      display:"flex", alignItems:"center", gap:1.2,
                      px:1.5, py:1.2, cursor:"pointer",
                      borderBottom: isLast ? "none" : `1px solid ${T.border}`,
                      bgcolor: active ? catMeta.bg : "transparent",
                      transition:"background .12s",
                      "&:hover":{ bgcolor: catMeta.bg }
                    }}>
                    <Box sx={{ p:0.55, borderRadius:"6px",
                      bgcolor: active ? catMeta.color : "#F1F5F9",
                      color:   active ? "#fff"         : T.textMute, flexShrink:0 }}>
                      <Icon sx={{ fontSize:12 }} />
                    </Box>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem",
                      fontWeight: active ? 700 : 500,
                      color: active ? catMeta.color : T.textSub, flex:1, lineHeight:1.4 }}>
                      {rep.name}
                    </Typography>
                    {active && <CheckCircle sx={{ fontSize:14, color:catMeta.color }} />}
                  </Box>
                );
              })}
            </Stack>

            {/* Step 3 — Filters */}
            <SLabel sx={{ mb:1 }}>3 · Apply Filters</SLabel>
            <Stack spacing={1.8}>

              {/* Departments multi-select */}
              <FormControl size="small" fullWidth sx={{
                "& .MuiOutlinedInput-root":{ borderRadius:"8px", fontFamily:fBody, fontSize:"0.8rem",
                  "& fieldset":{ borderColor:T.border },
                  "&.Mui-focused fieldset":{ borderColor:T.accent } },
                "& .MuiInputLabel-root.Mui-focused":{ color:T.accent }
              }}>
                <InputLabel sx={{ fontFamily:fBody, fontSize:"0.8rem" }}>Departments</InputLabel>
                <Select
                  multiple value={depts}
                  onChange={e => { setDepts(typeof e.target.value==="string" ? e.target.value.split(",") : e.target.value); setGenerated(false); }}
                  input={<OutlinedInput label="Departments" />}
                  renderValue={sel => sel.length === DEPARTMENTS.length ? "All Departments" : sel.join(", ")}
                >
                  {DEPARTMENTS.map(d => (
                    <MenuItem key={d} value={d} sx={{ fontFamily:fBody, fontSize:"0.8rem" }}>
                      <Checkbox checked={depts.includes(d)} size="small"
                        sx={{ "&.Mui-checked":{ color:T.accent }, p:0.5, mr:0.5 }} />
                      <ListItemText primary={d} primaryTypographyProps={{ fontFamily:fBody, fontSize:"0.8rem" }} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Date range */}
              <Box>
                <SLabel sx={{ mb:0.7 }}>Date Range</SLabel>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <DInput type="date" label="From" value={dateFrom}
                      onChange={e => { setDateFrom(e.target.value); setGenerated(false); }}
                      InputLabelProps={{ shrink:true }} />
                  </Grid>
                  <Grid item xs={6}>
                    <DInput type="date" label="To" value={dateTo}
                      onChange={e => { setDateTo(e.target.value); setGenerated(false); }}
                      InputLabelProps={{ shrink:true }} />
                  </Grid>
                </Grid>
              </Box>

              {/* Designation */}
              <Box>
                <SLabel sx={{ mb:0.7 }}>Designation</SLabel>
                <DInput select value={desgn}
                  onChange={e => { setDesgn(e.target.value); setGenerated(false); }}>
                  {DESIGNATIONS.map(d => (
                    <MenuItem key={d} value={d} sx={{ fontFamily:fBody, fontSize:"0.82rem" }}>{d}</MenuItem>
                  ))}
                </DInput>
              </Box>
            </Stack>

            <Divider sx={{ borderColor:T.border, my:2.5 }} />

            {/* Buttons */}
            <Stack spacing={1}>
              <Button variant="contained" fullWidth size="large"
                startIcon={<Assessment sx={{fontSize:17}} />}
                disabled={!reportId}
                onClick={handleGenerate}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.85rem",
                  textTransform:"none", borderRadius:"9px", py:1.2,
                  bgcolor: catMeta.color, boxShadow:"none",
                  "&:hover":{ bgcolor:catMeta.color, filter:"brightness(0.92)", boxShadow:"none" },
                  "&.Mui-disabled":{ bgcolor:"#F1F5F9", color:T.textMute } }}>
                Generate Report
              </Button>
              {generated && (
                <Button variant="outlined" fullWidth size="small"
                  startIcon={<Refresh sx={{fontSize:15}} />}
                  onClick={handleReset}
                  sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem",
                    textTransform:"none", borderRadius:"8px",
                    borderColor:T.border, color:T.textSub,
                    "&:hover":{ borderColor:T.danger, color:T.danger } }}>
                  Reset &amp; Clear
                </Button>
              )}
            </Stack>
          </SCard>
        </Grid>

        {/* ══════════════════════════
            RIGHT: PREVIEW + EXPORT
        ══════════════════════════ */}
        <Grid item xs={12} md={8}>
          <SCard sx={{ overflow:"hidden", minHeight:520, display:"flex", flexDirection:"column" }} className="fu1">

            {/* Preview toolbar */}
            <Box sx={{ px:2.5, py:1.8, borderBottom:`1px solid ${T.border}`,
              bgcolor:"#FAFBFD", display:"flex", justifyContent:"space-between",
              alignItems:"center", flexWrap:"wrap", gap:1 }}>
              <Box>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.88rem", color: generated ? T.text : T.textMute }}>
                  {generated && report ? report.name : "Preview Area"}
                </Typography>
                {generated && (
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute, mt:0.2 }}>
                    Depts: {depts.join(", ")} &nbsp;·&nbsp;
                    {dateFrom && dateTo ? `${dateFrom} → ${dateTo}` : "All dates"} &nbsp;·&nbsp;
                    {desgn}
                  </Typography>
                )}
              </Box>
              <Box display="flex" gap={1}>
                {[
                  { label:"PDF",   Icon:PictureAsPdf, fmt:"PDF"   },
                  { label:"Excel", Icon:TableView,    fmt:"Excel"  },
                  { label:"CSV",   Icon:Download,     fmt:"CSV"    },
                ].map(e => (
                  <Button key={e.fmt} size="small" variant="outlined"
                    startIcon={<e.Icon sx={{fontSize:14}} />}
                    onClick={() => handleExport(e.fmt)}
                    disabled={!generated}
                    sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.72rem",
                      textTransform:"none", borderRadius:"7px",
                      borderColor:T.border, color: generated ? T.textSub : T.textMute,
                      "&:hover":{ borderColor:catMeta.color, color:catMeta.color } }}>
                    {e.label}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Content area */}
            <Box sx={{ p:3, flex:1 }}>

              {/* ── Empty state ── */}
              {!generated && (
                <Box sx={{ height:"100%", minHeight:400, display:"flex",
                  flexDirection:"column", alignItems:"center",
                  justifyContent:"center", color:T.textMute }} className="fu">
                  <Box sx={{ p:3, borderRadius:"50%", bgcolor:"#F1F5F9", mb:2.5 }}>
                    <FilterAlt sx={{ fontSize:48, color:T.textMute, opacity:0.5 }} />
                  </Box>
                  <Typography sx={{ fontFamily:fBody, fontWeight:700,
                    fontSize:"0.9rem", color:T.textMute, mb:0.5 }}>
                    No Report Generated
                  </Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem",
                    color:T.textMute, textAlign:"center", maxWidth:300 }}>
                    Select a report category and type on the left, apply filters, then click "Generate Report" to see a live preview here.
                  </Typography>
                </Box>
              )}

              {/* ── Generated preview ── */}
              {generated && report && (
                <Box className="fu">
                  {/* ── Filter summary chips ── */}
                  <Box display="flex" gap={1} flexWrap="wrap" mb={2.5}>
                    {[
                      { label:`Category: ${category}`,   color:catMeta.color, bg:catMeta.bg },
                      { label:`Report: ${report.name.length>28?report.name.slice(0,26)+"…":report.name}`, color:catMeta.color, bg:catMeta.bg },
                      { label:`${depts.length} Dept${depts.length!==1?"s":""}`, color:T.accent, bg:T.accentLight },
                      ...(dateFrom && dateTo ? [{ label:`${dateFrom} → ${dateTo}`, color:T.textSub, bg:"#F1F5F9" }] : []),
                      ...(desgn !== "All"   ? [{ label:`Desgn: ${desgn}`,            color:T.purple, bg:T.purpleLight }] : []),
                    ].map((c,i) => (
                      <Box key={i} sx={{ px:1.2, py:0.35, borderRadius:"99px",
                        bgcolor:c.bg, border:`1px solid ${c.color}25` }}>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                          fontWeight:700, color:c.color }}>{c.label}</Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* ── SVG Bar Chart ── */}
                  {report.vizType === "bar" && (
                    <SCard sx={{ p:2.5, mb:2.5 }}>
                      <Box display="flex" justifyContent="space-between"
                        alignItems="center" mb={1.5}>
                        <Typography sx={{ fontFamily:fHead, fontWeight:700,
                          fontSize:"0.82rem", color:T.text }}>
                          {report.chartLabel} — Visual Overview
                        </Typography>
                        <Box sx={{ px:1, py:0.25, borderRadius:"6px",
                          bgcolor:catMeta.bg }}>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.67rem",
                            fontWeight:700, color:catMeta.color }}>
                            {previewRows.length} depts
                          </Typography>
                        </Box>
                      </Box>
                      <SVGBarChart
                        data={previewRows}
                        color={report.chartColor}
                        labelKey="dept"
                        valueKey="chart"
                        maxVal={report.chartMax}
                        chartLabel={report.chartLabel}
                      />
                    </SCard>
                  )}

                  {/* ── Data Table ── */}
                  <SCard sx={{ overflow:"hidden" }}>
                    <Box sx={{ px:2, py:1.5, borderBottom:`1px solid ${T.border}`,
                      bgcolor:"#FAFBFD", display:"flex", justifyContent:"space-between",
                      alignItems:"center" }}>
                      <Typography sx={{ fontFamily:fBody, fontWeight:700,
                        fontSize:"0.8rem", color:T.text }}>
                        Detailed Data Table
                      </Typography>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.7rem", color:T.textMute }}>
                        {previewRows.length} rows
                      </Typography>
                    </Box>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {report.columns.map((col,i) => (
                            <TH key={i}>{col}</TH>
                          ))}
                          <TH>Bar</TH>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {previewRows.map((row, i) => (
                          <TableRow key={i} className="row-h">
                            {row.vals.map((v, j) => (
                              <TD key={j} sx={j===0 ? { fontWeight:700, color:T.text } : {}}>
                                <Typography sx={{
                                  fontFamily: j===0 ? fBody : typeof v==="number" ? fMono : fBody,
                                  fontSize:"0.8rem",
                                  color: j===0 ? T.text : T.textSub,
                                  fontWeight: j===0 ? 700 : 400
                                }}>
                                  {v}
                                </Typography>
                              </TD>
                            ))}
                            <TD sx={{ minWidth:100 }}>
                              <MiniBar
                                value={typeof row.chart === "number" ? row.chart : 0}
                                max={report.chartMax}
                                color={report.chartColor}
                              />
                            </TD>
                          </TableRow>
                        ))}
                        {previewRows.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={report.columns.length + 1}
                              sx={{ textAlign:"center", py:4,
                                fontFamily:fBody, color:T.textMute }}>
                              No data matches the current filter selection.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>

                    {/* Table footer summary */}
                    {previewRows.length > 0 && (
                      <Box sx={{ px:2.5, py:1.8, borderTop:`1px solid ${T.border}`,
                        bgcolor:"#FAFBFD", display:"flex", gap:3, flexWrap:"wrap" }}>
                        <Box>
                          <SLabel sx={{ mb:0.2 }}>Total Rows</SLabel>
                          <Typography sx={{ fontFamily:fMono, fontWeight:700,
                            fontSize:"0.88rem", color:catMeta.color }}>
                            {previewRows.length}
                          </Typography>
                        </Box>
                        <Box>
                          <SLabel sx={{ mb:0.2 }}>Avg. {report.chartLabel}</SLabel>
                          <Typography sx={{ fontFamily:fMono, fontWeight:700,
                            fontSize:"0.88rem", color:catMeta.color }}>
                            {previewRows.length > 0
                              ? (previewRows.reduce((a,r) => a + (typeof r.chart==="number"?r.chart:0), 0) / previewRows.length).toFixed(1)
                              : "—"}
                          </Typography>
                        </Box>
                        <Box>
                          <SLabel sx={{ mb:0.2 }}>Max {report.chartLabel}</SLabel>
                          <Typography sx={{ fontFamily:fMono, fontWeight:700,
                            fontSize:"0.88rem", color:catMeta.color }}>
                            {previewRows.length > 0
                              ? Math.max(...previewRows.map(r => typeof r.chart==="number"?r.chart:0))
                              : "—"}
                          </Typography>
                        </Box>
                        <Box sx={{ ml:"auto" }}>
                          <SLabel sx={{ mb:0.2 }}>Generated</SLabel>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.75rem", color:T.textMute }}>
                            {new Date().toLocaleString("en-IN", { dateStyle:"medium", timeStyle:"short" })}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </SCard>
                </Box>
              )}
            </Box>
          </SCard>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3200}
        onClose={() => setSnack(s => ({ ...s, open:false }))}
        anchorOrigin={{ vertical:"bottom", horizontal:"center" }}>
        <Alert severity={snack.severity}
          sx={{ borderRadius:"10px", fontFamily:fBody, fontWeight:600 }}
          onClose={() => setSnack(s => ({ ...s, open:false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportsView;