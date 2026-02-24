import React, { useState } from "react";
import {
  Box, Grid, Typography, Button, Avatar, IconButton,
  Stack, Divider, Tooltip, Snackbar, Alert
} from "@mui/material";
import {
  Description, AttachMoney, AccessTime, School,
  ArrowForward, Add, EmojiEvents, Science,
  CheckCircle, NotificationsActive, CalendarMonth,
  TrendingUp, BarChart as BarChartIcon, Article,
  BeachAccess, AccountBalance, Psychology, Groups,
  ChevronRight, Circle, Event, Bolt
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
    @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
    @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    .fu  { animation: fadeUp 0.35s ease both; }
    .fu1 { animation: fadeUp 0.35s .06s ease both; }
    .fu2 { animation: fadeUp 0.35s .12s ease both; }
    .fu3 { animation: fadeUp 0.35s .18s ease both; }
    .fu4 { animation: fadeUp 0.35s .24s ease both; }
    .card-h { transition:box-shadow .2s,transform .2s; }
    .card-h:hover { box-shadow:0 8px 28px rgba(99,102,241,.13); transform:translateY(-3px); }
    .blink { animation: pulse 2s infinite; }
    .float { animation: float 3.5s ease-in-out infinite; }
    .row-h:hover { background:#F9FAFB; transition:background .15s; }
  `}</style>
);

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const CHART_DATA = {
  months: ["Jan","Feb","Mar","Apr","May","Jun"],
  lectures:  [12, 18, 14, 22, 16, 25],
  research:  [30, 35, 28, 40, 32, 45],
};

const ACTIVITY = [
  { label:"Leave Approved",           sub:"2 hrs ago",    color:T.success, Icon:CheckCircle         },
  { label:"New Policy: IT Usage",     sub:"Yesterday",    color:T.accent,  Icon:Description         },
  { label:"Grant Submission Due",     sub:"Oct 28",       color:T.warning, Icon:AccessTime           },
  { label:"PBAS Review Reminder",     sub:"Nov 01",       color:T.purple,  Icon:NotificationsActive  },
];

const SCHEDULE = [
  { time:"09:00 AM", title:"Data Structures Lecture",  venue:"Room 202",          type:"Lecture",  color:T.accent  },
  { time:"11:30 AM", title:"Research Group Meeting",   venue:"Conf. Hall A",      type:"Meeting",  color:T.purple  },
  { time:"02:00 PM", title:"Academic Council Review",  venue:"Board Room",        type:"Council",  color:T.warning },
  { time:"04:00 PM", title:"Student Project Review",   venue:"Lab 3",             type:"Review",   color:T.success },
];

const QUICK_ACTIONS = [
  { label:"Log Activity",       Icon:Add,              color:T.accent  },
  { label:"Apply Leave",        Icon:BeachAccess,       color:T.success },
  { label:"Submit Publication", Icon:Science,           color:T.purple  },
  { label:"Claim Reimbursement",Icon:AttachMoney,       color:T.warning },
  { label:"View PBAS",          Icon:BarChartIcon,      color:T.info    },
  { label:"My Schedule",        Icon:CalendarMonth,     color:T.gold    },
];

const PBAS_ITEMS = [
  { label:"Teaching",    pct:82, color:T.accent  },
  { label:"Research",    pct:67, color:T.purple  },
  { label:"Extension",   pct:55, color:T.success },
  { label:"Self Dev.",   pct:40, color:T.warning },
];

const LEAVE_BALANCES = [
  { label:"Casual Leave",    total:12, used:4,  color:T.accent  },
  { label:"Earned Leave",    total:30, used:8,  color:T.success },
  { label:"Medical Leave",   total:10, used:2,  color:T.warning },
];

/* ─────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────── */
const SCard = ({ children, sx={}, hover=false, ...p }) => (
  <Box className={hover ? "card-h" : ""}
    sx={{ background:T.surface, border:`1px solid ${T.border}`,
      borderRadius:"14px", ...sx }} {...p}>
    {children}
  </Box>
);

const SLabel = ({ children, sx={} }) => (
  <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem", fontWeight:700,
    letterSpacing:"0.08em", textTransform:"uppercase", color:T.textMute, mb:0.5, ...sx }}>
    {children}
  </Typography>
);

/* ── Pure SVG Academic Performance Chart ── */
const AcademicChart = () => {
  const W = 520, H = 220;
  const PAD = { top:20, right:20, bottom:36, left:38 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top  - PAD.bottom;

  const maxVal = 50;
  const step   = cW / (CHART_DATA.months.length - 1);

  const barW   = 18;
  const barStep = cW / CHART_DATA.months.length;

  /* Line points for research */
  const points = CHART_DATA.research.map((v,i) => {
    const x = PAD.left + i * step;
    const y = PAD.top  + cH - (v / maxVal) * cH;
    return `${x},${y}`;
  }).join(" ");

  return (
    <Box sx={{ width:"100%", overflowX:"auto" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", maxHeight:230, display:"block" }}>
        {/* Y grid */}
        {[0, 10, 20, 30, 40, 50].map(v => {
          const y = PAD.top + cH - (v/maxVal)*cH;
          return (
            <g key={v}>
              <line x1={PAD.left} y1={y} x2={W-PAD.right} y2={y}
                stroke={T.border} strokeWidth="1" strokeDasharray="4 3" />
              <text x={PAD.left-6} y={y+4} textAnchor="end"
                fontSize="8" fill={T.textMute} fontFamily={fMono}>{v}</text>
            </g>
          );
        })}

        {/* Bars — lectures */}
        {CHART_DATA.lectures.map((v,i) => {
          const x = PAD.left + i * barStep + (barStep - barW) / 2;
          const bH = (v/maxVal)*cH;
          const y  = PAD.top + cH - bH;
          return (
            <g key={i}>
              <rect x={x} y={PAD.top} width={barW} height={cH}
                rx="4" fill={T.border} opacity="0.35" />
              <rect x={x} y={y} width={barW} height={bH}
                rx="4" fill={T.accent} opacity="0.85" />
              <text x={x+barW/2} y={y-4} textAnchor="middle"
                fontSize="7.5" fill={T.accent} fontFamily={fMono} fontWeight="700">{v}</text>
              <text x={x+barW/2} y={H-PAD.bottom+14} textAnchor="middle"
                fontSize="8" fill={T.textMute} fontFamily={fBody}>
                {CHART_DATA.months[i]}
              </text>
            </g>
          );
        })}

        {/* Line — research */}
        <polyline points={points} fill="none"
          stroke={T.purple} strokeWidth="2.5" strokeLinejoin="round" />

        {/* Line dots */}
        {CHART_DATA.research.map((v,i) => {
          const x = PAD.left + i * step;
          const y = PAD.top  + cH - (v/maxVal)*cH;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill={T.surface} stroke={T.purple} strokeWidth="2" />
              <text x={x} y={y-7} textAnchor="middle"
                fontSize="7.5" fill={T.purple} fontFamily={fMono} fontWeight="700">{v}</text>
            </g>
          );
        })}

        {/* Axes */}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top+cH}
          stroke={T.border} strokeWidth="1.5" />
        <line x1={PAD.left} y1={PAD.top+cH} x2={W-PAD.right} y2={PAD.top+cH}
          stroke={T.border} strokeWidth="1.5" />

        {/* Legend */}
        <rect x={PAD.left} y={H-8} width={10} height={8} rx="2" fill={T.accent} opacity="0.85" />
        <text x={PAD.left+14} y={H-1} fontSize="8" fill={T.textSub} fontFamily={fBody}>Lectures (hrs)</text>
        <circle cx={PAD.left+100} cy={H-4} r="4" fill={T.surface} stroke={T.purple} strokeWidth="2" />
        <text x={PAD.left+108} y={H-1} fontSize="8" fill={T.textSub} fontFamily={fBody}>Research (hrs)</text>
      </svg>
    </Box>
  );
};

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const DefaultDashboard = () => {
  const [snack, setSnack] = useState({ open:false, msg:"" });
  const toast = (msg) => setSnack({ open:true, msg });
  const today = new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" });

  return (
    <Box sx={{ p:{ xs:2, md:3 }, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ══════════════════════════════════════
          WELCOME BANNER
      ══════════════════════════════════════ */}
      <Box sx={{
        borderRadius:"16px", mb:3, overflow:"hidden", position:"relative",
        background:`linear-gradient(135deg, #4338CA 0%, ${T.accent} 45%, ${T.purple} 100%)`,
        minHeight:155,
      }} className="fu">
        {/* Decorative circles */}
        {[
          { size:200, right:-50, top:-70, op:0.08 },
          { size:130, right:120, top:-40, op:0.06 },
          { size:80,  right:240, top:20,  op:0.05 },
        ].map((c,i) => (
          <Box key={i} sx={{ position:"absolute", width:c.size, height:c.size,
            borderRadius:"50%", right:c.right, top:c.top,
            bgcolor:`rgba(255,255,255,${c.op})` }} />
        ))}

        {/* Floating school icon */}
        <Box sx={{ position:"absolute", right:{ xs:12, md:48 }, top:"50%",
          transform:"translateY(-50%)", display:{ xs:"none", md:"block" } }}
          className="float">
          <School sx={{ fontSize:90, color:"rgba(255,255,255,0.12)" }} />
        </Box>

        <Box sx={{ px:{ xs:2.5, md:4 }, py:3, position:"relative", zIndex:1 }}>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between"
            gap={2} flexWrap="wrap">
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Box sx={{ width:7, height:7, borderRadius:"50%",
                  bgcolor:"#4ADE80" }} className="blink" />
                <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:600,
                  color:"rgba(255,255,255,0.7)", letterSpacing:"0.08em",
                  textTransform:"uppercase" }}>
                  {today}
                </Typography>
              </Box>
              <Typography sx={{ fontFamily:fHead, fontWeight:700,
                fontSize:{ xs:"1.3rem", md:"1.65rem" }, color:"#fff", mb:0.5 }}>
                Welcome back, Dr. Naveen! 👋
              </Typography>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.85rem",
                color:"rgba(255,255,255,0.82)", mb:2 }}>
                You have&nbsp;
                <Box component="span" sx={{ fontWeight:700, color:"#FCD34D",
                  px:0.6, py:0.1, borderRadius:"4px", bgcolor:"rgba(252,211,77,.15)" }}>
                  3 pending approvals
                </Box>
                &nbsp;and an Academic Council meeting at 2:00 PM today.
              </Typography>
              <Box display="flex" gap={1.5} flexWrap="wrap">
                <Button size="small" variant="contained"
                  startIcon={<Add sx={{fontSize:15}} />}
                  onClick={() => toast("Activity log opened.")}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.77rem",
                    textTransform:"none", borderRadius:"8px",
                    bgcolor:"rgba(255,255,255,0.2)",
                    backdropFilter:"blur(8px)",
                    boxShadow:"none", color:"#fff",
                    "&:hover":{ bgcolor:"rgba(255,255,255,0.3)", boxShadow:"none" } }}>
                  Log Activity
                </Button>
                <Button size="small" variant="outlined"
                  startIcon={<CalendarMonth sx={{fontSize:15}} />}
                  onClick={() => toast("Schedule opened.")}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.77rem",
                    textTransform:"none", borderRadius:"8px",
                    color:"#fff", borderColor:"rgba(255,255,255,0.45)",
                    "&:hover":{ bgcolor:"rgba(255,255,255,0.08)",
                      borderColor:"rgba(255,255,255,0.7)" } }}>
                  View Schedule
                </Button>
              </Box>
            </Box>

            {/* Mini alert chips */}
            <Box display="flex" flexDirection="column" gap={1} pt={{ xs:0, md:0.5 }}>
              {[
                { label:"3 Pending Approvals", color:"#FCD34D", bg:"rgba(252,211,77,.18)" },
                { label:"PBAS Deadline: Nov 30", color:"#86EFAC", bg:"rgba(134,239,172,.15)" },
              ].map(a => (
                <Box key={a.label} sx={{ px:1.3, py:0.55, borderRadius:"8px",
                  bgcolor:a.bg, backdropFilter:"blur(8px)",
                  border:`1px solid ${a.color}30` }}>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.73rem",
                    fontWeight:700, color:a.color }}>{a.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ══════════════════════════════════════
          QUICK STATS STRIP
      ══════════════════════════════════════ */}
      <Grid container spacing={2} mb={3}>
        {[
          { title:"Attendance",      value:"92%",      sub:"2 late mark(s) this month", color:T.success, Icon:AccessTime    },
          { title:"Publications",    value:"12",       sub:"+2 added this year",         color:T.purple,  Icon:Science      },
          { title:"Reimbursements",  value:"₹4,500",   sub:"Pending processing",         color:T.warning, Icon:AttachMoney  },
          { title:"Service Bond",    value:"1Y 2M",    sub:"Remaining obligation",       color:T.danger,  Icon:Description  },
        ].map((s,i) => (
          <Grid item xs={6} md={3} key={i}>
            <SCard hover sx={{ p:2.5, height:"100%" }} className={`fu${i}`}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                <Box sx={{ p:1.1, borderRadius:"10px",
                  bgcolor:`${s.color}15`, color:s.color }}>
                  <s.Icon sx={{ fontSize:20 }} />
                </Box>
                <IconButton size="small"
                  onClick={() => toast(`Viewing ${s.title} details.`)}
                  sx={{ borderRadius:"7px", width:28, height:28,
                    "&:hover":{ bgcolor:T.accentLight, color:T.accent } }}>
                  <ArrowForward sx={{ fontSize:14, color:T.textMute }} />
                </IconButton>
              </Box>
              <Typography sx={{ fontFamily:fMono, fontWeight:700,
                fontSize:"1.6rem", color:s.color, lineHeight:1.1 }}>{s.value}</Typography>
              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                fontSize:"0.78rem", color:T.text, mt:0.3 }}>{s.title}</Typography>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                color:T.textMute, mt:0.25 }}>{s.sub}</Typography>
            </SCard>
          </Grid>
        ))}
      </Grid>

      {/* ══════════════════════════════════════
          MAIN GRID — Chart + Sidebar
      ══════════════════════════════════════ */}
      <Grid container spacing={2.5} mb={2.5}>

        {/* ── Academic Performance Chart ── */}
        <Grid item xs={12} md={8}>
          <SCard sx={{ p:0, overflow:"hidden", height:"100%" }} className="fu1">
            {/* Card header */}
            <Box sx={{ px:3, py:2, borderBottom:`1px solid ${T.border}`,
              display:"flex", justifyContent:"space-between", alignItems:"center",
              bgcolor:"#FAFBFD" }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ p:0.75, borderRadius:"8px",
                  bgcolor:T.accentLight, color:T.accent }}>
                  <BarChartIcon sx={{ fontSize:16 }} />
                </Box>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.9rem", color:T.text }}>
                  Academic Performance
                </Typography>
              </Box>
              <Box display="flex" gap={1} alignItems="center">
                {[
                  { dot:T.accent,  label:"Lectures" },
                  { dot:T.purple,  label:"Research"  },
                ].map(l => (
                  <Box key={l.label} display="flex" alignItems="center" gap={0.5}>
                    <Box sx={{ width:7, height:7, borderRadius:"50%", bgcolor:l.dot }} />
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem", color:T.textMute }}>
                      {l.label}
                    </Typography>
                  </Box>
                ))}
                <Box sx={{ px:1.2, py:0.3, borderRadius:"7px", bgcolor:T.accentLight, ml:1 }}>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                    fontWeight:700, color:T.accent }}>This Semester</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ px:2, pt:2, pb:1 }}>
              <AcademicChart />
            </Box>

            {/* Summary stats below chart */}
            <Box sx={{ px:3, pb:2.5, pt:1 }}>
              <Grid container spacing={2}>
                {[
                  { label:"Total Lecture Hrs",  value:"107", color:T.accent  },
                  { label:"Research Hrs",        value:"210", color:T.purple  },
                  { label:"Avg. per Month",      value:"52.8",color:T.success },
                  { label:"Peak Month",          value:"Jun", color:T.warning },
                ].map(s => (
                  <Grid item xs={6} sm={3} key={s.label}>
                    <Box sx={{ p:1.4, borderRadius:"9px",
                      bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
                      <SLabel sx={{ mb:0.2 }}>{s.label}</SLabel>
                      <Typography sx={{ fontFamily:fMono, fontWeight:700,
                        fontSize:"1.1rem", color:s.color }}>{s.value}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </SCard>
        </Grid>

        {/* ── Right Column ── */}
        <Grid item xs={12} md={4}>
          <Stack spacing={2.5} height="100%">

            {/* Today's Schedule */}
            <SCard sx={{ p:0, overflow:"hidden", flex:1 }} className="fu2">
              <Box sx={{ px:2.5, py:1.8, borderBottom:`1px solid ${T.border}`,
                bgcolor:"#FAFBFD", display:"flex",
                justifyContent:"space-between", alignItems:"center" }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ p:0.7, borderRadius:"7px",
                    bgcolor:T.accentLight, color:T.accent }}>
                    <Event sx={{ fontSize:14 }} />
                  </Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.85rem", color:T.text }}>Today's Schedule</Typography>
                </Box>
                <Typography sx={{ fontFamily:fMono, fontSize:"0.67rem",
                  color:T.textMute }}>4 events</Typography>
              </Box>

              <Stack spacing={0}>
                {SCHEDULE.map((ev, i) => (
                  <Box key={i} className="row-h"
                    sx={{ px:2.5, py:1.4, display:"flex", alignItems:"center", gap:1.5,
                      borderBottom: i<SCHEDULE.length-1 ? `1px solid ${T.border}` : "none",
                      cursor:"pointer" }}>
                    {/* Time */}
                    <Box sx={{ minWidth:60 }}>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.7rem",
                        fontWeight:700, color:ev.color }}>{ev.time}</Typography>
                    </Box>
                    {/* Dot */}
                    <Box sx={{ width:8, height:8, borderRadius:"50%",
                      bgcolor:ev.color, flexShrink:0 }} />
                    {/* Detail */}
                    <Box flex={1} minWidth={0}>
                      <Typography sx={{ fontFamily:fBody, fontWeight:700,
                        fontSize:"0.78rem", color:T.text,
                        overflow:"hidden", textOverflow:"ellipsis",
                        whiteSpace:"nowrap" }}>{ev.title}</Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem",
                        color:T.textMute }}>{ev.venue}</Typography>
                    </Box>
                    {/* Type tag */}
                    <Box sx={{ px:0.8, py:0.18, borderRadius:"5px",
                      bgcolor:`${ev.color}15`, flexShrink:0 }}>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.61rem",
                        fontWeight:700, color:ev.color }}>{ev.type}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </SCard>

            {/* Recent Activity */}
            <SCard sx={{ p:0, overflow:"hidden" }} className="fu3">
              <Box sx={{ px:2.5, py:1.8, borderBottom:`1px solid ${T.border}`,
                bgcolor:"#FAFBFD" }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ p:0.7, borderRadius:"7px",
                    bgcolor:T.purpleLight, color:T.purple }}>
                    <Bolt sx={{ fontSize:14 }} />
                  </Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.85rem", color:T.text }}>Recent Activity</Typography>
                </Box>
              </Box>

              <Stack spacing={0}>
                {ACTIVITY.map((a,i) => (
                  <Box key={i} className="row-h"
                    sx={{ px:2.5, py:1.5, display:"flex", alignItems:"center", gap:1.5,
                      borderBottom: i<ACTIVITY.length-1 ? `1px solid ${T.border}` : "none" }}>
                    <Box sx={{ p:0.8, borderRadius:"8px",
                      bgcolor:`${a.color}15`, color:a.color, flexShrink:0 }}>
                      <a.Icon sx={{ fontSize:14 }} />
                    </Box>
                    <Box flex={1}>
                      <Typography sx={{ fontFamily:fBody, fontWeight:700,
                        fontSize:"0.78rem", color:T.text }}>{a.label}</Typography>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem",
                        color:T.textMute }}>{a.sub}</Typography>
                    </Box>
                    <ChevronRight sx={{ fontSize:15, color:T.textMute }} />
                  </Box>
                ))}
              </Stack>
            </SCard>
          </Stack>
        </Grid>
      </Grid>

      {/* ══════════════════════════════════════
          BOTTOM GRID — PBAS + Leave + Actions
      ══════════════════════════════════════ */}
      <Grid container spacing={2.5}>

        {/* PBAS Progress */}
        <Grid item xs={12} md={4}>
          <SCard sx={{ p:2.5 }} className="fu2">
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ p:0.75, borderRadius:"8px",
                bgcolor:T.accentLight, color:T.accent }}>
                <TrendingUp sx={{ fontSize:15 }} />
              </Box>
              <Typography sx={{ fontFamily:fHead, fontWeight:700,
                fontSize:"0.88rem", color:T.text }}>PBAS Progress</Typography>
              <Box sx={{ ml:"auto", px:1, py:0.25, borderRadius:"6px", bgcolor:T.warningLight }}>
                <Typography sx={{ fontFamily:fMono, fontSize:"0.66rem",
                  fontWeight:700, color:T.warning }}>Due Nov 30</Typography>
              </Box>
            </Box>

            <Stack spacing={2}>
              {PBAS_ITEMS.map(p => (
                <Box key={p.label}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem",
                      fontWeight:600, color:T.textSub }}>{p.label}</Typography>
                    <Typography sx={{ fontFamily:fMono, fontSize:"0.75rem",
                      fontWeight:700, color:p.color }}>{p.pct}%</Typography>
                  </Box>
                  <Box sx={{ height:7, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
                    <Box sx={{ height:"100%", width:`${p.pct}%`, borderRadius:99,
                      bgcolor:p.color, transition:"width 1.2s ease" }} />
                  </Box>
                </Box>
              ))}
            </Stack>

            <Box sx={{ mt:2.5, p:1.5, borderRadius:"9px",
              bgcolor:T.accentLight, border:`1px solid ${T.accent}20` }}>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem",
                fontWeight:700, color:T.accent, textAlign:"center" }}>
                Overall Score: <Box component="span"
                  sx={{ fontFamily:fMono, fontSize:"0.9rem" }}>61%</Box> — On Track
              </Typography>
            </Box>

            <Button fullWidth size="small" variant="outlined"
              onClick={() => toast("PBAS form opened.")}
              sx={{ mt:1.5, fontFamily:fBody, fontWeight:700, fontSize:"0.77rem",
                textTransform:"none", borderRadius:"8px",
                borderColor:T.accent, color:T.accent,
                "&:hover":{ bgcolor:T.accentLight } }}>
              Update PBAS Entries
            </Button>
          </SCard>
        </Grid>

        {/* Leave Balance */}
        <Grid item xs={12} md={4}>
          <SCard sx={{ p:2.5 }} className="fu3">
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ p:0.75, borderRadius:"8px",
                bgcolor:T.successLight, color:T.success }}>
                <BeachAccess sx={{ fontSize:15 }} />
              </Box>
              <Typography sx={{ fontFamily:fHead, fontWeight:700,
                fontSize:"0.88rem", color:T.text }}>Leave Balance</Typography>
            </Box>

            <Stack spacing={2}>
              {LEAVE_BALANCES.map(l => {
                const remaining = l.total - l.used;
                const pct       = Math.round((remaining / l.total) * 100);
                return (
                  <Box key={l.label}>
                    <Box display="flex" justifyContent="space-between" mb={0.6}>
                      <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem",
                        fontWeight:600, color:T.textSub }}>{l.label}</Typography>
                      <Box display="flex" gap={0.8}>
                        <Box sx={{ px:0.8, py:0.15, borderRadius:"5px",
                          bgcolor:`${l.color}15` }}>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.67rem",
                            fontWeight:700, color:l.color }}>
                            {remaining}/{l.total}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ height:7, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
                      <Box sx={{ height:"100%", width:`${pct}%`, borderRadius:99,
                        bgcolor:l.color, transition:"width 1.2s ease" }} />
                    </Box>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.66rem",
                      color:T.textMute, mt:0.4 }}>
                      {remaining} day{remaining!==1?"s":""} remaining · {l.used} used
                    </Typography>
                  </Box>
                );
              })}
            </Stack>

            <Divider sx={{ borderColor:T.border, my:2 }} />

            <Button fullWidth size="small" variant="outlined"
              onClick={() => toast("Leave application opened.")}
              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.77rem",
                textTransform:"none", borderRadius:"8px",
                borderColor:T.success, color:T.success,
                "&:hover":{ bgcolor:T.successLight } }}>
              Apply for Leave
            </Button>
          </SCard>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <SCard sx={{ p:2.5 }} className="fu4">
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ p:0.75, borderRadius:"8px",
                bgcolor:T.goldLight, color:T.gold }}>
                <Bolt sx={{ fontSize:15 }} />
              </Box>
              <Typography sx={{ fontFamily:fHead, fontWeight:700,
                fontSize:"0.88rem", color:T.text }}>Quick Actions</Typography>
            </Box>

            <Grid container spacing={1.2}>
              {QUICK_ACTIONS.map((a,i) => (
                <Grid item xs={6} key={i}>
                  <Box className="card-h"
                    onClick={() => toast(`${a.label} opened.`)}
                    sx={{ p:1.5, borderRadius:"10px", cursor:"pointer",
                      border:`1px solid ${T.border}`, bgcolor:"#FAFBFD",
                      display:"flex", flexDirection:"column",
                      alignItems:"flex-start", gap:0.8,
                      "&:hover":{ borderColor:a.color, bgcolor:`${a.color}08` } }}>
                    <Box sx={{ p:0.8, borderRadius:"8px",
                      bgcolor:`${a.color}15`, color:a.color }}>
                      <a.Icon sx={{ fontSize:16 }} />
                    </Box>
                    <Typography sx={{ fontFamily:fBody, fontWeight:700,
                      fontSize:"0.72rem", color:T.text, lineHeight:1.35 }}>
                      {a.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Storage widget */}
            <Box sx={{ mt:2, p:1.8, borderRadius:"10px",
              bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
              <Box display="flex" justifyContent="space-between" mb={0.8}>
                <Typography sx={{ fontFamily:fBody, fontWeight:700,
                  fontSize:"0.74rem", color:T.textSub }}>Asset Storage Quota</Typography>
                <Typography sx={{ fontFamily:fMono, fontWeight:700,
                  fontSize:"0.74rem", color:T.warning }}>70%</Typography>
              </Box>
              <Box sx={{ height:6, borderRadius:99, bgcolor:T.border, overflow:"hidden" }}>
                <Box sx={{ height:"100%", width:"70%", borderRadius:99,
                  bgcolor:T.warning, transition:"width 1s ease" }} />
              </Box>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem",
                color:T.textMute, mt:0.5 }}>
                3.5 GB used of 5 GB
              </Typography>
            </Box>
          </SCard>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={2800}
        onClose={() => setSnack(s => ({ ...s, open:false }))}
        anchorOrigin={{ vertical:"bottom", horizontal:"center" }}>
        <Alert severity="info"
          sx={{ borderRadius:"10px", fontFamily:fBody, fontWeight:600 }}
          onClose={() => setSnack(s => ({ ...s, open:false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DefaultDashboard;