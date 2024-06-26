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
import axios from 'axios'; // Import Axios

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeoutError, setTimeoutError] = useState(false);
  const router = useRouter(); // Use 'next/router' instead

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
      setIsLoading(true);
      setError(null);
      setTimeoutError(false);

      const timeoutId = setTimeout(() => {
        setTimeoutError(true);
        setIsLoading(false);
      }, 10000); // 10 seconds timeout for user feedback

      try {
        const response = await axios.post(`/api/auth/login`, values, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 seconds timeout for Axios
        });

        clearTimeout(timeoutId);

        if (response.status === 200) {
          const data = response.data;
          const token = data.token;
          const decoded = jwtDecode(token);
          console.log('Token decoded:', decoded); // Debugging token
          localStorage.setItem('token', token);
          console.log('Token stored in localStorage'); // Debugging storage
          router.push('/dashboard');
          console.log('Redirect to dashboard'); // Debugging redirection
        } else {
          const errorData = response.data;
          console.error('Login failed:', errorData);
          setError(errorData.message || 'Invalid email or password');
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Login error:', error);
        setError('Login failed. Please try again.');
      }

      setIsLoading(false);
      formik.resetForm();
    },
  });

  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
      }}
    >
      <Card className="login__card" sx={{ padding: 2 }}>
        {error && <Alert severity="error" color="error">{error}</Alert>}
        {timeoutError && <Alert severity="warning" color="warning">The request is taking too long. Please try again later.</Alert>}
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
                className={!formik.dirty || !formik.isValid || isLoading ? "disabled_btn" : "btn"}
                size="medium" 
                fullWidth
                disabled={!formik.dirty || !formik.isValid || isLoading}
              >
                {isLoading ? <CircularProgress className="white" size={24} color="inherit" /> : 'Login'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginForm;