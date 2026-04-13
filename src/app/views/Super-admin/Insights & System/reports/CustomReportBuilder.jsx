import React, { useState, useRef, useCallback, useMemo } from "react";
import {
    Box, Grid, Typography, Button, TextField, MenuItem, IconButton,
    Divider, Snackbar, Alert, Tooltip, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, Select, FormControl, InputLabel,
    Switch, FormControlLabel
} from "@mui/material";
import {
    DragIndicator, Add, Delete, PictureAsPdf, TableView, Download,
    Save, Visibility, BarChart as BarChartIcon, PieChart, ShowChart,
    TextFields, Functions, FilterAlt, SwapVert, Close, ContentCopy,
    Tune, PlayArrow, RestartAlt, Dashboard, ViewColumn, TableRows,
    Construction, CheckCircle, ErrorOutline, ArrowUpward, ArrowDownward,
    Palette
} from "@mui/icons-material";

/* ═════════════ DESIGN TOKENS ═════════════ */
const T = {
    bg: "#F5F7FA", surface: "#FFFFFF", border: "#E4E8EF",
    accent: "#6366F1", accentLight: "#EEF2FF",
    success: "#10B981", successLight: "#ECFDF5",
    warning: "#F59E0B", warningLight: "#FFFBEB",
    danger: "#EF4444", dangerLight: "#FEF2F2",
    purple: "#7C3AED", purpleLight: "#F5F3FF",
    teal: "#14B8A6", tealLight: "#F0FDFA",
    cyan: "#0891B2", cyanLight: "#ECFEFF",
    pink: "#EC4899", pinkLight: "#FDF2F8",
    text: "#111827", textSub: "#4B5563", textMute: "#9CA3AF",
};
const fH = "Roboto, Helvetica, Arial, sans-serif";
const fB = "Roboto, Helvetica, Arial, sans-serif";
const fM = "Roboto, Helvetica, Arial, sans-serif";

/* ═════════════ DATA SOURCE SCHEMAS ═════════════ */
const DATA_SOURCES = {
    "Faculty": {
        icon: "👨‍🏫", color: T.accent,
        fields: [
            { id: "f_name", label: "Name", type: "text" },
            { id: "f_dept", label: "Department", type: "text" },
            { id: "f_designation", label: "Designation", type: "text" },
            { id: "f_salary", label: "Base Salary", type: "number" },
            { id: "f_experience", label: "Experience (yr)", type: "number" },
            { id: "f_attendance", label: "Attendance %", type: "number" },
            { id: "f_leaves", label: "Leaves Taken", type: "number" },
            { id: "f_publications", label: "Publications", type: "number" },
            { id: "f_join_date", label: "Join Date", type: "date" },
            { id: "f_status", label: "Status", type: "text" },
        ]
    },
    "Students": {
        icon: "🎓", color: T.success,
        fields: [
            { id: "s_name", label: "Name", type: "text" },
            { id: "s_rollno", label: "Roll No", type: "text" },
            { id: "s_dept", label: "Department", type: "text" },
            { id: "s_year", label: "Year", type: "number" },
            { id: "s_cgpa", label: "CGPA", type: "number" },
            { id: "s_hostel", label: "Hostel Block", type: "text" },
            { id: "s_transport", label: "Bus Route", type: "text" },
            { id: "s_fees_paid", label: "Fees Paid (₹)", type: "number" },
            { id: "s_attendance", label: "Attendance %", type: "number" },
        ]
    },
    "Infrastructure": {
        icon: "🏢", color: T.purple,
        fields: [
            { id: "i_name", label: "Facility Name", type: "text" },
            { id: "i_type", label: "Type", type: "text" },
            { id: "i_zone", label: "Zone", type: "text" },
            { id: "i_capacity", label: "Capacity", type: "number" },
            { id: "i_occupancy", label: "Occupancy %", type: "number" },
            { id: "i_maintenance", label: "Maint. Cost (₹)", type: "number" },
            { id: "i_condition", label: "Condition", type: "text" },
            { id: "i_last_audit", label: "Last Audit", type: "date" },
        ]
    },
    "Transport": {
        icon: "🚌", color: T.cyan,
        fields: [
            { id: "t_bus_id", label: "Bus ID", type: "text" },
            { id: "t_route", label: "Route", type: "text" },
            { id: "t_driver", label: "Driver", type: "text" },
            { id: "t_capacity", label: "Capacity", type: "number" },
            { id: "t_occupancy", label: "Avg Occupancy", type: "number" },
            { id: "t_fuel_cost", label: "Fuel Cost (₹)", type: "number" },
            { id: "t_status", label: "Status", type: "text" },
            { id: "t_mileage", label: "Mileage (km)", type: "number" },
        ]
    },
    "Hostel": {
        icon: "🏨", color: T.pink,
        fields: [
            { id: "h_block", label: "Block", type: "text" },
            { id: "h_room_no", label: "Room No", type: "text" },
            { id: "h_occupant", label: "Occupant Name", type: "text" },
            { id: "h_capacity", label: "Room Capacity", type: "number" },
            { id: "h_occupied", label: "Occupied Beds", type: "number" },
            { id: "h_complaints", label: "Complaints", type: "number" },
            { id: "h_mess_rating", label: "Mess Rating", type: "number" },
            { id: "h_fee_status", label: "Fee Status", type: "text" },
        ]
    },
};

