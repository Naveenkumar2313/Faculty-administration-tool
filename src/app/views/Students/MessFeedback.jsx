import React, { useState } from "react";
import { Box, Card, Typography, TextField, Button, Grid, IconButton, MenuItem } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import { T, fontHead, fontBody, Fonts } from "./studentShared";

export default function MessFeedback() {
    const [rating, setRating] = useState(0);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody, display: "flex", justifyContent: "center" }}>
            <style>{Fonts()}</style>

            <Box sx={{ maxWidth: 600, width: "100%" }}>
                <Box mb={4} className="fade-up" textAlign="center">
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Mess & Food</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Submit Mess Feedback</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>Help us improve food quality and hygiene.</Typography>
                </Box>

                <Card className="fade-up" sx={{ p: 4, borderRadius: "16px", border: `1px solid ${T.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1rem", mb: 1, textAlign: "center" }}>Rate today's food</Typography>
                            <Box display="flex" justifyContent="center" gap={1} mb={2}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <IconButton
                                        key={star}
                                        onClick={() => setRating(star)}
                                        sx={{ color: star <= rating ? T.warning : T.border }}
                                    >
                                        {star <= rating ? <Star sx={{ fontSize: 32 }} /> : <StarBorder sx={{ fontSize: 32 }} />}
                                    </IconButton>
                                ))}
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                select fullWidth label="Meal Session" defaultValue="Lunch"
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            >
                                <MenuItem value="Breakfast">Breakfast</MenuItem>
                                <MenuItem value="Lunch">Lunch</MenuItem>
                                <MenuItem value="Snacks">Snacks</MenuItem>
                                <MenuItem value="Dinner">Dinner</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth multiline rows={4} label="Your Comments / Suggestions" placeholder="What did you like or dislike? Was it too spicy?"
                                InputLabelProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem" } }}
                                InputProps={{ sx: { fontFamily: fontBody, fontSize: "0.85rem", borderRadius: "8px" } }}
                            />
                        </Grid>

                        <Grid item xs={12} mt={1}>
                            <Button fullWidth variant="contained" sx={{ bgcolor: T.accent, fontFamily: fontBody, fontWeight: 700, textTransform: "none", borderRadius: "8px", py: 1.5, boxShadow: "none" }}>
                                Submit Feedback
                            </Button>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </Box>
    );
}
