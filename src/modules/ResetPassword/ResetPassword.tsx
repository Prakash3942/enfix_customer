import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Avatar, Box, IconButton, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import EnPrimaryButton from "../../components/EnPrimaryButton";
import { EnTextField } from "../../components/EnTextField";
import { useSnackbar } from "notistack";
import { notEmpty } from "../../utils/validators";
import {
  authCookieName,
  authenticationService,
  resetPasswordService,
} from "../../apis/rest.app";
import { useSelector } from "react-redux";
import { AppStoreState } from "../../store/store";

export interface ResetPasswordProps {}

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const { setToken } = useSelector((state: AppStoreState) => state.app);
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const validate = () => {
    const newErrors: any = {};

    if (!notEmpty(password)) {
      newErrors.password = "Password is required!";
    }
    if (!notEmpty(confirmPassword)) {
      newErrors.confirmPassword = "confirmPassword is required!";
    }
    if (password !== confirmPassword) {
      newErrors.password = "Password do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (validate()) {
      await resetPasswordService
        .create(
          {
            password: password,
            access_token: setToken,
          },
          {
            headers: {
              authorization: `Bearer ${setToken}`,
            },
          }
        )
        .then((res: any) => {
          setSuccess(true);
        })
        .catch((err: any) => {
          enqueueSnackbar(err?.message, {
            variant: "error",
          });
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
            {success ? (
              "Success"
            ) : (
              <IconButton
                onClick={() => {
                  router.push("/login");
                }}
              >
                <KeyboardArrowLeftIcon sx={{ color: "black" }} />
              </IconButton>
            )}
            <IconButton
              onClick={() => {
                router.push("/login");
              }}
            >
              <CloseIcon sx={{ color: "black" }} />
            </IconButton>
          </Box>
          {success ? (
            <>
              <Avatar
                src="/images/success-icon.svg"
                variant="square"
                sx={{ width: "20%", height: "100%" }}
              />
              <Typography
                color={"#252525"}
                sx={{
                  fontSize: "24px",
                  fontWeight: 500,
                  mt: 3.5,
                }}
                textAlign={"center"}
              >
                {"Reset Successful"}
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
                {"Password reset successful"}
              </Typography>
            </>
          ) : (
            <>
              <Typography
                color={"#252525"}
                sx={{
                  fontSize: "24px",
                  fontWeight: 500,
                  mt: 3.5,
                }}
                textAlign={"center"}
              >
                {"Reset Password"}
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
                  "Nearly there. Just enter the new password that you want and confirm that."
                }
              </Typography>

              <EnTextField
                data={password}
                setData={setPassword}
                label="Enter new password"
                placeHolder="Enter new password"
                disabled={false}
                passwordType={true}
                endAdornment={true}
                size="large"
                error={errors.password}
              />
              <EnTextField
                data={confirmPassword}
                setData={setConfirmPassword}
                label="Enter confirm password"
                placeHolder="Enter confirm password"
                disabled={false}
                passwordType={true}
                endAdornment={true}
                size="large"
                error={errors.password}
              />
            </>
          )}
          <EnPrimaryButton
            disabled={false}
            loading={false}
            onClick={() => {
              if (success) {
                router.push("/login");
              } else {
                handleChangePassword();
              }
            }}
            hoverColor="#373737"
          >
            {success ? "Go to Login" : "Reset Password"}
          </EnPrimaryButton>
        </Paper>
      </Box>
    </Box>
  );
};

export default ResetPassword;
