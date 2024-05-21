import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Button,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { useRouter } from "next/router";
import { AppDispatch } from "../../../store/store";
import { changeDialogState, setSelectedPage } from "../../app/slice";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import {
  authCookieName,
  authenticationService,
  cookieStorage,
} from "../../../apis/rest.app";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { EnTextField } from "../../../components/EnTextField";
import { notEmpty } from "../../../utils/validators";
import { useSnackbar } from "notistack";
import SuccessPage from "../../../components/SuccessPage";

interface ChangePasswordProps {}

const ChangePassword: React.FC<ChangePasswordProps> = ({}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    oldPassword: "",
  });

  const validate = () => {
    const newErrors: any = {};

    if (!notEmpty(oldPassword)) {
      newErrors.oldPassword = "Old Password is required";
    }

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
    const token = localStorage.getItem(authCookieName);
    console.log("token----->", token);

    if (validate()) {
      await authenticationService
        .create(
          {
            strategy: "changePassword",
            oldPassword: oldPassword,
            newPassword: password,
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
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
    <>
      {success ? (
        <SuccessPage
          handleClose={() => {}}
          successText="Password change successfully"
          successSubText="Password changed."
        />
      ) : (
        <Box
          p={2}
          width={"30vw"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            width={"100%"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {"Change Password"}
            </Typography>
            <IconButton
              onClick={() => {
                dispatch(changeDialogState(null));
              }}
            >
              <CloseIcon sx={{ color: "black" }} />
            </IconButton>
          </Box>

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
            data={oldPassword}
            setData={setOldPassword}
            label="Enter old password"
            placeHolder="Enter old password"
            disabled={false}
            passwordType={true}
            endAdornment={true}
            size="large"
            error={errors.oldPassword}
          />
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
          <Box display={"flex"} alignItems={"center"} width={"100%"} gap={2}>
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
              {/* {success ? "Go to Login" : "Change Password"} */}
              {"Change Password"}
            </EnPrimaryButton>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChangePassword;
