"use client";

import React, { useRef, useState, useEffect } from "react";
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
import EditPrescription from "../../components/EditPrescription"; // Correct import path for EditPrescription
import useGetClientById from "../../../hooks/useGetClientById";
import useProtectedRoute from "../../../hooks/useProtectedRoute";
import useAppointments from "../../../hooks/useAppointments"; // Adjust the path as necessary
import { format } from "date-fns"; // Import date-fns format function
import { CircularProgress } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import RedirectToWhatsApp from "../../components/RedirectToWhatsApp";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "@mui/material";

const PatientDetails = ({ params }) => {
  const invoiceRef = useRef();
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filltredMeets, setfilltredmeets] = useState([]);
  const [isLoading, setLoading] = useState(false); // State for loading indicator
  const [clientId, setClientId] = useState(null); // State to store clientId for Addprescription
  const [appointmentId, setAppointmentId] = useState(null); // State to store appointmentId for Addprescription
  const [prescriptionId, setPrescriptionId] = useState(null); // State to store prescriptionId for Addprescription
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal open/close

  const apiUrl = `/api/clients`; // Replace with your actual API URL
  const { pid } = params;
  const { client, clientisLoading, error } = useGetClientById(apiUrl, pid);
  const { appointments, loading, meetserror } = useAppointments(pid);

  const handleEdit = (clientId, appointmentId, prescriptionId) => {
    setIsModalOpen(true);
    setClientId(clientId);
    setAppointmentId(appointmentId);
    setPrescriptionId(prescriptionId);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setClientId(null);
    setAppointmentId(null);
    setPrescriptionId(null);
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
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
  }, [appointments]);

  useEffect(() => {
    const fetchData = () => {
      setTimeout(() => {
        // console.log("Fetching data after 3 seconds...");
        // console.log(filltredMeets);
      }, 3000);
    };
    fetchData();
  }, [filltredMeets]);

  if (clientisLoading) {
    return <p>Loading...</p>; // Handle loading state
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
                    Informant name and relationship:{" "}
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
                {filltredMeets.map((appointment) => (
                  <Accordion
                    key={appointment.appointmentID}
                    className="accordion-theme"
                    expanded={expanded === appointment.appointmentID}
                    onChange={handleChange(appointment.appointmentID)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={appointment.appointmentID}
                      id={appointment.appointmentID}
                    >
                      <Typography sx={{ width: "70%" }}>
                        {appointment.appointmentID}
                      </Typography>
                      <Typography sx={{ width: "100%" }}>
                        Prescription
                      </Typography>
                      <Typography sx={{ width: "33%" }}>
                        {appointment.date}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          padding: 2,
                        }}
                      >
                        <Box>
                          <Typography component="p">
                            <strong>Service: </strong> {appointment.service}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography component="p">
                            <strong>Facilitated By: </strong>{" "}
                            {appointment.facilitatedBy}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider />

                      {appointment.prescriptions.map((prescription, index) => (
                        <React.Fragment key={index}>
                          <Box sx={{ padding: 2 }}>
                            <Typography component="p">
                              <strong>Diagnoses: </strong>{" "}
                              {prescription.diagnoses}
                            </Typography>
                          </Box>
                          <Box sx={{ padding: 2 }}>
                            <Typography component="p">
                              <strong>Suggestions: </strong>{" "}
                              {prescription.suggestions}
                            </Typography>
                          </Box>
                          <Divider />
                          <Box sx={{ padding: 2 }}>
                            <Typography component="p">
                              <strong>Presenting Problem: </strong>{" "}
                              {prescription.symptoms}
                            </Typography>
                          </Box>

                          <Divider />
                          <Box sx={{ padding: 2 }}>
                            <Typography component="p">
                              <strong>Follow Up: </strong>{" "}
                              {prescription.followUp}
                            </Typography>
                          </Box>
                          <Divider />
                          <Box sx={{ padding: 2 }}>
                            {prescription.file && (
                              <Typography key={index} component="p">
                                <strong>Download File: </strong>{" "}
                                <Link
                                  href={`${process.env.BACKEND_URL}/uploads/${prescription.file.name}`}
                                >
                                  {prescription.file.name}
                                </Link>
                              </Typography>
                            )}
                          </Box>
                          {/* Edit Button */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <IconButton
                              aria-label="edit"
                              onClick={() =>
                                handleEdit(
                                  pid,
                                  appointment._id,
                                  prescription._id
                                )
                              }
                            >
                              <EditIcon />
                            </IconButton>
                          </Box>
                        </React.Fragment>
                      ))}

                      {appointment.prescriptions.length === 0 && (
                        <Typography component="h6" className="my-5 center-text">
                          🙁 Prescription not updated for{" "}
                          {client && client.name}.
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}

                {filltredMeets.length === 0 && (
                  <Typography component="h6" className="my-4 center-text">
                    🙁 {client && client.name} does not have any appointments.
                  </Typography>
                )}

                {/* Addprescription Modal */}
                <EditPrescription
                  clientId={clientId}
                  appointmentId={appointmentId}
                  prescriptionId={prescriptionId}
                  open={isModalOpen}
                  handleClose={handleClose}
                />
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
                    Dr. Shaveta Bhardwaj
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
              <Addprescription clientId={pid} />
              <Divider
                sx={{
                  margin: "15px auto",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "15px auto",
                }}
              >
                <RedirectToWhatsApp client={client} />
                <Button
                  variant="outlined"
                  href={`mailto:${client && client.email}`}
                  startIcon={<AttachEmailIcon />}
                >
                  Mail
                </Button>
              </Box>
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
                x
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PatientDetails;
