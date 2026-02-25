import React, { useState, useMemo } from "react";
import {
  Box, Grid, Typography, Button, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Stack,
  Snackbar, Alert, Divider, Avatar, InputAdornment, Tabs, Tab
} from "@mui/material";
import {
  Inventory, Add, MoveDown, CheckCircle, Cancel,
  Visibility, QrCode, UploadFile, Search, Refresh,
  FileDownload, Edit, Warning, Computer, Chair,
  Biotech, Print, Close, ArrowForward, AttachMoney,
  LocationOn, Person, Info, Category
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
    @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
    @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
    .fu  { animation: fadeUp 0.32s ease both; }
    .fu1 { animation: fadeUp 0.32s .06s ease both; }
    .fu2 { animation: fadeUp 0.32s .12s ease both; }
    .fu3 { animation: fadeUp 0.32s .18s ease both; }
    .row-h:hover { background:#F9FAFB !important; transition:background .15s; }
    .card-h { transition:box-shadow .18s,transform .18s; }
    .card-h:hover { box-shadow:0 6px 24px rgba(99,102,241,.12); transform:translateY(-2px); }
    .blink { animation: pulse 2s infinite; }
  `}</style>
);

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const ASSETS_INIT = [
  { id:"AST-001", name:"Dell Latitude 5420",  type:"Laptop",    sn:"DL-5420-X88",   user:"Dr. Sarah Smith",    location:"CSE Lab 1",   value:65000, purchaseDate:"2023-04-15", warranty:"2026-04-14", status:"Assigned"    },
  { id:"AST-002", name:"Epson Projector EB",  type:"Equipment", sn:"EPS-PROJ-99",   user:"Classroom 301",      location:"Block A",     value:35000, purchaseDate:"2022-08-01", warranty:"2025-07-31", status:"Active"      },
  { id:"AST-003", name:"Ergo Lab Chair",      type:"Furniture", sn:"FURN-CH-102",   user:"Library",            location:"Central Lib", value:4500,  purchaseDate:"2021-01-10", warranty:"N/A",        status:"Maintenance" },
  { id:"AST-004", name:"HP LaserJet Pro",     type:"Equipment", sn:"HP-LJ-7841",    user:"Admin Office",       location:"Block B",     value:22000, purchaseDate:"2024-01-20", warranty:"2027-01-19", status:"Active"      },
  { id:"AST-005", name:"MacBook Pro 14\"",    type:"Laptop",    sn:"MBP-14-2024A",  user:"Prof. Rajan Kumar",  location:"Mech Dept",   value:185000,purchaseDate:"2024-03-10", warranty:"2027-03-09", status:"Assigned"    },
  { id:"AST-006", name:"Standing Desk",       type:"Furniture", sn:"FURN-SD-044",   user:"Unassigned",         location:"Store Room",  value:12000, purchaseDate:"2023-11-05", warranty:"N/A",        status:"In Stock"    },
];

const TRANSFERS_INIT = [
  { id:101, assetId:"AST-001", asset:"AST-001 — Dell Latitude 5420", from:"Dr. Sarah Smith",  to:"Prof. Rajan Kumar", date:"2026-02-04", reason:"Faculty Exit",   status:"Pending Approval", remarks:"" },
  { id:102, assetId:"AST-004", asset:"AST-004 — HP LaserJet Pro",    from:"Admin Office",      to:"Exam Cell",         date:"2026-02-01", reason:"Relocation",     status:"Approved",         remarks:"Verified condition." },
  { id:103, assetId:"AST-006", asset:"AST-006 — Standing Desk",      from:"Store Room",        to:"CSE Dept Head",     date:"2026-02-10", reason:"New Allocation", status:"Pending Approval", remarks:"" },
];

const ASSET_TYPES = ["Laptop","Equipment","Furniture","Vehicle","Software","Other"];

const STATUS_META = {
  Assigned:          { color:T.accent,   bg:T.accentLight   },
  Active:            { color:T.success,  bg:T.successLight  },
  "In Stock":        { color:T.info,     bg:T.infoLight     },
  Maintenance:       { color:T.warning,  bg:T.warningLight  },
  Disposed:          { color:T.textMute, bg:"#F1F5F9"       },
};

const TRANSFER_STATUS_META = {
  "Pending Approval":{ color:T.warning, bg:T.warningLight },
  Approved:          { color:T.success, bg:T.successLight },
  Rejected:          { color:T.danger,  bg:T.dangerLight  },
};

const TYPE_META = {
  Laptop:    { color:T.accent,   bg:T.accentLight,  Icon:Computer  },
  Equipment: { color:T.purple,   bg:T.purpleLight,  Icon:Biotech   },
  Furniture: { color:T.gold,     bg:T.goldLight,    Icon:Chair     },
  Vehicle:   { color:T.info,     bg:T.infoLight,    Icon:Category  },
  Software:  { color:T.success,  bg:T.successLight, Icon:Inventory },
  Other:     { color:T.textMute, bg:"#F1F5F9",      Icon:Inventory },
};

const AVATAR_COLORS = [
  { bg:"#EEF2FF", color:"#6366F1" },
  { bg:"#ECFDF5", color:"#10B981" },
  { bg:"#F5F3FF", color:"#7C3AED" },
  { bg:"#FFFBEB", color:"#F59E0B" },
  { bg:"#F0F9FF", color:"#0EA5E9" },
  { bg:"#FEF2F2", color:"#EF4444" },
];
const aColor  = (s) => AVATAR_COLORS[(s||"A").charCodeAt(0) % AVATAR_COLORS.length];
const fmt     = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const initials= (s) => s.split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();

const BLANK_ASSET = {
  name:"", type:"", sn:"", value:"",
  purchaseDate:"", warranty:"", location:"", notes:"",
};

/* ─────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────── */
const SCard = ({ children, sx={}, hover=false, ...p }) => (
  <Box className={hover?"card-h":""}
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
    borderBottom:`1px solid ${T.border}`, py:1.8, ...sx }}>
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

const StatusPill = ({ status, meta }) => {
  const s = (meta||{})[status] || { color:T.textMute, bg:"#F1F5F9" };
  return (
    <Box display="flex" alignItems="center" gap={0.6}
      sx={{ px:1.2, py:0.38, borderRadius:"99px", bgcolor:s.bg, width:"fit-content" }}>
      <Box sx={{ width:6, height:6, borderRadius:"50%", bgcolor:s.color,
        ...(status==="Active"||status==="Assigned" ? { animation:"pulse 2s infinite" } : {}) }} />
      <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem", fontWeight:700, color:s.color }}>
        {status}
      </Typography>
    </Box>
  );
};

/* ═════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════ */
const AssetAdminView = () => {
  const [tabIndex,       setTabIndex]       = useState(0);

  /* Asset inventory state */
  const [assets,         setAssets]         = useState(ASSETS_INIT);
  const [assetSearch,    setAssetSearch]     = useState("");
  const [assetType,      setAssetType]       = useState("All");
  const [assetStatus,    setAssetStatus]     = useState("All");
  const [openAddDialog,  setOpenAddDialog]   = useState(false);
  const [newAsset,       setNewAsset]        = useState(BLANK_ASSET);
  const [uploadedInv,    setUploadedInv]     = useState(null);
  const [detailAsset,    setDetailAsset]     = useState(null);
  const [detailDialog,   setDetailDialog]    = useState(false);
  const [qrAsset,        setQrAsset]         = useState(null);
  const [qrDialog,       setQrDialog]        = useState(false);

  /* Transfer state */
  const [transfers,      setTransfers]       = useState(TRANSFERS_INIT);
  const [selectedTx,     setSelectedTx]      = useState(null);
  const [txDialog,       setTxDialog]        = useState(false);
  const [txRemarks,      setTxRemarks]       = useState("");

  const [snack, setSnack] = useState({ open:false, msg:"", severity:"success" });
  const toast = (msg, severity="success") => setSnack({ open:true, msg, severity });
  const setNF = (k, v) => setNewAsset(p => ({ ...p, [k]:v }));

  /* Add asset */
  const handleAddAsset = () => {
    if (!newAsset.name || !newAsset.type || !newAsset.sn) {
      toast("Name, Type, and Serial Number are required.", "error"); return;
    }
    const id = `AST-${String(assets.length + 1).padStart(3,"0")}`;
    setAssets(p => [{ id, ...newAsset, user:"Unassigned",
      location: newAsset.location || "Store Room", status:"In Stock",
      value:+newAsset.value || 0 }, ...p]);
    setNewAsset(BLANK_ASSET); setUploadedInv(null); setOpenAddDialog(false);
    toast(`Asset "${newAsset.name}" registered as ${id}.`);
  };

  /* Transfer action */
  const handleTxAction = (action) => {
    const status = action === "approve" ? "Approved" : "Rejected";
    setTransfers(p => p.map(t => t.id === selectedTx.id ? { ...t, status, remarks:txRemarks } : t));
    if (action === "approve") {
      setAssets(p => p.map(a =>
        a.id === selectedTx.assetId ? { ...a, user:selectedTx.to } : a
      ));
    }
    setTxDialog(false);
    toast(`Transfer ${status.toLowerCase()} for ${selectedTx.asset}.`,
      action === "approve" ? "success" : "error");
  };

  /* Filtered assets */
  const filteredAssets = useMemo(() => assets.filter(a => {
    const q = assetSearch.toLowerCase();
    if (q && !a.name.toLowerCase().includes(q) && !a.id.toLowerCase().includes(q)
           && !a.user.toLowerCase().includes(q)) return false;
    if (assetType   !== "All" && a.type   !== assetType)   return false;
    if (assetStatus !== "All" && a.status !== assetStatus) return false;
    return true;
  }), [assets, assetSearch, assetType, assetStatus]);

  /* Stats */
  const totalAssets   = assets.length;
  const totalValue    = assets.reduce((s,a) => s + (+a.value||0), 0);
  const inMaintenance = assets.filter(a => a.status==="Maintenance").length;
  const pendingTx     = transfers.filter(t => t.status==="Pending Approval").length;
  const hasFilter     = assetSearch || assetType!=="All" || assetStatus!=="All";

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <Box sx={{ p:3, bgcolor:T.bg, minHeight:"100vh", fontFamily:fBody }}>
      <Fonts />

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start"
        mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", fontWeight:700,
            letterSpacing:"0.1em", textTransform:"uppercase", color:T.textMute, mb:0.3 }}>
            Admin Dashboard · Logistics
          </Typography>
          <Typography sx={{ fontFamily:fHead, fontWeight:700, fontSize:"1.5rem", color:T.text }}>
            Asset Management &amp; Inventory
          </Typography>
          <Typography sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textSub, mt:0.3 }}>
            Register assets, track assignments, and approve transfer requests.
          </Typography>
        </Box>
        <Box display="flex" gap={1.5} pt={0.5}>
          <Button size="small" variant="outlined"
            startIcon={<FileDownload sx={{fontSize:15}} />}
            onClick={() => toast("Asset register exported.")}
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.76rem", textTransform:"none",
              borderRadius:"8px", borderColor:T.border, color:T.textSub,
              "&:hover":{ borderColor:T.accent, color:T.accent } }}>
            Export Register
          </Button>
          <Button size="small" variant="contained"
            startIcon={<Add sx={{fontSize:15}} />}
            onClick={() => { setNewAsset(BLANK_ASSET); setUploadedInv(null); setOpenAddDialog(true); }}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.76rem", textTransform:"none",
              borderRadius:"8px", bgcolor:T.accent, boxShadow:"none",
              "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
            Add New Asset
          </Button>
        </Box>
      </Box>

      {/* ── Stat Strip ── */}
      <Grid container spacing={2} mb={3}>
        {[
          { label:"Total Assets",       value:totalAssets,      sub:"In the master register",   color:T.accent,  Icon:Inventory    },
          { label:"Total Asset Value",  value:fmt(totalValue),  sub:"Book value (all assets)",  color:T.success, Icon:AttachMoney  },
          { label:"Under Maintenance",  value:inMaintenance,    sub:"Currently out of service", color:T.warning, Icon:Warning      },
          { label:"Pending Transfers",  value:pendingTx,        sub:"Awaiting admin approval",  color:T.danger,  Icon:MoveDown     },
        ].map((s,i) => (
          <Grid item xs={6} md={3} key={i}>
            <SCard hover sx={{ p:2.5 }} className={`fu${i}`}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <SLabel>{s.label}</SLabel>
                  <Typography sx={{ fontFamily:fMono, fontWeight:700, fontSize:"1.45rem",
                    color:s.color, lineHeight:1.1 }}>{s.value}</Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.7rem",
                    color:T.textMute, mt:0.4 }}>{s.sub}</Typography>
                </Box>
                <Box sx={{ p:1.1, borderRadius:"10px", bgcolor:`${s.color}15`, color:s.color }}>
                  <s.Icon sx={{ fontSize:20 }} />
                </Box>
              </Box>
            </SCard>
          </Grid>
        ))}
      </Grid>

      {/* ── Main Card ── */}
      <SCard sx={{ overflow:"hidden" }} className="fu1">

        {/* Tab bar */}
        <Box sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
          <Tabs value={tabIndex} onChange={(_,v) => setTabIndex(v)} sx={{
            px:2,
            "& .MuiTabs-indicator":{ bgcolor:T.accent, height:"2.5px",
              borderRadius:"2px 2px 0 0" },
            "& .MuiTab-root":{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
              textTransform:"none", color:T.textMute, minHeight:50,
              "&.Mui-selected":{ color:T.accent } }
          }}>
            {[
              { label:"Asset Inventory",     Icon:Inventory },
              { label:"Transfer Approvals",  Icon:MoveDown  },
            ].map((t,i) => (
              <Tab key={i} icon={<t.Icon sx={{fontSize:16}} />}
                iconPosition="start" label={t.label} />
            ))}
          </Tabs>
        </Box>

        <Box p={3}>

          {/* ════════════════════════════════
              TAB 0 — ASSET INVENTORY
          ════════════════════════════════ */}
          {tabIndex === 0 && (
            <Box className="fu">

              {/* Filter bar */}
              <Box display="flex" gap={1.5} mb={2.5} flexWrap="wrap" alignItems="center">
                <TextField size="small" placeholder="Search by name, ID or user…"
                  value={assetSearch} onChange={e => setAssetSearch(e.target.value)}
                  InputProps={{ startAdornment:
                    <InputAdornment position="start">
                      <Search sx={{ fontSize:15, color:T.textMute }} />
                    </InputAdornment>
                  }}
                  sx={{ flex:"1 1 200px",
                    "& .MuiOutlinedInput-root":{ borderRadius:"8px",
                      fontFamily:fBody, fontSize:"0.8rem", bgcolor:T.surface,
                      "& fieldset":{ borderColor:T.border },
                      "&.Mui-focused fieldset":{ borderColor:T.accent } }}}
                />

                {/* Type pills */}
                <Box display="flex" gap={0.7} flexWrap="wrap">
                  {["All","Laptop","Equipment","Furniture"].map(c => {
                    const meta = TYPE_META[c];
                    const active = assetType === c;
                    return (
                      <Box key={c} onClick={() => setAssetType(c)}
                        sx={{ px:1.2, py:0.38, borderRadius:"99px", cursor:"pointer",
                          fontFamily:fBody, fontSize:"0.71rem", fontWeight:700,
                          border:`1.5px solid ${active ? (meta?.color||T.accent) : T.border}`,
                          bgcolor: active ? (meta?.bg||T.accentLight) : "transparent",
                          color:   active ? (meta?.color||T.accent) : T.textMute,
                          transition:"all .13s" }}>
                        {c}
                      </Box>
                    );
                  })}
                </Box>

                {/* Status pills */}
                <Box display="flex" gap={0.7} flexWrap="wrap">
                  {["All","Assigned","Active","In Stock","Maintenance"].map(s => (
                    <Box key={s} onClick={() => setAssetStatus(s)}
                      sx={{ px:1.2, py:0.38, borderRadius:"99px", cursor:"pointer",
                        fontFamily:fBody, fontSize:"0.71rem", fontWeight:700,
                        border:`1.5px solid ${assetStatus===s ? T.accent : T.border}`,
                        bgcolor: assetStatus===s ? T.accentLight : "transparent",
                        color:   assetStatus===s ? T.accent      : T.textMute,
                        transition:"all .13s" }}>
                      {s}
                    </Box>
                  ))}
                </Box>

                {hasFilter && (
                  <Tooltip title="Reset filters">
                    <IconButton size="small"
                      onClick={() => { setAssetSearch(""); setAssetType("All"); setAssetStatus("All"); }}
                      sx={{ borderRadius:"8px", border:`1px solid ${T.border}`,
                        "&:hover":{ bgcolor:T.dangerLight, color:T.danger } }}>
                      <Refresh sx={{ fontSize:15 }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              {/* Asset table */}
              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Asset ID / SN</TH>
                      <TH>Name &amp; Type</TH>
                      <TH>Assigned To</TH>
                      <TH>Location</TH>
                      <TH align="right">Value</TH>
                      <TH>Warranty</TH>
                      <TH>Status</TH>
                      <TH align="center">Actions</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAssets.map(row => {
                      const tm = TYPE_META[row.type] || TYPE_META.Other;
                      return (
                        <TableRow key={row.id} className="row-h">

                          <TD sx={{ minWidth:135 }}>
                            <Typography sx={{ fontFamily:fMono, fontWeight:700,
                              fontSize:"0.77rem", color:T.accent }}>{row.id}</Typography>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.67rem",
                              color:T.textMute }}>{row.sn}</Typography>
                          </TD>

                          <TD sx={{ minWidth:180 }}>
                            <Box display="flex" alignItems="center" gap={1.2}>
                              <Box sx={{ p:0.75, borderRadius:"8px",
                                bgcolor:tm.bg, color:tm.color, flexShrink:0 }}>
                                <tm.Icon sx={{ fontSize:15 }} />
                              </Box>
                              <Box>
                                <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                  fontSize:"0.82rem", color:T.text }}>{row.name}</Typography>
                                <Box sx={{ px:0.9, py:0.18, borderRadius:"5px",
                                  bgcolor:tm.bg, display:"inline-block", mt:0.3 }}>
                                  <Typography sx={{ fontFamily:fBody, fontSize:"0.65rem",
                                    fontWeight:700, color:tm.color }}>{row.type}</Typography>
                                </Box>
                              </Box>
                            </Box>
                          </TD>

                          <TD sx={{ minWidth:155 }}>
                            {row.user === "Unassigned" ? (
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.76rem",
                                color:T.textMute, fontStyle:"italic" }}>Unassigned</Typography>
                            ) : (
                              <Box display="flex" alignItems="center" gap={1}>
                                <Avatar sx={{ width:24, height:24, bgcolor:aColor(row.user).bg,
                                  color:aColor(row.user).color, fontFamily:fHead,
                                  fontSize:"0.55rem", fontWeight:700 }}>
                                  {initials(row.user)}
                                </Avatar>
                                <Typography sx={{ fontFamily:fBody, fontSize:"0.79rem",
                                  color:T.text }}>{row.user}</Typography>
                              </Box>
                            )}
                          </TD>

                          <TD>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <LocationOn sx={{ fontSize:12, color:T.textMute }} />
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.77rem" }}>
                                {row.location}
                              </Typography>
                            </Box>
                          </TD>

                          <TD align="right">
                            <Typography sx={{ fontFamily:fMono, fontWeight:700,
                              fontSize:"0.82rem", color:T.text }}>{fmt(row.value)}</Typography>
                          </TD>

                          <TD>
                            <Typography sx={{ fontFamily:fMono, fontSize:"0.73rem",
                              color: row.warranty === "N/A" ? T.textMute
                                   : new Date(row.warranty) < new Date() ? T.danger : T.textSub }}>
                              {row.warranty}
                            </Typography>
                            {row.warranty !== "N/A" && new Date(row.warranty) < new Date() && (
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.62rem",
                                color:T.danger, fontWeight:700 }}>Expired</Typography>
                            )}
                          </TD>

                          <TD>
                            <StatusPill status={row.status} meta={STATUS_META} />
                          </TD>

                          <TD align="center">
                            <Box display="flex" gap={0.5} justifyContent="center">
                              <Tooltip title="View QR Code">
                                <IconButton size="small"
                                  onClick={() => { setQrAsset(row); setQrDialog(true); }}
                                  sx={{ borderRadius:"7px", bgcolor:"#F1F5F9",
                                    color:T.textSub, width:28, height:28,
                                    "&:hover":{ bgcolor:T.purpleLight, color:T.purple } }}>
                                  <QrCode sx={{ fontSize:14 }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="View Details">
                                <IconButton size="small"
                                  onClick={() => { setDetailAsset(row); setDetailDialog(true); }}
                                  sx={{ borderRadius:"7px", bgcolor:T.accentLight,
                                    color:T.accent, width:28, height:28,
                                    "&:hover":{ bgcolor:T.accent, color:"#fff" } }}>
                                  <Visibility sx={{ fontSize:14 }} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TD>
                        </TableRow>
                      );
                    })}

                    {filteredAssets.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ textAlign:"center", py:6 }}>
                          <Inventory sx={{ fontSize:40, color:T.border,
                            display:"block", mx:"auto", mb:1.5 }} />
                          <Typography sx={{ fontFamily:fBody, color:T.textMute }}>
                            No assets match your current filters.
                          </Typography>
                          {hasFilter && (
                            <Button size="small"
                              onClick={() => { setAssetSearch(""); setAssetType("All"); setAssetStatus("All"); }}
                              sx={{ mt:1.5, fontFamily:fBody, fontSize:"0.76rem",
                                textTransform:"none", color:T.accent }}>
                              Clear all filters
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>

              {/* Footer */}
              <Box sx={{ mt:2, display:"flex", justifyContent:"space-between" }}>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", color:T.textMute }}>
                  Showing <Box component="span" sx={{ fontFamily:fMono, fontWeight:700,
                    color:T.accent }}>{filteredAssets.length}</Box> of {assets.length} assets
                </Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", color:T.textMute }}>
                  Total filtered value:&nbsp;
                  <Box component="span" sx={{ fontFamily:fMono, fontWeight:700, color:T.text }}>
                    {fmt(filteredAssets.reduce((s,a)=>s+(+a.value||0),0))}
                  </Box>
                </Typography>
              </Box>
            </Box>
          )}

          {/* ════════════════════════════════
              TAB 1 — TRANSFER APPROVALS
          ════════════════════════════════ */}
          {tabIndex === 1 && (
            <Box className="fu">
              <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                <Box sx={{ p:0.75, borderRadius:"8px",
                  bgcolor:T.warningLight, color:T.warning }}>
                  <MoveDown sx={{ fontSize:15 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily:fHead, fontWeight:700,
                    fontSize:"0.9rem", color:T.text }}>Asset Transfer Queue</Typography>
                  <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
                    {pendingTx} request{pendingTx!==1?"s":""} awaiting admin approval
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ borderRadius:"10px", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TH>Asset</TH>
                      <TH>Transfer Route</TH>
                      <TH>Request Date</TH>
                      <TH>Reason</TH>
                      <TH>Status</TH>
                      <TH align="center">Action</TH>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transfers.map(row => (
                      <TableRow key={row.id} className="row-h">

                        <TD sx={{ minWidth:210 }}>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.7rem",
                            fontWeight:700, color:T.accent }}>
                            {row.assetId}
                          </Typography>
                          <Typography sx={{ fontFamily:fBody, fontWeight:700,
                            fontSize:"0.8rem", color:T.text }}>
                            {row.asset.split("—")[1]?.trim() || row.asset}
                          </Typography>
                        </TD>

                        <TD sx={{ minWidth:210 }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                                color:T.textMute }}>From</Typography>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                fontSize:"0.79rem", color:T.text }}>{row.from}</Typography>
                            </Box>
                            <ArrowForward sx={{ fontSize:14, color:T.accent, flexShrink:0 }} />
                            <Box>
                              <Typography sx={{ fontFamily:fBody, fontSize:"0.68rem",
                                color:T.textMute }}>To</Typography>
                              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                                fontSize:"0.79rem", color:T.accent }}>{row.to}</Typography>
                            </Box>
                          </Box>
                        </TD>

                        <TD>
                          <Typography sx={{ fontFamily:fMono, fontSize:"0.74rem" }}>
                            {row.date}
                          </Typography>
                        </TD>

                        <TD>
                          <Box sx={{ px:1, py:0.25, borderRadius:"6px",
                            bgcolor:"#F1F5F9", display:"inline-block" }}>
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.71rem",
                              fontWeight:700, color:T.textSub }}>{row.reason}</Typography>
                          </Box>
                        </TD>

                        <TD>
                          <StatusPill status={row.status} meta={TRANSFER_STATUS_META} />
                          {row.remarks && (
                            <Typography sx={{ fontFamily:fBody, fontSize:"0.67rem",
                              color:T.textMute, mt:0.4, maxWidth:150,
                              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                              {row.remarks}
                            </Typography>
                          )}
                        </TD>

                        <TD align="center">
                          {row.status === "Pending Approval" ? (
                            <Button size="small" variant="contained"
                              onClick={() => {
                                setSelectedTx(row); setTxRemarks(""); setTxDialog(true);
                              }}
                              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.72rem",
                                textTransform:"none", borderRadius:"7px",
                                bgcolor:T.accent, boxShadow:"none",
                                "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
                              Review
                            </Button>
                          ) : (
                            <Button size="small" variant="outlined"
                              startIcon={<Print sx={{fontSize:13}} />}
                              onClick={() => toast(`Transfer letter for ${row.assetId} downloading…`)}
                              sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.72rem",
                                textTransform:"none", borderRadius:"7px",
                                borderColor: row.status==="Approved" ? T.success : T.border,
                                color:       row.status==="Approved" ? T.success : T.textSub,
                                "&:hover":{ bgcolor: row.status==="Approved" ? T.successLight : "#F1F5F9" } }}>
                              Letter
                            </Button>
                          )}
                        </TD>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}
        </Box>
      </SCard>

      {/* ── Add Asset Dialog ── */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}
        maxWidth="md" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box sx={{ width:4, height:28, borderRadius:2, bgcolor:T.accent }} />
              <Box>
                <Typography sx={{ fontFamily:fHead, fontWeight:700,
                  fontSize:"0.96rem", color:T.text }}>Register New Asset</Typography>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
                  Fill in all required fields to add to the master register.
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setOpenAddDialog(false)}
              sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px:3, pt:3, pb:2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <SLabel sx={{ mb:0.7 }}>Asset Name *</SLabel>
              <DInput value={newAsset.name}
                onChange={e => setNF("name", e.target.value)}
                placeholder="e.g. Dell Latitude 5420" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SLabel sx={{ mb:0.7 }}>Asset Type *</SLabel>
              <DInput select value={newAsset.type}
                onChange={e => setNF("type", e.target.value)}>
                <MenuItem value="" sx={{ fontFamily:fBody, fontSize:"0.82rem", color:T.textMute }}>
                  — Select type —
                </MenuItem>
                {ASSET_TYPES.map(t => (
                  <MenuItem key={t} value={t}
                    sx={{ fontFamily:fBody, fontSize:"0.82rem" }}>{t}</MenuItem>
                ))}
              </DInput>
            </Grid>
            <Grid item xs={12} sm={6}>
              <SLabel sx={{ mb:0.7 }}>Serial Number *</SLabel>
              <DInput value={newAsset.sn}
                onChange={e => setNF("sn", e.target.value)}
                placeholder="e.g. DL-5420-X88" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SLabel sx={{ mb:0.7 }}>Purchase Value (₹)</SLabel>
              <DInput type="number" value={newAsset.value}
                onChange={e => setNF("value", e.target.value)}
                InputProps={{ startAdornment:
                  <InputAdornment position="start">
                    <Typography sx={{ fontFamily:fMono, fontSize:"0.78rem",
                      color:T.textMute }}>₹</Typography>
                  </InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SLabel sx={{ mb:0.7 }}>Purchase Date</SLabel>
              <DInput type="date" value={newAsset.purchaseDate}
                onChange={e => setNF("purchaseDate", e.target.value)}
                InputLabelProps={{ shrink:true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SLabel sx={{ mb:0.7 }}>Warranty Expires</SLabel>
              <DInput type="date" value={newAsset.warranty}
                onChange={e => setNF("warranty", e.target.value)}
                InputLabelProps={{ shrink:true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SLabel sx={{ mb:0.7 }}>Initial Location</SLabel>
              <DInput value={newAsset.location}
                onChange={e => setNF("location", e.target.value)}
                placeholder="e.g. Store Room, CSE Lab 1" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SLabel sx={{ mb:0.7 }}>Notes</SLabel>
              <DInput value={newAsset.notes}
                onChange={e => setNF("notes", e.target.value)}
                placeholder="Optional remarks…" />
            </Grid>
            <Grid item xs={12}>
              <SLabel sx={{ mb:0.7 }}>Invoice / Purchase Order (PDF)</SLabel>
              <Box sx={{ p:2, borderRadius:"9px", textAlign:"center",
                border:`2px dashed ${uploadedInv ? T.success : T.border}`,
                bgcolor: uploadedInv ? T.successLight : "#FAFBFD",
                cursor:"pointer", transition:"all .15s" }}
                onClick={() => document.getElementById("inv-upload").click()}>
                <input id="inv-upload" type="file" accept="application/pdf"
                  style={{ display:"none" }}
                  onChange={e => {
                    if (e.target.files[0]) { setUploadedInv(e.target.files[0].name); toast("Invoice uploaded."); }
                  }} />
                {uploadedInv ? (
                  <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                    <CheckCircle sx={{ fontSize:16, color:T.success }} />
                    <Typography sx={{ fontFamily:fBody, fontWeight:700,
                      fontSize:"0.77rem", color:T.success }}>{uploadedInv}</Typography>
                  </Box>
                ) : (
                  <Box>
                    <UploadFile sx={{ fontSize:22, color:T.textMute, mb:0.3 }} />
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", color:T.textMute }}>
                      Click to upload Invoice / PO (PDF)
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px:3, pb:3, pt:2,
          borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD", gap:1 }}>
          <Button onClick={() => setOpenAddDialog(false)} variant="outlined" size="small"
            sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              borderColor:T.border, color:T.textSub }}>
            Cancel
          </Button>
          <Button variant="contained" size="small"
            startIcon={<Add sx={{fontSize:14}} />}
            onClick={handleAddAsset}
            sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
              textTransform:"none", borderRadius:"8px",
              bgcolor:T.accent, boxShadow:"none",
              "&:hover":{ bgcolor:"#4F46E5", boxShadow:"none" } }}>
            Register Asset
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Asset Detail Dialog ── */}
      <Dialog open={detailDialog} onClose={() => setDetailDialog(false)}
        maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        {detailAsset && (() => {
          const tm = TYPE_META[detailAsset.type] || TYPE_META.Other;
          return (
            <>
              <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Box sx={{ width:4, height:28, borderRadius:2, bgcolor:tm.color }} />
                    <Box>
                      <Typography sx={{ fontFamily:fHead, fontWeight:700,
                        fontSize:"0.9rem", color:T.text }}>{detailAsset.name}</Typography>
                      <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem",
                        color:T.accent }}>{detailAsset.id}</Typography>
                    </Box>
                  </Box>
                  <IconButton size="small" onClick={() => setDetailDialog(false)}
                    sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent sx={{ px:3, pt:3, pb:2 }}>
                <Grid container spacing={1.5}>
                  {[
                    { label:"Asset ID",      value:detailAsset.id           },
                    { label:"Serial No.",    value:detailAsset.sn           },
                    { label:"Type",          value:detailAsset.type         },
                    { label:"Status",        value:detailAsset.status       },
                    { label:"Book Value",    value:fmt(detailAsset.value)   },
                    { label:"Assigned To",   value:detailAsset.user         },
                    { label:"Location",      value:detailAsset.location     },
                    { label:"Purchase Date", value:detailAsset.purchaseDate || "N/A" },
                    { label:"Warranty",      value:detailAsset.warranty     },
                  ].map(s => (
                    <Grid item xs={6} key={s.label}>
                      <Box sx={{ p:1.3, borderRadius:"8px",
                        bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
                        <SLabel sx={{ mb:0.2 }}>{s.label}</SLabel>
                        <Typography sx={{
                          fontFamily: s.label.includes("Value")||s.label.includes("ID")||s.label.includes("No.")
                            ? fMono : fBody,
                          fontWeight:600, fontSize:"0.8rem", color:T.text }}>
                          {s.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </DialogContent>
              <DialogActions sx={{ px:3, pb:3, pt:1.5,
                borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD" }}>
                <Button onClick={() => setDetailDialog(false)} variant="outlined" size="small"
                  sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
                    textTransform:"none", borderRadius:"8px",
                    borderColor:T.border, color:T.textSub }}>
                  Close
                </Button>
                <Button variant="outlined" size="small"
                  startIcon={<FileDownload sx={{fontSize:13}} />}
                  onClick={() => { setDetailDialog(false); toast(`Asset sheet for ${detailAsset.id} downloading…`); }}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
                    textTransform:"none", borderRadius:"8px",
                    borderColor:T.accent, color:T.accent,
                    "&:hover":{ bgcolor:T.accentLight } }}>
                  Download Sheet
                </Button>
              </DialogActions>
            </>
          );
        })()}
      </Dialog>

      {/* ── QR Code Dialog ── */}
      <Dialog open={qrDialog} onClose={() => setQrDialog(false)}
        maxWidth="xs" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        {qrAsset && (
          <>
            <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ width:4, height:28, borderRadius:2, bgcolor:T.purple }} />
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.9rem", color:T.text }}>Asset QR Code</Typography>
                    <Typography sx={{ fontFamily:fMono, fontSize:"0.68rem",
                      color:T.accent }}>{qrAsset.id}</Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={() => setQrDialog(false)}
                  sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ px:3, pt:3, pb:2, textAlign:"center" }}>
              {/* Simulated QR visual */}
              <Box sx={{ width:160, height:160, mx:"auto", mb:2, borderRadius:"10px",
                border:`2px solid ${T.border}`, bgcolor:"#F9FAFB",
                display:"flex", flexDirection:"column", alignItems:"center",
                justifyContent:"center", position:"relative", overflow:"hidden" }}>
                <QrCode sx={{ fontSize:110, color:T.text }} />
                <Box sx={{ position:"absolute", bottom:0, left:0, right:0,
                  bgcolor:T.accent, py:0.4 }}>
                  <Typography sx={{ fontFamily:fMono, fontSize:"0.6rem",
                    fontWeight:700, color:"#fff", textAlign:"center" }}>{qrAsset.id}</Typography>
                </Box>
              </Box>
              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                fontSize:"0.85rem", color:T.text, mb:0.3 }}>{qrAsset.name}</Typography>
              <Typography sx={{ fontFamily:fMono, fontSize:"0.73rem",
                color:T.textMute }}>{qrAsset.sn}</Typography>
              <Box sx={{ mt:2, p:1.5, borderRadius:"8px",
                bgcolor:T.infoLight, border:`1px solid ${T.info}25` }}>
                <Typography sx={{ fontFamily:fBody, fontSize:"0.74rem", color:T.textSub }}>
                  Scan this QR code to instantly view asset details, current assignment, and service history.
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px:3, pb:3, pt:1.5,
              borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD", gap:1 }}>
              <Button onClick={() => setQrDialog(false)} variant="outlined" size="small"
                sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.78rem",
                  textTransform:"none", borderRadius:"8px",
                  borderColor:T.border, color:T.textSub }}>
                Close
              </Button>
              <Button variant="contained" size="small"
                startIcon={<Print sx={{fontSize:13}} />}
                onClick={() => { setQrDialog(false); toast(`QR label for ${qrAsset.id} sent to printer.`); }}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.78rem",
                  textTransform:"none", borderRadius:"8px",
                  bgcolor:T.purple, boxShadow:"none",
                  "&:hover":{ bgcolor:"#6D28D9", boxShadow:"none" } }}>
                Print Label
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ── Transfer Review Dialog ── */}
      <Dialog open={txDialog} onClose={() => setTxDialog(false)}
        maxWidth="sm" fullWidth
        PaperProps={{ sx:{ borderRadius:"16px", border:`1px solid ${T.border}` } }}>
        {selectedTx && (
          <>
            <DialogTitle sx={{ borderBottom:`1px solid ${T.border}`, bgcolor:"#FAFBFD", pb:2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ width:4, height:28, borderRadius:2, bgcolor:T.warning }} />
                  <Box>
                    <Typography sx={{ fontFamily:fHead, fontWeight:700,
                      fontSize:"0.96rem", color:T.text }}>Review Transfer Request</Typography>
                    <Typography sx={{ fontFamily:fBody, fontSize:"0.72rem", color:T.textMute }}>
                      {selectedTx.assetId} · {selectedTx.reason}
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={() => setTxDialog(false)}
                  sx={{ bgcolor:"#F1F5F9", borderRadius:"8px" }}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ px:3, pt:3, pb:2 }}>
              <Typography sx={{ fontFamily:fBody, fontWeight:700,
                fontSize:"0.83rem", color:T.text, mb:1.5 }}>
                {selectedTx.asset}
              </Typography>

              {/* Transfer route */}
              <Box sx={{ p:2, borderRadius:"10px", mb:2.5,
                bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
                  <Box flex={1}>
                    <SLabel sx={{ mb:0.3 }}>Current Owner</SLabel>
                    <Box display="flex" alignItems="center" gap={0.8}>
                      <Avatar sx={{ width:26, height:26, bgcolor:aColor(selectedTx.from).bg,
                        color:aColor(selectedTx.from).color,
                        fontFamily:fHead, fontSize:"0.55rem", fontWeight:700 }}>
                        {initials(selectedTx.from)}
                      </Avatar>
                      <Typography sx={{ fontFamily:fBody, fontWeight:700,
                        fontSize:"0.82rem", color:T.text }}>{selectedTx.from}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ px:1, py:0.5, borderRadius:"8px",
                    bgcolor:T.accentLight, flexShrink:0 }}>
                    <ArrowForward sx={{ fontSize:16, color:T.accent }} />
                  </Box>
                  <Box flex={1} textAlign="right">
                    <SLabel sx={{ mb:0.3, textAlign:"right" }}>New Owner</SLabel>
                    <Box display="flex" alignItems="center" gap={0.8} justifyContent="flex-end">
                      <Avatar sx={{ width:26, height:26, bgcolor:aColor(selectedTx.to).bg,
                        color:aColor(selectedTx.to).color,
                        fontFamily:fHead, fontSize:"0.55rem", fontWeight:700 }}>
                        {initials(selectedTx.to)}
                      </Avatar>
                      <Typography sx={{ fontFamily:fBody, fontWeight:700,
                        fontSize:"0.82rem", color:T.accent }}>{selectedTx.to}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={1.5} mb={2.5}>
                {[
                  { label:"Request Date", value:selectedTx.date   },
                  { label:"Transfer Reason", value:selectedTx.reason },
                ].map(s => (
                  <Grid item xs={6} key={s.label}>
                    <Box sx={{ p:1.3, borderRadius:"8px",
                      bgcolor:"#F9FAFB", border:`1px solid ${T.border}` }}>
                      <SLabel sx={{ mb:0.2 }}>{s.label}</SLabel>
                      <Typography sx={{ fontFamily:fBody, fontWeight:600,
                        fontSize:"0.81rem", color:T.text }}>{s.value}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <SLabel sx={{ mb:0.7 }}>Admin Remarks / Conditions</SLabel>
              <DInput multiline rows={2} value={txRemarks}
                onChange={e => setTxRemarks(e.target.value)}
                placeholder="e.g. Verified physical condition before handover…"
              />
            </DialogContent>

            <DialogActions sx={{ px:3, pb:3, pt:2,
              borderTop:`1px solid ${T.border}`, bgcolor:"#FAFBFD",
              display:"flex", justifyContent:"space-between" }}>
              <Button size="small" variant="outlined"
                startIcon={<Cancel sx={{fontSize:14}} />}
                onClick={() => handleTxAction("reject")}
                sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.77rem",
                  textTransform:"none", borderRadius:"8px",
                  borderColor:T.danger, color:T.danger,
                  "&:hover":{ bgcolor:T.dangerLight } }}>
                Reject Transfer
              </Button>
              <Box display="flex" gap={1}>
                <Button size="small" variant="outlined"
                  onClick={() => setTxDialog(false)}
                  sx={{ fontFamily:fBody, fontWeight:600, fontSize:"0.77rem",
                    textTransform:"none", borderRadius:"8px",
                    borderColor:T.border, color:T.textSub }}>
                  Cancel
                </Button>
                <Button size="small" variant="contained"
                  startIcon={<CheckCircle sx={{fontSize:14}} />}
                  onClick={() => handleTxAction("approve")}
                  sx={{ fontFamily:fBody, fontWeight:700, fontSize:"0.77rem",
                    textTransform:"none", borderRadius:"8px",
                    bgcolor:T.success, boxShadow:"none",
                    "&:hover":{ bgcolor:"#059669", boxShadow:"none" } }}>
                  Approve Transfer
                </Button>
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>

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

export default AssetAdminView;