/* ═════════════ AGGREGATIONS ═════════════ */
const AGGREGATIONS = [
    { id: "none", label: "Raw Value", icon: "—" },
    { id: "sum", label: "Sum", icon: "Σ" },
    { id: "avg", label: "Average", icon: "x̄" },
    { id: "count", label: "Count", icon: "#" },
    { id: "min", label: "Minimum", icon: "↓" },
    { id: "max", label: "Maximum", icon: "↑" },
];

const CHART_TYPES = [
    { id: "table", label: "Table Only", Icon: TableRows },
    { id: "bar", label: "Bar Chart", Icon: BarChartIcon },
    { id: "line", label: "Line Chart", Icon: ShowChart },
    { id: "pie", label: "Pie Chart", Icon: PieChart },
];

const SORT_OPTIONS = [
    { id: "none", label: "No Sort" },
    { id: "asc", label: "Ascending" },
    { id: "desc", label: "Descending" },
];

/* ═════════════ MOCK DATA GENERATORS ═════════════ */
const DEPTS = ["CSE", "ECE", "Mech", "Civil", "EEE", "IT"];
const NAMES_F = ["Dr. Ananya Sharma", "Dr. Rohit Verma", "Dr. Priya Nair", "Dr. Vikash Kumar", "Dr. Shalini Iyer", "Dr. Manoj Das", "Dr. Kavita Rao", "Dr. Arjun Singh"];
const NAMES_S = ["Rahul M", "Sneha K", "Aditya R", "Pooja S", "Amit P", "Divya N", "Karthik V", "Meera L", "Naveen B", "Sanya D"];

const generateMockData = (source, count = 20) => {
    const rows = [];
    for (let i = 0; i < count; i++) {
        const row = {};
        const src = DATA_SOURCES[source];
        if (!src) break;
        src.fields.forEach(f => {
            if (f.type === "number") {
                const ranges = {
                    f_salary: [35000, 95000], f_experience: [1, 25], f_attendance: [70, 100], f_leaves: [0, 15], f_publications: [0, 30],
                    s_year: [1, 4], s_cgpa: [5.5, 9.8], s_fees_paid: [30000, 120000], s_attendance: [60, 100],
                    i_capacity: [20, 500], i_occupancy: [40, 100], i_maintenance: [5000, 80000],
                    t_capacity: [30, 55], t_occupancy: [15, 50], t_fuel_cost: [2000, 12000], t_mileage: [10000, 80000],
                    h_capacity: [1, 4], h_occupied: [0, 4], h_complaints: [0, 8], h_mess_rating: [2.0, 5.0],
                };
                const [min, max] = ranges[f.id] || [1, 100];
                row[f.id] = f.id.includes("rating") || f.id.includes("cgpa")
                    ? +(min + Math.random() * (max - min)).toFixed(1)
                    : Math.floor(min + Math.random() * (max - min));
            } else if (f.type === "date") {
                const d = new Date(2023, Math.floor(Math.random() * 24), Math.floor(Math.random() * 28) + 1);
                row[f.id] = d.toISOString().split("T")[0];
            } else {
                const textMap = {
                    f_name: NAMES_F, f_dept: DEPTS, f_designation: ["Professor", "Associate Professor", "Assistant Professor"],
                    f_status: ["Active", "On Leave", "Sabbatical"],
                    s_name: NAMES_S, s_rollno: [`R${2023000 + i}`], s_dept: DEPTS, s_hostel: ["Block A", "Block B", "Block C", "Block D"],
                    s_transport: ["Route 1", "Route 2", "Route 3", "Route 4", "None"],
                    i_name: [`Room ${100 + i}`, `Lab ${i + 1}`, `Hall ${i + 1}`], i_type: ["Classroom", "Lab", "Seminar Hall", "Office"],
                    i_zone: ["Zone A", "Zone B", "Zone C", "Zone D"], i_condition: ["Good", "Fair", "Needs Repair"],
                    t_bus_id: [`B-${String(i + 1).padStart(2, "0")}`], t_route: ["Route 1", "Route 2", "Route 3", "Route 4", "Route 5"],
                    t_driver: NAMES_F.map(n => n.replace("Dr. ", "")), t_status: ["On Route", "Idle", "Maintenance"],
                    h_block: ["Boys H1", "Boys H2", "Girls H1", "Girls H2"], h_room_no: [`${100 + i}`],
                    h_occupant: NAMES_S, h_fee_status: ["Paid", "Pending", "Overdue"],
                };
                const opts = textMap[f.id] || ["N/A"];
                row[f.id] = opts[i % opts.length];
            }
        });
        rows.push(row);
    }
    return rows;
};

/* ═════════════ HELPERS ═════════════ */
const applyAggregation = (rows, fieldId, aggType) => {
    const vals = rows.map(r => r[fieldId]).filter(v => typeof v === "number");
    if (vals.length === 0) return 0;
    switch (aggType) {
        case "sum": return vals.reduce((a, b) => a + b, 0);
        case "avg": return +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
        case "count": return vals.length;
        case "min": return Math.min(...vals);
        case "max": return Math.max(...vals);
        default: return null;
    }
};

const SCard = ({ children, sx = {} }) => (
    <Box sx={{ bgcolor: T.surface, border: `1px solid ${T.border}`, borderRadius: "14px", ...sx }}>{children}</Box>
);
const SLabel = ({ children, sx = {} }) => (
    <Typography sx={{ fontFamily: fB, fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMute, mb: 0.5, ...sx }}>{children}</Typography>
);

/* ═════════════ DRAGGABLE FIELD CHIP ═════════════ */
const FieldChip = ({ field, source, onDragStart }) => {
    const srcColor = DATA_SOURCES[source]?.color || T.accent;
    return (
        <Box
            draggable
            onDragStart={(e) => { e.dataTransfer.setData("field", JSON.stringify({ ...field, source })); onDragStart?.(); }}
            sx={{
                display: "flex", alignItems: "center", gap: 0.8,
                px: 1.2, py: 0.65, borderRadius: "8px", cursor: "grab",
                border: `1px solid ${T.border}`, bgcolor: T.surface,
                transition: "all 0.15s",
                "&:hover": { borderColor: srcColor, bgcolor: `${srcColor}08`, transform: "translateX(2px)" },
                "&:active": { cursor: "grabbing", transform: "scale(0.97)" },
            }}
        >
            <DragIndicator sx={{ fontSize: 13, color: T.textMute }} />
            <Typography sx={{ fontFamily: fB, fontSize: "0.76rem", fontWeight: 600, color: T.textSub, flex: 1 }}>{field.label}</Typography>
            <Chip label={field.type} size="small" sx={{ height: 18, fontFamily: fM, fontSize: "0.6rem", fontWeight: 700, bgcolor: `${srcColor}15`, color: srcColor, border: "none" }} />
        </Box>
    );
};

