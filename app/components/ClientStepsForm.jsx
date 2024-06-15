import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Step1Form from "./Step1Form";
import Step2Form from "./Step2Form";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";

const steps = ["Personal Detail", "Medical Detail"];

const HorizontalLinearStepper = () => {
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    gender: Yup.string().required("Gender is required"),
    mobile: Yup.string().required("Mobile is required"),
    maritalStatus: Yup.string().required("Marital Status is required"),
    occupation: Yup.string().required("Occupation is required"),
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
      mobile: "",
      maritalStatus: "",
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

  const { handleSubmit, isValid, dirty, isSubmitting, errors, touched } = formik;
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [isFinished, setIsFinished] = React.useState(false);
  const [showModalProgress, setShowModalProgress] = React.useState(false);

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
          formik.values.mobile !== "" &&
          formik.values.maritalStatus !== "" &&
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
    // Replace with your actual API endpoint
    const apiUrl = "https://api.example.com/submit-form";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    };

    setShowModalProgress(true);

    try {
      const response = await fetch(apiUrl, requestOptions);
      if (!response.ok) {
        const errorMessage = `An error occurred: ${response.status}`;
        throw new Error(errorMessage);
      }
      // Handle success response as needed
      const data = await response.json();
      console.log("Form submission successful:", data);
      setIsFinished(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error state as needed
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
          {isFinished ? (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                All steps completed
              </Typography>
              <Button onClick={handleReset}>Reset</Button>
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
                {activeStep === 0 && <Step1Form formik={formik} />}
                {activeStep === 1 && <Step2Form formik={formik} />}
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
