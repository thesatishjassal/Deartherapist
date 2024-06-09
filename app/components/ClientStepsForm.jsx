import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import CountrySelect from "./CounntrySelect";

const steps = ["Personal Detail", "Medical Detail"];

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [isFinished, setIsFinished] = React.useState(false);

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
      setIsFinished(true);
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

  const handleSubmit = () => {
    console.log("Form Data:");
    // Here you can add the logic to send the form data to a server or perform other actions with it
  };

  const style = {
    py: 4,
  };

  const PersonalDetailStep = () => (
    <React.Fragment>
      <Box sx={style}>
        <Box sx={{ width: "100%" }}>
          <Grid
            container
            rowSpacing={3}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            columns={{ xs: 12, sm: 12, md: 12 }}
          >
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                id="amount-control"
                label="Name"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                id="amount-control"
                label="Email"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FormControl fullWidth>
                <InputLabel id="gender">Gender</InputLabel>
                <Select labelId="gender" id="gender-control" label="gender">
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">female</MenuItem>
                  <MenuItem value="Prefer Not to answer">
                    Prefer Not to answer
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                id="amount-control"
                label="Mobile"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FormControl fullWidth>
                <InputLabel id="marital-status">Marital Status</InputLabel>
                <Select
                  labelId="marital-status"
                  id="marital-tatus-control"
                  label="marital-status"
                >
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                  <MenuItem value="Widow">Widow</MenuItem>
                  <MenuItem value="Seprated">Seprated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FormControl fullWidth>
                <InputLabel id="occupation">Occupation</InputLabel>
                <Select
                  labelId="occupation"
                  id="occupation-control"
                  label="occupation"
                >
                  <MenuItem value="job">Job</MenuItem>
                  <MenuItem value="Student">Student</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                  <MenuItem value="Unemployed">Unemployed</MenuItem>
                  <MenuItem value="Self Employed">Self Employed</MenuItem>
                  <MenuItem value="Widow">Counselor</MenuItem>
                  <MenuItem value="Homemaker">Homemaker</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              {" "}
              <TextField
                id="outlined-multiline-static"
                label="Address"
                multiline
                fullWidth
                rows={1}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <CountrySelect />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                id="amount-control"
                label="Informant (name | relation)"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                id="amount-control"
                label="Emergency Contact"
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </React.Fragment>
  );

  const MedicalDetailStep = () => (
    <React.Fragment>
      <Box sx={style}>
        <Box sx={{ width: "100%" }}></Box>{" "}
        <Grid
          container
          rowSpacing={3}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          columns={{ xs: 12, sm: 12, md: 12 }}
        >
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              id="medical-multiline-static"
              label="Medical / physicatric History"
              multiline
              fullWidth
              rows={2}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              id="personal-multiline-static"
              label="Personal History"
              multiline
              fullWidth
              rows={2}
            />
          </Grid>{" "}
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              id="find-multiline-static"
              label="How did you find us?"
              multiline
              fullWidth
              rows={2}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              id="remarks-multiline-static"
              label="Remarks"
              multiline
              fullWidth
              rows={2}
            />
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );

  return (
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
            {activeStep === 0 && <PersonalDetailStep />}
            {activeStep === 1 && <MedicalDetailStep />}
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
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        </>
      )}
    </Box>
  );
}
