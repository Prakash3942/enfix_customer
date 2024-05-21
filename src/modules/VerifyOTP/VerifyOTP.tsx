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
import OtpInput from "react-otp-input";
import { useEffect, useState } from "react";
import Link from "next/link";
import { forogotPasswordService } from "../../apis/rest.app";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppStoreState } from "../../store/store";
import { setAccessToken, setForgetEmail } from "../app/slice";

export interface VerifyOTPProps {}

const VerifyOTP: React.FC<VerifyOTPProps> = () => {
  const { setEmail } = useSelector((state: AppStoreState) => state.app);
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [timer, setTimer] = useState(29);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const timerConst: any =
      timer > 0 && setInterval(() => setTimer(timer - 1), 1000);
    return () => clearInterval(timerConst);
  }, [timer]);

  const [errors, setErrors] = useState({
    otp: "",
  });

  const [hasErrored, setHasErrored] = useState(false);
  const validate = () => {
    const newErrors: any = {};
    if (!otp.trim()) {
      newErrors.otp = "Please enter a valid OTP!";
    }
    // if (!notEmpty(otp)) {
    //   newErrors.otp = "Please enter a valid OTP!";
    // }
    setErrors(newErrors);
    setHasErrored(Object.keys(newErrors).length > 0);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyOtp = async () => {
    setLoader(true);
    if (validate()) {
      await forogotPasswordService
        .patch(null, {
          purpose: "forgot_password",
          email: setEmail,
          otp: otp,
        })
        .then((res: any) => {
          console.log("handleVerifyOtp---->", res);
          router.push("reset-password");
          enqueueSnackbar("Otp Verify Successfully", {
            variant: "success",
          });
          dispatch(setAccessToken({ setToken: res?.accessToken }));
        })
        .finally(() => {
          setLoader(false);
        });
    }
  };

  const handleSendOTP = () => {
    setLoader(true);
    forogotPasswordService
      .create({
        purpose: "forgot_password",
        email: setEmail,
      })
      .then((res: any) => {
        dispatch(setForgetEmail({ setEmail: setEmail }));
        enqueueSnackbar("Otp Send Successfully", {
          variant: "success",
        });
        router.push("/verify-otp");
        setTimer(29);
      })
      .finally(() => {
        setLoader(false);
      });
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
            width={"100%"}
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
              mb: 1.5,
            }}
            textAlign={"center"}
          >
            {
              "No issues! We can help you reset it using your official email ID & a OTP verification."
            }
          </Typography>
          <Box mt={2.5} mb={1.5}>
            <Box width={"100%"} display={"flex"} alignItems={"flex-start"}>
              <Typography
                color={"#6C6C6C"}
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
                textAlign={"center"}
              >
                {"ENTER OTP"}
              </Typography>
            </Box>
            <OtpInput
              numInputs={6}
              separator={<span>&nbsp;&nbsp;&nbsp;&nbsp; </span>}
              inputStyle={{
                width: "60px",
                height: "50px",
                margin: " 10px 12px 10px 0px",
                fontSize: "1rem",
                borderRadius: 7,
                border: `solid 1px #CCCCCC`,
                // background: "#F2F2F2",
                outline: "none",
              }}
              shouldAutoFocus
              isDisabled={false}
              isInputNum={true}
              errorStyle="error"
              focusStyle={{ border: `2px solid #00476B` }}
              // hasErrored={false}
              hasErrored={hasErrored}
              onChange={(event: any) => {
                setOtp(event);
              }}
              value={otp}
            />
            {errors.otp && (
              <Typography sx={{ color: "red" }}>{errors.otp}</Typography>
            )}
          </Box>
          <EnPrimaryButton
            disabled={false}
            loading={false}
            onClick={() => handleVerifyOtp()}
            hoverColor="#373737"
          >
            Verify OTP
          </EnPrimaryButton>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            mt={2}
            mb={3}
          >
            {timer === 0 ? (
              <>
                <Typography
                  fontWeight={400}
                  color={"#373737"}
                  fontSize={"13px"}
                  mt={1}
                >
                  Don’t got any OTP? &nbsp;
                </Typography>
                <Button
                  onClick={() => {
                    handleSendOTP();
                  }}
                  variant="outlined"
                  sx={{
                    border: "solid 1px #FB8C25",
                    color: "#FB8C25",
                    fontWeight: 600,
                    mt: 1,
                  }}
                >
                  RESEND OTP
                </Button>
              </>
            ) : (
              <Typography fontSize={"18px"} fontWeight={"600"}>
                {`00 : ${timer.toString().length === 1 ? "0" + timer : timer}`}
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default VerifyOTP;
