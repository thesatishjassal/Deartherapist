import React from "react";
import Grid from "@mui/material/Grid"; // Grid version 1
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import InvoicePage from "../../components/InvoicePage";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";

const DailyReport = () => {
  return (
    <>
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
              <Box
                className="invoice-content"
                sx={{
                  margin: "30px auto",
                  padding: 3,
                  boxShadow: 2,
                  backgroundColor: "#fff",
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  sx={{
                    width: "100%",
                  }}
                >
                  Download Pdf
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default DailyReport;
