import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useNavigate } from "react-router-dom"
import axios from 'axios';
import { toast } from "react-toastify";

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
  
  const theme = createTheme();

function Signup() {
  const navigate = useNavigate();
  let ValidRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const [userData, setUserData] = React.useState({
      firstName:"",
      lastName:"",
      email: "",
      password: ""
  })
  const [userDataError, setUserDataError] = React.useState({})

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value }, setUserDataError(validation(name, value)))
}
const validation = (name, value) => {
  switch (name) {
    case 'firstName':
      if(!value){
        return "please input First name *"
      }else{
        return ""
      }
      case 'lastName':
        if(!value){
          return "please input Last name *"
        }else{
          return ""
        }
      case 'email':
          if (!value) {
              return 'email requied'
          } else {
              if (!userData.email.match(ValidRex)) {
                  return 'enter valid email'
              }
              else {
                  return ''
              }
          }
      case 'password':
          if (!value) {
              return "please Input password *"
          } else {
              const uppercaseRegExp = /(?=.*?[A-Z])/;
              const lowercaseRegExp = /(?=.*?[a-z])/;
              const digitsRegExp = /(?=.*?[0-9])/;
              const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
              const minLengthRegExp = /.{8,}/;
              const passwordLength = userData.password.length;
              const uppercasePassword = uppercaseRegExp.test(userData.password);
              const lowercasePassword = lowercaseRegExp.test(userData.password);
              const digitsPassword = digitsRegExp.test(userData.password);
              const specialCharPassword = specialCharRegExp.test(userData.password);
              const minLengthPassword = minLengthRegExp.test(userData.password);
              if (passwordLength === 0) {
                  return "Password is empty";
              } else if (!uppercasePassword) {
                  return "At least one Uppercase";
              } else if (!lowercasePassword) {
                  return "At least one Lowercase";
              } else if (!digitsPassword) {
                  return "At least one digit";
              } else if (!specialCharPassword) {
                  return "At least one Special Characters";
              } else if (!minLengthPassword) {
                  return "At least minumum 8 characters";
              } else {
                  return "";
              }
              // return ""
          }
      default:
          break;
  }
}


    const handleSubmit = (event) => {
      event.preventDefault();

      let allErrors = {}
      Object.keys(userData).forEach(key => {
          const error = validation(key, userData[key])
          if (error && error.length) {
              allErrors[key] = error
          }
      });
      if (Object.keys(allErrors).length) {
          return setUserDataError(allErrors)
      } else {
          console.log(userData)
          signUpUser(userData)

      }
      };

      const signUpUser = async (userData) => {
        const res = await axios({
            method: 'POST',
            url: `http://localhost:8080/api/v1/signup`,
            data: userData
        })
        if (res.status === 200) {
            toast.success(res.data.message)
            console.log("----",res.data)
            navigate("/dashboard"); 
            localStorage.setItem("auth",JSON.stringify(res?.data?.resData))
            localStorage.setItem('token',JSON.stringify(res?.data?.resData?.token))
            setUserData({
                email: "",
                password: ""
            })
        } else {
            toast.error(res.data.message || 'Invalid user Credentials')

        }
        console.log(res)

    }

    return(
        <>
        <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  value={userData.firstName}
                  onChange={(e) => handleChange(e)}
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  helperText={userDataError?.firstName?.length > 0 ? userDataError?.firstName : null}
                  error={userDataError?.firstName?.length > 0 ? true : false}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={userData.lastName}
                  onChange={(e) => handleChange(e)}
                  autoComplete="family-name"
                  helperText={userDataError?.lastName?.length > 0 ? userDataError?.lastName : null}
                  error={userDataError?.lastName?.length > 0 ? true : false}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  name='email'
                  value={userData.email}
                  onChange={(e) => handleChange(e)}
                  label="Email Address"
                  autoComplete="email"
                  helperText={userDataError?.email?.length > 0 ? userDataError?.email : null}
                  error={userDataError?.email?.length > 0 ? true : false}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name='password'
                  value={userData.password}
                  onChange={(e) => handleChange(e)}
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  helperText={userDataError?.password?.length > 0 ? userDataError?.password : null}
                  error={userDataError?.password?.length > 0 ? true : false}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="Remember me"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link onClick={()=>navigate("/")} variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
        </>
    )
}
export default Signup