"use client";
import React, { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import ReportTable from "../components/ReportTable";
import Grid from "@mui/material/Grid"; // Grid version 1
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import { CircularProgress } from "@mui/material";
import useProtectedRoute from "../../hooks/useProtectedRoute";

const DailyReport = () => {
  const invoiceRef = useRef();
  const [isLoading, setLoading] = useState(false); // State for loading indicator
  const user = useProtectedRoute();

  if (!user) {
    return <div>Loading...</div>; // Placeholder for loading state or redirect
  }

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <Container>
      <Box sx={{ width: "100%" }}>
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
                  <ReportTable />
                </Box>
                <Box
                  sx={{
                    mt: 40,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography component="p">Sign</Typography>
                    <Typography component="strong">Dr. Shaweta Bhardwaj</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6">Total</Typography>
                    <Typography component="strong"></Typography>
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
        </Grid>
      </Box>
    </Container>
  );
};

export default DailyReport;
