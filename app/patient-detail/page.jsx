"use client";

import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";

const InvoicePage = () => {
  const invoiceRef = useRef();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

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
    <Box sx={{ width: "100%", my: 3 }}>
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={12} md={9}>
          <Box
            ref={invoiceRef}
            className="invoice-content"
            sx={{
              width: "100%",
              maxWidth: "800px",
              margin: "30px auto",
              padding: 3,
              backgroundColor: "#fff",
              boxShadow: 3,
            }}
          >
            {/* Invoice Header */}
            <Typography
              variant="p"
              sx={{
                margin: 3,
              }}
            >
              <strong>Page Details x</strong>
            </Typography>
            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: { xs: "column-reverse", md: "row" },
              }}
            >
              <Box>
                <Typography variant="h6" className="blue-strong">
                  John Doe
                </Typography>
                <Typography variant="p">
                  789/1 Sector-2c, 38200 Gandhinagar, <i>India</i>
                </Typography>
                <br />
                <Typography variant="p">
                  +91-8481758569 | contact@johndoe.co
                </Typography>
              </Box>
              <Box
                sx={{
                  textAlign: { xs: "center", md: "right" },
                  mb: { xs: 2, md: 0 },
                }}
              >
                <Image
                  src="/images/login-logo.png"
                  width="130"
                  height="80"
                  alt="Logo"
                />
              </Box>
            </Box>

            {/* Invoice Body */}
            <Box sx={{ my: 3 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Box
                      className="grey_box"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        height: "100%",
                      }}
                    >
                      <Box>
                        <Typography component="p" className="grey_light">
                          Age
                        </Typography>
                        <Typography component="strong" variant="h6">
                          28
                        </Typography>
                      </Box>
                      <Box className="spacer" sx={{ flexGrow: 1 }}></Box>
                      <Box>
                        <Typography component="p" className="grey_light">
                          Gender
                        </Typography>
                        <Typography component="strong" variant="h6">
                          Male
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <Box
                      className="grey_box"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        height: "100%",
                      }}
                    >
                      <Box>
                        <Typography component="p" className="grey_light">
                          Occupation
                        </Typography>
                        <Typography component="strong" variant="h6">
                          Self-Employed
                        </Typography>
                      </Box>
                      <Box className="spacer" sx={{ flexGrow: 1 }}></Box>
                      <Box>
                        <Typography component="p" className="grey_light">
                          Marital Status
                        </Typography>
                        <Typography component="strong" variant="h6">
                          Single
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box
                      className="grey_box"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        height: "100%",
                      }}
                    >
                      <Box>
                        <Typography component="p" className="grey_light">
                          Medical/Psychiatric History
                        </Typography>
                        <Typography component="strong" variant="h6">
                          28
                        </Typography>
                      </Box>
                      <Box className="spacer" sx={{ flexGrow: 1 }}></Box>
                      <Box>
                        <Typography component="p" className="grey_light">
                          Gender
                        </Typography>
                        <Typography component="strong" variant="h6">
                          Male
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography component="p">
                  Informamt name and relationship: <strong>Dummy</strong>
                </Typography>
              </Box>

              <Box>
                <Typography component="p">
                  Emergency Contact: <strong>Dummy</strong>
                </Typography>
              </Box>
            </Box>

            <Box sx={{ my: 5 }}>
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: "70%" }}>Ap-101</Typography>
                  <Typography sx={{ width: "100%" }}>Precison</Typography>
                  <Typography sx={{ width: "33%" }}>10-March-2024</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: 2,
                    }}
                  >
                    <Box>
                      <Typography component="p">
                        <strong>Service: </strong> Dummy
                      </Typography>
                    </Box>
                    <Box>
                      <Typography component="p">
                        <strong>Faclilated By: </strong> Dummy
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />
                  <Box
                    sx={{
                      padding: 2,
                    }}
                  >
                    <Typography component="p">
                      <strong>Diagnouse: </strong> simply dummy text of
                      the printing and typesetting industry. Lorem Ipsum has
                      been the industry's standard dummy text ever since the
                      1500s, when an unknown printer took a galley of type and
                      scrambled it to make a type specimen book. It has survived
                      not only five centuries,
                    </Typography>
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      padding: 2,
                    }}
                  >
                    <Typography component="p">
                      <strong>Presenting Problem: </strong> simply dummy
                      text of the printing and typesetting industry. Lorem Ipsum
                      has been the industry's standard dummy text ever since the
                      1500s, when an unknown printer took a galley of type and
                      scrambled it to make a type specimen book. It has survived
                      not only five centuries,
                    </Typography>
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      padding: 2,
                    }}
                  >
                    <Typography component="p">
                      <strong>Suggestions: </strong> simply dummy text of
                      the printing and typesetting industry. Lorem Ipsum has
                      been the industry's standard dummy text ever since the
                      1500s, when an unknown printer took a galley of type and
                      scrambled it to make a type specimen book. It has survived
                      not only five centuries,
                    </Typography>
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      padding: 2,
                    }}
                  >
                    <Typography component="p">
                      <strong>Follow-up: </strong> simply dummy text of
                      the printing and typesetting industry. Lorem Ipsum has
                      been the industry's standard dummy text ever since the
                      1500s, when an unknown printer took a galley of type and
                      scrambled it to make a type specimen book. It has survived
                      not only five centuries,
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
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
                <Typography component="p">Sign</Typography>
                <Typography component="strong">Dr. Shaweta Bhardwaj</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <Button variant="contained" onClick={handleDownloadPdf}>
            Download PDF
          </Button>
          <Button variant="contained" onClick={handlePrint}>
            Print
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoicePage;