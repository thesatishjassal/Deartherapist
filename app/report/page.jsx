import React from "react";
import ChildBanner from "../components/childBanner";
import Grid from "@mui/material/Grid"; // Grid version 1
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import InvoicePage from "../components/InvoicePage"

const DailyReport = () => {
  return (
    <>
      <ChildBanner />
      <Container>
        <Box>
          <Grid container spacing={2}>
            <Grid xs={12}>
                <InvoicePage />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default DailyReport;
