"use client";

import * as React from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Grid from "@mui/material/Grid"; // Grid version 1
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import { CircularProgress } from "@mui/material";
import Divider from "@mui/material/Divider";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { format, isSameMonth } from "date-fns";
import Box from "@mui/material/Box";
import useGetClients from "../../hooks/useGetClients";
import useTodayAppointments from "../../hooks/useTodayAppointments";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";

const DailyReport = () => {
  // const user = useProtectedRoute();
  const invoiceRef = React.useRef();
  // State variables
  const [rows, setRows] = React.useState([]);
  const [filteredAppointments, setFilteredAppointments] = React.useState([]);
  const [selectedMonth, setSelectedMonth] = React.useState("");
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);

  // Columns for DataGrid
  const columns = [
    { field: "Srno", headerName: "Sr. NO", width: 100 },
    { field: "date", headerName: "Date", width: 140 },
    { field: "name", headerName: "Name", width: 140 },
    { field: "channel", headerName: "Mode", width: 130 },
    { field: "service", headerName: "Service", width: 130 },
    { field: "facilitatedBy", headerName: "Facilitated By", width: 130 },
    { field: "amount", headerName: "Amount", width: 100 },
  ];

  const {
    clients,
    isLoading: isCLoading,
    error: clientsError,
  } = useGetClients();
  const todayAppointments = useTodayAppointments(clients);

  const handleDownloadPdf = async () => {
    try {
      setLoading(true); // Start loading indicator
      // Generate PDF
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 4, // Increase resolution
        useCORS: true, // Handle cross-origin images
        backgroundColor: null, // Ensure background transparency
      });
      const data = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");

      setLoading(false); // Stop loading indicator after download
    } catch (error) {
      console.error("Error generating PDF:", error);
      setLoading(false); // Ensure loading indicator is stopped on error
      alert("Error generating PDF. Please try again.");
    }
  };

  const handleMonthChange = (event) => {
    const monthYear = event.target.value;
    setSelectedMonth(monthYear);
    filterAppointments(monthYear);
  };

  const filterAppointments = (monthYear) => {
    if (!monthYear) {
      setFilteredAppointments(rows); // If no month selected, show all appointments
    } else {
      const filtered = rows.filter((row) =>
        isSameMonth(new Date(row.date), new Date(monthYear))
      );
      setFilteredAppointments(filtered);
      // Calculate total amount for filtered appointments
      const total = filtered.reduce(
        (sum, appointment) => sum + (appointment.amount || 0),
        0
      );
      setTotalAmount(total); // Update total amount in state
    }
  };

  React.useEffect(() => {
    const formattedRows = todayAppointments.map((appointment) => ({
      ...appointment,
      id: appointment._id,
    }));
    setRows(formattedRows);
    setFilteredAppointments(formattedRows); // Initialize filtered appointments with all data

    // Calculate total amount
    const total = formattedRows.reduce(
      (sum, appointment) => sum + (appointment.amount || 0),
      0
    );
    setTotalAmount(total); // Set total amount in state
  }, [todayAppointments]);

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          cell: {
            fontSize: "0.75rem",
          },
          columnHeaders: {
            fontSize: "0.8rem",
          },
        },
      },
    },
  });

  // if (!user) {
  //   return null; // Optionally render a loading state or a redirect message
  // }

  if (clientsError) {
    return <Typography variant="h6">Error loading clients data.</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={12} md={9}>
          <Box sx={{ padding: 2 }}>
            <Box
              ref={invoiceRef}
              className="invoice-content"
              sx={{
                width: "100%",
                maxWidth: "800px",
                margin: "auto",
                padding: 3,
                backgroundColor: "#fff",
                boxShadow: 3,
              }}
            >
              {/* Invoice Header */}
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h5">Client Report</Typography>
                <Image src="/images/login-logo.png" width="130" height="80" />
              </Box>

              {/* Invoice Body */}
              <Box>
                <ThemeProvider theme={theme}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Appointments Report
                    </Typography>
                    <FormControl sx={{ minWidth: 120, mb: 2 }}>
                      <Select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        displayEmpty
                        inputProps={{ "aria-label": "Select Month" }}
                      >
                        <MenuItem value="">All Months</MenuItem>
                        <MenuItem value="01/2023">January</MenuItem>
                        <MenuItem value="02/2023">February</MenuItem>
                        <MenuItem value="03/2023">March</MenuItem>
                        <MenuItem value="04/2023">April</MenuItem>
                        <MenuItem value="05/2023">May</MenuItem>
                        <MenuItem value="06/2023">June</MenuItem>
                        <MenuItem value="07/2023">July</MenuItem>
                        <MenuItem value="08/2023">August</MenuItem>
                        <MenuItem value="09/2023">September</MenuItem>
                        <MenuItem value="10/2023">October</MenuItem>
                        <MenuItem value="11/2023">November</MenuItem>
                        <MenuItem value="12/2023">December</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                      rows={filteredAppointments}
                      columns={columns}
                      pageSize={10}
                      rowsPerPageOptions={[5, 10, 20]}
                      components={{ Toolbar: GridToolbar }}
                    />
                  </div>
                </ThemeProvider>
              </Box>
              <Box
                sx={{
                  mt: 40,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box></Box>
                <Box>
                  <Typography variant="h6">
                    Total Amount: {totalAmount}
                  </Typography>
                  <Divider
                    sx={{
                      margin: "15px auto",
                    }}
                  />
                  <Typography component="p">Sign</Typography>
                  <Typography component="strong">
                    Dr. Shaveta Bhardwaj
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <Box
            className="invoice-content"
            sx={{
              margin: "30px auto",
              padding: 3,
              boxShadow: 2,
              backgroundColor: "#fff",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{
                width: "100%",
              }}
              onClick={handleDownloadPdf}
              disabled={isLoading} // Disable button during loading
            >
              {isLoading ? (
                <CircularProgress size={24} /> // Display loading indicator if isLoading is true
              ) : (
                "Download Pdf"
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>''
    </Container>
  );
};

export default DailyReport;