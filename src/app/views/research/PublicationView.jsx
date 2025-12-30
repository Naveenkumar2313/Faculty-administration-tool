import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, Chip, 
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, 
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem 
} from "@mui/material";
import { Add, FilterList, PictureAsPdf, Link as LinkIcon, Edit } from "@mui/icons-material";
import useResearchSystem from "../../hooks/useResearchSystem";

const PublicationView = () => {
  const { publications, addPublication } = useResearchSystem();
  const [openForm, setOpenForm] = useState(false);
  const [filterType, setFilterType] = useState("All");

  // Filter Logic
  const filteredPubs = filterType === "All" 
    ? publications 
    : publications.filter(p => p.type === filterType);

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">Research Publications</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenForm(true)}>Add New Paper</Button>
      </Box>

      {/* FILTERS */}
      <Card sx={{ p: 2, mb: 3, display: 'flex', gap: 2 }}>
        <Chip icon={<FilterList />} label="All" onClick={() => setFilterType("All")} color={filterType === "All" ? "primary" : "default"} clickable />
        <Chip label="Journals" onClick={() => setFilterType("Journal")} color={filterType === "Journal" ? "primary" : "default"} clickable />
        <Chip label="Conferences" onClick={() => setFilterType("Conference")} color={filterType === "Conference" ? "primary" : "default"} clickable />
        <Chip label="Books" onClick={() => setFilterType("Book Chapter")} color={filterType === "Book Chapter" ? "primary" : "default"} clickable />
      </Card>

      {/* DATA TABLE */}
      <Card>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>Title / Authors</TableCell>
              <TableCell>Journal / Publisher</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Impact Factor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPubs.map((pub) => (
              <TableRow key={pub.id} hover>
                <TableCell>
                  <Typography fontWeight="bold" variant="body2">{pub.title}</Typography>
                </TableCell>
                <TableCell>{pub.journal}</TableCell>
                <TableCell><Chip size="small" label={pub.type} variant="outlined" /></TableCell>
                <TableCell>{pub.year}</TableCell>
                <TableCell>{pub.impactFactor || "-"}</TableCell>
                <TableCell>
                    <Chip size="small" label={pub.status} color={pub.status === 'Published' ? 'success' : 'warning'} />
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="primary"><LinkIcon /></IconButton>
                  <IconButton size="small" color="error"><PictureAsPdf /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* ADD MODAL (Simplified for brevity) */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Publication Details</DialogTitle>
        <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
                <TextField label="Paper Title" fullWidth />
                <TextField select label="Type" fullWidth defaultValue="Journal">
                    <MenuItem value="Journal">Journal</MenuItem>
                    <MenuItem value="Conference">Conference</MenuItem>
                </TextField>
                <TextField label="Journal Name" fullWidth />
                <TextField label="DOI Link" fullWidth />
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenForm(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => { addPublication({ title: "New Paper", type: "Journal" }); setOpenForm(false); }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PublicationView;