import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Image from "next/image";
import Box from "@mui/material/Box";

export default function LoginForm() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0', // optional, for better visual
      }}
    >
      <Card className="login__card" sx={{ padding: 2 }}>
        <CardContent>
          <Image src="/images/login-logo.png" width="150" height="100" />
          <Typography gutterBottom variant="h5" className="mb-4 text-center">
            Sign In
          </Typography>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-email"
              label="Email"
              fullWidth
              size="small"
              variant="outlined" 
            />
            <TextField
              id="outlined-password"
              label="Password"
              fullWidth
              size="small"
              variant="outlined" 
            />
            <Button variant="contained" className="btn" size="medium" fullWidth>
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
