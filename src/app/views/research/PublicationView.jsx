import React, { useState, useRef } from 'react';
import {
  Box, Grid, Typography, Button, Tabs, Tab, Table, TableBody,
  TableCell, TableHead, TableRow, Stack, IconButton, TextField,
  Tooltip, Snackbar, Alert, Divider, Avatar
} from "@mui/material";
import {
  Description, Timeline, Group, FactCheck, CloudUpload,
  Link, Warning, VerifiedUser, Science, School, Edit,
  Add, CheckCircle, Close, Search, TrendingUp, OpenInNew,
  FileDownload, Refresh, ArrowForward, Article
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
    @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.35} }
    .fu  { animation: fadeUp 0.28s ease both; }
    .fu1 { animation: fadeUp 0.28s .07s ease both; }
    .fu2 { animation: fadeUp 0.28s .14s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background .13s; }
    .card-h { transition:box-shadow .16s,transform .16s; }
    .card-h:hover { box-shadow:0 4px 20px rgba(99,102,241,.11); transform:translateY(-2px); }
  `}</style>
);

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const METRICS = {
  hIndex:           14,
  i10Index:         22,
  citations:        487,
  researchGateScore:38.6,
  citationGrowth: [
    { year:"2019", count:42  },
    { year:"2020", count:78  },
    { year:"2021", count:134 },
    { year:"2022", count:198 },
    { year:"2023", count:311 },
    { year:"2024", count:487 },
  ],
};

const PUBLICATIONS_INIT = [
  { id:1, title:"Deep Learning-Based Intrusion Detection in IoT Networks", journal:"IEEE Transactions on Information Forensics",         year:2024, citations:38,  scopus:true,  ugcCare:true,  impactFactor:6.8, proofUploaded:true  },
  { id:2, title:"Federated Learning for Privacy-Preserving Medical Imaging",journal:"Nature Machine Intelligence",                       year:2023, citations:91,  scopus:true,  ugcCare:false, impactFactor:25.9,proofUploaded:true  },
  { id:3, title:"Graph Neural Networks for Supply Chain Optimisation",      journal:"Expert Systems with Applications",                  year:2023, citations:55,  scopus:true,  ugcCare:true,  impactFactor:8.7, proofUploaded:true  },
  { id:4, title:"Explainable AI in Clinical Decision Support Systems",      journal:"Artificial Intelligence in Medicine",               year:2022, citations:112, scopus:true,  ugcCare:true,  impactFactor:7.0, proofUploaded:true  },
  { id:5, title:"Quantum-Classical Hybrid Algorithms for Optimisation",     journal:"Quantum Information Processing",                    year:2022, citations:29,  scopus:true,  ugcCare:false, impactFactor:2.5, proofUploaded:false },
  { id:6, title:"Transformer Models for Code Vulnerability Detection",      journal:"Journal of Systems and Software",                   year:2021, citations:64,  scopus:true,  ugcCare:true,  impactFactor:3.9, proofUploaded:true  },
];

const PLANNER_INIT = [
  { id:1, title:"LLM-Assisted Peer Review Bias Detection",   targetJournal:"ACM Computing Surveys",       deadline:"15 Feb 2025", stage:"Writing",       probability:"75%", notes:"" },
  { id:2, title:"Multi-Agent RL for Smart Grid Management",  targetJournal:"IEEE Transactions on AI",     deadline:"01 Apr 2025", stage:"Under Review",  probability:"60%", notes:"" },
  { id:3, title:"Zero-Shot Cross-Lingual NLP for Indic Languages", targetJournal:"Computational Linguistics", deadline:"30 Jun 2025", stage:"Data Collection",probability:"50%", notes:"" },
];

const COAUTHORS = [
  { id:1, name:"Dr. Anjali Menon",    affil:"IIT Bombay — Dept. of CSE",          collaborations:8,  orcid:"0000-0001-2345-6789", color:T.accent  },
  { id:2, name:"Prof. John Mitchell", affil:"Stanford University — AI Lab",        collaborations:5,  orcid:"0000-0002-3456-7890", color:T.success },
  { id:3, name:"Dr. Kavita Sharma",   affil:"TIFR Mumbai — Theoretical CS",        collaborations:4,  orcid:"0000-0003-4567-8901", color:T.purple  },
  { id:4, name:"Dr. Reza Mohamadi",   affil:"ETH Zürich — ML Research Group",     collaborations:3,  orcid:"0000-0004-5678-9012", color:T.gold    },
  { id:5, name:"Ms. Priya Nair",      affil:"IISER Pune — PhD Scholar",            collaborations:6,  orcid:"0000-0005-6789-0123", color:T.info    },
  { id:6, name:"Dr. Sanjay Gupta",    affil:"NIT Trichy — Dept. of ECE",           collaborations:2,  orcid:"0000-0006-7890-1234", color:T.danger  },
];

const KNOWN_JOURNALS = {
  "ieee":       { safe:true,  message:"IEEE Journals are indexed in Scopus, Web of Science, and are globally recognised." },
  "elsevier":   { safe:true,  message:"Elsevier journals are peer-reviewed and indexed in Scopus and ScienceDirect." },
  "springer":   { safe:true,  message:"Springer journals are reputable and indexed in major databases." },
  "nature":     { safe:true,  message:"Nature Portfolio journals are among the highest impact peer-reviewed publications." },
  "taylor":     { safe:true,  message:"Taylor & Francis journals are reputable and indexed in Web of Science." },
  "predatory":  { safe:false, message:"This journal appears in Beall's List of predatory publishers. Avoid submission." },
  "scirp":      { safe:false, message:"SCIRP is listed as a potential predatory publisher. Verify independently." },
  "omics":      { safe:false, message:"OMICS International is listed on Beall's List. Do not submit without verification." },
};

const STAGES = ["Data Collection","Writing","Under Review","Accepted","Published"];

const STAGE_META = {
  "Data Collection": { color:T.info,    bg:T.infoLight    },
  "Writing":         { color:T.accent,  bg:T.accentLight  },
  "Under Review":    { color:T.warning, bg:T.warningLight },
  "Accepted":        { color:T.success, bg:T.successLight },
  "Published":       { color:T.purple,  bg:T.purpleLight  },
};

const initials = (s) => (s||"?").split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();
const fmt      = (n) => Number(n||0).toLocaleString("en-IN");

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

const TH = ({ children, align }) => (
  <TableCell align={align} sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.68rem",
    letterSpacing:"0.06em", textTransform:"uppercase", color:T.textMute,
    borderBottom:`1px solid ${T.border}`, py:1.5, bgcolor:"#F9FAFB", whiteSpace:"nowrap" }}>
    {children}
  </TableCell>
);

const TD = ({ children, sx={}, align }) => (
  <TableCell align={align} sx={{ fontFamily:fBody, fontSize:"0.81rem", color:T.textSub,
    borderBottom:`1px solid ${T.border}`, py:1.9, ...sx }}>
    {children}
  </TableCell>
);

const DInput = ({ sx={}, ...props }) => (
  <TextField size="small" fullWidth {...props} sx={{
    "& .MuiOutlinedInput-root":{ borderRadius:"9px", fontFamily:fBody, fontSize:"0.83rem",
      bgcolor:T.surface,
      "& fieldset":{ borderColor:T.border },
      "&.Mui-focused fieldset":{ borderColor:T.accent } },
    "& .MuiInputLabel-root.Mui-focused":{ color:T.accent },
    ...sx
  }} />
);

const StagePill = ({ stage }) => {
  const m = STAGE_META[stage] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box sx={{ px:1.2, py:0.38, borderRadius:"99px", bgcolor:m.bg, display:"inline-block" }}>
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:m.color }}>
        {stage}
      </Typography>
    </Box>
  );
};

/* ─────────────────────────────────────────
   CITATION AREA CHART  (pure SVG)
───────────────────────────────────────── */
const CitationChart = ({ data }) => {
  const W = 600, H = 180;
  const PAD = { l:40, r:20, t:16, b:28 };
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;
  const maxVal = Math.max(...data.map(d => d.count)) * 1.1;
  const n = data.length;
  const xs = data.map((_, i) => PAD.l + (i / (n - 1)) * cW);
  const ys = data.map(d => PAD.t + cH - (d.count / maxVal) * cH);
  const linePts = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  const areaPts = `${xs[0]},${PAD.t + cH} ${linePts} ${xs[n-1]},${PAD.t + cH}`;
  const yLines = [0, 100, 200, 300, 400, 500].filter(v => v <= maxVal * 1.05);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:"block", overflow:"visible" }}>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={T.accent} stopOpacity={0.22} />
          <stop offset="100%" stopColor={T.accent} stopOpacity={0.01} />
        </linearGradient>
      </defs>

      {yLines.map(v => {
        const y = PAD.t + cH - (v / maxVal) * cH;
        return (
          <g key={v}>
            <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y}
              stroke={T.border} strokeDasharray="3 3" strokeWidth={1} />
            <text x={PAD.l - 6} y={y + 4} textAnchor="end"
              fontSize={9} fill={T.textMute} fontFamily={fBody}>{v}</text>
          </g>
        );
      })}

      <polygon points={areaPts} fill="url(#cg)" />
      <polyline points={linePts} fill="none" stroke={T.accent} strokeWidth={2.5}
        strokeLinejoin="round" strokeLinecap="round" />

      {data.map((d, i) => (
        <g key={d.year}>
          <circle cx={xs[i]} cy={ys[i]} r={4.5} fill={T.surface}
            stroke={T.accent} strokeWidth={2.5} />
          <text x={xs[i]} y={H - 4} textAnchor="middle"
            fontSize={10} fill={T.textMute} fontFamily={fBody}>{d.year}</text>
          <text x={xs[i]} y={ys[i] - 9} textAnchor="middle"
            fontSize={9} fill={T.accent} fontFamily={fBody} fontWeight="700">{d.count}</text>
        </g>
      ))}
    </svg>
  );
};

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const PublicationView = () => {
  const [tabIndex,     setTabIndex]     = useState(0);
  const [publications, setPublications] = useState(PUBLICATIONS_INIT);
  const [planner,      setPlanner]      = useState(PLANNER_INIT);
  const [journalCheck, setJournalCheck] = useState("");
  const [checkResult,  setCheckResult]  = useState(null);
  const [syncing,      setSyncing]      = useState(false);
  const [addPlan,      setAddPlan]      = useState(false);
  const [newPlan, setNewPlan] = useState({ title:"", targetJournal:"", deadline:"", stage:"Writing", probability:"" });
  const [snack, setSnack] = useState({ open:false, msg:"", severity:"success" });
  const fileRefs = useRef({});

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  /* ORCID sync */
  const handleOrcidSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast("ORCID sync complete. 3 new citations found.");
    }, 1800);
  };

  /* Upload proof */
  const handleUploadProof = (id) => {
    fileRefs.current[id]?.click();
  };
  const handleFileChange = (id, e) => {
    if (e.target.files?.length) {
      setPublications(p => p.map(pub => pub.id === id ? { ...pub, proofUploaded:true } : pub));
      toast("Proof uploaded and verified.");
    }
  };

  /* Predatory check */
  const handleJournalCheck = () => {
    if (!journalCheck.trim()) return;
    const key = Object.keys(KNOWN_JOURNALS).find(k => journalCheck.toLowerCase().includes(k));
    const result = key ? KNOWN_JOURNALS[key]
                       : { safe:true, message:"No predatory flags found for this journal. Always cross-check with UGC-CARE and Scopus lists." };
    setCheckResult(result);
  };

  /* Add planner item */
  const handleAddPlan = () => {
    if (!newPlan.title || !newPlan.targetJournal) {
      toast("Title and target journal are required.", "error"); return;
    }
    const id = Math.max(...planner.map(p => p.id), 0) + 1;
    setPlanner(p => [...p, { ...newPlan, id, notes:"" }]);
    setNewPlan({ title:"", targetJournal:"", deadline:"", stage:"Writing", probability:"" });
    setAddPlan(false);
    toast("Publication target added to planner.");
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
            Faculty Portal · Research
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Research &amp; Publications
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Dr. Sarah Smith &nbsp;·&nbsp; Department of Computer Science
          </Typography>
        </Box>
        <Button size="small" variant="outlined"
          disabled={syncing}
          startIcon={syncing
            ? <Refresh sx={{ fontSize:15, animation:"pulse 1s infinite" }} />
            : <Link sx={{ fontSize:15 }} />}
          onClick={handleOrcidSync}
          sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem", textTransform:"none",
            borderRadius:"8px", borderColor:T.accent, color:T.accent, mt:0.5,
            "&:hover":{ bgcolor:T.accentLight },
            "&.Mui-disabled":{ borderColor:T.border, color:T.textMute } }}>
          {syncing ? "Syncing ORCID…" : "Sync with ORCID"}
        </Button>
      </Box>

      {/* ── Impact Dashboard ── */}
      <Grid container spacing={2.5} mb={3} className="fu1">

        {/* Citation chart */}
        <Grid item xs={12} md={8}>
          <SCard sx={{ p:2.8, height:"100%" }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
              <Box>
                <SLabel>Citation Growth</SLabel>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.88rem", color:T.text }}>Annual Citation Trajectory</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.7}
                sx={{ px:1.2, py:0.4, borderRadius:"99px",
                  bgcolor:T.successLight, border:`1px solid ${T.success}20` }}>
                <TrendingUp sx={{ fontSize:13, color:T.success }} />
                <Typography sx={{ fontFamily:fBody, fontWeight:700,
                  fontSize:"0.72rem", color:T.success }}>
                  +57% YoY
                </Typography>
              </Box>
            </Box>
            <CitationChart data={METRICS.citationGrowth} />
          </SCard>
        </Grid>

        {/* Metric cards */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={1.5} sx={{ height:"100%" }}>
            {[
              { label:"h-index",        value:METRICS.hIndex,           color:T.accent,  bg:T.accentLight,  Icon:Science },
              { label:"i10-index",      value:METRICS.i10Index,         color:T.success, bg:T.successLight, Icon:CheckCircle },
              { label:"Total Citations",value:fmt(METRICS.citations),    color:T.purple,  bg:T.purpleLight,  Icon:TrendingUp },
              { label:"RG Score",       value:METRICS.researchGateScore, color:T.gold,    bg:T.goldLight,    Icon:School },
            ].map((m, i) => (
              <Grid item xs={6} key={i}>
                <SCard hover sx={{ p:2, height:"100%" }}>
                  <Box sx={{ display:"inline-flex", p:0.8, borderRadius:"9px",
                    bgcolor:m.bg, mb:0.8 }}>
                    <m.Icon sx={{ fontSize:16, color:m.color }} />
                  </Box>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700,
                    fontSize:"1.5rem", color:m.color, display:"block", lineHeight:1.1 }}>
                    {m.value}
                  </Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                    color:T.textMute, mt:0.3 }}>{m.label}</Typography>
                </SCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* ── Main Tabs ── */}
      <SCard sx={{ overflow:"hidden" }} className="fu2">
        <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
          <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} variant="scrollable"
            scrollButtons="auto" sx={{
              px:1,
              "& .MuiTabs-indicator":{ bgcolor:T.accent, height:"2.5px",
                borderRadius:"2px 2px 0 0" },
              "& .MuiTab-root":{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
                textTransform:"none", color:T.textMute, minHeight:52,
                "&.Mui-selected":{ color:T.accent } }
            }}>
            <Tab icon={<Description sx={{ fontSize:15 }} />} iconPosition="start" label="My Publications" />
            <Tab icon={<Timeline sx={{ fontSize:15 }} />}    iconPosition="start" label="Planner & Targets" />
            <Tab icon={<FactCheck sx={{ fontSize:15 }} />}   iconPosition="start" label="Predatory Checker" />
            <Tab icon={<Group sx={{ fontSize:15 }} />}       iconPosition="start" label="Co-Authors" />
          </Tabs>
        </Box>

        <Box sx={{ p:3 }}>

          {/* ══════════════════════════════════════
              TAB 0 — MY PUBLICATIONS
          ══════════════════════════════════════ */}
          {tabIndex === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.96rem", color:T.text }}>Published Works</Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                    color:T.textMute, mt:0.2 }}>
                    {publications.length} publications &nbsp;·&nbsp;
                    {publications.filter(p => p.proofUploaded).length} verified
                  </Typography>
                </Box>
                <Button size="small" variant="outlined"
                  startIcon={<FileDownload sx={{ fontSize:14 }} />}
                  onClick={() => toast("Publications list exported.")}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.73rem",
                    textTransform:"none", borderRadius:"8px",
                    borderColor:T.border, color:T.textSub,
                    "&:hover":{ borderColor:T.accent, color:T.accent } }}>
                  Export List
                </Button>
              </Box>

              <Table>
                <TableHead>
                  <TableRow>
                    <TH>Title &amp; Journal</TH>
                    <TH>Year</TH>
                    <TH>IF</TH>
                    <TH align="center">Citations</TH>
                    <TH>Indexing</TH>
                    <TH align="center">Proof</TH>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {publications.map(pub => (
                    <TableRow key={pub.id} className="row-h">

                      <TD sx={{ minWidth:280 }}>
                        <Box display="flex" alignItems="flex-start" gap={1.2}>
                          <Box sx={{ p:0.65, borderRadius:"7px",
                            bgcolor:T.accentLight, color:T.accent, flexShrink:0, mt:0.2 }}>
                            <Article sx={{ fontSize:13 }} />
                          </Box>
                          <Box>
                            <Typography sx={{ fontFamily:fBody, fontWeight:700,
                              fontSize:"0.81rem", color:T.text, lineHeight:1.4 }}>
                              {pub.title}
                            </Typography>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem",
                              color:T.textMute, mt:0.2 }}>{pub.journal}</Typography>
                          </Box>
                        </Box>
                      </TD>

                      <TD>
                        <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem",
                          color:T.textSub }}>{pub.year}</Typography>
                      </TD>

                      <TD>
                        <Typography sx={{ fontFamily:fMono, fontWeight:700,
                          fontSize:"0.78rem",
                          color: pub.impactFactor >= 10 ? T.danger
                               : pub.impactFactor >= 5  ? T.success
                               :                          T.textSub }}>
                          {pub.impactFactor}
                        </Typography>
                      </TD>

                      <TD align="center">
                        <Box sx={{ px:1.2, py:0.3, borderRadius:"99px",
                          bgcolor:T.accentLight, display:"inline-block" }}>
                          <Typography sx={{ fontFamily:fMono, fontWeight:700,
                            fontSize:"0.76rem", color:T.accent }}>{pub.citations}</Typography>
                        </Box>
                      </TD>

                      <TD>
                        <Box display="flex" gap={0.7} flexWrap="wrap">
                          {pub.scopus && (
                            <Box sx={{ px:1, py:0.2, borderRadius:"5px",
                              bgcolor:T.successLight }}>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                fontSize:"0.64rem", color:T.success }}>Scopus</Typography>
                            </Box>
                          )}
                          {pub.ugcCare && (
                            <Box sx={{ px:1, py:0.2, borderRadius:"5px",
                              bgcolor:T.accentLight }}>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                fontSize:"0.64rem", color:T.accent }}>UGC-CARE</Typography>
                            </Box>
                          )}
                        </Box>
                      </TD>

                      <TD align="center">
                        {pub.proofUploaded ? (
                          <Box display="flex" alignItems="center" gap={0.4}
                            sx={{ justifyContent:"center" }}>
                            <CheckCircle sx={{ fontSize:14, color:T.success }} />
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                              fontWeight:700, color:T.success }}>Verified</Typography>
                          </Box>
                        ) : (
                          <>
                            <input type="file" accept=".pdf"
                              ref={el => fileRefs.current[pub.id] = el}
                              style={{ display:"none" }}
                              onChange={e => handleFileChange(pub.id, e)}
                            />
                            <Button size="small" variant="outlined"
                              startIcon={<CloudUpload sx={{ fontSize:12 }} />}
                              onClick={() => handleUploadProof(pub.id)}
                              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.68rem",
                                textTransform:"none", borderRadius:"7px",
                                borderColor:T.danger, color:T.danger,
                                "&:hover":{ bgcolor:T.dangerLight } }}>
                              Upload PDF
                            </Button>
                          </>
                        )}
                      </TD>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* ══════════════════════════════════════
              TAB 1 — PLANNER & TARGETS
          ══════════════════════════════════════ */}
          {tabIndex === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Box display="flex" justifyContent="space-between"
                  alignItems="center" mb={2.5}>
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.96rem", color:T.text }}>Submission Pipeline</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                      color:T.textMute, mt:0.2 }}>
                      Track manuscripts through each stage of the publication pipeline.
                    </Typography>
                  </Box>
                </Box>

                <Stack spacing={2}>
                  {planner.map(item => (
                    <SCard key={item.id} sx={{ p:2.5,
                      borderLeft:`4px solid ${STAGE_META[item.stage]?.color || T.border}` }}>
                      <Box display="flex" justifyContent="space-between"
                        alignItems="flex-start" gap={2}>
                        <Box flex={1}>
                          <Typography sx={{ fontFamily:fHead, fontWeight:700,
                            fontSize:"0.88rem", color:T.text, mb:0.3 }}>
                            {item.title}
                          </Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem",
                            color:T.textMute }}>
                            Target: {item.targetJournal}
                          </Typography>
                          <Box display="flex" gap={2} mt={1}>
                            <Box sx={{ display:"flex", alignItems:"center", gap:0.5 }}>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                                color:T.danger, fontWeight:700 }}>Due:</Typography>
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.72rem",
                                color:T.danger }}>{item.deadline || "TBD"}</Typography>
                            </Box>
                            <Box sx={{ display:"flex", alignItems:"center", gap:0.5 }}>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                                color:T.textMute }}>Probability:</Typography>
                              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                fontSize:"0.72rem", color:T.success }}>
                                {item.probability || "—"}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign:"right", flexShrink:0 }}>
                          <StagePill stage={item.stage} />
                        </Box>
                      </Box>
                    </SCard>
                  ))}

                  {/* Add target */}
                  {!addPlan ? (
                    <Box onClick={() => setAddPlan(true)}
                      sx={{ border:`2px dashed ${T.border}`, borderRadius:"12px",
                        py:2.5, textAlign:"center", cursor:"pointer",
                        transition:"all .15s",
                        "&:hover":{ borderColor:T.accent, bgcolor:T.accentLight } }}>
                      <Add sx={{ fontSize:18, color:T.textMute }} />
                      <Typography sx={{ fontFamily:fBody, fontWeight:700,
                        fontSize:"0.8rem", color:T.textMute, mt:0.3 }}>
                        Add New Target
                      </Typography>
                    </Box>
                  ) : (
                    <SCard sx={{ p:2.5 }}>
                      <Typography sx={{ fontFamily:fHead, fontWeight:700,
                        fontSize:"0.86rem", color:T.text, mb:2 }}>New Publication Target</Typography>
                      <Grid container spacing={1.5}>
                        <Grid item xs={12}>
                          <SLabel sx={{ mb:0.6 }}>Paper Title *</SLabel>
                          <DInput value={newPlan.title}
                            onChange={e => setNewPlan(p => ({ ...p, title:e.target.value }))}
                            placeholder="Working title of the manuscript" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <SLabel sx={{ mb:0.6 }}>Target Journal *</SLabel>
                          <DInput value={newPlan.targetJournal}
                            onChange={e => setNewPlan(p => ({ ...p, targetJournal:e.target.value }))}
                            placeholder="e.g. IEEE Transactions on AI" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <SLabel sx={{ mb:0.6 }}>Stage</SLabel>
                          <DInput select value={newPlan.stage}
                            onChange={e => setNewPlan(p => ({ ...p, stage:e.target.value }))}>
                            {STAGES.map(s => (
                              <option key={s} value={s}
                                style={{ fontFamily:fBody }}>{s}</option>
                            ))}
                          </DInput>
                        </Grid>
                        <Grid item xs={6}>
                          <SLabel sx={{ mb:0.6 }}>Target Deadline</SLabel>
                          <DInput type="date" value={newPlan.deadline}
                            onChange={e => setNewPlan(p => ({ ...p, deadline:e.target.value }))} />
                        </Grid>
                        <Grid item xs={6}>
                          <SLabel sx={{ mb:0.6 }}>Acceptance Probability</SLabel>
                          <DInput value={newPlan.probability}
                            onChange={e => setNewPlan(p => ({ ...p, probability:e.target.value }))}
                            placeholder="e.g. 70%" />
                        </Grid>
                      </Grid>
                      <Box display="flex" gap={1} mt={2} justifyContent="flex-end">
                        <Button size="small" variant="outlined"
                          onClick={() => setAddPlan(false)}
                          sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem",
                            textTransform:"none", borderRadius:"8px",
                            borderColor:T.border, color:T.textSub }}>
                          Cancel
                        </Button>
                        <Button size="small" variant="contained"
                          onClick={handleAddPlan}
                          sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem",
                            textTransform:"none", borderRadius:"8px",
                            bgcolor:T.accent, boxShadow:"none",
                            "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                          Add to Planner
                        </Button>
                      </Box>
                    </SCard>
                  )}
                </Stack>
              </Grid>

              {/* Tip sidebar */}
              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <Box sx={{ p:2.2, borderRadius:"10px",
                    bgcolor:T.infoLight, border:`1px solid ${T.info}20` }}>
                    <Box display="flex" alignItems="center" sx={{ gap:0.8, mb:0.8 }}>
                      <TrendingUp sx={{ fontSize:14, color:T.info }} />
                      <Typography sx={{ fontFamily:fBody, fontWeight:700,
                        fontSize:"0.76rem", color:T.info }}>Appraisal Tip</Typography>
                    </Box>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem",
                      color:T.textSub, lineHeight:1.65 }}>
                      Target journals with <Box component="span"
                        sx={{ fontWeight:700 }}>Impact Factor &gt; 2.0</Box> for
                      your next appraisal cycle. Scopus-indexed publications carry
                      additional API score weightage.
                    </Typography>
                  </Box>

                  <SCard sx={{ p:2.2, bgcolor:"#FAFBFD" }}>
                    <SLabel sx={{ mb:1.2 }}>Stage Overview</SLabel>
                    <Stack spacing={0.8}>
                      {STAGES.map(s => {
                        const cnt = planner.filter(p => p.stage === s).length;
                        const m = STAGE_META[s] || { color:T.textMute, bg:"#F1F5F9" };
                        return (
                          <Box key={s} display="flex" justifyContent="space-between"
                            alignItems="center">
                            <Box display="flex" alignItems="center" gap={0.7}>
                              <Box sx={{ width:7, height:7, borderRadius:"50%",
                                bgcolor:m.color }} />
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.75rem",
                                color:T.textSub }}>{s}</Typography>
                            </Box>
                            <Typography sx={{ fontFamily:fMono, fontWeight:700,
                              fontSize:"0.76rem", color:m.color }}>
                              {cnt}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Stack>
                  </SCard>
                </Stack>
              </Grid>
            </Grid>
          )}

          {/* ══════════════════════════════════════
              TAB 2 — PREDATORY CHECKER
          ══════════════════════════════════════ */}
          {tabIndex === 2 && (
            <Box sx={{ maxWidth:640 }}>
              <Typography sx={{ fontFamily:fHead, fontWeight:700,
                fontSize:"0.96rem", color:T.text, mb:0.4 }}>Journal Safety Check</Typography>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.79rem",
                color:T.textMute, mb:3, lineHeight:1.7 }}>
                Verify if a journal is indexed in UGC-CARE, Scopus, or Web of Science
                before submitting your work. Avoid predatory or fraudulent publishers.
              </Typography>

              <Box display="flex" gap={1.5} mb={3}>
                <DInput value={journalCheck}
                  onChange={e => { setJournalCheck(e.target.value); setCheckResult(null); }}
                  onKeyDown={e => e.key === "Enter" && handleJournalCheck()}
                  placeholder="Enter journal name or ISSN (e.g. IEEE Transactions, 0018-9219)"
                  sx={{ "& .MuiOutlinedInput-root":{ bgcolor:"#FAFBFD" } }}
                />
                <Button variant="contained"
                  startIcon={<Search sx={{ fontSize:15 }} />}
                  onClick={handleJournalCheck}
                  disabled={!journalCheck.trim()}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
                    textTransform:"none", borderRadius:"9px", whiteSpace:"nowrap",
                    bgcolor:T.accent, boxShadow:"none", px:2.5,
                    "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" },
                    "&.Mui-disabled":{ bgcolor:T.border } }}>
                  Check Journal
                </Button>
              </Box>

              {checkResult && (
                <SCard sx={{ p:2.5, borderLeft:`4px solid ${checkResult.safe ? T.success : T.danger}` }}>
                  <Box display="flex" alignItems="flex-start" gap={1.5}>
                    {checkResult.safe ? (
                      <Box sx={{ p:0.8, borderRadius:"9px",
                        bgcolor:T.successLight, flexShrink:0 }}>
                        <VerifiedUser sx={{ fontSize:22, color:T.success }} />
                      </Box>
                    ) : (
                      <Box sx={{ p:0.8, borderRadius:"9px",
                        bgcolor:T.dangerLight, flexShrink:0 }}>
                        <Warning sx={{ fontSize:22, color:T.danger }} />
                      </Box>
                    )}
                    <Box>
                      <Typography sx={{ fontFamily:fHead, fontWeight:700,
                        fontSize:"0.88rem",
                        color: checkResult.safe ? T.success : T.danger, mb:0.5 }}>
                        {checkResult.safe ? "✓ Safe to Submit" : "⚠ Potential Risk Detected"}
                      </Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.8rem",
                        color:T.textSub, lineHeight:1.65 }}>{checkResult.message}</Typography>
                    </Box>
                  </Box>
                </SCard>
              )}

              <Divider sx={{ borderColor:T.border, my:3 }} />

              {/* Common safe publishers */}
              <SLabel sx={{ mb:1.2 }}>Trusted Publisher Reference</SLabel>
              <Grid container spacing={1.5}>
                {[
                  { name:"IEEE",       badge:"Always Safe"     },
                  { name:"Elsevier",   badge:"Scopus Indexed"  },
                  { name:"Springer",   badge:"WoS Indexed"     },
                  { name:"Nature",     badge:"High Impact"     },
                  { name:"ACM",        badge:"CS Gold Standard"},
                  { name:"Wiley",      badge:"Peer Reviewed"   },
                ].map(p => (
                  <Grid item xs={6} md={4} key={p.name}>
                    <Box sx={{ p:1.5, borderRadius:"8px",
                      bgcolor:"#F9FAFB", border:`1px solid ${T.border}`,
                      display:"flex", justifyContent:"space-between",
                      alignItems:"center" }}>
                      <Typography sx={{ fontFamily:fBody, fontWeight:700,
                        fontSize:"0.78rem", color:T.text }}>{p.name}</Typography>
                      <Box sx={{ px:0.8, py:0.18, borderRadius:"5px",
                        bgcolor:T.successLight }}>
                        <Typography sx={{ fontFamily:fBody, fontSize:"0.62rem",
                          fontWeight:700, color:T.success }}>{p.badge}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* ══════════════════════════════════════
              TAB 3 — CO-AUTHORS
          ══════════════════════════════════════ */}
          {tabIndex === 3 && (
            <Box>
              <Box mb={2.5}>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.96rem", color:T.text }}>Co-Author Network</Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                  color:T.textMute, mt:0.2 }}>
                  {COAUTHORS.length} collaborators across {new Set(COAUTHORS.map(a => a.affil.split("—")[0].trim())).size} institutions
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {COAUTHORS.map(author => (
                  <Grid item xs={12} md={6} key={author.id}>
                    <SCard hover sx={{ p:2.5 }}>
                      <Box display="flex" alignItems="center" gap={1.8}>
                        <Avatar sx={{ width:42, height:42, bgcolor:`${author.color}15`,
                          color:author.color, fontFamily:fHead,
                          fontSize:"0.72rem", fontWeight:700, border:`2px solid ${author.color}30` }}>
                          {initials(author.name)}
                        </Avatar>
                        <Box flex={1} minWidth={0}>
                          <Typography sx={{ fontFamily:fHead, fontWeight:700,
                            fontSize:"0.85rem", color:T.text }}>{author.name}</Typography>
                          <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem",
                            color:T.textMute, mt:0.15 }}>{author.affil}</Typography>
                          <Box display="flex" alignItems="center" gap={1} mt={0.8}>
                            <Box sx={{ px:0.9, py:0.2, borderRadius:"5px",
                              bgcolor:`${author.color}15` }}>
                              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                                fontSize:"0.68rem", color:author.color }}>
                                {author.collaborations} joint papers
                              </Typography>
                            </Box>
                            <Tooltip title={`ORCID: ${author.orcid}`}>
                              <Box display="flex" alignItems="center" gap={0.3}
                                sx={{ cursor:"pointer",
                                  "&:hover":{ color:T.accent } }}>
                                <Link sx={{ fontSize:12, color:T.textMute }} />
                                <Typography sx={{ fontFamily:fMono, fontSize:"0.63rem",
                                  color:T.textMute }}>ORCID</Typography>
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>
                    </SCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </SCard>

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

export default PublicationView;