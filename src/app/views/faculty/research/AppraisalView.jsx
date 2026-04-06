import React, { useState, useRef } from 'react';
import {
  Box, Grid, Typography, Button, TextField, Table, TableHead,
  TableBody, TableRow, TableCell, Stack, Avatar, Divider,
  Snackbar, Alert
} from "@mui/material";
import {
  Assessment, UploadFile, VerifiedUser, TrendingUp, School,
  GroupWork, CheckCircle, ChevronLeft, ChevronRight, Warning, HourglassEmpty,
  Description, AttachFile, CloudUpload, ArrowForward,
  Science, Groups, WorkspacePremium, Article
} from '@mui/icons-material';

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
  info:         "#0EA5E9",
  infoLight:    "#F0F9FF",
  gold:         "#D97706",
  goldLight:    "#FEF3C7",
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
    @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
    @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    .fu  { animation: fadeUp 0.28s ease both; }
    .fu1 { animation: fadeUp 0.28s .07s ease both; }
    .fu2 { animation: fadeUp 0.28s .14s ease both; }
    .fu3 { animation: fadeUp 0.28s .21s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background .13s; }
    .card-h { transition:box-shadow .16s,transform .16s; }
    .card-h:hover { box-shadow:0 4px 20px rgba(99,102,241,.12); transform:translateY(-2px); }
    .step-dot-active { animation:pulse 2s infinite; }
  `}</style>
);

/* ─────────────────────────────────────────
   INITIAL STATE
───────────────────────────────────────── */
const INIT_CAT1 = {
  lectures:    { count:120, rate:0.5  },   // points = count × rate, capped
  practicals:  { count:60,  rate:0.25 },
  evaluation:  { count:250, rate:0.04 },
  mentoring:   { count:18,  rate:0.5  },
};

const INIT_CAT2 = [
  { id:"nss",      label:"NSS / NCC Activities",                 score:10 },
  { id:"clubs",    label:"Student Clubs Guided",                 score:8  },
  { id:"visits",   label:"Industrial Visits Organised",          score:5  },
  { id:"conf",     label:"Conferences / Workshops Attended",     score:12 },
  { id:"fdp",      label:"FDPs Attended (≥1 Week)",              score:15 },
  { id:"admin",    label:"Admin Responsibilities (HOD/Warden)",  score:10 },
];

const INIT_CAT3 = [
  { id:"r1", type:"Research Papers (Scopus/WoS)", qty:3,  unit:25, editable:true  },
  { id:"r2", type:"Books Authored (International)",qty:0, unit:30, editable:true  },
  { id:"r3", type:"Book Chapters",               qty:2,  unit:10, editable:true  },
  { id:"r4", type:"Ph.D. Guidance (Awarded)",     qty:1,  unit:30, editable:true  },
  { id:"r5", type:"Major Projects (>₹30L)",       qty:1,  unit:20, editable:true  },
  { id:"r6", type:"Consultancy Projects",         qty:2,  unit:10, editable:true  },
  { id:"r7", type:"Patents Filed / Granted",      qty:1,  unit:20, editable:true  },
  { id:"r8", type:"Awards / Fellowships",         qty:2,  unit:15, editable:true  },
];

const INIT_DOCS = [
  { id:1, category:"Cat-I",   title:"Time Table AY 2023-24",            status:"Verified" },
  { id:2, category:"Cat-I",   title:"Exam Duty Certificate — Nov 2023", status:"Verified" },
  { id:3, category:"Cat-II",  title:"FDP Completion Certificate",        status:"Verified" },
  { id:4, category:"Cat-III", title:"IEEE Publication Proof",            status:"Pending"  },
  { id:5, category:"Cat-III", title:"Grant Sanction Letter — DST",       status:"Verified" },
];

const CAT1_MIN = 75;
const CAT3_MAX = 400;
const APPRAISAL_YEARS = ["2023-24","2022-23","2021-22"];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const capCat1Score = (count, rate, cap = 50) =>
  Math.min(Math.round(count * rate), cap);

const calc1Total = (cat1) =>
  capCat1Score(cat1.lectures.count,   cat1.lectures.rate,   50) +
  capCat1Score(cat1.practicals.count, cat1.practicals.rate, 25) +
  capCat1Score(cat1.evaluation.count, cat1.evaluation.rate, 10) +
  capCat1Score(cat1.mentoring.count,  cat1.mentoring.rate,  15);

const calc2Total = (cat2) => cat2.reduce((s, c) => s + Number(c.score), 0);

const calc3Total = (cat3) =>
  Math.min(cat3.reduce((s, r) => s + Number(r.qty) * Number(r.unit), 0), CAT3_MAX);

/* ─────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────── */
const SCard = ({ children, sx={}, hover=false, ...p }) => (
  <Box className={hover?"card-h":""}
    sx={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:"14px", ...sx }}
    {...p}>
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
  <TableCell align={align} sx={{ fontFamily:fBody, fontSize:"0.81rem", color:T.textSub,
    borderBottom:`1px solid ${T.border}`, py:1.7, ...sx }}>
    {children}
  </TableCell>
);

const ScoreInput = ({ value, onChange, max=999 }) => (
  <TextField type="number" size="small" value={value} onChange={onChange}
    inputProps={{ min:0, max, style:{ textAlign:"center", fontFamily:fMono,
      fontWeight:700, fontSize:"0.82rem", color:T.accent, padding:"4px 6px" } }}
    sx={{ width:72,
      "& .MuiOutlinedInput-root":{ borderRadius:"8px",
        "& fieldset":{ borderColor:T.border },
        "&.Mui-focused fieldset":{ borderColor:T.accent } } }}
  />
);

const ProgBar = ({ value, max, color=T.accent }) => {
  const pct = Math.min(100, (value / max) * 100);
  const c = pct >= 100 ? T.success : pct >= 75 ? color : T.warning;
  return (
    <Box sx={{ height:8, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
      <Box sx={{ height:"100%", width:`${pct}%`, borderRadius:99, bgcolor:c,
        transition:"width 0.9s ease" }} />
    </Box>
  );
};

/* ─────────────────────────────────────────
   CUSTOM STEPPER
───────────────────────────────────────── */
const STEPS = [
  { label:"Teaching & Learning",  sub:"Category I",  Icon:School,          color:T.accent  },
  { label:"Professional Dev.",    sub:"Category II", Icon:GroupWork,        color:T.success },
  { label:"Research & Output",    sub:"Category III",Icon:TrendingUp,       color:T.purple  },
  { label:"Evidence & Submit",    sub:"Step 4",      Icon:VerifiedUser,     color:T.gold    },
];

const AppraisalStepper = ({ active, onStep }) => (
  <Box display="flex" alignItems="center" justifyContent="center">
    {STEPS.map((s, i) => {
      const done   = i < active;
      const isAct  = i === active;
      const dotCol = done ? T.success : isAct ? s.color : T.border;
      const txtCol = done ? T.success : isAct ? s.color : T.textMute;
      return (
        <Box key={i} display="flex" alignItems="center">
          <Box sx={{ display:"flex", flexDirection:"column", alignItems:"center",
            cursor: done ? "pointer" : "default", minWidth:90 }}
            onClick={() => done && onStep(i)}>
            <Box sx={{ width:38, height:38, borderRadius:"50%",
              bgcolor: done ? T.success : isAct ? s.color : "#F1F5F9",
              border:`2.5px solid ${dotCol}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow: isAct ? `0 0 0 4px ${s.color}22` : "none",
              transition:"all .22s" }}>
              {done ? (
                <CheckCircle sx={{ fontSize:18, color:"#fff" }} />
              ) : (
                <s.Icon sx={{ fontSize:16,
                  color: isAct ? "#fff" : T.textMute }} />
              )}
            </Box>
            <Typography sx={{ fontFamily:fBody, fontWeight: isAct ? 700 : 500,
              fontSize:"0.72rem", color:txtCol, mt:0.6,
              textAlign:"center", lineHeight:1.2 }}>{s.label}</Typography>
            <Typography sx={{ fontFamily:fBody, fontSize:"0.62rem",
              color:T.textMute, textAlign:"center" }}>{s.sub}</Typography>
          </Box>
          {i < STEPS.length - 1 && (
            <Box sx={{ width:60, height:2, mx:0.5, mb:2.5, borderRadius:99,
              bgcolor: done ? T.success : T.border, transition:"background .3s" }} />
          )}
        </Box>
      );
    })}
  </Box>
);

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const AppraisalView = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [year,       setYear]       = useState(APPRAISAL_YEARS[0]);
  const [cat1,       setCat1]       = useState(INIT_CAT1);
  const [cat2,       setCat2]       = useState(INIT_CAT2);
  const [cat3,       setCat3]       = useState(INIT_CAT3);
  const [documents,  setDocuments]  = useState(INIT_DOCS);
  const [submitted,  setSubmitted]  = useState(false);
  const [snack,      setSnack]      = useState({ open:false, msg:"", severity:"success" });
  const fileRef = useRef();

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  /* Live score computations */
  const score1 = calc1Total(cat1);
  const score2 = calc2Total(cat2);
  const score3 = calc3Total(cat3);
  const total  = score1 + score2 + score3;
  const REQUIRED = 300;
  const eligible = total >= REQUIRED;

  /* Cat-1 row config */
  const cat1Rows = [
    { key:"lectures",   label:"Lectures / Tutorials (hours)",      rate:"×0.5", cap:50  },
    { key:"practicals", label:"Practical / Field Work (hours)",     rate:"×0.25",cap:25  },
    { key:"evaluation", label:"Evaluation Duties (answer scripts)", rate:"×0.04",cap:10  },
    { key:"mentoring",  label:"Students Mentored (count)",          rate:"×0.5", cap:15  },
  ];

  /* Cat-1 input change */
  const handleCat1 = (key, val) =>
    setCat1(p => ({ ...p, [key]:{ ...p[key], count:Math.max(0, Number(val)) } }));

  /* Cat-2 score change */
  const handleCat2 = (id, val) =>
    setCat2(p => p.map(c => c.id === id ? { ...c, score:Math.max(0, Number(val)) } : c));

  /* Cat-3 qty change */
  const handleCat3 = (id, val) =>
    setCat3(p => p.map(r => r.id === id ? { ...r, qty:Math.max(0, Number(val)) } : r));

  /* Upload doc */
  const handleUpload = (e) => {
    if (e.target.files?.length) {
      const f   = e.target.files[0];
      const id  = Math.max(...documents.map(d => d.id), 0) + 1;
      const cat = activeStep === 0 ? "Cat-I" : activeStep === 1 ? "Cat-II" : "Cat-III";
      setDocuments(p => [...p, { id, category:cat, title:f.name, status:"Pending" }]);
      toast("Document uploaded. Pending admin verification.");
    }
  };

  /* Final submit */
  const handleFinalSubmit = () => {
    setSubmitted(true);
    toast("Self Appraisal submitted for HOD Review. Reference: PBAS-2024-CS-0412");
  };

  /* ─── Score ring (SVG) ─── */
  const ScoreRing = ({ score, max, size=88, color=T.accent, label }) => {
    const r = size / 2 - 7;
    const circ = 2 * Math.PI * r;
    const pct  = Math.min(1, score / max);
    const dash = pct * circ;
    return (
      <Box sx={{ position:"relative", width:size, height:size }}>
        <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r}
            fill="none" stroke={T.border} strokeWidth={7} />
          <circle cx={size/2} cy={size/2} r={r}
            fill="none" stroke={color} strokeWidth={7}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition:"stroke-dasharray 1s ease" }} />
        </svg>
        <Box sx={{ position:"absolute", inset:0, display:"flex",
          flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <Typography sx={{ fontFamily:fMono, fontWeight:700,
            fontSize:"1rem", color, lineHeight:1 }}>{score}</Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.56rem",
            color:T.textMute }}>{label}</Typography>
        </Box>
      </Box>
    );
  };

  /* ─── Render ─── */
  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start"
        mb={3} flexWrap="wrap" gap={2} className="fu">
        <Box>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700,
            letterSpacing:"0.1em", textTransform:"uppercase", color:T.textMute, mb:0.3 }}>
            Faculty Portal · Appraisal
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Annual Performance Appraisal (PBAS)
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Dr. Sarah Smith &nbsp;·&nbsp; Department of Computer Science
          </Typography>
        </Box>

        {/* Year selector */}
        <Box display="flex" gap={0.6} flexWrap="wrap" pt={0.5}>
          {APPRAISAL_YEARS.map(y => (
            <Box key={y} onClick={() => setYear(y)}
              sx={{ px:1.5, py:0.55, borderRadius:"8px", cursor:"pointer",
                fontFamily:fMono, fontWeight:700, fontSize:"0.74rem",
                border:`1.5px solid ${y===year ? T.accent : T.border}`,
                bgcolor: y===year ? T.accentLight : T.surface,
                color: y===year ? T.accent : T.textMute,
                transition:"all .14s" }}>
              {y}
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Score Dashboard ── */}
      <Grid container spacing={2.5} mb={3} className="fu1">

        {/* Total API score card */}
        <Grid item xs={12} md={4}>
          <SCard sx={{ p:2.8, height:"100%",
            background: eligible
              ? `linear-gradient(135deg, ${T.success} 0%, #059669 100%)`
              : `linear-gradient(135deg, ${T.accent} 0%, #4F46E5 100%)` }}>
            <SLabel sx={{ color:"rgba(255,255,255,.7)", mb:1 }}>Total API Score</SLabel>
            <Typography sx={{ fontFamily:fMono, fontWeight:700,
              fontSize:"3rem", color:"#fff", lineHeight:1, mb:0.5 }}>
              {total}
            </Typography>
            <Typography sx={{ fontFamily:fBody, fontSize:"0.8rem",
              color:"rgba(255,255,255,.85)" }}>
              {eligible
                ? "✓ Eligible for promotion consideration"
                : `${REQUIRED - total} points needed for eligibility`}
            </Typography>
            <Divider sx={{ borderColor:"rgba(255,255,255,.2)", my:1.8 }} />
            <Box display="flex" gap={2}>
              {[
                { label:"Required", val:REQUIRED, col:"rgba(255,255,255,.6)" },
                { label:"Shortfall",
                  val: eligible ? "—" : REQUIRED - total,
                  col: eligible ? "rgba(255,255,255,.6)" : "#FCA5A5" },
              ].map(s => (
                <Box key={s.label}>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.65rem",
                    color:"rgba(255,255,255,.6)" }}>{s.label}</Typography>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700,
                    fontSize:"0.9rem", color:s.col }}>{s.val}</Typography>
                </Box>
              ))}
            </Box>
          </SCard>
        </Grid>

        {/* Category breakdown */}
        <Grid item xs={12} md={8}>
          <SCard sx={{ p:2.8, height:"100%" }}>
            <Typography sx={{ fontFamily:fHead, fontWeight:700,
              fontSize:"0.9rem", color:T.text, mb:2 }}>Category Breakdown</Typography>

            <Grid container spacing={2} alignItems="center">

              {/* Score rings */}
              <Grid item>
                <Box display="flex" gap={2.5}>
                  <Box sx={{ textAlign:"center" }}>
                    <ScoreRing score={score1} max={100} color={T.accent}   label="/ 100" size={84} />
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                      color:T.textMute, mt:0.6 }}>Teaching</Typography>
                  </Box>
                  <Box sx={{ textAlign:"center" }}>
                    <ScoreRing score={score2} max={100} color={T.success}  label="/ 100" size={84} />
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                      color:T.textMute, mt:0.6 }}>Co-Curricular</Typography>
                  </Box>
                  <Box sx={{ textAlign:"center" }}>
                    <ScoreRing score={score3} max={400} color={T.purple}   label="/ 400" size={84} />
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                      color:T.textMute, mt:0.6 }}>Research</Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Progress bars */}
              <Grid item xs>
                <Stack spacing={1.8}>
                  {[
                    { label:"Category I — Teaching & Learning",  score:score1, max:100, color:T.accent,  min:75 },
                    { label:"Category II — Co-Curricular & Dev.",score:score2, max:100, color:T.success, min:50 },
                    { label:"Category III — Research Output",     score:score3, max:400, color:T.purple,  min:75 },
                  ].map(c => (
                    <Box key={c.label}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem",
                          color:T.textSub }}>{c.label}</Typography>
                        <Box display="flex" gap={1} alignItems="center">
                          <Typography sx={{ fontFamily:fMono, fontWeight:700,
                            fontSize:"0.75rem", color:c.color }}>{c.score}</Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                            color:T.textMute }}>/ {c.max}</Typography>
                          {c.score < c.min && (
                            <Warning sx={{ fontSize:12, color:T.warning }} />
                          )}
                        </Box>
                      </Box>
                      <ProgBar value={c.score} max={c.max} color={c.color} />
                    </Box>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </SCard>
        </Grid>
      </Grid>

      {/* ── Wizard Card ── */}
      <SCard sx={{ overflow:"hidden" }} className="fu2">

        {/* Stepper header */}
        <Box sx={{ p:3, bgcolor:"#FAFBFD", borderBottom:`1px solid ${T.border}` }}>
          <AppraisalStepper active={activeStep} onStep={setActiveStep} />
        </Box>

        {/* Step content */}
        <Box sx={{ p:3 }}>

          {/* ══════════════════════════════════════
              STEP 0 — Category I: Teaching
          ══════════════════════════════════════ */}
          {activeStep === 0 && (
            <Grid container spacing={3} className="fu">
              <Grid item xs={12} md={8}>
                <Box display="flex" alignItems="center" gap={1.2} mb={2}>
                  <Box sx={{ p:0.8, borderRadius:"8px",
                    bgcolor:T.accentLight, color:T.accent }}>
                    <School sx={{ fontSize:16 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.9rem", color:T.text }}>Teaching &amp; Evaluation</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem",
                      color:T.textMute }}>Enter actual counts — scores computed automatically</Typography>
                  </Box>
                </Box>

                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Activity</TH>
                      <TH align="center">Rate</TH>
                      <TH align="center">Count</TH>
                      <TH align="center">Cap</TH>
                      <TH align="center">Score</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cat1Rows.map(row => {
                      const pts = capCat1Score(cat1[row.key].count, cat1[row.key].rate, row.cap);
                      const atCap = pts >= row.cap;
                      return (
                        <TableRow key={row.key} className="row-h">
                          <TD>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700,
                              fontSize:"0.8rem", color:T.text }}>{row.label}</Typography>
                          </TD>
                          <TD align="center">
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem",
                              color:T.textMute }}>{row.rate}</Typography>
                          </TD>
                          <TD align="center">
                            <ScoreInput value={cat1[row.key].count}
                              onChange={e => handleCat1(row.key, e.target.value)} />
                          </TD>
                          <TD align="center">
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem",
                              color:T.textMute }}>{row.cap}</Typography>
                          </TD>
                          <TD align="center">
                            <Box sx={{ px:1.3, py:0.35, borderRadius:"99px",
                              bgcolor: atCap ? T.successLight : T.accentLight,
                              display:"inline-block" }}>
                              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                fontSize:"0.8rem",
                                color: atCap ? T.success : T.accent }}>{pts}</Typography>
                            </Box>
                          </TD>
                        </TableRow>
                      );
                    })}
                    {/* Total row */}
                    <TableRow sx={{ bgcolor:"#FAFBFD" }}>
                      <TableCell colSpan={4}
                        sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.82rem",
                          color:T.text, borderBottom:"none", py:1.5 }}>
                        Category I Total
                      </TableCell>
                      <TD align="center">
                        <Box sx={{ px:1.5, py:0.5, borderRadius:"99px",
                          bgcolor: score1 >= CAT1_MIN ? T.successLight : T.warningLight }}>
                          <Typography sx={{ fontFamily:fMono, fontWeight:700,
                            fontSize:"0.88rem",
                            color: score1 >= CAT1_MIN ? T.success : T.warning }}>
                            {score1} / 100
                          </Typography>
                        </Box>
                      </TD>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>

              {/* Right panel */}
              <Grid item xs={12} md={4}>
                <Box sx={{ p:1.8, borderRadius:"10px", mb:2,
                  bgcolor:T.infoLight, border:`1px solid ${T.info}20`,
                  display:"flex", gap:0.8, alignItems:"flex-start" }}>
                  <Warning sx={{ fontSize:14, color:T.info, flexShrink:0, mt:0.1 }} />
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                    color:T.textSub, lineHeight:1.65 }}>
                    Minimum <Box component="span" sx={{ fontWeight:700 }}>75 points</Box> required
                    in Category I for a positive appraisal outcome.
                  </Typography>
                </Box>

                <SCard sx={{ p:2.2, bgcolor:"#FAFBFD" }}>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.82rem", color:T.text, mb:1.5 }}>Evidence Upload</Typography>
                  <Stack spacing={1}>
                    {[
                      "Attach Time Table (PDF)",
                      "Attach Exam Duty Certificate",
                      "Student Feedback Summary",
                    ].map(label => (
                      <Button key={label} variant="outlined" size="small"
                        startIcon={<UploadFile sx={{ fontSize:13 }} />}
                        onClick={() => fileRef.current?.click()}
                        sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.73rem",
                          textTransform:"none", borderRadius:"8px", justifyContent:"flex-start",
                          borderColor:T.border, color:T.textSub,
                          "&:hover":{ borderColor:T.accent, color:T.accent } }}>
                        {label}
                      </Button>
                    ))}
                  </Stack>
                </SCard>
              </Grid>
            </Grid>
          )}

          {/* ══════════════════════════════════════
              STEP 1 — Category II: Co-Curricular
          ══════════════════════════════════════ */}
          {activeStep === 1 && (
            <Box className="fu">
              <Box display="flex" alignItems="center" gap={1.2} mb={2.5}>
                <Box sx={{ p:0.8, borderRadius:"8px",
                  bgcolor:T.successLight, color:T.success }}>
                  <GroupWork sx={{ fontSize:16 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.9rem", color:T.text }}>Co-Curricular &amp; Extension Activities</Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem",
                    color:T.textMute }}>Adjust scores to match your actual contributions</Typography>
                </Box>
              </Box>

              <Grid container spacing={2} mb={3}>
                {cat2.map(item => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <SCard sx={{ p:2.3 }}>
                      <Typography sx={{ fontFamily:fBody, fontWeight:700,
                        fontSize:"0.8rem", color:T.text, mb:1.5,
                        minHeight:36, lineHeight:1.4 }}>{item.label}</Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                          color:T.textMute }}>Score</Typography>
                        <ScoreInput value={item.score} max={50}
                          onChange={e => handleCat2(item.id, e.target.value)} />
                      </Box>
                    </SCard>
                  </Grid>
                ))}
              </Grid>

              {/* Total */}
              <SCard sx={{ p:2, bgcolor:"#FAFBFD" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontFamily:fBody, fontWeight:700,
                    fontSize:"0.82rem", color:T.text }}>Category II Total</Typography>
                  <Box sx={{ px:1.5, py:0.5, borderRadius:"99px",
                    bgcolor: score2 >= 50 ? T.successLight : T.warningLight }}>
                    <Typography sx={{ fontFamily:fMono, fontWeight:700,
                      fontSize:"0.88rem",
                      color: score2 >= 50 ? T.success : T.warning }}>
                      {score2} / 100
                    </Typography>
                  </Box>
                </Box>
              </SCard>
            </Box>
          )}

          {/* ══════════════════════════════════════
              STEP 2 — Category III: Research
          ══════════════════════════════════════ */}
          {activeStep === 2 && (
            <Box className="fu">
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2.5}>
                <Box display="flex" alignItems="center" gap={1.2}>
                  <Box sx={{ p:0.8, borderRadius:"8px",
                    bgcolor:T.purpleLight, color:T.purple }}>
                    <TrendingUp sx={{ fontSize:16 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.9rem", color:T.text }}>Research Contributions</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem",
                      color:T.textMute }}>Enter quantities — scores calculated per UGC norms</Typography>
                  </Box>
                </Box>
                <Button size="small" variant="outlined"
                  startIcon={<ArrowForward sx={{ fontSize:13 }} />}
                  onClick={() => toast("Syncing from Publications module…")}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.72rem",
                    textTransform:"none", borderRadius:"8px",
                    borderColor:T.purple, color:T.purple,
                    "&:hover":{ bgcolor:T.purpleLight } }}>
                  Import from Publications
                </Button>
              </Box>

              <Table>
                <TableHead>
                  <TableRow>
                    <TH>Contribution Type</TH>
                    <TH align="center">Qty</TH>
                    <TH align="center">Unit Points</TH>
                    <TH align="center">Total Score</TH>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cat3.map(row => {
                    const pts = Number(row.qty) * Number(row.unit);
                    return (
                      <TableRow key={row.id} className="row-h">
                        <TD>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box sx={{ p:0.5, borderRadius:"5px",
                              bgcolor:T.purpleLight, color:T.purple }}>
                              <Article sx={{ fontSize:12 }} />
                            </Box>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700,
                              fontSize:"0.8rem", color:T.text }}>{row.type}</Typography>
                          </Box>
                        </TD>
                        <TD align="center">
                          <ScoreInput value={row.qty}
                            onChange={e => handleCat3(row.id, e.target.value)} />
                        </TD>
                        <TD align="center">
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem",
                            color:T.textMute }}>{row.unit}</Typography>
                        </TD>
                        <TD align="center">
                          <Box sx={{ px:1.2, py:0.3, borderRadius:"99px",
                            bgcolor: pts > 0 ? T.purpleLight : "#F1F5F9",
                            display:"inline-block" }}>
                            <Typography sx={{ fontFamily:fMono, fontWeight:700,
                              fontSize:"0.8rem",
                              color: pts > 0 ? T.purple : T.textMute }}>
                              {pts}
                            </Typography>
                          </Box>
                        </TD>
                      </TableRow>
                    );
                  })}
                  {/* Total row */}
                  <TableRow sx={{ bgcolor:"#FAFBFD" }}>
                    <TableCell colSpan={3}
                      sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.82rem",
                        color:T.text, borderBottom:"none", py:1.5 }}>
                      Category III Total (capped at {CAT3_MAX})
                    </TableCell>
                    <TD align="center">
                      <Box sx={{ px:1.5, py:0.5, borderRadius:"99px",
                        bgcolor:T.purpleLight }}>
                        <Typography sx={{ fontFamily:fMono, fontWeight:700,
                          fontSize:"0.88rem", color:T.purple }}>
                          {score3} / {CAT3_MAX}
                        </Typography>
                      </Box>
                    </TD>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          )}

          {/* ══════════════════════════════════════
              STEP 3 — Evidence & Submit
          ══════════════════════════════════════ */}
          {activeStep === 3 && (
            <Grid container spacing={3} className="fu">
              <Grid item xs={12} md={8}>
                <Box display="flex" justifyContent="space-between"
                  alignItems="center" mb={2}>
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.9rem", color:T.text }}>Uploaded Evidences</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem",
                      color:T.textMute, mt:0.2 }}>
                      {documents.filter(d => d.status==="Verified").length} verified ·
                      {" "}{documents.filter(d => d.status==="Pending").length} pending review
                    </Typography>
                  </Box>
                  <Button size="small" variant="outlined"
                    startIcon={<CloudUpload sx={{ fontSize:13 }} />}
                    onClick={() => fileRef.current?.click()}
                    sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.73rem",
                      textTransform:"none", borderRadius:"8px",
                      borderColor:T.accent, color:T.accent,
                      "&:hover":{ bgcolor:T.accentLight } }}>
                    Upload Document
                  </Button>
                </Box>

                <Box sx={{ p:1.8, borderRadius:"9px", mb:2.5,
                  bgcolor:T.warningLight, border:`1px solid ${T.warning}20`,
                  display:"flex", gap:0.8, alignItems:"flex-start" }}>
                  <Warning sx={{ fontSize:14, color:T.warning, flexShrink:0, mt:0.1 }} />
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                    color:T.textSub, lineHeight:1.65 }}>
                    All claims above 10 points must be supported by documentary evidence.
                    Unverified claims will be withheld pending review.
                  </Typography>
                </Box>

                <Stack spacing={1.2}>
                  {documents.map(doc => {
                    const catMeta = {
                      "Cat-I":   { color:T.accent,  bg:T.accentLight  },
                      "Cat-II":  { color:T.success, bg:T.successLight },
                      "Cat-III": { color:T.purple,  bg:T.purpleLight  },
                    }[doc.category] || { color:T.textMute, bg:"#F1F5F9" };
                    return (
                      <SCard key={doc.id} sx={{ p:2,
                        display:"flex", justifyContent:"space-between",
                        alignItems:"center", gap:2 }}>
                        <Box display="flex" alignItems="center" sx={{ gap:1.5 }}>
                          <Box sx={{ p:0.6, borderRadius:"7px",
                            bgcolor:catMeta.bg, color:catMeta.color, flexShrink:0 }}>
                            <Description sx={{ fontSize:14 }} />
                          </Box>
                          <Box>
                            <Box sx={{ px:0.9, py:0.15, borderRadius:"5px",
                              bgcolor:catMeta.bg, display:"inline-block", mb:0.3 }}>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                fontSize:"0.62rem", color:catMeta.color }}>
                                {doc.category}
                              </Typography>
                            </Box>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700,
                              fontSize:"0.8rem", color:T.text, display:"block" }}>
                              {doc.title}
                            </Typography>
                          </Box>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.6}
                          sx={{ px:1.1, py:0.35, borderRadius:"99px", flexShrink:0,
                            bgcolor: doc.status==="Verified" ? T.successLight : T.warningLight }}>
                          {doc.status==="Verified"
                            ? <VerifiedUser sx={{ fontSize:12, color:T.success }} />
                            : <HourglassEmpty sx={{ fontSize:12, color:T.warning }} />
                          }
                          <Typography sx={{ fontFamily:fBody, fontWeight:700,
                            fontSize:"0.69rem",
                            color: doc.status==="Verified" ? T.success : T.warning }}>
                            {doc.status}
                          </Typography>
                        </Box>
                      </SCard>
                    );
                  })}
                </Stack>
              </Grid>

              {/* Score summary sidebar */}
              <Grid item xs={12} md={4}>
                <SCard sx={{ p:2.5, mb:2 }}>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.88rem", color:T.text, mb:2 }}>Final Score Summary</Typography>
                  <Stack spacing={1.2}>
                    {[
                      { label:"Category I — Teaching",    score:score1, max:100, color:T.accent  },
                      { label:"Category II — Co-Curr.",   score:score2, max:100, color:T.success },
                      { label:"Category III — Research",  score:score3, max:400, color:T.purple  },
                    ].map(c => (
                      <Box key={c.label} display="flex" justifyContent="space-between"
                        sx={{ py:0.8, borderBottom:`1px solid ${T.border}` }}>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                          color:T.textSub }}>{c.label}</Typography>
                        <Typography sx={{ fontFamily:fMono, fontWeight:700,
                          fontSize:"0.8rem", color:c.color }}>{c.score}</Typography>
                      </Box>
                    ))}
                    <Box display="flex" justifyContent="space-between" sx={{ pt:0.5 }}>
                      <Typography sx={{ fontFamily:fBody, fontWeight:700,
                        fontSize:"0.82rem", color:T.text }}>Total API Score</Typography>
                      <Typography sx={{ fontFamily:fMono, fontWeight:700,
                        fontSize:"0.96rem",
                        color: eligible ? T.success : T.accent }}>{total}</Typography>
                    </Box>
                  </Stack>
                </SCard>

                {submitted ? (
                  <SCard sx={{ p:2.5, bgcolor:T.successLight,
                    border:`1.5px solid ${T.success}30`, textAlign:"center" }}>
                    <CheckCircle sx={{ fontSize:36, color:T.success,
                      display:"block", mx:"auto", mb:1 }} />
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.88rem", color:T.success, mb:0.5 }}>
                      Submitted!
                    </Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                      color:T.textSub }}>
                      Reference: PBAS-2024-CS-0412<br/>
                      Awaiting HOD review.
                    </Typography>
                  </SCard>
                ) : (
                  <Button fullWidth variant="contained"
                    startIcon={<CheckCircle sx={{ fontSize:15 }} />}
                    onClick={handleFinalSubmit}
                    sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.84rem",
                      textTransform:"none", borderRadius:"9px", py:1.3,
                      bgcolor:T.success, boxShadow:"none",
                      "&:hover":{ bgcolor:"#059669", boxShadow:"none" } }}>
                    Final Submit for HOD Review
                  </Button>
                )}
              </Grid>
            </Grid>
          )}
        </Box>

        {/* ── Wizard footer ── */}
        <Box sx={{ p:2.5, borderTop:`1px solid ${T.border}`,
          bgcolor:"#FAFBFD", display:"flex",
          justifyContent:"space-between", alignItems:"center" }}>
          <Button size="small" variant="outlined"
            disabled={activeStep === 0}
            startIcon={<ChevronLeft sx={{ fontSize:16 }} />}
            onClick={() => setActiveStep(p => p - 1)}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              borderColor:T.border, color:T.textSub,
              "&:hover":{ borderColor:T.accent, color:T.accent },
              "&.Mui-disabled":{ borderColor:T.border, color:T.textMute } }}>
            Back
          </Button>

          {/* Step indicator */}
          <Box display="flex" gap={0.7}>
            {STEPS.map((_, i) => (
              <Box key={i} sx={{ width: i===activeStep ? 20 : 7, height:7,
                borderRadius:99, transition:"all .22s",
                bgcolor: i < activeStep ? T.success
                        : i === activeStep ? T.accent : T.border }} />
            ))}
          </Box>

          {activeStep < 3 ? (
            <Button size="small" variant="contained"
              endIcon={<ChevronRight sx={{ fontSize:16 }} />}
              onClick={() => setActiveStep(p => p + 1)}
              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
                textTransform:"none", borderRadius:"8px",
                bgcolor:T.accent, boxShadow:"none",
                "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
              Next Step
            </Button>
          ) : (
            <Button size="small" variant="contained"
              disabled={submitted}
              startIcon={<CheckCircle sx={{ fontSize:14 }} />}
              onClick={handleFinalSubmit}
              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
                textTransform:"none", borderRadius:"8px",
                bgcolor:T.success, boxShadow:"none",
                "&:hover":{ bgcolor:"#059669", boxShadow:"none" },
                "&.Mui-disabled":{ bgcolor:T.border } }}>
              {submitted ? "Submitted" : "Final Submit"}
            </Button>
          )}
        </Box>
      </SCard>

      {/* Hidden file input */}
      <input type="file" ref={fileRef} style={{ display:"none" }} accept=".pdf,.jpg,.png"
        onChange={handleUpload} />

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3500}
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

export default AppraisalView;