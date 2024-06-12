import React from "react";
import ChildBanner from "../components/childBanner";
import Grid from "@mui/material/Grid"; // Grid version 1
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import InvoicePage from "../components/InvoicePage";
import Button from "@mui/material/Button";

const DailyReport = () => {
  return (
    <>
      <ChildBanner />
      <Container>
        <Box sx={{ width: "100%" }}>
          <Grid
            container
            rowSpacing={3}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={12} sm={12} md={9}>
              <InvoicePage />
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
              <Button variant="contained">Download PDF</Button>
              <Button variant="contained">Print</Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default DailyReport;
