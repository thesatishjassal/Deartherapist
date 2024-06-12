import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

const Custom404 = () => {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
      </Head>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <Box>
          <Image
            src="/images/404-illustration.svg"
            alt="404 Illustration"
            width={400}
            height={300}
          />
        </Box>
        <Typography variant="h2" component="h1" gutterBottom>
          Oops! Page Not Found
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          It seems the page you are looking for does not exist.
        </Typography>
        <Link href="/" passHref>
          <Button variant="contained" color="primary" sx={{ mt: 3 }}>
            Go Back Home
          </Button>
        </Link>
      </Container>
    </>
  );
};

export default Custom404;
