import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { EnTextField } from "../../components/EnTextField";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import EnPrimaryButton from "../../components/EnPrimaryButton";
import { useRouter } from "next/router";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { forogotPasswordService } from "../../apis/rest.app";
import { isValidEmail } from "../../utils/validators";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { setForgetEmail } from "../app/slice";
import { useSnackbar } from "notistack";

export interface ForgotPassowrdProps {}

const ForgotPassowrd: React.FC<ForgotPassowrdProps> = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const { enqueueSnackbar } = useSnackbar();

  const validate = () => {
    const newErrors: any = {};
    if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = () => {
    if (validate()) {
      setLoader(true);
      forogotPasswordService
        .create({
          purpose: "forgot_password",
          email: email,
        })
        .then((res: any) => {
          dispatch(setForgetEmail({ setEmail: email }));
          router.push("/verify-otp");
          enqueueSnackbar("Otp Send Successfully", {
            variant: "success",
          });
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
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            width={"30vw"}
          >
            <IconButton
              onClick={() => {
                router.push("/login");
              }}
            >
              <KeyboardArrowLeftIcon sx={{ color: "black" }} />
            </IconButton>
            <IconButton
              onClick={() => {
                router.push("/login");
              }}
            >
              <CloseIcon sx={{ color: "black" }} />
            </IconButton>
          </Box>
          <Typography
            color={"#252525"}
            sx={{
              fontSize: "24px",
              fontWeight: 500,
              mt: 3.5,
            }}
            textAlign={"center"}
          >
            {"Oops! Forgot your password?"}
          </Typography>
          <Typography
            color={"#252525"}
            sx={{
              fontSize: "18px",
              fontWeight: 500,
              width: "23rem",
              mt: 1.5,
              mb: 3,
            }}
            textAlign={"center"}
          >
            {
              "No issues! We can help you reset it using your official email ID & a OTP verification."
            }
          </Typography>
          <EnTextField
            data={email}
            setData={setEmail}
            label="Official email id"
            placeHolder="Enter Official email id"
            disabled={false}
            error={errors.email}
          />
          <EnPrimaryButton
            disabled={loader}
            loading={loader}
            onClick={() => {
              handleSendOTP();
            }}
            hoverColor="#373737"
          >
            Send OTP
          </EnPrimaryButton>
        </Paper>
      </Box>
    </Box>
  );
};

export default ForgotPassowrd;
