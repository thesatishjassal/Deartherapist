"use client";

import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import ReportTable from "../components/ReportTable";
import TotalAmount from "./TotalAmount";

const InvoicePage = () => {
  const invoiceRef = useRef();

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
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ padding: 2}}>
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
        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h5">Client Report</Typography>
          </Box>
          <Box>
            <Image src="/images/login-logo.png" alt="logo" width="130" height="80" />
          </Box>
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
              <Typography component="strong">Dr. Shaveta Bhardwaj</Typography>
            </Box>
            <Box>
              <Typography variant="h6">Total</Typography>
              <Typography component="strong"><TotalAmount /></Typography>
            </Box>
          </Box>
      </Box>
    </Box>
  );
};

export default InvoicePage;
