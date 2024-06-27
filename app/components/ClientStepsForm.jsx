import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import CountrySelect from "../components/CounntrySelect"; // Ensure the file name is correct
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import Alert from "@mui/material/Alert";

const steps = ["Personal Detail", "Medical Detail"];

const findUsOptions = [
  { label: "Google Search", value: "Google Search" },
  { label: "Social Media", value: "Social Media" },
  { label: "Friend/Family Referral", value: "Friend/Family Referral" },
  { label: "Advertisement", value: "Advertisement" },
  { label: "Other", value: "Other" },
];

const HorizontalLinearStepper = () => {
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    gender: Yup.string().required("Gender is required"),
    mobile: Yup.number().required("Mobile is required"),
    age: Yup.number().required("Age is required"),
    maritalStatus: Yup.string().required("Marital Status is required"),
    occupation: Yup.string().required("Occupation is required"),
    country: Yup.string().required("Country is required"),
    address: Yup.string().required("Address is required"),
    informant: Yup.string().required("Informant is required"),
    emergencyContact: Yup.string().required("Emergency Contact is required"),
    medicalHistory: Yup.string().required("Medical History is required"),
    personalHistory: Yup.string().required("Personal History is required"),
    findUs: Yup.string().required("How did you find us? is required"),
    remarks: Yup.string().required("Remarks is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      gender: "",
      age: "",
      mobile: "",
      maritalStatus: "",
      country: "",
      occupation: "",
      address: "",
      informant: "",
      emergencyContact: "",
      medicalHistory: "",
      personalHistory: "",
      findUs: "",
      remarks: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await submitForm(values);
        setIsFinished(true); // Assuming the API call is successful
      } catch (error) {
        console.error("Error submitting form:", error);
        // Handle error state as needed
      }
    },
  });

  const { handleSubmit, isValid, dirty, isSubmitting, errors, touched } =
    formik;
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [isFinished, setIsFinished] = React.useState(false);
  const [showModalProgress, setShowModalProgress] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [showSuccess, setShowSuccess] = React.useState(false);

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSkipped(new Set());
    setIsFinished(false);
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return (
          formik.values.name !== "" &&
          formik.values.email !== "" &&
          formik.values.gender !== "" &&
          formik.values.age !== "" &&
          formik.values.mobile !== "" &&
          formik.values.maritalStatus !== "" &&
          formik.values.country !== "" &&
          formik.values.occupation !== "" &&
          formik.values.address !== "" &&
          formik.values.informant !== "" &&
          formik.values.emergencyContact !== ""
        );
      case 1:
        return (
          formik.values.medicalHistory !== "" &&
          formik.values.personalHistory !== "" &&
          formik.values.findUs !== "" &&
          formik.values.remarks !== ""
        );
      default:
        return true;
    }
  };

  const submitForm = async (formData) => {
    const apiUrl = `/api/clients`;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    };

    setShowModalProgress(true);

    try {
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        // Set specific error message from API response
        if (data.error.includes("Mobile number")) {
          setAlertMessage("Mobile number already exists. Try another.");
        } else if (data.error.includes("Email")) {
          setAlertMessage("Email already exists. Try another.");
        } else {
          setAlertMessage("An error occurred. Please try again.");
        }
        if (response.status === 409) {
          // Assuming 409 is for duplicate key error
          setAlertMessage("A client with this Srno already exists.");
        }
        setShowAlert(true);
        throw new Error(data.error || `An error occurred: ${response.status}`);
      }

      // Handle success response
      // console.log("Form submission successful:", data);
      setSuccessMessage("Form submitted successfully!");
      setShowSuccess(true);
      setIsFinished(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setShowModalProgress(false);
    }
  };

  const handleCloseModal = () => {
    setShowModalProgress(false);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ width: "100%" }}>
          {showAlert && (
            <Alert severity="error" onClose={() => setShowAlert(false)}>
              {alertMessage}
            </Alert>
          )}
          {showSuccess && (
            <Alert severity="success" onClose={() => setShowSuccess(false)}>
              {successMessage}
            </Alert>
          )}
          {isFinished ? (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              {/* <Typography variant="h6" gutterBottom>
                All steps completed
              </Typography>
              <Button onClick={handleReset}>Reset</Button> */}
            </Box>
          ) : (
            <>
              <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};
                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <React.Fragment>
                {activeStep === 0 && (
                  <Grid
                    container
                    rowSpacing={3}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    sx={{ width: "100%", px: 1, pt: 4 }}
                  >
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="name"
                        name="name"
                        label="Name"
                        fullWidth
                        variant="outlined"
                        {...formik.getFieldProps("name")}
                        error={
                          formik.touched.name && Boolean(formik.errors.name)
                        }
                        helperText={formik.touched.name && formik.errors.name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="email"
                        name="email"
                        label="Email"
                        fullWidth
                        variant="outlined"
                        {...formik.getFieldProps("email")}
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <FormControl
                            fullWidth
                            error={
                              formik.touched.gender &&
                              Boolean(formik.errors.gender)
                            }
                          >
                            <InputLabel id="gender-label">Gender</InputLabel>
                            <Select
                              labelId="gender-label"
                              id="gender"
                              name="gender"
                              value={formik.values.gender}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              label="Gender"
                            >
                              <MenuItem value="">Select Gender</MenuItem>
                              <MenuItem value="male">Male</MenuItem>
                              <MenuItem value="female">Female</MenuItem>
                              <MenuItem value="preferNotToAnswer">
                                Prefer Not to answer
                              </MenuItem>
                            </Select>
                            {formik.touched.gender && formik.errors.gender && (
                              <FormHelperText>
                                {formik.errors.gender}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            id="age"
                            name="age"
                            label="Age"
                            fullWidth
                            variant="outlined"
                            {...formik.getFieldProps("age")}
                            error={
                              formik.touched.age && Boolean(formik.errors.age)
                            }
                            helperText={formik.touched.age && formik.errors.age}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="mobile"
                        name="mobile"
                        label="Mobile"
                        fullWidth
                        variant="outlined"
                        {...formik.getFieldProps("mobile")}
                        error={
                          formik.touched.mobile && Boolean(formik.errors.mobile)
                        }
                        helperText={
                          formik.touched.mobile && formik.errors.mobile
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.maritalStatus &&
                          Boolean(formik.errors.maritalStatus)
                        }
                      >
                        <InputLabel id="marital-status-label">
                          Marital Status
                        </InputLabel>
                        <Select
                          labelId="marital-status-label"
                          id="maritalStatus"
                          name="maritalStatus"
                          value={formik.values.maritalStatus}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          label="Marital Status"
                        >
                          <MenuItem value="">Select Marital Status</MenuItem>
                          <MenuItem value="single">Single</MenuItem>
                          <MenuItem value="married">Married</MenuItem>
                          <MenuItem value="widow">Widow</MenuItem>
                          <MenuItem value="separated">Separated</MenuItem>
                        </Select>
                        {formik.touched.maritalStatus &&
                          formik.errors.maritalStatus && (
                            <FormHelperText>
                              {formik.errors.maritalStatus}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.occupation &&
                          Boolean(formik.errors.occupation)
                        }
                      >
                        <InputLabel id="occupation-label">
                          Occupation
                        </InputLabel>
                        <Select
                          labelId="occupation-label"
                          id="occupation"
                          name="occupation"
                          value={formik.values.occupation}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          label="Occupation"
                        >
                          <MenuItem value="">Select Occupation</MenuItem>
                          <MenuItem value="job">Job</MenuItem>
                          <MenuItem value="student">Student</MenuItem>
                          <MenuItem value="business">Business</MenuItem>
                          <MenuItem value="unemployed">Unemployed</MenuItem>
                          <MenuItem value="self-employed">
                            Self Employed
                          </MenuItem>
                          <MenuItem value="homemaker">Homemaker</MenuItem>
                        </Select>
                        {formik.touched.occupation &&
                          formik.errors.occupation && (
                            <FormHelperText>
                              {formik.errors.occupation}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="address"
                        name="address"
                        label="Address"
                        multiline
                        fullWidth
                        variant="outlined"
                        rows={2}
                        {...formik.getFieldProps("address")}
                        error={
                          formik.touched.address &&
                          Boolean(formik.errors.address)
                        }
                        helperText={
                          formik.touched.address && formik.errors.address
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CountrySelect formik={formik} />
                      {formik.touched.country && formik.errors.country && (
                        <FormHelperText error>
                          {formik.errors.country}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="informant"
                        name="informant"
                        label="Informant (name | relation)"
                        fullWidth
                        variant="outlined"
                        {...formik.getFieldProps("informant")}
                        error={
                          formik.touched.informant &&
                          Boolean(formik.errors.informant)
                        }
                        helperText={
                          formik.touched.informant && formik.errors.informant
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="emergencyContact"
                        name="emergencyContact"
                        label="Emergency Contact"
                        fullWidth
                        variant="outlined"
                        {...formik.getFieldProps("emergencyContact")}
                        error={
                          formik.touched.emergencyContact &&
                          Boolean(formik.errors.emergencyContact)
                        }
                        helperText={
                          formik.touched.emergencyContact &&
                          formik.errors.emergencyContact
                        }
                      />
                    </Grid>
                  </Grid>
                )}
                {activeStep === 1 && (
                  <Grid
                    container
                    rowSpacing={3}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    sx={{ width: "100%", px: 1, pt: 4 }}
                  >
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="medicalHistory"
                        name="medicalHistory"
                        label="Medical / psychiatric History"
                        multiline
                        fullWidth
                        variant="outlined"
                        rows={2}
                        {...formik.getFieldProps("medicalHistory")}
                        error={
                          formik.touched.medicalHistory &&
                          Boolean(formik.errors.medicalHistory)
                        }
                        helperText={
                          formik.touched.medicalHistory &&
                          formik.errors.medicalHistory
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="personalHistory"
                        name="personalHistory"
                        label="Personal History"
                        multiline
                        fullWidth
                        variant="outlined"
                        rows={2}
                        {...formik.getFieldProps("personalHistory")}
                        error={
                          formik.touched.personalHistory &&
                          Boolean(formik.errors.personalHistory)
                        }
                        helperText={
                          formik.touched.personalHistory &&
                          formik.errors.personalHistory
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        fullWidth
                        error={
                          formik.touched.findUs && Boolean(formik.errors.findUs)
                        }
                      >
                        <InputLabel id="findUs-label">
                          How did you find us?
                        </InputLabel>
                        <Select
                          labelId="findUs-label"
                          id="findUs"
                          name="findUs"
                          value={formik.values.findUs}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          label="How did you find us?"
                        >
                          <MenuItem value="">Select</MenuItem>
                          {findUsOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {formik.touched.findUs && formik.errors.findUs && (
                          <FormHelperText>
                            {formik.errors.findUs}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="remarks"
                        name="remarks"
                        label="Remarks"
                        multiline
                        fullWidth
                        variant="outlined"
                        rows={2}
                        {...formik.getFieldProps("remarks")}
                        error={
                          formik.touched.remarks &&
                          Boolean(formik.errors.remarks)
                        }
                        helperText={
                          formik.touched.remarks && formik.errors.remarks
                        }
                      />
                    </Grid>
                  </Grid>
                )}
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button
                    type="button"
                    disabled={!isStepValid(activeStep) || isSubmitting}
                    onClick={handleNext}
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </Box>
                <Box sx={{ color: "red", textAlign: "center", mt: 2 }}>
                  {touched[Object.keys(errors)[0]] && (
                    <Typography variant="caption">
                      {errors[Object.keys(errors)[0]]}
                    </Typography>
                  )}
                </Box>
              </React.Fragment>
            </>
          )}
        </Box>
      </form>

      {/* Modal with Progress Indicator */}
      <Modal
        open={showModalProgress}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showModalProgress}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default HorizontalLinearStepper;
