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
    <Card className="login__card">
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
            id="outlined-error-helper-text"
            label="Email"
            fullWidth
            size="small"
           variant="outlined" 
          />
          <TextField
            id="outlined-error-helper-text"
            label="Password"
            fullWidth
            size="small"
           variant="outlined" 
          />
          <Button variant="contained" className="btn" size="medium">
            Login
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
