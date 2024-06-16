import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import CountrySelect from "../components/CounntrySelect"; // Ensure the file name is correct
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";

const Step1Form = ({ formik }) => {
  return (
    <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ width: "100%", px: 1, pt: 4 }}>
      <Grid item xs={12} sm={6}>
        <TextField
          id="name"
          name="name"
          label="Name"
          fullWidth
          variant="outlined"
          {...formik.getFieldProps("name")}
          error={formik.touched.name && Boolean(formik.errors.name)}
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
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth error={formik.touched.gender && Boolean(formik.errors.gender)}>
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
                <MenuItem value="preferNotToAnswer">Prefer Not to answer</MenuItem>
              </Select>
              {formik.touched.gender && formik.errors.gender && (
                <FormHelperText>{formik.errors.gender}</FormHelperText>
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
              error={formik.touched.age && Boolean(formik.errors.age)}
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
          error={formik.touched.mobile && Boolean(formik.errors.mobile)}
          helperText={formik.touched.mobile && formik.errors.mobile}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth error={formik.touched.maritalStatus && Boolean(formik.errors.maritalStatus)}>
          <InputLabel id="marital-status-label">Marital Status</InputLabel>
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
          {formik.touched.maritalStatus && formik.errors.maritalStatus && (
            <FormHelperText>{formik.errors.maritalStatus}</FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth error={formik.touched.occupation && Boolean(formik.errors.occupation)}>
          <InputLabel id="occupation-label">Occupation</InputLabel>
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
            <MenuItem value="self-employed">Self Employed</MenuItem>
            <MenuItem value="counselor">Counselor</MenuItem>
            <MenuItem value="homemaker">Homemaker</MenuItem>
          </Select>
          {formik.touched.occupation && formik.errors.occupation && (
            <FormHelperText>{formik.errors.occupation}</FormHelperText>
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
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CountrySelect
          id="country"
          name="country"
          value={formik.values.country}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.country && Boolean(formik.errors.country)}
          helperText={formik.touched.country && formik.errors.country}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          id="informant"
          name="informant"
          label="Informant (name | relation)"
          fullWidth
          variant="outlined"
          {...formik.getFieldProps("informant")}
          error={formik.touched.informant && Boolean(formik.errors.informant)}
          helperText={formik.touched.informant && formik.errors.informant}
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
          error={formik.touched.emergencyContact && Boolean(formik.errors.emergencyContact)}
          helperText={formik.touched.emergencyContact && formik.errors.emergencyContact}
        />
      </Grid>
    </Grid>
  );
};

export default Step1Form;
