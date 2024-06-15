"use client";

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Image from 'next/image';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress for loading state
import { useRouter } from 'next/navigation'
import { jwtDecode } from "jwt-decode";
import Alert from '@mui/material/Alert';

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null);
  const router = useRouter()
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true); // Start loading state

      try {
        const response = await fetch('http://localhost:5500/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
  
        if (response.ok) {
          const data = await response.json();
          const token = data.token;
          // Decode the token to get user data
          const decoded = jwtDecode(token);
          console.log(data); // You can access decoded data like decoded.email, decoded.role, etc.
          localStorage.setItem('token', token);
            router.push('/dashboard')
        } else {
          setError('Invalid email or password');
        }
      } catch (error) {
        console.error('Login error:', error);
        setError('Login failed. Please try again.');
      }
      // Simulate API call or async operation
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate 1 second delay
      setIsLoading(false); // End loading state
      formik.resetForm(); // Reset form fields
    },
  });

  return (
   <>
  
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
     {!error ? "" : <Alert severity="error" color="error">{error}</Alert> }
       <CardContent>
         <Image src="/images/login-logo.png" alt="logo" width="150" height="100" />
         <Typography gutterBottom variant="h5" className="mb-4 text-center">
           Sign In
         </Typography>
         <form onSubmit={formik.handleSubmit}>
           <Box
             sx={{
               '& .MuiTextField-root': { m: 1, width: '100%' },
               '& .MuiButton-root': { m: 1, width: '100%' },
             }}
           >
             <TextField
               id="email"
               name="email"
               label="Email"
               type="email"
               variant="outlined"
               fullWidth
               size="small"
               {...formik.getFieldProps('email')}
               error={formik.touched.email && Boolean(formik.errors.email)}
               helperText={formik.touched.email && formik.errors.email}
             />
             <TextField
               id="password"
               name="password"
               label="Password"
               type="password"
               variant="outlined"
               fullWidth
               size="small"
               {...formik.getFieldProps('password')}
               error={formik.touched.password && Boolean(formik.errors.password)}
               helperText={formik.touched.password && formik.errors.password}
             />
             <Button
               type="submit"
               variant="contained"
               className={!formik.dirty || !formik.isValid || isLoading ? "disbaled_btn" : "btn"}
               size="medium"
               fullWidth
               disabled={!formik.dirty || !formik.isValid || isLoading} // Disable when form is pristine or invalid or during loading
             >
               {isLoading ? <CircularProgress className="white" size={24} color="inherit" /> : 'Login'}
             </Button>
           </Box>
         </form>
       </CardContent>
     </Card>
   </Box></>
  );
};

export default LoginForm;
