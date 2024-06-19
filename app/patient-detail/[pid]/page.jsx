// app/patient-detail/[pid]/page.jsx
"use client";

import React, { useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import { styled, alpha } from "@mui/material/styles";
import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import Addprescription from "../../components/Addprescription"; // Correct import path for Addprescription
import EditPrescription from "../../components/EditPrescription"; // Correct import path for Addprescription
import useGetClientById from "../../../hooks/useGetClientById";
import useProtectedRoute from "../../../hooks/useProtectedRoute";
import useAppointments from "../../../hooks/useAppointments"; // Adjust the path as necessary
import { format } from "date-fns"; // Import date-fns format function
import { CircularProgress } from "@mui/material";

const PatientDetails = ({ params }) => {
  const invoiceRef = useRef();
  const [expanded, setExpanded] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [clientId, setclientId] = React.useState(null);
  const [filltredMeets, setfilltredmeets] = React.useState([]);
  const open = Boolean(anchorEl);
  const [isLoading, setLoading] = React.useState(false); // State for loading indicator

  const apiUrl = "http://localhost:5500/api/clients"; // Replace with your actual API URL
  const { pid } = params;
  const user = useProtectedRoute();
  const { client, clientisLoading, error } = useGetClientById(apiUrl, pid);
  const { appointments, loading, meetserror } = useAppointments(pid);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    const formattedRows = appointments.map((appointment) => ({
      ...appointment,
      date: format(new Date(appointment.date), "dd-MM-yyyy"), // Format date correctly
      time: format(new Date(appointment.time), "HH:mm a"), // Format time correctly
    }));
    setfilltredmeets(formattedRows);
    console.log(filltredMeets);
  }, [appointments]); // Update when todayAppointments changes

  if (!user) {
    return null; // Optionally render a loading state or a redirect message
  }

  if (clientisLoading) {
    return <p>Loading...</p>; // Handle loading state
    setclientId(pid);
  }

  if (error) {
    return <p>Error: {error.message}</p>; // Handle error state
  }

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
          marginright: theme.spacing(1.5),
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
    <Box sx={{ width: "100%" }}>
      <Container maxWidth="lg">
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
              <Typography variant="p">
                <strong>Client ID: {client && client.ClientID}</strong>
              </Typography>
              <Divider
                sx={{
                  margin: "8px auto",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: { xs: "column-reverse", md: "row" },
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    className="blue-strong"
                    sx={{
                      margin: "6px auto",
                    }}
                  >
                    {client && client.name}
                  </Typography>
                  <Typography variant="p" className="address">
                    {client && client.address},{" "}
                    <i>{client && client.country}</i>
                  </Typography>
                  <br />
                  <Typography variant="p" className="address">
                    {client && client.mobile} | {client && client.email}
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
                            {client && client.age}
                          </Typography>
                        </Box>
                        <Box className="spacer" sx={{ flexGrow: 1 }}></Box>
                        <Box>
                          <Typography component="p" className="grey_light">
                            Gender
                          </Typography>
                          <Typography component="strong" variant="h6">
                            {client && client.gender}
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
                            {client && client.occupation}
                          </Typography>
                        </Box>
                        <Box className="spacer" sx={{ flexGrow: 1 }}></Box>
                        <Box>
                          <Typography component="p" className="grey_light">
                            Marital Status
                          </Typography>
                          <Typography component="strong" variant="h6">
                            {client && client.maritalStatus}
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
                            {client && client.medicalHistory}
                          </Typography>
                        </Box>
                        <Box className="spacer" sx={{ flexGrow: 1 }}></Box>
                        <Box>
                          <Typography component="p" className="grey_light">
                            Find Us
                          </Typography>
                          <Typography component="strong" variant="h6">
                            {client && client.findUs}
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
                    Informamt name and relationship:{" "}
                    <strong>{client && client.informant}</strong>
                  </Typography>
                </Box>

                <Box>
                  <Typography component="p">
                    Emergency Contact:{" "}
                    <strong>{client && client.emergencyContact}</strong>
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ my: 5 }}>
                {filltredMeets &&
                  filltredMeets.map((appointment) => (
                    <Accordion
                      className="accordian-theme"
                      expanded={
                        expanded ===
                        `${appointment && appointment.appointmentID}`
                      }
                      onChange={handleChange(
                        `${appointment && appointment.appointmentID}`
                      )}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={appointment && appointment.appointmentID}
                        id={appointment && appointment.appointmentID}
                      >
                        <Typography sx={{ width: "70%" }}>
                          {appointment && appointment.appointmentID}
                        </Typography>
                        <Typography sx={{ width: "100%" }}>Precison</Typography>
                        <Typography sx={{ width: "33%" }}>
                          {appointment && appointment.date}
                        </Typography>
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
                              <strong>Service: </strong>{" "}
                              {appointment && appointment.service}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography component="p">
                              <strong>Faclilated By: </strong>{" "}
                              {appointment && appointment.facilitatedBy}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider />
                        {appointment &&
                          appointment.prescriptions.map((prescription) => (
                            <>
                              <Box
                                sx={{
                                  padding: 2,
                                }}
                              >
                                <Typography component="p">
                                  <strong>Diagnoses: </strong>{" "}
                                  {prescription.diagnoses}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  padding: 2,
                                }}
                              >
                                <Typography component="p">
                                  <strong>Suggestions: </strong>{" "}
                                  {prescription.suggestions}
                                </Typography>
                              </Box>
                              <Divider />
                              <Box
                                sx={{
                                  padding: 2,
                                }}
                              >
                                <Typography component="p">
                                  <strong>Presenting Problem: </strong>{" "}
                                  {prescription.symptoms}
                                </Typography>
                              </Box>

                              <Divider />
                              <Box
                                sx={{
                                  padding: 2,
                                }}
                              >
                                <Typography component="p">
                                  <strong>Follow Up: </strong>{" "}
                                  {prescription.followUp}
                                </Typography>
                              </Box>
                            </>
                          ))}
                        {appointment &&
                        appointment.prescriptions.length == "0" ? (
                          <Typography
                            component="h6"
                            className="my-5 center-text"
                          >
                            🙁 prescription not updated for{" "}
                            {client && client.name}.
                          </Typography>
                        ) : (
                          ""
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))}

                {filltredMeets && filltredMeets.lenght == 0 ? (
                  <Typography component="h6" className="my-4 center-text">
                    🙁 {client && client.name} dont have any appointments.
                  </Typography>
                ) : (
                  ""
                )}
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
                  <Typography component="strong">
                    Dr. Shaweta Bhardwaj
                  </Typography>
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
              {/* <EditPrescription clientId={pid} /> */}
              <Addprescription clientId={pid} />
              <Divider
                sx={{
                  margin: "15px auto",
                }}
              ></Divider>
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
      </Container>
    </Box>
  );
};

export default PatientDetails;
