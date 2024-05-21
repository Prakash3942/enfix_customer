import { Avatar, Box, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import restApp, { authCookieName, authenticationService, cookieStorage, } from "../../apis/rest.app";
import EnPrimaryButton from "../../components/EnPrimaryButton";
import EnTextButton from "../../components/EnTextButton";
import { EnTextField } from "../../components/EnTextField";
import { AppDispatch, AppStoreState } from "../../store/store";
import { GetDeviceId } from "../../utils/core/DeviceId";
import { isValidEmail, notEmpty } from "../../utils/validators";
import { setUser } from "../app/slice";

export interface LoginProps { }

const Login: React.FC<LoginProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: AppStoreState) => state.loginData);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    GetDeviceId();
  }, []);

  const validate = () => {
    const newErrors: any = {};
    if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address!";
    }
    if (!notEmpty(password)) {
      newErrors.password = "Password is required!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validate()) {
      setLoader(true);
      authenticationService.create({
        email: email,
        password: password,
        deviceId: localStorage.getItem("deviceId") ? localStorage.getItem("deviceId") : "",
        deviceType: 1,
        strategy: "local",
        entity: "customer",
      })
        .then((res: any) => {
          enqueueSnackbar("Login Successfull", { variant: "success" });
          restApp.authenticate({
            deviceType: 1,
            strategy: "jwt",
            deviceId: localStorage.getItem("deviceId"),
          },
            {
              headers: {
                Authorization: `Bearer ${res?.accessToken}`,
              },
            }
          )
            .then((res: any) => {
              router.push("/");
              localStorage.setItem(authCookieName, res.accessToken);
              cookieStorage.setItem(authCookieName, res.accessToken);
              dispatch(setUser({ user: res?.user }));
            })
            .catch((err: any) => {
              if (err) {
                router.push("/login");
                localStorage.removeItem(authCookieName);
                cookieStorage.removeItem(authCookieName);
              }
            });
        })
        .catch((err: any) => {
          enqueueSnackbar(err.message, { variant: "error", });
        })
        .finally(() => {
          setLoader(false);
        });
    }
  };

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        background: "url('/images/login-background.svg')",
        backgroundSize: { lg: "cover", md: "cover", sm: "cover", xs: "cover" },
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Avatar
          src="/images/full-logo.svg"
          variant="square"
          sx={{ width: "50%", height: "auto", mb: 3 }}
        />
        <Paper
          sx={{
            borderRadius: "10px",
            background: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 1.5,
          }}
        >
          <Typography
            color={"#252525"}
            sx={{
              fontSize: "24px",
              fontWeight: 600,
              mt: 3.5,
            }}
            textAlign={"center"}
          >
            {"Welcome to Enfix !"}
          </Typography>
          <Typography
            color={"#252525"}
            sx={{
              fontSize: "18px",
              fontWeight: 500,
              width: "24rem",
              mt: 1.5,
              mb: 3,
            }}
            textAlign={"center"}
          >
            This system is a tool for admin to easily{" "}
            {<span style={{ fontWeight: 600 }}>manage</span>} amusement{" "}
            <span style={{ fontWeight: 600 }}>park</span> customers.
          </Typography>
          <EnTextField
            data={email}
            setData={setEmail}
            label="Email Id"
            placeHolder="Enter your Email ID"
            disabled={false}
            size="large"
            error={errors.email}
          />
          <EnTextField
            data={password}
            setData={setPassword}
            label="Enter password"
            placeHolder="Enter password"
            passwordType={true}
            endAdornment={true}
            size="large"
            error={errors.password}
          />
          <Box display={"flex"} flexDirection={"row-reverse"} width={"100%"}>
            <EnTextButton
              disabled={false}
              loading={false}
              onClick={() => {
                router.push("/forgot-password");
              }}
              textColor="#373737"
              textWeight={600}
              textSize={15}
            >
              Forgot password ?
            </EnTextButton>
          </Box>
          <EnPrimaryButton
            disabled={loader}
            loading={loader}
            onClick={() => {
              handleLogin();
            }}
            hoverColor="#373737"
          >
            Login
          </EnPrimaryButton>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
