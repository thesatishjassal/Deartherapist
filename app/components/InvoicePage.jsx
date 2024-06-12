"use client";

import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import ReportTable from "../components/ReportTable";

const InvoicePage = () => {
  const invoiceRef = useRef();

  const handleDownloadPdf = async () => {
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
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
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
            <Image src="/images/login-logo.png" width="130" height="80" />
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
              <Typography component="strong">Dr. Shaweta Bhardwaj</Typography>
            </Box>
            <Box>
              <Typography variant="h6">Total</Typography>
              <Typography component="strong">0.00</Typography>
            </Box>
          </Box>
          {/* <Button variant="contained" color="primary" onClick={handleDownloadPdf}>
            Download PDF
          </Button>
          <Button variant="contained" color="secondary" onClick={handlePrint}>
            Print
          </Button> */}
      </Box>
    </Box>
  );
};

export default InvoicePage;
