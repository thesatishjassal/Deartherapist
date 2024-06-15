import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

const Step2Form = ({ formik }) => {
  return (
    <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ width: "100%", px: 1, pt: 4 }}>
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
          error={formik.touched.medicalHistory && Boolean(formik.errors.medicalHistory)}
          helperText={formik.touched.medicalHistory && formik.errors.medicalHistory}
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
          error={formik.touched.personalHistory && Boolean(formik.errors.personalHistory)}
          helperText={formik.touched.personalHistory && formik.errors.personalHistory}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          id="findUs"
          name="findUs"
          label="How did you find us?"
          multiline
          fullWidth
          variant="outlined"
          rows={2}
          {...formik.getFieldProps("findUs")}
          error={formik.touched.findUs && Boolean(formik.errors.findUs)}
          helperText={formik.touched.findUs && formik.errors.findUs}
        />
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
          error={formik.touched.remarks && Boolean(formik.errors.remarks)}
          helperText={formik.touched.remarks && formik.errors.remarks}
        />
      </Grid>
    </Grid>
  );
};

export default Step2Form;
