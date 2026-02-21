import React, { useState } from 'react';
import {
  Box, Card, Grid, Typography, Button, Chip, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Stepper, Step, StepLabel,
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
  TextField, Alert, Stack, Divider, IconButton, Snackbar, Checkbox
} from "@mui/material";
import {
  Gavel, VerifiedUser, Warning, PlayCircle, Quiz,
  HistoryEdu, Download, CheckCircle, Close, Fingerprint,
  Lock, Refresh, CheckCircleOutline, AssignmentTurnedIn
} from '@mui/icons-material';

// ─────────────────────────────────────────────
// MOCK DATA (replaces useGovernanceSystem hook)
// ─────────────────────────────────────────────
const INITIAL_POLICIES = [
  {
    id: 1,
    title: "POSH Policy",
    category: "Compliance",
    version: "3.1",
    lastUpdated: "Jan 2026",
    deadline: "2026-02-28",
    status: "Pending",
    changes: "Expanded definition of workplace harassment to include digital/remote interactions.",
    requiresVideo: true,
    requiresQuiz: true,
    videoUrl: "https://www.youtube.com/embed/MdPG5Ssbihk",
    quiz: [
      {
        q: "POSH Act stands for Prevention of Sexual Harassment at ___ ?",
        options: ["Public Office", "Workplace", "School", "Parliament"],
        correct: 1,
      },
      {
        q: "Within how many days must an Internal Complaints Committee complete an inquiry?",
        options: ["30 days", "60 days", "90 days", "120 days"],
        correct: 2,
      },
      {
        q: "Which of the following is NOT considered a form of sexual harassment under POSH?",
        options: [
          "Unwelcome physical contact",
          "Showing pornography",
          "A performance review",
          "Eve teasing",
        ],
        correct: 2,
      },
    ],
  },
  {
    id: 2,
    title: "IT Acceptable Use Policy",
    category: "Information Technology",
    version: "2.0",
    lastUpdated: "Dec 2025",
    deadline: "2026-03-15",
    status: "Pending",
    changes: "New clause on AI tool usage and data privacy obligations added.",
    requiresVideo: false,
    requiresQuiz: true,
    videoUrl: null,
    quiz: [
      {
        q: "Which of the following is a violation of the IT Acceptable Use Policy?",
        options: [
          "Using institutional email for official communication",
          "Sharing your login credentials with a colleague",
          "Using licensed software",
          "Reporting a security incident",
        ],
        correct: 1,
      },
      {
        q: "Institutional data should be stored on:",
        options: [
          "Personal Google Drive",
          "Approved institutional cloud storage only",
          "USB drives for convenience",
          "Any publicly accessible server",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: 3,
    title: "Academic Integrity & Anti-Plagiarism Policy",
    category: "Academic",
    version: "1.5",
    lastUpdated: "Nov 2025",
    deadline: "2026-04-01",
    status: "Signed",
    changes: null,
    requiresVideo: false,
    requiresQuiz: false,
    videoUrl: null,
    quiz: [],
    signedOn: "2025-12-10",
    certificate: "CERT-2025-AIP-003",
  },
  {
    id: 4,
    title: "Service Bond & Commitment Policy",
    category: "HR",
    version: "1.2",
    lastUpdated: "Oct 2025",
    deadline: "2026-02-25",
    status: "Pending",
    changes: "Updated bond period from 2 years to 3 years for faculty joining after Jan 2026.",
    requiresVideo: false,
    requiresQuiz: false,
    videoUrl: null,
    quiz: [],
  },
];

// Simulate OTP (in real app, this calls backend)
const MOCK_OTP = "1234";

const getDaysRemaining = (deadline) => {
  if (!deadline) return 999;
  return Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
};

// ─────────────────────────────────────────────
// CATEGORY COLOR MAP
// ─────────────────────────────────────────────
const categoryColor = {
  Compliance: { bg: "#FEF3C7", color: "#92400E" },
  "Information Technology": { bg: "#EFF6FF", color: "#1E40AF" },
  Academic: { bg: "#F0FDF4", color: "#166534" },
  HR: { bg: "#F5F3FF", color: "#5B21B6" },
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const GovernanceView = () => {
  const [policies, setPolicies] = useState(INITIAL_POLICIES);

  // Dialog state
  const [open, setOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  // Step-level state
  const [readChecked, setReadChecked] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizResults, setQuizResults] = useState({});

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Snackbar
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  // ── Build step list dynamically ──
  const getSteps = (policy) => {
    if (!policy) return [];
    const s = ["Review Policy"];
    if (policy.requiresVideo) s.push("Training Video");
    if (policy.requiresQuiz) s.push("Knowledge Quiz");
    s.push("Digital Signature");
    return s;
  };

  // ── Open dialog ──
  const handleStartCompliance = (policy) => {
    setActivePolicy(policy);
    setActiveStep(0);
    setReadChecked(false);
    setVideoWatched(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(false);
    setQuizResults({});
    setOtpSent(false);
    setOtpInput("");
    setOtpError(false);
    setOtpVerified(false);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // ── Determine what the current step represents ──
  const getStepType = (policy, stepIndex) => {
    if (!policy) return null;
    const steps = getSteps(policy);
    const label = steps[stepIndex];
    if (label === "Review Policy") return "read";
    if (label === "Training Video") return "video";
    if (label === "Knowledge Quiz") return "quiz";
    if (label === "Digital Signature") return "sign";
    return null;
  };

  // ── Can we proceed from current step? ──
  const canProceed = () => {
    const type = getStepType(activePolicy, activeStep);
    if (type === "read") return readChecked;
    if (type === "video") return videoWatched;
    if (type === "quiz") return quizPassed;
    if (type === "sign") return otpVerified;
    return false;
  };

  // ── Next / Submit quiz ──
  const handleNext = () => {
    const steps = getSteps(activePolicy);
    if (activeStep < steps.length - 1) {
      setActiveStep((p) => p + 1);
    }
  };

  const handleSubmitQuiz = () => {
    const results = {};
    let allCorrect = true;
    activePolicy.quiz.forEach((q, i) => {
      const correct = quizAnswers[i] === q.correct;
      results[i] = correct;
      if (!correct) allCorrect = false;
    });
    setQuizResults(results);
    setQuizSubmitted(true);
    setQuizPassed(allCorrect);
  };

  const handleRetryQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(false);
    setQuizResults({});
  };

  // ── OTP ──
  const handleSendOTP = () => {
    setOtpSent(true);
    setOtpInput("");
    setOtpError(false);
    setSnack({ open: true, msg: `OTP sent! (Demo OTP: ${MOCK_OTP})`, severity: "info" });
  };

  const handleVerifyOTP = () => {
    if (otpInput.trim() === MOCK_OTP) {
      setOtpVerified(true);
      setOtpError(false);
    } else {
      setOtpError(true);
    }
  };

  // ── Final submission ──
  const handleFinalSign = () => {
    setPolicies((prev) =>
      prev.map((p) =>
        p.id === activePolicy.id
          ? {
              ...p,
              status: "Signed",
              signedOn: new Date().toISOString().split("T")[0],
              certificate: `CERT-${new Date().getFullYear()}-${p.category.slice(0,3).toUpperCase()}-00${p.id}`,
            }
          : p
      )
    );
    setOpen(false);
    setSnack({ open: true, msg: `✓ "${activePolicy.title}" signed successfully! Certificate generated.`, severity: "success" });
  };

  const steps = getSteps(activePolicy);
  const stepType = getStepType(activePolicy, activeStep);
  const isLastStep = activeStep === steps.length - 1;

  const compliantCount = policies.filter((p) => p.status === "Signed" || p.status === "Compliant").length;

  return (
    <Box sx={{ p: 3, bgcolor: "#F5F7FA", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          Policies & Compliance Hub
        </Typography>
        <Chip
          icon={<AssignmentTurnedIn />}
          label={`${compliantCount} / ${policies.length} Compliant`}
          color={compliantCount === policies.length ? "success" : "warning"}
          sx={{ fontWeight: 700 }}
        />
      </Box>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Review, acknowledge, and digitally sign institutional policies as required.
      </Typography>

      {/* ── Overall progress bar ── */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="caption" color="text.secondary">Overall Compliance Progress</Typography>
          <Typography variant="caption" fontWeight={700}>{Math.round((compliantCount / policies.length) * 100)}%</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={(compliantCount / policies.length) * 100}
          sx={{ height: 8, borderRadius: 99, bgcolor: "#E5E7EB", "& .MuiLinearProgress-bar": { bgcolor: "#10B981", borderRadius: 99 } }}
        />
      </Box>

      {/* ── Policy Cards ── */}
      <Grid container spacing={3}>
        {policies.map((policy) => {
          const daysLeft = getDaysRemaining(policy.deadline);
          const isUrgent = daysLeft < 7 && policy.status !== "Compliant" && policy.status !== "Signed";
          const isSigned = policy.status === "Signed" || policy.status === "Compliant";
          const cat = categoryColor[policy.category] || { bg: "#F3F4F6", color: "#374151" };

          return (
            <Grid item xs={12} md={6} key={policy.id}>
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: isSigned ? "#D1FAE5" : isUrgent ? "#FEE2E2" : "#E4E8EF",
                  borderLeft: `5px solid ${isSigned ? "#10B981" : isUrgent ? "#EF4444" : "#F59E0B"}`,
                  borderRadius: "14px",
                  bgcolor: "#FFFFFF",
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
                }}
              >
                {/* Top row */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box sx={{ px: 1.2, py: 0.4, borderRadius: "6px", bgcolor: cat.bg }}>
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: cat.color, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      {policy.category}
                    </Typography>
                  </Box>
                  {isSigned ? (
                    <Chip icon={<VerifiedUser sx={{ fontSize: "14px !important" }} />} label="Compliant" color="success" size="small" sx={{ fontWeight: 700 }} />
                  ) : (
                    <Chip
                      icon={<Warning sx={{ fontSize: "14px !important" }} />}
                      label={daysLeft <= 0 ? "Overdue" : `${daysLeft}d remaining`}
                      color={isUrgent ? "error" : "warning"}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  )}
                </Box>

                {/* Title */}
                <Typography variant="h6" fontWeight={700} gutterBottom>{policy.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Version {policy.version} &nbsp;·&nbsp; Updated: {policy.lastUpdated}
                </Typography>

                {/* Change alert */}
                {policy.changes && !isSigned && (
                  <Alert severity="info" sx={{ mt: 2, py: 0.5, fontSize: "0.8rem", borderRadius: "8px" }}>
                    <strong>What's New: </strong>{policy.changes}
                  </Alert>
                )}

                {/* Requirement chips */}
                <Stack direction="row" spacing={1} mt={2} mb={2.5} flexWrap="wrap">
                  {policy.requiresVideo && (
                    <Chip icon={<PlayCircle />} label="Video Training" size="small" variant="outlined" color="primary" />
                  )}
                  {policy.requiresQuiz && (
                    <Chip icon={<Quiz />} label="Mandatory Quiz" size="small" variant="outlined" color="secondary" />
                  )}
                  <Chip icon={<Fingerprint />} label="OTP Signature" size="small" variant="outlined" />
                </Stack>

                {/* Signed info */}
                {isSigned && policy.signedOn && (
                  <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                    ✓ Signed on {policy.signedOn} &nbsp;·&nbsp; Cert: {policy.certificate}
                  </Typography>
                )}

                {/* CTA */}
                <Box display="flex" gap={2}>
                  {!isSigned ? (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleStartCompliance(policy)}
                      sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px", boxShadow: "none", bgcolor: "#6366F1", "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" } }}
                    >
                      Start Compliance
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="success"
                      fullWidth
                      startIcon={<Download />}
                      onClick={() => setSnack({ open: true, msg: `Certificate ${policy.certificate} downloaded.`, severity: "success" })}
                      sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px" }}
                    >
                      Download Certificate
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* ══════════════════════════════════════
          COMPLIANCE WIZARD DIALOG
      ══════════════════════════════════════ */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}>

        {/* Dialog Header */}
        <DialogTitle sx={{ borderBottom: "1px solid #E4E8EF", pb: 2, bgcolor: "#FAFBFD" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography fontWeight={700} fontSize="1rem">{activePolicy?.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                Step {activeStep + 1} of {steps.length} &nbsp;·&nbsp; {steps[activeStep]}
              </Typography>
            </Box>
            <IconButton onClick={handleClose} size="small" sx={{ bgcolor: "#F3F4F6", borderRadius: "8px" }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ py: 4, px: 4 }}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label, idx) => (
              <Step key={label} completed={idx < activeStep}>
                <StepLabel sx={{
                  "& .MuiStepLabel-label": { fontWeight: 600, fontSize: "0.78rem" },
                  "& .MuiStepIcon-root.Mui-active": { color: "#6366F1" },
                  "& .MuiStepIcon-root.Mui-completed": { color: "#10B981" },
                }}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* ── STEP: READ POLICY ── */}
          {stepType === "read" && (
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Policy Document <Chip label={`v${activePolicy?.version}`} size="small" sx={{ ml: 1 }} />
              </Typography>
              <Box sx={{ height: 280, bgcolor: "#F9FAFB", p: 3, overflowY: "auto", borderRadius: "10px", border: "1px solid #E4E8EF", mb: 2.5 }}>
                <Typography paragraph><strong>1. Purpose</strong><br />
                  This policy outlines the guidelines for <em>{activePolicy?.title}</em> applicable to all employees, faculty members, and affiliated personnel of the institution.
                </Typography>
                <Typography paragraph><strong>2. Scope</strong><br />
                  Applies to all faculty, staff, contract employees, students, and third-party vendors engaging with institutional premises or resources, whether in-person or digitally.
                </Typography>
                <Typography paragraph><strong>3. Obligations</strong><br />
                  All stakeholders are required to familiarise themselves with this document, complete any associated training modules, and adhere to the prescribed conduct at all times.
                </Typography>
                {activePolicy?.changes && (
                  <Alert severity="warning" sx={{ mt: 1, borderRadius: "8px" }}>
                    <strong>Critical Update (v{activePolicy.version}):</strong> {activePolicy.changes}
                  </Alert>
                )}
                <Typography paragraph mt={2}><strong>4. Non-Compliance</strong><br />
                  Violation of this policy may result in disciplinary action, up to and including termination, as determined by the Disciplinary Committee.
                </Typography>
                <Typography paragraph><strong>5. Review Cycle</strong><br />
                  This policy is reviewed annually. The most current version is always available on the institution's intranet portal.
                </Typography>
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={readChecked}
                    onChange={(e) => setReadChecked(e.target.checked)}
                    sx={{ color: "#6366F1", "&.Mui-checked": { color: "#6366F1" } }}
                  />
                }
                label={
                  <Typography variant="body2" fontWeight={500}>
                    I have read and understood the document in its entirety, including all updates.
                  </Typography>
                }
              />
            </Box>
          )}

          {/* ── STEP: VIDEO ── */}
          {stepType === "video" && (
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>Mandatory Training Video</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Watch the full video to proceed. Once finished, check the box below.
              </Typography>
              <Box sx={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "10px", border: "1px solid #E4E8EF" }}>
                <iframe
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                  src={activePolicy?.videoUrl}
                  title="Training Video"
                  allowFullScreen
                />
              </Box>
              <FormControlLabel
                sx={{ mt: 2 }}
                control={
                  <Checkbox
                    checked={videoWatched}
                    onChange={(e) => setVideoWatched(e.target.checked)}
                    sx={{ color: "#6366F1", "&.Mui-checked": { color: "#6366F1" } }}
                  />
                }
                label={<Typography variant="body2" fontWeight={500}>I have watched the complete training video.</Typography>}
              />
            </Box>
          )}

          {/* ── STEP: QUIZ ── */}
          {stepType === "quiz" && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" fontWeight={700}>Knowledge Check</Typography>
                {quizSubmitted && !quizPassed && (
                  <Button size="small" startIcon={<Refresh />} onClick={handleRetryQuiz} color="warning">Retry Quiz</Button>
                )}
              </Box>

              {!quizSubmitted && (
                <Alert severity="info" sx={{ mb: 3, borderRadius: "8px" }}>
                  Answer all questions correctly to proceed. You may retry if any answer is wrong.
                </Alert>
              )}
              {quizSubmitted && quizPassed && (
                <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 3, borderRadius: "8px" }}>
                  All answers correct! You may proceed to sign.
                </Alert>
              )}
              {quizSubmitted && !quizPassed && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: "8px" }}>
                  Some answers are incorrect. Review the highlighted questions and retry.
                </Alert>
              )}

              {activePolicy?.quiz.map((q, idx) => {
                const answered = quizAnswers[idx] !== undefined;
                const correct = quizResults[idx];
                let borderColor = "#E4E8EF";
                if (quizSubmitted) borderColor = correct ? "#10B981" : "#EF4444";

                return (
                  <Box key={idx} sx={{ mb: 3, p: 2.5, borderRadius: "10px", border: `1.5px solid ${borderColor}`, bgcolor: quizSubmitted ? (correct ? "#F0FDF4" : "#FEF2F2") : "#FAFBFD" }}>
                    <FormControl component="fieldset" sx={{ width: "100%" }}>
                      <FormLabel sx={{ fontWeight: 700, color: "text.primary", mb: 1, "&.Mui-focused": { color: "text.primary" } }}>
                        {idx + 1}. {q.q}
                      </FormLabel>
                      <RadioGroup
                        value={quizAnswers[idx] !== undefined ? quizAnswers[idx] : ""}
                        onChange={(e) => {
                          if (!quizSubmitted) {
                            setQuizAnswers({ ...quizAnswers, [idx]: parseInt(e.target.value) });
                          }
                        }}
                      >
                        {q.options.map((opt, optIdx) => {
                          let labelColor = "text.primary";
                          if (quizSubmitted) {
                            if (optIdx === q.correct) labelColor = "#10B981";
                            else if (quizAnswers[idx] === optIdx && !correct) labelColor = "#EF4444";
                          }
                          return (
                            <FormControlLabel
                              key={optIdx}
                              value={optIdx}
                              disabled={quizSubmitted}
                              control={<Radio size="small" sx={{ color: "#6366F1", "&.Mui-checked": { color: "#6366F1" } }} />}
                              label={<Typography variant="body2" sx={{ color: labelColor, fontWeight: optIdx === q.correct && quizSubmitted ? 700 : 400 }}>{opt}</Typography>}
                            />
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                  </Box>
                );
              })}

              {!quizSubmitted && (
                <Button
                  variant="contained"
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(quizAnswers).length < (activePolicy?.quiz.length || 0)}
                  sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px", bgcolor: "#6366F1", boxShadow: "none", "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" } }}
                >
                  Submit Quiz
                </Button>
              )}
            </Box>
          )}

          {/* ── STEP: DIGITAL SIGNATURE ── */}
          {stepType === "sign" && (
            <Box textAlign="center" py={2}>
              <Box sx={{ display: "inline-flex", p: 2.5, borderRadius: "50%", bgcolor: "#EEF2FF", mb: 2 }}>
                <Fingerprint sx={{ fontSize: 56, color: "#6366F1" }} />
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>Digital Acceptance & Signature</Typography>
              <Typography color="text.secondary" variant="body2" maxWidth={480} mx="auto" mb={3}>
                By verifying your identity via OTP and signing, you confirm that you have reviewed the policy in full and commit to abide by its terms.
              </Typography>

              <Box sx={{ p: 2.5, bgcolor: "#F9FAFB", borderRadius: "10px", border: "1px solid #E4E8EF", maxWidth: 380, mx: "auto", textAlign: "left", mb: 3 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} letterSpacing="0.05em">SIGNING SUMMARY</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2"><strong>Policy:</strong> {activePolicy?.title}</Typography>
                <Typography variant="body2"><strong>Version:</strong> {activePolicy?.version}</Typography>
                <Typography variant="body2"><strong>Date:</strong> {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</Typography>
              </Box>

              {!otpVerified ? (
                !otpSent ? (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Lock />}
                    onClick={handleSendOTP}
                    sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px", bgcolor: "#6366F1", boxShadow: "none", "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" } }}
                  >
                    Send OTP to Registered Mobile
                  </Button>
                ) : (
                  <Box maxWidth={320} mx="auto">
                    <Alert severity="info" sx={{ mb: 2, borderRadius: "8px", textAlign: "left" }}>
                      OTP sent to your registered mobile. <strong>(Demo: use 1234)</strong>
                    </Alert>
                    <TextField
                      fullWidth
                      label="Enter 4-digit OTP"
                      value={otpInput}
                      onChange={(e) => { setOtpInput(e.target.value); setOtpError(false); }}
                      error={otpError}
                      helperText={otpError ? "Incorrect OTP. Please try again." : ""}
                      inputProps={{ maxLength: 4, style: { textAlign: "center", fontSize: "1.4rem", letterSpacing: "0.3em", fontWeight: 700 } }}
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      size="large"
                      onClick={handleVerifyOTP}
                      sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px", boxShadow: "none" }}
                    >
                      Verify OTP
                    </Button>
                    <Button size="small" sx={{ mt: 1 }} onClick={handleSendOTP} startIcon={<Refresh sx={{ fontSize: 14 }} />}>
                      Resend OTP
                    </Button>
                  </Box>
                )
              ) : (
                <Box>
                  <Alert severity="success" icon={<CheckCircleOutline />} sx={{ mb: 3, borderRadius: "8px", maxWidth: 360, mx: "auto" }}>
                    Identity verified! Click below to complete signing.
                  </Alert>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<CheckCircle />}
                    onClick={handleFinalSign}
                    sx={{ textTransform: "none", fontWeight: 700, borderRadius: "10px", boxShadow: "none", px: 4 }}
                  >
                    Confirm & Sign Policy
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        {/* Dialog Footer */}
        <DialogActions sx={{ px: 4, py: 2.5, borderTop: "1px solid #E4E8EF", bgcolor: "#FAFBFD", justifyContent: "space-between" }}>
          <Button onClick={handleClose} sx={{ textTransform: "none", color: "text.secondary" }}>
            Cancel
          </Button>

          {/* Show Next only if not last step AND not sign step (sign step has its own CTA) */}
          {!isLastStep && stepType !== "quiz" && (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!canProceed()}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px", bgcolor: "#6366F1", boxShadow: "none", "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" }, "&.Mui-disabled": { bgcolor: "#E0E0E0" } }}
            >
              {activeStep === 0 ? "Agree & Continue" : "Next →"}
            </Button>
          )}

          {/* Quiz step: Next only enabled after passing */}
          {!isLastStep && stepType === "quiz" && quizPassed && (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px", bgcolor: "#10B981", boxShadow: "none", "&:hover": { bgcolor: "#059669", boxShadow: "none" } }}
            >
              Continue to Signature →
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ── */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity} sx={{ borderRadius: "10px", fontWeight: 600 }} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GovernanceView;