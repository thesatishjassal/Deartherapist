"use client";

import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";

const actions = [
  { icon: <FileCopyIcon />, name: "Copy" },
  { icon: <SaveIcon />, name: "Save" },
  { icon: <PrintIcon />, name: "Print" },
  { icon: <ShareIcon />, name: "Share" },
];

const InvoicePage = () => {
  const invoiceRef = useRef();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDownloadPdf = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, {
      scale: 2, // Increase resolution
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
    <>
      {" "}
      <Box sx={{ padding: 4, backgroundColor: "#f9f9f9" }}>
        <Box
          ref={invoiceRef}
          className="invoice-content"
          sx={{
            width: "210mm",
            minHeight: "297mm",
            margin: "auto",
            padding: 3,
            backgroundColor: "#fff",
            boxShadow: 3,
          }}
        >
          {/* Invoice Header */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Typography variant="h4" gutterBottom>
              Invoice
            </Typography>
            <Typography variant="h6">Your Company Name</Typography>
            <Typography>123 Your Street, City, Country</Typography>
            <Typography>Phone: (123) 456-7890</Typography>
            <Typography>Email: info@yourcompany.com</Typography>
          </Box>

          {/* Invoice Body */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Bill To" variant="outlined" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Date" variant="outlined" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Invoice Number" variant="outlined" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Due Date" variant="outlined" />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Items
            </Typography>
            {/* Add your table or list of items here */}
          </Box>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h6">Notes</Typography>
              <Typography>Thank you for your business!</Typography>
            </Box>
            <Box>
              <Typography variant="h6">Total</Typography>
              <Typography>$0.00</Typography>
            </Box>
          </Box>
        </Box>
        <SpeedDial
          ariaLabel="SpeedDial openIcon example"
          sx={{ position: "fixed", bottom: 30, right: 15 }}
          icon={<SpeedDialIcon openIcon={<EditIcon />} />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
            />
          ))}
        </SpeedDial>
      </Box>
    </>
  );
};

export default InvoicePage;
