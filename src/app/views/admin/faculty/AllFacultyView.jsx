import React, { useState } from "react";
import { 
  Box, Card, Grid, Typography, Button, TextField, MenuItem, 
  Table, TableBody, TableCell, TableHead, TableRow, TablePagination,
  Chip, IconButton, Avatar, InputAdornment, Menu, Tooltip, Stack,
  useTheme
} from "@mui/material";
import { 
  Add, Search, FilterList, MoreVert, FileDownload, 
  Edit, Delete, Visibility, Email, Phone 
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AllFacultyView = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // STATE MANAGEMENT
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // MOCK DATA: FACULTY DIRECTORY
  const [facultyList, setFacultyList] = useState([
    { 
      id: "FAC-2023-001", name: "Dr. Sarah Smith", email: "sarah.smith@college.edu", 
      phone: "+91 98765 43210", dept: "Computer Science", desg: "Professor", 
      joinDate: "2018-06-01", status: "Active", image: "/assets/images/faces/1.jpg" 
    },
    { 
      id: "FAC-2024-045", name: "Mr. Arjun Singh", email: "arjun.singh@college.edu", 
      phone: "+91 98765 12345", dept: "Mechanical", desg: "Asst. Professor", 
      joinDate: "2024-01-15", status: "Probation", image: null 
    },
    { 
      id: "FAC-2020-112", name: "Dr. Emily Davis", email: "emily.d@college.edu", 
      phone: "+91 98765 67890", dept: "Civil Engg", desg: "Associate Prof", 
      joinDate: "2020-08-20", status: "On Leave", image: "/assets/images/faces/2.jpg" 
    },
    { 
      id: "FAC-2015-089", name: "Prof. Rajan Kumar", email: "rajan.k@college.edu", 
      phone: "+91 91234 56789", dept: "Electrical", desg: "HOD", 
      joinDate: "2015-03-10", status: "Active", image: null 
    },
    { 
      id: "FAC-2025-003", name: "Ms. Priya Roy", email: "priya.roy@college.edu", 
      phone: "+91 88888 99999", dept: "Computer Science", desg: "Lecturer", 
      joinDate: "2025-02-01", status: "Active", image: "/assets/images/faces/3.jpg" 
    },
  ]);

  // HANDLERS
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  // FILTER LOGIC
  const filteredList = facultyList.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDept === "All" || user.dept === filterDept;
    const matchesStatus = filterStatus === "All" || user.status === filterStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // HELPER: STATUS COLORS
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'success';
      case 'Probation': return 'warning';
      case 'On Leave': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER SECTION */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight="bold">Faculty Directory</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage all teaching and non-teaching staff records.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<FileDownload />}>Export CSV</Button>
          <Button 
            variant="contained" color="primary" startIcon={<Add />}
            onClick={() => navigate('/admin/hr/onboarding')}
          >
            Add New Faculty
          </Button>
        </Stack>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        {/* FILTER BAR */}
        <Box p={3} bgcolor="background.paper">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField 
                fullWidth placeholder="Search by Name or ID..." size="small"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search color="action" /></InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField 
                select fullWidth label="Department" size="small"
                value={filterDept} onChange={(e) => setFilterDept(e.target.value)}
              >
                <MenuItem value="All">All Departments</MenuItem>
                <MenuItem value="Computer Science">Computer Science</MenuItem>
                <MenuItem value="Mechanical">Mechanical</MenuItem>
                <MenuItem value="Civil Engg">Civil Engg</MenuItem>
                <MenuItem value="Electrical">Electrical</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField 
                select fullWidth label="Status" size="small"
                value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Probation">Probation</MenuItem>
                <MenuItem value="On Leave">On Leave</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2} textAlign="right">
              <Button startIcon={<FilterList />} color="secondary">More Filters</Button>
            </Grid>
          </Grid>
        </Box>

        {/* DATA TABLE */}
        <Box overflow="auto">
          <Table>
            <TableHead sx={{ bgcolor: theme.palette.primary.light }}>
              <TableRow>
                <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Faculty Profile</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Employee ID</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Department & Role</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Contact Info</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align="right" sx={{ color: 'primary.main', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src={row.image} alt={row.name} sx={{ width: 45, height: 45 }}>
                          {row.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">{row.name}</Typography>
                          <Typography variant="caption" color="text.secondary">Joined: {row.joinDate}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={row.id} size="small" variant="outlined" sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{row.dept}</Typography>
                      <Typography variant="caption" color="text.secondary">{row.desg}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Tooltip title={row.email}><Email fontSize="small" color="action" /></Tooltip>
                        <Tooltip title={row.phone}><Phone fontSize="small" color="action" /></Tooltip>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status} size="small" 
                        color={getStatusColor(row.status)} 
                        variant={row.status === 'Active' ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, row.id)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">No faculty members found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {/* PAGINATION */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* ACTION MENU */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Visibility fontSize="small" sx={{ mr: 1.5 }} /> View Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Edit fontSize="small" sx={{ mr: 1.5 }} /> Edit Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1.5 }} /> Deactivate User
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AllFacultyView;