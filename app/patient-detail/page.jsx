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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const InvoicePage = () => {
  const invoiceRef = useRef();
  const [expanded, setExpanded] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const StyledMenu = styled((props) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === "light"
          ? "rgb(55, 65, 81)"
          : theme.palette.grey[300],
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      "& .MuiMenu-list": {
        padding: "4px 0",
      },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));

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
    <Box sx={{ width: "100%" }}>
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
                      <strong>Diagnouse: </strong> simply dummy text of the
                      printing and typesetting industry. Lorem Ipsum has been
                      the industry&apos;s standard dummy text ever since the
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
                      <strong>Diagnouse: </strong> simply dummy text of the
                      printing and typesetting industry. Lorem Ipsum has been
                      the industry&apos;s standard dummy text ever since the
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
                      <strong>Diagnouse: </strong> simply dummy text of the
                      printing and typesetting industry. Lorem Ipsum has been
                      the industry&apos;s standard dummy text ever since the
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
                      <strong>Diagnouse: </strong> simply dummy text of the
                      printing and typesetting industry. Lorem Ipsum has been
                      the industry&apos;s standard dummy text ever since the
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
          <Button
            id="demo-customized-button"
            aria-controls={open ? "demo-customized-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            variant="contained"
            disableElevation
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Options
          </Button>
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} disableRipple>
              <EditIcon />
              Edit
            </MenuItem>
            <MenuItem onClick={handleClose} disableRipple>
              <FileCopyIcon />
              Duplicate
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleClose} disableRipple>
              <ArchiveIcon />
              Archive
            </MenuItem>
            <MenuItem onClick={handleClose} disableRipple>
              <MoreHorizIcon />
              More
            </MenuItem>
          </StyledMenu>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoicePage;
