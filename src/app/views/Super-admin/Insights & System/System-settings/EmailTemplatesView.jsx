import React, { useState, useCallback } from "react";
import {
  Box, Grid, Typography, Button, TextField, List, ListItem,
  ListItemText, ListItemIcon, Divider, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, Stack, InputAdornment, Avatar
} from "@mui/material";
import {
  Email, Edit, Visibility, Save, ContentCopy,
  InsertDriveFile, Send, Add, Search, Close,
  CheckCircle, Delete, Article, Notifications,
  AttachMoney, BeachAccess, TrendingUp, Badge,
  MarkEmailRead, HelpOutline, Refresh
} from "@mui/icons-material";

/* ─────────────────────────────────────────
   DESIGN TOKENS  (platform-consistent)
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
    @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
    @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
    .fu  { animation: fadeUp 0.28s ease both; }
    .fu1 { animation: fadeUp 0.28s .05s ease both; }
    .fu2 { animation: fadeUp 0.28s .10s ease both; }
    .tmpl-item { transition:background .14s,border-color .14s; }
    .tmpl-item:hover { background:#F5F7FA !important; }
    .ph-chip { transition:all .14s; cursor:pointer; }
    .ph-chip:hover { transform:translateY(-1px); box-shadow:0 3px 8px rgba(99,102,241,.18); }
  `}</style>
);

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const CATEGORY_META = {
  HR:      { color:T.accent,   bg:T.accentLight,  Icon:Badge        },
  Leave:   { color:T.success,  bg:T.successLight, Icon:BeachAccess  },
  Payroll: { color:T.gold,     bg:T.goldLight,    Icon:AttachMoney  },
  General: { color:T.purple,   bg:T.purpleLight,  Icon:Notifications},
  Other:   { color:T.textMute, bg:"#F1F5F9",      Icon:Article      },
};

const TEMPLATES_INIT = [
  {
    id:"appt_letter", name:"Appointment Letter", category:"HR",
    subject:"Offer of Appointment — {{designation}}",
    body:`Dear {{faculty_name}},

We are pleased to offer you the position of {{designation}} in the Department of {{department}}, effective from {{joining_date}}.

This appointment is subject to your acceptance of the terms and conditions outlined in the appointment order enclosed herewith.

Please report to the HR office on your joining date with the required documents.

Warm Regards,
HR Department
[Institution Name]`,
    lastModified:"2026-02-10",
  },
  {
    id:"leave_approve", name:"Leave Approval", category:"Leave",
    subject:"Your Leave Request Has Been Approved",
    body:`Dear {{faculty_name}},

This is to inform you that your leave request for {{leave_days}} day(s) has been duly reviewed and approved by the administration.

Please ensure proper academic arrangements are made for your absence and submit any pending work before your leave commences.

Regards,
Admin Office`,
    lastModified:"2026-01-28",
  },
  {
    id:"salary_slip", name:"Monthly Salary Slip", category:"Payroll",
    subject:"Salary Slip for {{month_year}} — Confidential",
    body:`Dear {{faculty_name}},

Please find enclosed your salary slip for the month of {{month_year}}.

  Net Amount Payable : {{salary}}

This is a system-generated document. Please contact the Finance department for any discrepancies.

Regards,
Finance & Accounts Team`,
    lastModified:"2026-02-01",
  },
  {
    id:"increment", name:"Annual Increment Letter", category:"HR",
    subject:"Annual Increment Notification — {{faculty_name}}",
    body:`Dear {{faculty_name}},

On behalf of the Management, we are pleased to inform you that your annual increment has been approved effective {{effective_date}}.

  Revised Basic Pay : {{new_basic}}

We appreciate your continued dedication and contribution to the institution.

Warm Regards,
Management`,
    lastModified:"2026-01-15",
  },
  {
    id:"noc_letter", name:"NOC Issuance Letter", category:"General",
    subject:"No Objection Certificate — {{faculty_name}}",
    body:`To Whomsoever It May Concern,

This is to certify that {{faculty_name}}, serving as {{designation}} in the Department of {{department}}, is permitted to {{noc_purpose}}.

The institution has no objection to the above activity, provided it does not interfere with the candidate's regular academic duties.

Issued on: {{issue_date}}

Authorised Signatory
[Institution Name]`,
    lastModified:"2026-02-05",
  },
];

const PLACEHOLDERS = [
  { key:"{{faculty_name}}",  label:"Faculty Name",     group:"Person"   },
  { key:"{{designation}}",   label:"Designation",      group:"Person"   },
  { key:"{{department}}",    label:"Department",        group:"Person"   },
  { key:"{{joining_date}}",  label:"Joining Date",      group:"Date"     },
  { key:"{{leave_days}}",    label:"Leave Days",        group:"Leave"    },
  { key:"{{month_year}}",    label:"Month & Year",      group:"Payroll"  },
  { key:"{{salary}}",        label:"Net Salary",        group:"Payroll"  },
  { key:"{{new_basic}}",     label:"New Basic Pay",     group:"Payroll"  },
  { key:"{{effective_date}}",label:"Effective Date",    group:"Date"     },
  { key:"{{noc_purpose}}",   label:"NOC Purpose",       group:"General"  },
  { key:"{{issue_date}}",    label:"Issue Date",        group:"Date"     },
];

const MOCK_VALUES = {
  "{{faculty_name}}":   "Dr. Sarah Smith",
  "{{designation}}":    "Associate Professor",
  "{{department}}":     "Computer Science",
  "{{joining_date}}":   "01 June 2026",
  "{{leave_days}}":     "3",
  "{{month_year}}":     "February 2026",
  "{{salary}}":         "₹1,42,000",
  "{{new_basic}}":      "₹96,000",
  "{{effective_date}}": "01 March 2026",
  "{{noc_purpose}}":    "pursue a part-time PhD programme at IIT Delhi",
  "{{issue_date}}":     "26 February 2026",
};

const PH_GROUP_COLORS = {
  Person:  T.accent,
  Date:    T.success,
  Leave:   T.warning,
  Payroll: T.gold,
  General: T.purple,
};

/* ─────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────── */
const SCard = ({ children, sx={}, ...p }) => (
  <Box sx={{ background:T.surface, border:`1px solid ${T.border}`,
    borderRadius:"14px", ...sx }} {...p}>
    {children}
  </Box>
);

const SLabel = ({ children, sx={} }) => (
  <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem", fontWeight:700,
    letterSpacing:"0.08em", textTransform:"uppercase", color:T.textMute, ...sx }}>
    {children}
  </Typography>
);

const DInput = ({ sx={}, ...props }) => (
  <TextField size="small" fullWidth {...props} sx={{
    "& .MuiOutlinedInput-root":{ borderRadius:"9px", fontFamily:fBody, fontSize:"0.83rem",
      bgcolor:T.surface,
      "& fieldset":{ borderColor:T.border },
      "&.Mui-focused fieldset":{ borderColor:T.accent } },
    "& .MuiInputLabel-root":{ fontFamily:fBody, fontSize:"0.83rem" },
    "& .MuiInputLabel-root.Mui-focused":{ color:T.accent },
    "& .MuiFormHelperText-root":{ fontFamily:fBody },
    ...sx
  }} />
);

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const EmailTemplatesView = () => {
  const [templates,  setTemplates]  = useState(TEMPLATES_INIT);
  const [selected,   setSelected]   = useState(TEMPLATES_INIT[0]);
  const [search,     setSearch]     = useState("");
  const [saved,      setSaved]      = useState({});       // id → true if unsaved changes
  const [previewOpen,setPreviewOpen]= useState(false);
  const [testEmail,  setTestEmail]  = useState("");
  const [testDialog, setTestDialog] = useState(false);
  const [addDialog,  setAddDialog]  = useState(false);
  const [newTmpl,    setNewTmpl]    = useState({ name:"", category:"General", subject:"", body:"" });
  const [snack,      setSnack]      = useState({ open:false, msg:"", severity:"success" });
  const [copiedPh,   setCopiedPh]   = useState(null);

  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });

  /* ── Select template ── */
  const handleSelect = (tmpl) => setSelected({ ...tmpl });

  /* ── Edit field ── */
  const handleEdit = (field, val) => {
    setSelected(p => ({ ...p, [field]:val }));
    setSaved(p => ({ ...p, [selected.id]:true }));
  };

  /* ── Save template ── */
  const handleSave = () => {
    const today = new Date().toISOString().split("T")[0];
    const updated = { ...selected, lastModified:today };
    setTemplates(p => p.map(t => t.id === updated.id ? updated : t));
    setSelected(updated);
    setSaved(p => ({ ...p, [selected.id]:false }));
    toast(`"${selected.name}" saved successfully.`);
  };

  /* ── Copy placeholder ── */
  const handleCopyPh = (ph) => {
    navigator.clipboard.writeText(ph).catch(() => {});
    setCopiedPh(ph);
    setTimeout(() => setCopiedPh(null), 1800);
    toast(`${ph} copied to clipboard.`);
  };

  /* ── Insert placeholder at cursor (best-effort) ── */
  const handleInsertPh = (ph) => {
    const ta = document.getElementById("email-body-editor");
    if (ta) {
      const start = ta.selectionStart;
      const end   = ta.selectionEnd;
      const val   = selected.body;
      const next  = val.slice(0, start) + ph + val.slice(end);
      handleEdit("body", next);
      setTimeout(() => {
        ta.focus();
        ta.setSelectionRange(start + ph.length, start + ph.length);
      }, 0);
    } else {
      handleCopyPh(ph);
    }
  };

  /* ── Preview ── */
  const getPreview = () => {
    let txt = selected.body;
    Object.entries(MOCK_VALUES).forEach(([k,v]) => {
      txt = txt.replaceAll(k, v);
    });
    return txt;
  };

  const getPreviewSubject = () => {
    let s = selected.subject;
    Object.entries(MOCK_VALUES).forEach(([k,v]) => { s = s.replaceAll(k,v); });
    return s;
  };

  /* ── Add template ── */
  const handleAddTemplate = () => {
    if (!newTmpl.name || !newTmpl.subject) {
      toast("Name and Subject are required.", "error"); return;
    }
    const id = newTmpl.name.toLowerCase().replace(/\s+/g,"_") + "_" + Date.now();
    const tmpl = { ...newTmpl, id, lastModified:new Date().toISOString().split("T")[0] };
    setTemplates(p => [...p, tmpl]);
    setSelected({ ...tmpl });
    setAddDialog(false);
    setNewTmpl({ name:"", category:"General", subject:"", body:"" });
    toast(`Template "${tmpl.name}" created.`);
  };

  /* ── Reset template ── */
  const handleReset = () => {
    const orig = TEMPLATES_INIT.find(t => t.id === selected.id);
    if (orig) { setSelected({ ...orig }); setSaved(p => ({ ...p, [selected.id]:false })); toast("Template reset to default."); }
    else toast("No default to reset to.", "warning");
  };

  /* ── Filtered templates ── */
  const filtered = templates.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase())
  );

  const hasUnsaved = saved[selected.id];

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start"
        mb={3} flexWrap="wrap" gap={2} className="fu">
        <Box>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700,
            letterSpacing:"0.1em", textTransform:"uppercase", color:T.textMute, mb:0.3 }}>
            Admin Dashboard · Communication
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Email &amp; Notification Templates
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Manage reusable email templates with dynamic placeholders for automated communications.
          </Typography>
        </Box>
        <Button size="small" variant="contained"
          startIcon={<Add sx={{fontSize:15}} />}
          onClick={() => setAddDialog(true)}
          sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem", textTransform:"none",
            borderRadius:"8px", bgcolor:T.accent, boxShadow:"none", mt:0.5,
            "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
          New Template
        </Button>
      </Box>

      <Grid container spacing={2.5} className="fu1">

        {/* ── Column 1: Template List ── */}
        <Grid item xs={12} md={3}>
          <SCard sx={{ p:0, overflow:"hidden", height:"100%" }}>

            {/* Sidebar header */}
            <Box sx={{ px:2, py:1.8, borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
              <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"0.82rem",
                color:T.text, mb:1 }}>Templates
                <Box component="span" sx={{ ml:1, px:0.9, py:0.2, borderRadius:"99px",
                  bgcolor:T.accentLight, fontFamily:fMono, fontSize:"0.62rem",
                  fontWeight:700, color:T.accent }}>
                  {templates.length}
                </Box>
              </Typography>
              <TextField size="small" fullWidth placeholder="Search templates…"
                value={search} onChange={e => setSearch(e.target.value)}
                InputProps={{ startAdornment:
                  <InputAdornment position="start">
                    <Search sx={{ fontSize:14, color:T.textMute }} />
                  </InputAdornment>
                }}
                sx={{ "& .MuiOutlinedInput-root":{ borderRadius:"8px",
                  fontFamily:fBody, fontSize:"0.78rem", bgcolor:T.surface,
                  "& fieldset":{ borderColor:T.border },
                  "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
              />
            </Box>

            {/* Template list */}
            <Box sx={{ overflowY:"auto", maxHeight:"calc(100vh - 280px)" }}>
              {filtered.map(tmpl => {
                const meta  = CATEGORY_META[tmpl.category] || CATEGORY_META.Other;
                const isSel = selected.id === tmpl.id;
                const isDirty = saved[tmpl.id];
                return (
                  <Box key={tmpl.id} className="tmpl-item"
                    onClick={() => handleSelect(tmpl)}
                    sx={{ px:2, py:1.8, cursor:"pointer",
                      borderLeft:`3.5px solid ${isSel ? T.accent : "transparent"}`,
                      bgcolor: isSel ? T.accentLight : "transparent",
                      borderBottom:`1px solid ${T.border}` }}>
                    <Box display="flex" alignItems="center" gap={1.2}>
                      <Box sx={{ p:0.7, borderRadius:"7px",
                        bgcolor: isSel ? T.accentLight : meta.bg,
                        color:   isSel ? T.accent      : meta.color, flexShrink:0 }}>
                        <InsertDriveFile sx={{ fontSize:14 }} />
                      </Box>
                      <Box flex={1} minWidth={0}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Typography sx={{ fontFamily:fBody, fontWeight:700,
                            fontSize:"0.8rem",
                            color:isSel ? T.accent : T.text,
                            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {tmpl.name}
                          </Typography>
                          {isDirty && (
                            <Box sx={{ width:6, height:6, borderRadius:"50%",
                              bgcolor:T.warning, flexShrink:0 }} />
                          )}
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5} mt={0.2}>
                          <Box sx={{ px:0.7, py:0.1, borderRadius:"5px",
                            bgcolor: isSel ? "#fff" : meta.bg }}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.62rem",
                              fontWeight:700, color:meta.color }}>{tmpl.category}</Typography>
                          </Box>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.6rem",
                            color:T.textMute }}>{tmpl.lastModified}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                );
              })}

              {filtered.length === 0 && (
                <Box sx={{ py:5, textAlign:"center" }}>
                  <Email sx={{ fontSize:32, color:T.border, display:"block", mx:"auto", mb:1 }} />
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem", color:T.textMute }}>
                    No templates found.
                  </Typography>
                </Box>
              )}
            </Box>
          </SCard>
        </Grid>

        {/* ── Column 2: Editor ── */}
        <Grid item xs={12} md={6}>
          <SCard sx={{ p:0, overflow:"hidden", display:"flex", flexDirection:"column" }}>

            {/* Editor header */}
            <Box sx={{ px:2.5, py:2, borderBottom:`1px solid ${T.border}`,
              bgcolor:"#FAFBFD", display:"flex", justifyContent:"space-between",
              alignItems:"center", flexWrap:"wrap", gap:1 }}>
              <Box display="flex" alignItems="center" gap={1.3}>
                {(() => {
                  const meta = CATEGORY_META[selected.category] || CATEGORY_META.Other;
                  return (
                    <Box sx={{ p:0.8, borderRadius:"8px",
                      bgcolor:meta.bg, color:meta.color }}>
                      <Edit sx={{ fontSize:15 }} />
                    </Box>
                  );
                })()}
                <Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.88rem", color:T.text }}>
                    {selected.name}
                    {hasUnsaved && (
                      <Box component="span" sx={{ ml:1, fontFamily:fBody, fontSize:"0.65rem",
                        fontWeight:700, color:T.warning }}>
                        ● Unsaved
                      </Box>
                    )}
                  </Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem", color:T.textMute }}>
                    Last modified: {selected.lastModified}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={1}>
                <Tooltip title="Reset to default">
                  <IconButton size="small"
                    onClick={handleReset}
                    sx={{ borderRadius:"8px", border:`1px solid ${T.border}`,
                      color:T.textMute, width:32, height:32,
                      "&:hover":{ bgcolor:T.warningLight, color:T.warning,
                        borderColor:T.warning } }}>
                    <Refresh sx={{ fontSize:14 }} />
                  </IconButton>
                </Tooltip>
                <Button size="small" variant="outlined"
                  startIcon={<Visibility sx={{fontSize:14}} />}
                  onClick={() => setPreviewOpen(true)}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.74rem",
                    textTransform:"none", borderRadius:"8px",
                    borderColor:T.border, color:T.textSub,
                    "&:hover":{ borderColor:T.accent, color:T.accent } }}>
                  Preview
                </Button>
                <Button size="small" variant="contained"
                  startIcon={<Save sx={{fontSize:14}} />}
                  onClick={handleSave}
                  disabled={!hasUnsaved}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.74rem",
                    textTransform:"none", borderRadius:"8px",
                    bgcolor:T.accent, boxShadow:"none",
                    "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" },
                    "&.Mui-disabled":{ bgcolor:T.border, color:T.textMute } }}>
                  Save Changes
                </Button>
              </Box>
            </Box>

            {/* Editor body */}
            <Box sx={{ p:2.5 }}>
              {/* Subject */}
              <Box mb={2.5}>
                <SLabel sx={{ mb:0.8 }}>Email Subject Line</SLabel>
                <DInput value={selected.subject}
                  onChange={e => handleEdit("subject", e.target.value)}
                  placeholder="e.g. Offer of Appointment — {{designation}}"
                />
              </Box>

              {/* Body */}
              <Box>
                <Box display="flex" justifyContent="space-between"
                  alignItems="center" mb={0.8}>
                  <SLabel>Email Body Content</SLabel>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem",
                    color:T.textMute }}>
                    Click a placeholder on the right to insert at cursor
                  </Typography>
                </Box>
                <TextField
                  id="email-body-editor"
                  fullWidth multiline rows={18}
                  value={selected.body}
                  onChange={e => handleEdit("body", e.target.value)}
                  helperText="Use {{placeholders}} to insert dynamic values. They will be auto-filled when sending."
                  sx={{
                    "& .MuiOutlinedInput-root":{
                      borderRadius:"9px",
                      fontFamily:fMono, fontSize:"0.78rem", lineHeight:1.75,
                      bgcolor:"#FAFBFD",
                      "& fieldset":{ borderColor:T.border },
                      "&.Mui-focused fieldset":{ borderColor:T.accent }
                    },
                    "& .MuiFormHelperText-root":{ fontFamily:fBody, fontSize:"0.7rem", mt:0.8 }
                  }}
                />
              </Box>

              {/* Test send button */}
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button size="small" variant="outlined"
                  startIcon={<Send sx={{fontSize:13}} />}
                  onClick={() => { setTestEmail(""); setTestDialog(true); }}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.74rem",
                    textTransform:"none", borderRadius:"8px",
                    borderColor:T.success, color:T.success,
                    "&:hover":{ bgcolor:T.successLight } }}>
                  Send Test Email
                </Button>
              </Box>
            </Box>
          </SCard>
        </Grid>

        {/* ── Column 3: Placeholder Reference ── */}
        <Grid item xs={12} md={3}>
          <SCard sx={{ p:0, overflow:"hidden", height:"100%" }}>
            <Box sx={{ px:2, py:1.8, borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ p:0.7, borderRadius:"7px",
                  bgcolor:T.purpleLight, color:T.purple }}>
                  <ContentCopy sx={{ fontSize:13 }} />
                </Box>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.82rem", color:T.text }}>Placeholder Reference</Typography>
              </Box>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.69rem",
                color:T.textMute, mt:0.5 }}>
                Click to insert at cursor position in editor.
              </Typography>
            </Box>

            <Box sx={{ p:2, overflowY:"auto", maxHeight:"calc(100vh - 290px)" }}>
              {/* Group placeholders */}
              {["Person","Date","Leave","Payroll","General"].map(group => {
                const phs = PLACEHOLDERS.filter(p => p.group === group);
                if (!phs.length) return null;
                const gColor = PH_GROUP_COLORS[group] || T.textMute;
                return (
                  <Box key={group} mb={2}>
                    <SLabel sx={{ mb:0.8, color:gColor }}>{group}</SLabel>
                    <Stack spacing={0.8}>
                      {phs.map(ph => {
                        const isCopied = copiedPh === ph.key;
                        return (
                          <Box key={ph.key} className="ph-chip"
                            onClick={() => handleInsertPh(ph.key)}
                            sx={{ px:1.5, py:1, borderRadius:"8px",
                              border:`1.5px solid ${isCopied ? gColor : T.border}`,
                              bgcolor: isCopied ? `${gColor}10` : "#FAFBFD",
                              display:"flex", alignItems:"center",
                              justifyContent:"space-between", gap:1 }}>
                            <Box minWidth={0}>
                              <Typography sx={{ fontFamily:fMono, fontSize:"0.7rem",
                                fontWeight:700, color:isCopied ? gColor : T.accent,
                                overflow:"hidden", textOverflow:"ellipsis",
                                whiteSpace:"nowrap" }}>
                                {ph.key}
                              </Typography>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.63rem",
                                color:T.textMute }}>{ph.label}</Typography>
                            </Box>
                            {isCopied
                              ? <CheckCircle sx={{ fontSize:13, color:gColor, flexShrink:0 }} />
                              : <ContentCopy sx={{ fontSize:12, color:T.textMute, flexShrink:0 }} />
                            }
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>
                );
              })}

              {/* Mock value reference */}
              <Divider sx={{ borderColor:T.border, my:2 }} />
              <Box sx={{ p:1.5, borderRadius:"8px",
                bgcolor:T.infoLight, border:`1px solid ${T.info}20` }}>
                <Box display="flex" alignItems="center" gap={0.7} sx={{ mb:0.8 }}>
                  <HelpOutline sx={{ fontSize:13, color:T.info }} />
                  <Typography sx={{ fontFamily:fBody, fontWeight:700,
                    fontSize:"0.69rem", color:T.info }}>Preview uses mock values</Typography>
                </Box>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.66rem",
                  color:T.textSub, lineHeight:1.65 }}>
                  e.g. <Box component="span" sx={{ fontFamily:fMono,
                    fontWeight:700, color:T.accent }}>{"{{faculty_name}}"}</Box>
                  &nbsp;→ Dr. Sarah Smith
                </Typography>
              </Box>
            </Box>
          </SCard>
        </Grid>
      </Grid>

      {/* ── Preview Dialog ── */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)}
        maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{ width:4, height:28, borderRadius:2, bgcolor:T.accent }} />
              <Box>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.96rem", color:T.text }}>Template Preview</Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
                  {selected.name} · Rendered with mock values
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setPreviewOpen(false)}
              sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          {/* Email metadata strip */}
          <Box sx={{ p:2, borderRadius:"9px", mb:2.5,
            bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
            <Box display="flex" gap={1} mb={1}>
              <SLabel sx={{ mb:0 }}>To:</SLabel>
              <Typography sx={{ fontFamily:fBody, fontSize:"0.78rem",
                color:T.textSub }}>Dr. Sarah Smith &lt;sarah.smith@institution.edu&gt;</Typography>
            </Box>
            <Box display="flex" gap={1}>
              <SLabel sx={{ mb:0, flexShrink:0 }}>Subject:</SLabel>
              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                fontSize:"0.82rem", color:T.text }}>{getPreviewSubject()}</Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor:T.border, mb:2 }} />

          {/* Email body */}
          <Box sx={{ p:2.5, borderRadius:"9px",
            bgcolor:"#F9FAFB", border:`1px solid ${T.border}`,
            whiteSpace:"pre-line" }}>
            <Typography sx={{ fontFamily:fBody, fontSize:"0.84rem",
              color:T.text, lineHeight:2 }}>
              {getPreview()}
            </Typography>
          </Box>

          <Box sx={{ mt:2, px:1.5, py:1, borderRadius:"7px",
            bgcolor:T.warningLight, border:`1px solid ${T.warning}25` }}>
            <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
              color:T.textSub }}>
              <Box component="span" sx={{ fontWeight:700, color:T.warning }}>Preview Mode:</Box>
              &nbsp;Placeholder values are mocked for display. Actual emails will use real faculty data.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px:3, pb:3, pt:2,
          borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD", gap:1 }}>
          <Button onClick={() => setPreviewOpen(false)} variant="outlined" size="small"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              borderColor:T.border, color:T.textSub }}>
            Close
          </Button>
          <Button variant="contained" size="small"
            endIcon={<Send sx={{fontSize:13}} />}
            onClick={() => { setPreviewOpen(false); setTestEmail(""); setTestDialog(true); }}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              bgcolor:T.success, boxShadow:"none",
              "&:hover":{ bgcolor:"#059669", boxShadow:"none" } }}>
            Send Test Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Test Email Dialog ── */}
      <Dialog open={testDialog} onClose={() => setTestDialog(false)}
        maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{ width:4, height:28, borderRadius:2, bgcolor:T.success }} />
              <Box>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.94rem", color:T.text }}>Send Test Email</Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", color:T.textMute }}>
                  Sends with mocked placeholder values.
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setTestDialog(false)}
              sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          <SLabel sx={{ mb:0.8 }}>Recipient Email Address</SLabel>
          <DInput
            type="email" value={testEmail}
            onChange={e => setTestEmail(e.target.value)}
            placeholder="e.g. admin@institution.edu"
            InputProps={{ startAdornment:
              <InputAdornment position="start">
                <Email sx={{ fontSize:15, color:T.textMute }} />
              </InputAdornment>
            }}
          />
          <Box sx={{ mt:2, p:1.5, borderRadius:"8px",
            bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
            <SLabel sx={{ mb:0.3 }}>Template</SLabel>
            <Typography sx={{ fontFamily:fBody, fontWeight:600,
              fontSize:"0.8rem", color:T.text }}>{selected.name}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px:3, pb:3, pt:2,
          borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD", gap:1 }}>
          <Button onClick={() => setTestDialog(false)} variant="outlined" size="small"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              borderColor:T.border, color:T.textSub }}>
            Cancel
          </Button>
          <Button variant="contained" size="small"
            endIcon={<Send sx={{fontSize:13}} />}
            onClick={() => {
              if (!testEmail) { toast("Please enter a recipient email.", "error"); return; }
              setTestDialog(false);
              toast(`Test email sent to ${testEmail}.`);
            }}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              bgcolor:T.success, boxShadow:"none",
              "&:hover":{ bgcolor:"#059669", boxShadow:"none" } }}>
            Send Test
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Add Template Dialog ── */}
      <Dialog open={addDialog} onClose={() => setAddDialog(false)}
        maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{ width:4, height:28, borderRadius:2, bgcolor:T.accent }} />
              <Box>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.96rem", color:T.text }}>Create New Template</Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
                  Define a new reusable email template.
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setAddDialog(false)}
              sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          <Stack spacing={2}>
            <Box>
              <SLabel sx={{ mb:0.7 }}>Template Name *</SLabel>
              <DInput value={newTmpl.name}
                onChange={e => setNewTmpl(p => ({ ...p, name:e.target.value }))}
                placeholder="e.g. Probation Completion Letter"
              />
            </Box>
            <Box>
              <SLabel sx={{ mb:0.7 }}>Category</SLabel>
              <DInput select value={newTmpl.category}
                onChange={e => setNewTmpl(p => ({ ...p, category:e.target.value }))}>
                {Object.keys(CATEGORY_META).map(c => (
                  <option key={c} value={c}
                    style={{ fontFamily:fBody, fontSize:"0.82rem" }}>{c}</option>
                ))}
              </DInput>
            </Box>
            <Box>
              <SLabel sx={{ mb:0.7 }}>Subject Line *</SLabel>
              <DInput value={newTmpl.subject}
                onChange={e => setNewTmpl(p => ({ ...p, subject:e.target.value }))}
                placeholder="e.g. Probation Completion — {{faculty_name}}"
              />
            </Box>
            <Box>
              <SLabel sx={{ mb:0.7 }}>Email Body</SLabel>
              <TextField fullWidth multiline rows={6}
                value={newTmpl.body}
                onChange={e => setNewTmpl(p => ({ ...p, body:e.target.value }))}
                placeholder={"Dear {{faculty_name}},\n\n[Body content here]\n\nRegards,\n[Department]"}
                sx={{ "& .MuiOutlinedInput-root":{ borderRadius:"9px",
                  fontFamily:fMono, fontSize:"0.78rem", bgcolor:"#FAFBFD",
                  "& fieldset":{ borderColor:T.border },
                  "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px:3, pb:3, pt:2,
          borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD", gap:1 }}>
          <Button onClick={() => setAddDialog(false)} variant="outlined" size="small"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              borderColor:T.border, color:T.textSub }}>
            Cancel
          </Button>
          <Button variant="contained" size="small"
            startIcon={<Add sx={{fontSize:14}} />}
            onClick={handleAddTemplate}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              bgcolor:T.accent, boxShadow:"none",
              "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
            Create Template
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3000}
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

export default EmailTemplatesView;