import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Card, Checkbox, Grid, TextField, Box, styled, Typography, Alert } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import useAuth from "../../hooks/useAuth";
import useSettings from "../../hooks/useSettings";
import { useNavigate } from "react-router-dom";

// Styled Components
const FlexBox = styled(Box)(() => ({ display: "flex", alignItems: "center" }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: "center" }));

const ContentBox = styled(Box)(() => ({
  height: "100%",
  padding: "32px",
  position: "relative",
  background: "rgba(0, 0, 0, 0.01)",
}));

const JWTRoot = styled(JustifyBox)(() => ({
  background: "#1A2038",
  minHeight: "100vh !important",
  "& .card": {
    maxWidth: 800,
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center",
  },
}));

// Initial Form Values
const initialValues = {
  email: "faculty@parc.edu",
  password: "faculty123",
  remember: true,
};

// Validation Schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be 6 character length")
    .required("Password is required!"),
  email: Yup.string().email("Invalid Email address").required("Email is required!"),
});

const JwtLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { login } = useAuth();
  const { updateSettings } = useSettings();

  const handleFormSubmit = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const user = await login(values.email, values.password);
      
      // Update Global Settings Role based on login
      updateSettings({ role: user.role });

      // Redirect based on Role
      if (user.role === 'admin') {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard/default");
      }
    } catch (e) {
      setLoading(false);
      setError(e);
    }
  };

  return (
    <JWTRoot>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <JustifyBox p={4} height="100%" sx={{ minWidth: 320 }}>
              <img src="/assets/images/illustrations/dreamer.svg" width="100%" alt="" />
            </JustifyBox>
          </Grid>

          <Grid item sm={6} xs={12}>
            <ContentBox>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>Sign In</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Faculty Administration Portal
              </Typography>

              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 1.5 }}
                    />

                    <FlexBox justifyContent="space-between">
                      <FlexBox gap={1}>
                        <Checkbox
                          size="small"
                          name="remember"
                          onChange={handleChange}
                          checked={values.remember}
                          sx={{ padding: 0 }}
                        />
                        <Typography variant="caption">Remember me</Typography>
                      </FlexBox>
                    </FlexBox>

                    {error && (
                      <Alert severity="error" sx={{ mt: 2, py: 0 }}>{error}</Alert>
                    )}

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ my: 2 }}
                      fullWidth
                    >
                      Login
                    </LoadingButton>

                    <Alert severity="info" sx={{ mt: 2 }}>
                      <strong>Admin:</strong> admin@parc.edu / admin123<br/>
                      <strong>Faculty:</strong> faculty@parc.edu / faculty123
                    </Alert>
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </JWTRoot>
  );
};

export default JwtLogin;