/* ═════════════ DROP ZONE COLUMN CARD ═════════════ */
const ColumnCard = ({ col, index, onRemove, onUpdate, totalCols }) => {
    const srcColor = DATA_SOURCES[col.source]?.color || T.accent;
    return (
        <Box sx={{ p: 1.5, borderRadius: "10px", border: `1px solid ${T.border}`, bgcolor: T.surface, transition: "all 0.2s", "&:hover": { borderColor: srcColor, boxShadow: `0 0 0 2px ${srcColor}15` } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Box display="flex" alignItems="center" gap={0.8}>
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: srcColor }} />
                    <Typography sx={{ fontFamily: fB, fontSize: "0.8rem", fontWeight: 700, color: T.text }}>{col.label}</Typography>
                </Box>
                <Box display="flex" gap={0.3}>
                    <Tooltip title="Move Up"><span><IconButton size="small" disabled={index === 0} onClick={() => onUpdate(index, "moveUp")} sx={{ p: 0.3 }}><ArrowUpward sx={{ fontSize: 13 }} /></IconButton></span></Tooltip>
                    <Tooltip title="Move Down"><span><IconButton size="small" disabled={index === totalCols - 1} onClick={() => onUpdate(index, "moveDown")} sx={{ p: 0.3 }}><ArrowDownward sx={{ fontSize: 13 }} /></IconButton></span></Tooltip>
                    <Tooltip title="Remove"><IconButton size="small" onClick={() => onRemove(index)} sx={{ p: 0.3, color: T.danger }}><Close sx={{ fontSize: 14 }} /></IconButton></Tooltip>
                </Box>
            </Box>
            <Box display="flex" gap={1} flexWrap="wrap">
                <FormControl size="small" sx={{ minWidth: 100, flex: 1 }}>
                    <InputLabel sx={{ fontSize: "0.72rem" }}>Aggregation</InputLabel>
                    <Select value={col.aggregation || "none"} label="Aggregation" onChange={e => onUpdate(index, "aggregation", e.target.value)}
                        sx={{ borderRadius: "7px", fontFamily: fB, fontSize: "0.75rem" }}>
                        {AGGREGATIONS.filter(a => col.type === "number" || a.id === "none" || a.id === "count").map(a => (
                            <MenuItem key={a.id} value={a.id} sx={{ fontSize: "0.78rem" }}><span style={{ marginRight: 6, fontWeight: 700, fontFamily: fM }}>{a.icon}</span> {a.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 90, flex: 1 }}>
                    <InputLabel sx={{ fontSize: "0.72rem" }}>Sort</InputLabel>
                    <Select value={col.sort || "none"} label="Sort" onChange={e => onUpdate(index, "sort", e.target.value)}
                        sx={{ borderRadius: "7px", fontFamily: fB, fontSize: "0.75rem" }}>
                        {SORT_OPTIONS.map(s => (
                            <MenuItem key={s.id} value={s.id} sx={{ fontSize: "0.78rem" }}>{s.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Typography sx={{ fontFamily: fM, fontSize: "0.62rem", color: T.textMute, mt: 0.6 }}>{col.source} · {col.type}</Typography>
        </Box>
    );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const CustomReportBuilder = () => {
    const [activeSource, setActiveSource] = useState("Faculty");
    const [columns, setColumns] = useState([]);
    const [reportName, setReportName] = useState("");
    const [chartType, setChartType] = useState("table");
    const [generated, setGenerated] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [dragOver, setDragOver] = useState(false);
    const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [savedReports, setSavedReports] = useState([
        { name: "Faculty Salary Analysis", cols: 4, source: "Faculty", date: "Apr 10, 2026" },
        { name: "Hostel Occupancy Report", cols: 3, source: "Hostel", date: "Apr 08, 2026" },
        { name: "Transport Utilisation", cols: 5, source: "Transport", date: "Apr 05, 2026" },
    ]);
    const dropRef = useRef(null);

    const toast = (msg, severity = "success") => setSnack({ open: true, msg, severity });

    /* ─── Drop handler ─── */
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        try {
            const field = JSON.parse(e.dataTransfer.getData("field"));
            if (columns.find(c => c.id === field.id && c.source === field.source)) {
                toast("Field already added.", "warning");
                return;
            }
            setColumns(prev => [...prev, { ...field, aggregation: "none", sort: "none" }]);
            setGenerated(false);
            toast(`Added "${field.label}" column`);
        } catch { /* ignore bad drags */ }
    }, [columns]);

    const handleRemoveColumn = (index) => {
        setColumns(prev => prev.filter((_, i) => i !== index));
        setGenerated(false);
    };

    const handleUpdateColumn = (index, key, value) => {
        if (key === "moveUp" && index > 0) {
            setColumns(prev => { const n = [...prev];[n[index - 1], n[index]] = [n[index], n[index - 1]]; return n; });
        } else if (key === "moveDown" && index < columns.length - 1) {
            setColumns(prev => { const n = [...prev];[n[index], n[index + 1]] = [n[index + 1], n[index]]; return n; });
        } else {
            setColumns(prev => prev.map((c, i) => i === index ? { ...c, [key]: value } : c));
        }
        setGenerated(false);
    };

    /* ─── Generate ─── */
    const handleGenerate = () => {
        if (columns.length === 0) { toast("Add at least one column.", "error"); return; }
        const sources = [...new Set(columns.map(c => c.source))];
        let allRows = [];
        sources.forEach(src => { allRows = allRows.concat(generateMockData(src, 15)); });

        const hasAgg = columns.some(c => c.aggregation && c.aggregation !== "none");
        let preview;

        if (hasAgg) {
            const groupCol = columns.find(c => c.aggregation === "none" && c.type === "text");
            if (groupCol) {
                const groups = {};
                allRows.forEach(r => {
                    const key = r[groupCol.id] || "Other";
                    if (!groups[key]) groups[key] = [];
                    groups[key].push(r);
                });
                preview = Object.entries(groups).map(([key, rows]) => {
                    const row = { [groupCol.id]: key };
                    columns.forEach(c => {
                        if (c.id === groupCol.id) return;
                        if (c.aggregation && c.aggregation !== "none") {
                            row[c.id] = applyAggregation(rows, c.id, c.aggregation);
                        } else {
                            row[c.id] = rows[0]?.[c.id] ?? "—";
                        }
                    });
                    return row;
                });
            } else {
                const row = {};
                columns.forEach(c => {
                    if (c.aggregation && c.aggregation !== "none") {
                        row[c.id] = applyAggregation(allRows, c.id, c.aggregation);
                    } else {
                        row[c.id] = "All";
                    }
                });
                preview = [row];
            }
        } else {
            preview = allRows.map(r => {
                const row = {};
                columns.forEach(c => { row[c.id] = r[c.id] ?? "—"; });
                return row;
            });
        }

        const sortCol = columns.find(c => c.sort && c.sort !== "none");
        if (sortCol && preview.length > 1) {
            preview.sort((a, b) => {
                const va = a[sortCol.id], vb = b[sortCol.id];
                const cmp = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb));
                return sortCol.sort === "desc" ? -cmp : cmp;
            });
        }

        setPreviewData(preview);
        setGenerated(true);
        toast(`Report generated — ${preview.length} rows`, "success");
    };

    const handleExport = (format) => {
        if (!generated) { toast("Generate first.", "error"); return; }
        if (format === "CSV") {
            const headers = columns.map(c => c.label).join(",");
            const rows = previewData.map(r => columns.map(c => r[c.id] ?? "").join(",")).join("\n");
            const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = `${reportName || "custom_report"}.csv`; a.click();
            URL.revokeObjectURL(url);
            toast("CSV downloaded!");
        } else {
            toast(`Exporting as ${format}…`);
        }
    };

    const handleSave = () => {
        if (!reportName.trim()) { toast("Enter a report name.", "error"); return; }
        setSavedReports(prev => [{ name: reportName, cols: columns.length, source: columns[0]?.source || "—", date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) }, ...prev]);
        setSaveDialogOpen(false);
        toast("Report template saved!");
    };

    const handleReset = () => {
        setColumns([]); setGenerated(false); setPreviewData([]); setReportName(""); setChartType("table");
        toast("Builder reset.", "info");
    };

    /* ─── SVG Bar Chart ─── */
    const SVGPreviewChart = useMemo(() => {
        if (!generated || chartType === "table" || columns.length === 0) return null;
        const numCol = columns.find(c => c.type === "number");
        const labelCol = columns.find(c => c.type === "text");
        if (!numCol || !labelCol) return null;

        const data = previewData.slice(0, 12);
        const vals = data.map(r => typeof r[numCol.id] === "number" ? r[numCol.id] : 0);
        const maxVal = Math.max(...vals, 1);
        const W = 520, H = 200, PAD = { top: 20, right: 20, bottom: 44, left: 50 };
        const chartW = W - PAD.left - PAD.right, chartH = H - PAD.top - PAD.bottom;
        const barW = Math.max(16, Math.floor(chartW / data.length) - 8);
        const step = chartW / data.length;
        const srcColor = DATA_SOURCES[numCol.source]?.color || T.accent;

        if (chartType === "pie") {
            const total = vals.reduce((a, b) => a + b, 0) || 1;
            const colors = [T.accent, T.success, T.warning, T.danger, T.purple, T.teal, T.cyan, T.pink, "#6366F1", "#D97706", "#059669", "#DB2777"];
            let cum = 0;
            return (
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 4, py: 2 }}>
                    <svg viewBox="0 0 200 200" style={{ width: 180, height: 180 }}>
                        {data.map((r, i) => {
                            const pct = vals[i] / total;
                            const startAngle = cum * 2 * Math.PI - Math.PI / 2;
                            cum += pct;
                            const endAngle = cum * 2 * Math.PI - Math.PI / 2;
                            const largeArc = pct > 0.5 ? 1 : 0;
                            const x1 = 100 + 80 * Math.cos(startAngle), y1 = 100 + 80 * Math.sin(startAngle);
                            const x2 = 100 + 80 * Math.cos(endAngle), y2 = 100 + 80 * Math.sin(endAngle);
                            return <path key={i} d={`M100,100 L${x1},${y1} A80,80 0 ${largeArc},1 ${x2},${y2} Z`} fill={colors[i % colors.length]} opacity={0.85} />;
                        })}
                        <circle cx={100} cy={100} r={40} fill={T.surface} />
                    </svg>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        {data.slice(0, 8).map((r, i) => (
                            <Box key={i} display="flex" alignItems="center" gap={0.8}>
                                <Box sx={{ width: 10, height: 10, borderRadius: "2px", bgcolor: [T.accent, T.success, T.warning, T.danger, T.purple, T.teal, T.cyan, T.pink][i % 8] }} />
                                <Typography sx={{ fontFamily: fB, fontSize: "0.7rem", color: T.textSub }}>{String(r[labelCol.id]).slice(0, 14)}</Typography>
                                <Typography sx={{ fontFamily: fM, fontSize: "0.65rem", fontWeight: 700, color: T.text, ml: "auto" }}>{vals[i]}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            );
        }

        return (
            <Box sx={{ width: "100%", overflowX: "auto" }}>
                <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxHeight: 220, display: "block" }}>
                    {[0, 25, 50, 75, 100].filter(v => v <= maxVal * 1.1).map(v => {
                        const scaled = Math.round(maxVal * v / 100);
                        const y = PAD.top + chartH - (scaled / maxVal) * chartH;
                        return (
                            <g key={v}>
                                <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke={T.border} strokeDasharray="4 3" />
                                <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="9" fill={T.textMute} fontFamily={fM}>{scaled}</text>
                            </g>
                        );
                    })}
                    {data.map((r, i) => {
                        const val = vals[i], pct = Math.min(val / maxVal, 1);
                        const bH = pct * chartH;
                        const x = PAD.left + i * step + (step - barW) / 2, y = PAD.top + chartH - bH;
                        const label = String(r[labelCol.id] || "");
                        if (chartType === "line") {
                            const cx = PAD.left + i * step + step / 2, cy = y + bH / 2 - bH + PAD.top + chartH - (pct * chartH);
                            const actualY = PAD.top + chartH - pct * chartH;
                            const prevX = i > 0 ? PAD.left + (i - 1) * step + step / 2 : null;
                            const prevPct = i > 0 ? Math.min(vals[i - 1] / maxVal, 1) : 0;
                            const prevY = i > 0 ? PAD.top + chartH - prevPct * chartH : null;
                            return (
                                <g key={i}>
                                    {prevX !== null && <line x1={prevX} y1={prevY} x2={cx} y2={actualY} stroke={srcColor} strokeWidth="2" />}
                                    <circle cx={cx} cy={actualY} r="4" fill={srcColor} />
                                    <text x={cx} y={actualY - 8} textAnchor="middle" fontSize="9" fill={srcColor} fontFamily={fM} fontWeight="700">{val}</text>
                                    <text x={cx} y={H - PAD.bottom + 14} textAnchor="middle" fontSize="7.5" fill={T.textSub} fontFamily={fB}>{label.length > 7 ? label.slice(0, 6) + "…" : label}</text>
                                </g>
                            );
                        }
                        return (
                            <g key={i}>
                                <rect x={x} y={PAD.top} width={barW} height={chartH} rx="4" fill={T.border} opacity="0.3" />
                                <rect x={x} y={y} width={barW} height={bH} rx="4" fill={srcColor} opacity="0.85" />
                                <text x={x + barW / 2} y={Math.max(y - 4, PAD.top + 10)} textAnchor="middle" fontSize="9" fill={srcColor} fontFamily={fM} fontWeight="700">{val}</text>
                                <text x={x + barW / 2} y={H - PAD.bottom + 14} textAnchor="middle" fontSize="7.5" fill={T.textSub} fontFamily={fB}>{label.length > 7 ? label.slice(0, 6) + "…" : label}</text>
                            </g>
                        );
                    })}
                    <line x1={PAD.left} y1={PAD.top + chartH} x2={W - PAD.right} y2={PAD.top + chartH} stroke={T.border} strokeWidth="1.5" />
                    <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + chartH} stroke={T.border} strokeWidth="1.5" />
                </svg>
            </Box>
        );
    }, [generated, chartType, columns, previewData]);

    const srcMeta = DATA_SOURCES[activeSource];

    /* ═════════════ RENDER ═════════════ */
    return (
        <Box sx={{ p: 3, bgcolor: T.bg, minHeight: "100vh", fontFamily: fB }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
        * { box-sizing:border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        .fu  { animation: fadeUp 0.3s ease both; }
        .fu1 { animation: fadeUp 0.3s .06s ease both; }
        .fu2 { animation: fadeUp 0.3s .12s ease both; }
        .row-h:hover { background:#F9FAFB !important; transition:background .15s; }
        .drop-active { background: ${T.accentLight} !important; border-color: ${T.accent} !important; }
      `}</style>

            {/* ── Header ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2} className="fu">
                <Box>
                    <Typography sx={{ fontFamily: fB, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Reports · Builder</Typography>
                    <Typography sx={{ fontFamily: fH, fontWeight: 700, fontSize: "1.5rem", color: T.text }}>Custom Report Builder</Typography>
                    <Typography sx={{ fontFamily: fB, fontSize: "0.82rem", color: T.textSub, mt: 0.3 }}>Drag fields from data sources to build custom reports. Configure aggregations, sorting, and chart type.</Typography>
                </Box>
                <Box display="flex" gap={1}>
                    <Button variant="outlined" startIcon={<RestartAlt sx={{ fontSize: 15 }} />} onClick={handleReset}
                        sx={{ fontFamily: fB, fontWeight: 600, fontSize: "0.78rem", textTransform: "none", borderRadius: "8px", borderColor: T.border, color: T.textSub }}>Reset</Button>
                    <Button variant="outlined" startIcon={<Save sx={{ fontSize: 15 }} />} onClick={() => setSaveDialogOpen(true)}
                        sx={{ fontFamily: fB, fontWeight: 600, fontSize: "0.78rem", textTransform: "none", borderRadius: "8px", borderColor: T.accent, color: T.accent }}>Save Template</Button>
                </Box>
            </Box>

            <Grid container spacing={2.5} alignItems="flex-start">
                {/* ═══ LEFT: Data Sources & Fields ═══ */}
                <Grid item xs={12} md={3}>
                    <SCard sx={{ p: 2, position: "sticky", top: 24 }} className="fu">
                        <SLabel sx={{ mb: 1.2 }}>Data Sources</SLabel>
                        <Box display="flex" flexWrap="wrap" gap={0.8} mb={2}>
                            {Object.entries(DATA_SOURCES).map(([key, src]) => (
                                <Chip key={key} label={`${src.icon} ${key}`} size="small"
                                    onClick={() => setActiveSource(key)}
                                    sx={{
                                        fontFamily: fB, fontSize: "0.72rem", fontWeight: activeSource === key ? 700 : 500, cursor: "pointer",
                                        bgcolor: activeSource === key ? `${src.color}15` : "transparent",
                                        color: activeSource === key ? src.color : T.textSub,
                                        border: `1.5px solid ${activeSource === key ? src.color : T.border}`,
                                        "&:hover": { borderColor: src.color },
                                    }}
                                />
                            ))}
                        </Box>

                        <Divider sx={{ borderColor: T.border, mb: 1.5 }} />

                        <SLabel sx={{ mb: 1 }}>Available Fields — {activeSource}</SLabel>
                        <Box display="flex" flexDirection="column" gap={0.8} sx={{ maxHeight: 420, overflowY: "auto", pr: 0.5, "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { bgcolor: T.border, borderRadius: 4 } }}>
                            {srcMeta?.fields.map(f => (
                                <FieldChip key={f.id} field={f} source={activeSource} />
                            ))}
                        </Box>

                        <Divider sx={{ borderColor: T.border, my: 2 }} />

                        <SLabel sx={{ mb: 1 }}>Saved Templates</SLabel>
                        <Box display="flex" flexDirection="column" gap={0.8}>
                            {savedReports.map((r, i) => (
                                <Box key={i} sx={{ px: 1.2, py: 0.8, borderRadius: "8px", border: `1px solid ${T.border}`, cursor: "pointer", transition: "all 0.15s", "&:hover": { borderColor: T.accent, bgcolor: T.accentLight } }}>
                                    <Typography sx={{ fontFamily: fB, fontSize: "0.76rem", fontWeight: 600, color: T.text }}>{r.name}</Typography>
                                    <Typography sx={{ fontFamily: fM, fontSize: "0.62rem", color: T.textMute }}>{r.cols} cols · {r.source} · {r.date}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </SCard>
                </Grid>

                {/* ═══ CENTER: Builder Canvas ═══ */}
                <Grid item xs={12} md={4}>
                    <SCard sx={{ p: 2, minHeight: 520 }} className="fu1">
                        <SLabel sx={{ mb: 1 }}>Report Configuration</SLabel>

                        {/* Report Name */}
                        <TextField size="small" fullWidth placeholder="Enter report name…" value={reportName} onChange={e => setReportName(e.target.value)}
                            sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fB, fontSize: "0.85rem", "& fieldset": { borderColor: T.border } } }} />

                        {/* Chart Type */}
                        <SLabel sx={{ mb: 0.8 }}>Visualization</SLabel>
                        <Box display="flex" gap={0.8} mb={2} flexWrap="wrap">
                            {CHART_TYPES.map(ct => (
                                <Box key={ct.id} onClick={() => setChartType(ct.id)}
                                    sx={{
                                        display: "flex", alignItems: "center", gap: 0.6,
                                        px: 1.2, py: 0.7, borderRadius: "8px", cursor: "pointer",
                                        border: `1.5px solid ${chartType === ct.id ? T.accent : T.border}`,
                                        bgcolor: chartType === ct.id ? T.accentLight : "transparent",
                                        transition: "all 0.15s",
                                        "&:hover": { borderColor: T.accent },
                                    }}>
                                    <ct.Icon sx={{ fontSize: 14, color: chartType === ct.id ? T.accent : T.textMute }} />
                                    <Typography sx={{ fontFamily: fB, fontSize: "0.72rem", fontWeight: chartType === ct.id ? 700 : 500, color: chartType === ct.id ? T.accent : T.textSub }}>{ct.label}</Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* Drop Zone */}
                        <SLabel sx={{ mb: 0.8 }}>Report Columns — Drag fields here</SLabel>
                        <Box
                            ref={dropRef}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            sx={{
                                minHeight: columns.length > 0 ? "auto" : 160,
                                p: 1.5, borderRadius: "10px",
                                border: `2px dashed ${dragOver ? T.accent : T.border}`,
                                bgcolor: dragOver ? T.accentLight : "#FAFBFD",
                                transition: "all 0.2s",
                                display: "flex", flexDirection: "column", gap: 1,
                            }}
                        >
                            {columns.length === 0 && (
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 4, color: T.textMute }}>
                                    <ViewColumn sx={{ fontSize: 36, mb: 1, opacity: 0.4 }} />
                                    <Typography sx={{ fontFamily: fB, fontSize: "0.8rem", fontWeight: 600, textAlign: "center" }}>Drop fields here to add columns</Typography>
                                    <Typography sx={{ fontFamily: fB, fontSize: "0.7rem", textAlign: "center", mt: 0.3 }}>Drag from the data source panel on the left</Typography>
                                </Box>
                            )}
                            {columns.map((col, i) => (
                                <ColumnCard key={`${col.id}-${i}`} col={col} index={i} totalCols={columns.length} onRemove={handleRemoveColumn} onUpdate={handleUpdateColumn} />
                            ))}
                        </Box>

                        {/* Generate Button */}
                        <Button variant="contained" fullWidth size="large" startIcon={<PlayArrow sx={{ fontSize: 18 }} />}
                            onClick={handleGenerate} disabled={columns.length === 0}
                            sx={{
                                mt: 2, fontFamily: fB, fontWeight: 700, fontSize: "0.88rem", textTransform: "none",
                                borderRadius: "10px", py: 1.3, bgcolor: T.accent, boxShadow: "none",
                                "&:hover": { bgcolor: "#5558e6", boxShadow: "none" },
                                "&.Mui-disabled": { bgcolor: "#F1F5F9", color: T.textMute },
                            }}>
                            Generate Report
                        </Button>
                    </SCard>
                </Grid>

                {/* ═══ RIGHT: Preview ═══ */}
                <Grid item xs={12} md={5}>
                    <SCard sx={{ overflow: "hidden", minHeight: 520, display: "flex", flexDirection: "column" }} className="fu2">
                        {/* Toolbar */}
                        <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                            <Box>
                                <Typography sx={{ fontFamily: fH, fontWeight: 700, fontSize: "0.88rem", color: generated ? T.text : T.textMute }}>
                                    {generated ? (reportName || "Untitled Report") : "Preview Area"}
                                </Typography>
                                {generated && <Typography sx={{ fontFamily: fB, fontSize: "0.68rem", color: T.textMute, mt: 0.2 }}>{previewData.length} rows · {columns.length} columns · {chartType}</Typography>}
                            </Box>
                            <Box display="flex" gap={0.8}>
                                {[
                                    { label: "PDF", Icon: PictureAsPdf, fmt: "PDF" },
                                    { label: "Excel", Icon: TableView, fmt: "Excel" },
                                    { label: "CSV", Icon: Download, fmt: "CSV" },
                                ].map(e => (
                                    <Button key={e.fmt} size="small" variant="outlined" startIcon={<e.Icon sx={{ fontSize: 13 }} />}
                                        onClick={() => handleExport(e.fmt)} disabled={!generated}
                                        sx={{ fontFamily: fB, fontWeight: 600, fontSize: "0.7rem", textTransform: "none", borderRadius: "7px", borderColor: T.border, color: generated ? T.textSub : T.textMute, "&:hover": { borderColor: T.accent, color: T.accent } }}>
                                        {e.label}
                                    </Button>
                                ))}
                            </Box>
                        </Box>

                        {/* Content */}
                        <Box sx={{ p: 2.5, flex: 1, overflow: "auto" }}>
                            {!generated ? (
                                <Box sx={{ height: "100%", minHeight: 350, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: T.textMute }}>
                                    <Box sx={{ p: 3, borderRadius: "50%", bgcolor: "#F1F5F9", mb: 2 }}>
                                        <Construction sx={{ fontSize: 44, color: T.textMute, opacity: 0.5 }} />
                                    </Box>
                                    <Typography sx={{ fontFamily: fB, fontWeight: 700, fontSize: "0.9rem", color: T.textMute, mb: 0.5 }}>Build Your Report</Typography>
                                    <Typography sx={{ fontFamily: fB, fontSize: "0.78rem", color: T.textMute, textAlign: "center", maxWidth: 280 }}>
                                        1. Select a data source   2. Drag fields to columns   3. Configure aggregation & sort   4. Click Generate
                                    </Typography>
                                </Box>
                            ) : (
                                <Box className="fu">
                                    {/* Column source badges */}
                                    <Box display="flex" gap={0.8} flexWrap="wrap" mb={2}>
                                        {columns.map((c, i) => (
                                            <Box key={i} sx={{ px: 1, py: 0.3, borderRadius: "99px", bgcolor: `${DATA_SOURCES[c.source]?.color || T.accent}12`, border: `1px solid ${DATA_SOURCES[c.source]?.color || T.accent}25` }}>
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.65rem", fontWeight: 700, color: DATA_SOURCES[c.source]?.color || T.accent }}>
                                                    {c.label}{c.aggregation !== "none" ? ` (${AGGREGATIONS.find(a => a.id === c.aggregation)?.icon})` : ""}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                    {/* Chart */}
                                    {chartType !== "table" && SVGPreviewChart && (
                                        <SCard sx={{ p: 2, mb: 2 }}>
                                            <Typography sx={{ fontFamily: fH, fontWeight: 700, fontSize: "0.82rem", color: T.text, mb: 1 }}>
                                                {CHART_TYPES.find(c => c.id === chartType)?.label} — Visual Overview
                                            </Typography>
                                            {SVGPreviewChart}
                                        </SCard>
                                    )}

                                    {/* Table */}
                                    <SCard sx={{ overflow: "hidden" }}>
                                        <Box sx={{ px: 2, py: 1.2, borderBottom: `1px solid ${T.border}`, bgcolor: "#FAFBFD", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography sx={{ fontFamily: fB, fontWeight: 700, fontSize: "0.8rem", color: T.text }}>Data Table</Typography>
                                            <Typography sx={{ fontFamily: fM, fontSize: "0.68rem", color: T.textMute }}>{previewData.length} rows</Typography>
                                        </Box>
                                        <Box sx={{ overflowX: "auto" }}>
                                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                <thead>
                                                    <tr style={{ background: "#F9FAFB" }}>
                                                        {columns.map((c, i) => (
                                                            <th key={i} style={{ padding: "10px 14px", fontFamily: fB, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: T.textMute, textAlign: "left", borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>
                                                                {c.label}
                                                                {c.aggregation !== "none" && <span style={{ marginLeft: 4, fontFamily: fM, color: DATA_SOURCES[c.source]?.color || T.accent }}>{AGGREGATIONS.find(a => a.id === c.aggregation)?.icon}</span>}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {previewData.slice(0, 25).map((row, ri) => (
                                                        <tr key={ri} className="row-h" style={{ borderBottom: `1px solid ${T.border}` }}>
                                                            {columns.map((c, ci) => (
                                                                <td key={ci} style={{ padding: "9px 14px", fontFamily: c.type === "number" ? fM : fB, fontSize: "0.8rem", color: ci === 0 ? T.text : T.textSub, fontWeight: ci === 0 ? 700 : 400, whiteSpace: "nowrap" }}>
                                                                    {row[c.id] != null ? (typeof row[c.id] === "number" ? row[c.id].toLocaleString() : row[c.id]) : "—"}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </Box>
                                        {previewData.length > 25 && (
                                            <Box sx={{ px: 2, py: 1, borderTop: `1px solid ${T.border}`, textAlign: "center" }}>
                                                <Typography sx={{ fontFamily: fB, fontSize: "0.72rem", color: T.textMute }}>Showing 25 of {previewData.length} rows</Typography>
                                            </Box>
                                        )}
                                    </SCard>
                                </Box>
                            )}
                        </Box>
                    </SCard>
                </Grid>
            </Grid>

            {/* ═══ Save Dialog ═══ */}
            <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "14px" } }}>
                <DialogTitle sx={{ fontFamily: fH, fontWeight: 700 }}>Save Report Template</DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontFamily: fB, fontSize: "0.82rem", color: T.textSub, mb: 2 }}>Save this column configuration as a reusable template.</Typography>
                    <TextField fullWidth size="small" label="Report Name" value={reportName} onChange={e => setReportName(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontFamily: fB } }} />
                    <Box sx={{ mt: 2, p: 1.5, borderRadius: "8px", bgcolor: T.bg, border: `1px solid ${T.border}` }}>
                        <Typography sx={{ fontFamily: fB, fontSize: "0.72rem", fontWeight: 700, color: T.textMute, mb: 0.5 }}>Template Summary</Typography>
                        <Typography sx={{ fontFamily: fM, fontSize: "0.78rem", color: T.text }}>{columns.length} columns from {[...new Set(columns.map(c => c.source))].join(", ") || "—"}</Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setSaveDialogOpen(false)} sx={{ fontFamily: fB, textTransform: "none" }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} sx={{ fontFamily: fB, textTransform: "none", bgcolor: T.accent, borderRadius: "8px" }}>Save Template</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity={snack.severity} sx={{ borderRadius: "10px", fontFamily: fB, fontWeight: 600 }} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
};

export default CustomReportBuilder;
