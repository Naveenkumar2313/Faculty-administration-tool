import React, { useState } from 'react';
import {
  Box, Grid, Typography, Button, Table, TableBody, TableCell,
  TableHead, TableRow, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Snackbar, Alert
} from "@mui/material";
import {
  AccessTime, Download, CheckCircle, Warning,
  Fingerprint, History, Close, ExitToApp, Login
} from '@mui/icons-material';

const T = {
  bg:"#F5F7FA", surface:"#FFFFFF", border:"#E4E8EF",
  accent:"#6366F1", accentLight:"#EEF2FF",
  success:"#10B981", successLight:"#ECFDF5",
  warning:"#F59E0B", warningLight:"#FFFBEB",
  danger:"#EF4444", dangerLight:"#FEF2F2",
  info:"#0EA5E9", infoLight:"#F0F9FF",
  text:"#111827", textSub:"#4B5563", textMute:"#9CA3AF",
};
const fHead = "Roboto, Helvetica, Arial, sans-serif";
const fBody = "Roboto, Helvetica, Arial, sans-serif";
const fMono = "Roboto, Helvetica, Arial, sans-serif";

const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Nunito:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
    *{box-sizing:border-box}
    @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
    .fu{animation:fadeUp .28s ease both}
    .fu1{animation:fadeUp .28s .07s ease both}
    .fu2{animation:fadeUp .28s .14s ease both}
    .row-h:hover{background:#F9FAFB!important;transition:background .13s}
    .card-h{transition:box-shadow .16s,transform .16s}
    .card-h:hover{box-shadow:0 4px 20px rgba(99,102,241,.11);transform:translateY(-2px)}
  `}</style>
);

const ATTENDANCE_DATA = [
  {id:1,date:"Oct 24, 2023",in:"09:05 AM",out:"05:10 PM",hours:"8h 05m",hoursNum:8.08,status:"Present",type:"On-Time"},
  {id:2,date:"Oct 23, 2023",in:"09:45 AM",out:"05:30 PM",hours:"7h 45m",hoursNum:7.75,status:"Present",type:"Late"},
  {id:3,date:"Oct 22, 2023",in:"-",out:"-",hours:"0h 00m",hoursNum:0,status:"Absent",type:"Leave"},
  {id:4,date:"Oct 21, 2023",in:"09:00 AM",out:"01:00 PM",hours:"4h 00m",hoursNum:4.0,status:"Half-Day",type:"Early Departure"},
];
const CHART_DATA=[{day:"Mon",mine:8.2,avg:7.8},{day:"Tue",mine:7.5,avg:7.8},{day:"Wed",mine:8.0,avg:7.9},{day:"Thu",mine:6.5,avg:7.8},{day:"Fri",mine:8.5,avg:7.6}];
const TYPE_META={"On-Time":{color:T.success,bg:T.successLight},"Late":{color:T.warning,bg:T.warningLight},"Leave":{color:T.danger,bg:T.dangerLight},"Early Departure":{color:T.info,bg:T.infoLight}};

const SCard=({children,sx={},hover=false,...p})=>(
  <Box className={hover?"card-h":""} sx={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:"14px",...sx}} {...p}>{children}</Box>
);
const SLabel=({children,sx={}})=>(
  <Typography sx={{fontFamily:fBody,fontSize:"0.67rem",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:T.textMute,mb:0.5,...sx}}>{children}</Typography>
);
const TH=({children,align})=>(
  <TableCell align={align} sx={{fontFamily:fBody,fontWeight:700,fontSize:"0.68rem",letterSpacing:"0.06em",textTransform:"uppercase",color:T.textMute,borderBottom:`1px solid ${T.border}`,py:1.5,bgcolor:"#F9FAFB",whiteSpace:"nowrap"}}>{children}</TableCell>
);
const TD=({children,sx={},align})=>(
  <TableCell align={align} sx={{fontFamily:fBody,fontSize:"0.81rem",color:T.textSub,borderBottom:`1px solid ${T.border}`,py:1.9,...sx}}>{children}</TableCell>
);
const DInput=({sx={},...props})=>(
  <TextField size="small" fullWidth {...props} sx={{"& .MuiOutlinedInput-root":{borderRadius:"9px",fontFamily:fBody,fontSize:"0.83rem",bgcolor:T.surface,"& fieldset":{borderColor:T.border},"&.Mui-focused fieldset":{borderColor:T.accent}},"& .MuiInputLabel-root.Mui-focused":{color:T.accent},...sx}}/>
);
const StatusPill=({type})=>{
  const m=TYPE_META[type]||{color:T.textMute,bg:"#F1F5F9"};
  return(
    <Box display="flex" alignItems="center" gap={0.6} sx={{px:1.2,py:0.38,borderRadius:"99px",bgcolor:m.bg,width:"fit-content"}}>
      <Box sx={{width:6,height:6,borderRadius:"50%",bgcolor:m.color}}/>
      <Typography sx={{fontFamily:fBody,fontSize:"0.71rem",fontWeight:700,color:m.color}}>{type}</Typography>
    </Box>
  );
};

const MiniChart=({data})=>{
  const W=400,H=130,PAD={l:28,r:10,t:8,b:22};
  const cW=W-PAD.l-PAD.r,cH=H-PAD.t-PAD.b,max=10,gW=cW/data.length,bW=18;
  const avgPts=data.map((d,i)=>`${PAD.l+i*gW+gW/2},${PAD.t+cH-(d.avg/max)*cH}`).join(" ");
  return(
    <Box>
      <Box display="flex" gap={2} mb={1.2}>
        <Box display="flex" alignItems="center" gap={0.6}>
          <Box sx={{width:10,height:10,borderRadius:"2px",bgcolor:T.accent}}/>
          <Typography sx={{fontFamily:fBody,fontSize:"0.69rem",color:T.textMute}}>My Hours</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={0.6}>
          <Box sx={{width:14,height:3,borderRadius:"99px",bgcolor:T.warning}}/>
          <Typography sx={{fontFamily:fBody,fontSize:"0.69rem",color:T.textMute}}>Dept Avg</Typography>
        </Box>
      </Box>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block",overflow:"visible"}}>
        {[0,2,4,6,8,10].map(v=>{
          const y=PAD.t+cH-(v/max)*cH;
          return(<g key={v}><line x1={PAD.l} y1={y} x2={W-PAD.r} y2={y} stroke={T.border} strokeDasharray="3 3" strokeWidth={1}/><text x={PAD.l-5} y={y+4} textAnchor="end" fontSize={9} fill={T.textMute} fontFamily={fBody}>{v}</text></g>);
        })}
        <polyline points={avgPts} fill="none" stroke={T.warning} strokeWidth={2} strokeDasharray="5 3" opacity={0.9}/>
        {data.map((d,i)=>{
          const cx=PAD.l+i*gW+gW/2,bH=(d.mine/max)*cH,by=PAD.t+cH-bH,ay=PAD.t+cH-(d.avg/max)*cH;
          return(<g key={d.day}><rect x={cx-bW/2} y={by} width={bW} height={bH} rx={4} fill={d.mine===0?T.border:T.accent} opacity={0.85}/><circle cx={cx} cy={ay} r={4} fill={T.warning}/><text x={cx} y={H-3} textAnchor="middle" fontSize={10} fill={T.textMute} fontFamily={fBody}>{d.day}</text></g>);
        })}
      </svg>
    </Box>
  );
};

const AttendanceView=()=>{
  const [openReg,setOpenReg]=useState(false);
  const [selLog,setSelLog]=useState(null);
  const [reason,setReason]=useState("");
  const [just,setJust]=useState("");
  const [snack,setSnack]=useState({open:false,msg:"",severity:"success"});
  const toast=(msg,severity="success")=>setSnack({open:true,msg,severity});
  const openDialog=(row)=>{setSelLog(row);setReason("");setJust("");setOpenReg(true);};
  const closeDialog=()=>{setOpenReg(false);setSelLog(null);};
  const submit=()=>{
    if(!reason){toast("Please select a reason.","error");return;}
    if(!just){toast("Please add a justification.","error");return;}
    closeDialog();toast(`Regularization for ${selLog?.date} submitted.`);
  };
  const canReg=(r)=>r.type==="Late"||r.type==="Early Departure"||r.status==="Absent";

  return(
    <Box sx={{p:3,bgcolor:T.bg,minHeight:"100vh",fontFamily:fBody}}>
      <Fonts/>

      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2} className="fu">
        <Box>
          <Typography sx={{fontFamily:fBody,fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:T.textMute,mb:0.3}}>Faculty Portal · October 2023</Typography>
          <Typography sx={{fontFamily:fHead,fontWeight:700,fontSize:"1.5rem",color:T.text}}>Attendance Logs</Typography>
          <Typography sx={{fontFamily:fBody,fontSize:"0.82rem",color:T.textSub,mt:0.3}}>Dr. Sarah Smith · Department of Computer Science</Typography>
        </Box>
        <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="center" pt={0.5}>
          <Box display="flex" alignItems="center" gap={0.7} sx={{px:1.5,py:0.6,borderRadius:"99px",bgcolor:T.successLight,border:`1.5px solid ${T.success}30`}}>
            <Box sx={{width:7,height:7,borderRadius:"50%",bgcolor:T.success,animation:"pulse 2s infinite"}}/>
            <Typography sx={{fontFamily:fBody,fontWeight:700,fontSize:"0.72rem",color:T.success}}>Geo-fencing Active: Campus Zone A</Typography>
          </Box>
          <Button size="small" variant="outlined" startIcon={<Download sx={{fontSize:15}}/>} onClick={()=>toast("Report downloaded.")}
            sx={{fontFamily:fBody,fontWeight:700,fontSize:"0.76rem",textTransform:"none",borderRadius:"8px",borderColor:T.border,color:T.textSub,"&:hover":{borderColor:T.accent,color:T.accent}}}>
            Download Report
          </Button>
        </Box>
      </Box>

      {/* SUMMARY ROW — same 3-col layout */}
      <Grid container spacing={2.5} mb={3} className="fu1">

        {/* Col 1: Monthly Hours */}
        <Grid item xs={12} md={4}>
          <SCard sx={{p:2.8,height:"100%",display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
              <Typography sx={{fontFamily:fHead,fontWeight:700,fontSize:"0.86rem",color:T.text}}>Monthly Hours</Typography>
              <Box sx={{px:1.2,py:0.38,borderRadius:"99px",bgcolor:T.accentLight,border:`1.5px solid ${T.accent}20`}}>
                <Typography sx={{fontFamily:fBody,fontWeight:700,fontSize:"0.69rem",color:T.accent}}>85% Target Met</Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="baseline" gap={1} mb={2}>
              <Typography sx={{fontFamily:fMono,fontWeight:700,fontSize:"2.6rem",color:T.accent,lineHeight:1}}>142h</Typography>
              <Typography sx={{fontFamily:fBody,fontSize:"0.84rem",color:T.textMute}}>/ 160h</Typography>
            </Box>
            <Box sx={{height:8,borderRadius:99,bgcolor:T.border,overflow:"hidden",mb:1}}>
              <Box sx={{height:"100%",width:"88%",borderRadius:99,bgcolor:T.accent,transition:"width 1.4s ease"}}/>
            </Box>
            <Typography sx={{fontFamily:fBody,fontSize:"0.73rem",color:T.textMute}}>18 hours remaining for full credit</Typography>
          </SCard>
        </Grid>

        {/* Col 2: 4 mini stats */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={1.5} sx={{height:"100%"}}>
            {[
              {label:"Present",val:"19",color:T.success,bg:T.successLight,Icon:CheckCircle},
              {label:"Late",val:"02",color:T.warning,bg:T.warningLight,Icon:Warning},
              {label:"Leaves",val:"01",color:T.danger,bg:T.dangerLight,Icon:History},
              {label:"Avg In-Time",val:"09:15",color:T.info,bg:T.infoLight,Icon:AccessTime},
            ].map((s,i)=>(
              <Grid item xs={6} key={i}>
                <SCard hover sx={{p:2,textAlign:"center",height:"100%"}}>
                  <Box sx={{display:"inline-flex",p:0.9,borderRadius:"9px",bgcolor:s.bg,mb:1}}>
                    <s.Icon sx={{fontSize:18,color:s.color}}/>
                  </Box>
                  <Typography sx={{fontFamily:fMono,fontWeight:700,fontSize:"1.4rem",color:s.color,display:"block"}}>{s.val}</Typography>
                  <Typography sx={{fontFamily:fBody,fontSize:"0.69rem",color:T.textMute}}>{s.label}</Typography>
                </SCard>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Col 3: Chart */}
        <Grid item xs={12} md={4}>
          <SCard sx={{p:2.5,height:"100%"}}>
            <SLabel sx={{mb:0.4}}>Weekly Performance</SLabel>
            <Typography sx={{fontFamily:fHead,fontWeight:700,fontSize:"0.86rem",color:T.text,mb:1.5}}>vs Department Average</Typography>
            <MiniChart data={CHART_DATA}/>
          </SCard>
        </Grid>
      </Grid>

      {/* DAILY LOG TABLE */}
      <SCard sx={{overflow:"hidden"}} className="fu2">
        <Box sx={{px:2.5,py:2,borderBottom:`1px solid ${T.border}`,bgcolor:"#FAFBFD"}}>
          <Typography sx={{fontFamily:fHead,fontWeight:700,fontSize:"0.9rem",color:T.text}}>Daily Activity Log</Typography>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TH>Date</TH><TH>Check In</TH><TH>Check Out</TH>
              <TH>Effective Hours</TH><TH>Status</TH><TH align="right">Action</TH>
            </TableRow>
          </TableHead>
          <TableBody>
            {ATTENDANCE_DATA.map(row=>{
              const absent=row.status==="Absent";
              return(
                <TableRow key={row.id} className="row-h">
                  <TD><Typography sx={{fontFamily:fBody,fontWeight:700,fontSize:"0.82rem",color:T.text}}>{row.date}</Typography></TD>
                  <TD>
                    <Box display="flex" alignItems="center" gap={0.8}>
                      <Box sx={{p:0.5,borderRadius:"6px",bgcolor:absent?"#F1F5F9":T.successLight}}>
                        <Login sx={{fontSize:13,color:absent?T.textMute:T.success}}/>
                      </Box>
                      <Typography sx={{fontFamily:fMono,fontSize:"0.79rem",color:absent?T.textMute:T.text,fontStyle:absent?"italic":"normal"}}>{row.in}</Typography>
                    </Box>
                  </TD>
                  <TD>
                    <Box display="flex" alignItems="center" gap={0.8}>
                      <Box sx={{p:0.5,borderRadius:"6px",bgcolor:absent?"#F1F5F9":T.dangerLight}}>
                        <ExitToApp sx={{fontSize:13,color:absent?T.textMute:T.danger}}/>
                      </Box>
                      <Typography sx={{fontFamily:fMono,fontSize:"0.79rem",color:absent?T.textMute:T.text,fontStyle:absent?"italic":"normal"}}>{row.out}</Typography>
                    </Box>
                  </TD>
                  <TD>
                    <Box display="flex" alignItems="center" gap={0.8}>
                      <Box sx={{width:36,height:5,borderRadius:99,bgcolor:T.border,overflow:"hidden"}}>
                        <Box sx={{height:"100%",width:`${Math.min(100,(row.hoursNum/9)*100)}%`,bgcolor:row.hoursNum>=8?T.success:row.hoursNum>=4?T.warning:T.border,borderRadius:99}}/>
                      </Box>
                      <Typography sx={{fontFamily:fMono,fontWeight:700,fontSize:"0.8rem",color:row.hoursNum>=8?T.success:row.hoursNum>=4?T.warning:T.textMute}}>{row.hours}</Typography>
                    </Box>
                  </TD>
                  <TD><StatusPill type={row.type}/></TD>
                  <TD align="right">
                    {canReg(row)?(
                      <Button size="small" variant="outlined" onClick={()=>openDialog(row)}
                        sx={{fontFamily:fBody,fontWeight:700,fontSize:"0.71rem",textTransform:"none",borderRadius:"7px",borderColor:T.warning,color:T.warning,"&:hover":{bgcolor:T.warningLight}}}>
                        Regularize
                      </Button>
                    ):(
                      <Tooltip title="Verified by Biometric">
                        <Box display="flex" alignItems="center" gap={0.5} sx={{justifyContent:"flex-end"}}>
                          <Fingerprint sx={{fontSize:14,color:T.success}}/>
                          <Typography sx={{fontFamily:fBody,fontSize:"0.7rem",fontWeight:700,color:T.success}}>Verified</Typography>
                        </Box>
                      </Tooltip>
                    )}
                  </TD>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </SCard>

      {/* REGULARIZATION DIALOG */}
      <Dialog open={openReg} onClose={closeDialog} fullWidth maxWidth="sm"
        PaperProps={{sx:{borderRadius:"16px",border:`1px solid ${T.border}`}}}>
        {selLog&&(
          <>
            <DialogTitle sx={{borderBottom:`1px solid ${T.border}`,bgcolor:"#FAFBFD",pb:2}}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{width:4,height:28,borderRadius:2,bgcolor:T.warning}}/>
                  <Box>
                    <Typography sx={{fontFamily:fHead,fontWeight:700,fontSize:"0.96rem",color:T.text}}>Regularize Attendance</Typography>
                    <Typography sx={{fontFamily:fBody,fontSize:"0.72rem",color:T.textMute}}>Submit a correction request for admin approval.</Typography>
                  </Box>
                </Box>
                <Box onClick={closeDialog} sx={{p:0.7,borderRadius:"8px",bgcolor:"#F1F5F9",cursor:"pointer","&:hover":{bgcolor:T.dangerLight}}}>
                  <Close sx={{fontSize:16,color:T.textMute}}/>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent sx={{px:3,pt:3,pb:2}}>
              <Grid container spacing={1.5} mb={2.5}>
                {[
                  {label:"Date to Regularize",value:selLog.date},
                  {label:"Discrepancy",value:selLog.type},
                  {label:"Recorded Check In",value:selLog.in},
                  {label:"Recorded Check Out",value:selLog.out},
                ].map(s=>(
                  <Grid item xs={6} key={s.label}>
                    <Box sx={{p:1.3,borderRadius:"8px",bgcolor:"#F9FAFB",border:`1px solid ${T.border}`}}>
                      <SLabel sx={{mb:0.2}}>{s.label}</SLabel>
                      <Typography sx={{fontFamily:fBody,fontWeight:600,fontSize:"0.82rem",color:T.text}}>{s.value}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{p:1.8,borderRadius:"9px",mb:2.5,bgcolor:T.warningLight,border:`1px solid ${T.warning}30`,display:"flex",gap:1,alignItems:"flex-start"}}>
                <Warning sx={{fontSize:15,color:T.warning,flexShrink:0,mt:0.15}}/>
                <Typography sx={{fontFamily:fBody,fontSize:"0.75rem",color:T.textSub,lineHeight:1.65}}>
                  Requests are reviewed by admin within 2 working days. Repeated requests may be escalated to the Head of Department.
                </Typography>
              </Box>
              <Box mb={2}>
                <SLabel sx={{mb:0.7}}>Reason Category *</SLabel>
                <DInput select value={reason} onChange={e=>setReason(e.target.value)}>
                  <MenuItem value="" sx={{fontFamily:fBody,fontSize:"0.82rem",color:T.textMute}}>— Select a reason —</MenuItem>
                  {["Traffic Delay","Public Transport Failure","Official Duty (Outside Campus)","Medical Emergency","Forgot ID Card / Biometric Issue"].map(r=>(
                    <MenuItem key={r} value={r} sx={{fontFamily:fBody,fontSize:"0.82rem"}}>{r}</MenuItem>
                  ))}
                </DInput>
              </Box>
              <Box>
                <SLabel sx={{mb:0.7}}>Detailed Justification *</SLabel>
                <DInput multiline rows={3} value={just} onChange={e=>setJust(e.target.value)} placeholder="Please explain the reason for the discrepancy in detail…"/>
              </Box>
            </DialogContent>
            <DialogActions sx={{px:3,pb:3,pt:2,borderTop:`1px solid ${T.border}`,bgcolor:"#FAFBFD",display:"flex",justifyContent:"space-between"}}>
              <Button size="small" variant="outlined" onClick={closeDialog}
                sx={{fontFamily:fBody,fontWeight:600,fontSize:"0.78rem",textTransform:"none",borderRadius:"8px",borderColor:T.border,color:T.textSub}}>
                Cancel
              </Button>
              <Button size="small" variant="contained" startIcon={<CheckCircle sx={{fontSize:14}}/>} onClick={submit}
                sx={{fontFamily:fBody,fontWeight:700,fontSize:"0.78rem",textTransform:"none",borderRadius:"8px",bgcolor:T.accent,boxShadow:"none","&:hover":{bgcolor:"#4F46E5",boxShadow:"none"}}}>
                Submit Request
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={()=>setSnack(s=>({...s,open:false}))} anchorOrigin={{vertical:"bottom",horizontal:"center"}}>
        <Alert severity={snack.severity} sx={{borderRadius:"10px",fontFamily:fBody,fontWeight:600}} onClose={()=>setSnack(s=>({...s,open:false}))}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AttendanceView;