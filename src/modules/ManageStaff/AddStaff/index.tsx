import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { changeDialogState, forEditState } from "../../app/slice";
import { EnTextField } from "../../../components/EnTextField";
import { AppDispatch, AppStoreState } from "../../../store/store";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import SuccessPage from "../../../components/SuccessPage";
import {
  getAllCustomerPermission,
  getAllPlansMaster,
  staffService,
  uploadService,
} from "../../../apis/rest.app";
import {
  isValidEmail,
  isValidPhoneNumber,
  notEmpty,
} from "../../../utils/validators";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import Subscription from "../Subscription";

export interface AddStaffProps {}
const AddStaff: React.FC<AddStaffProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { forEdit,dialogState } = useSelector((state: AppStoreState) => state.app);
  const [access, setAccess] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState("");
  const [imageLoader, setImageLoader] = useState(false);
  const [accessArray, setAccessArray] = useState<Array<any>>([]);
  const [planMaster, setPlanMaster] = useState<any>({});
  const [employeeData, setEmployeeData] = useState<any>({});
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    permissions: "",
    avatar: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    getAllCustomerPermission
      .find({
        query: {
          $limit: -1,
        },
      })
      .then((res: any) => {
        setAccessArray([...(res || [])]);
      })
      .catch((err: any) => {
        console.log("errors-->", err);
      });
    getAllPlansMaster
      .find({
        query: {
          type: "EMPLOYEE",
        },
      })
      .then((res: any) => {
        setPlanMaster(res?.data[0]);
      })
      .catch((err: any) => {
        console.log("errors-->", err);
      });
  }, []);

  const validate = () => {
    const newErrors: any = {};
    if (!forEdit) {
      if (!notEmpty(password)) {
        newErrors.password = "Password is required!";
      } else if (!notEmpty(confirmPassword)) {
        newErrors.confirmPassword = "confirmPassword is required!";
      } else if (password !== confirmPassword) {
        newErrors.password = "Password do not match";
      }
    }
    if (!notEmpty(name)) {
      newErrors.name = "name is required!";
    }
    if (!notEmpty(phone)) {
      newErrors.phone = "Phone is required!";
    }
    if (!notEmpty(image)) {
      newErrors.avatar = "Avatar is required!";
    } else if (!isValidPhoneNumber(phone)) {
      newErrors.phone = "Please enter a valid phone number!";
    }
    if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleDivClick = () => {
    // Trigger click on the file input when the div is clicked
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleChange = (value: string) => {
    setAccess((prevSelectedValues) => {
      if (prevSelectedValues.includes(value)) {
        // If the value is already selected, remove it from the array
        return prevSelectedValues.filter((item) => item !== value);
      } else {
        // If the value is not selected, add it to the array
        return [...prevSelectedValues, value];
      }
    });
  };

  const uploadImage = () => {
    setImageLoader(true);
    const formData = new FormData();
    formData.append("purpose", "1");
    formData.append("fileType", "1");
    formData.append("file", selectedFile);
    uploadService
      .create(formData)
      .then((res: any) => {
        setImage(res[0]?.link);
      })
      .catch((err: any) => {
        console.log("errors-->", err);
      })
      .finally(() => {
        setImageLoader(false);
      });
  };

  const checkForValidationAndGoToPayment = () => {
    if (validate()) {
      if (!forEdit) {
        setStep(2);
      } else {
        setLoader(true);
        staffService
          .patch(router?.query?.staffId, {
            name: name,
            email: email,
            phone: phone,
            avatar: image,
            permissions: access,
          })
          .then((res: any) => {
            if (res) {
              setSuccess(true);
            }
          })
          .catch((err: any) => {
            enqueueSnackbar(err?.message, {
              variant: "error",
            });
          })
          .finally(() => {
            setLoader(false);
          });
      }
    }
  };

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const handleOpenRazorPay = async (amount, orderId, userID) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // console.log("Order Id --> Inside --> ", orderId);
    // Getting the order details back
    const options = {
      key: "rzp_test_ek3yISA4jhwWEN", // Enter the Key ID generated from the Dashboard
      // amount: amount.toString(),
      // currency: 'INR',
      name: "Enfix",
      description: "Purchase Subsription",
      image: "/images/full-logo-black.svg",
      order_id: orderId,
      handler: (response: any) => {
        //my code here
        console.log("Inside handler --> ", response);
        setTimeout(() => {
          staffService
            .get(userID)
            .then((res: any) => {
              if (res) {
                setLoader(false);
                setSuccess(true);
              } else {
                setLoader(false);
                enqueueSnackbar("Payment Failed !", { variant: "error" });
              }
            })
            .catch(console.error);
        }, 1000);
      },
      prefill: {
        name: name,
        email: email,
        contact: phone,
      },
      notes: {
        address: "",
      },
      theme: {
        color: "#61dafb",
      },
    };

    let paymentObject: any;
    // @ts-ignore
    paymentObject = new Razorpay(options);
    paymentObject.open();
  };

  const handleAddStaff = (price: any) => {
    setLoader(true);
    staffService
      .create({
        name: name,
        email: email,
        password: password,
        phone: phone,
        avatar: image,
        permissions: access,
        plan_amount: price,
        plan_id: planMaster?.id || 2,
      })
      .then((res: any) => {
        if (res) {
          setEmployeeData({ ...res });
          handleOpenRazorPay(
            price,
            res?.transaction_data?.razorpay_payment_id,
            res?.id
          ).then(() => {});
        }
        dispatch(changeDialogState(null));
      })
      .catch((err: any) => {
        enqueueSnackbar(err?.message, {
          variant: "error",
        });
        setLoader(false);
      });
  };

  const loadStaffDetails = () => {
    staffService
      .get(router?.query?.staffId, {
        query: {
          $eager: "[permissions]",
        },
      })
      .then((res: any) => {
        setName(res?.name);
        setEmail(res?.email);
        setPhone(res?.phone);
        setImage(res?.avatar);
        const permissions = [];
        res?.permissions?.map((e: any) => {
          permissions.push(e?.meta_name);
        });
        if (permissions?.length > 0) {
          setAccess(permissions);
        }
      });
  };

  useEffect(() => {
    if (selectedFile) {
      uploadImage();
    }
  }, [selectedFile]);

  useEffect(() => {
    if (forEdit) {
      loadStaffDetails();
    }
  }, [forEdit]);

  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => {}}
          successText={
            !forEdit ? "Staff added succesfully" : "Staff details updated"
          }
          successSubText={
            !forEdit
              ? "staff added successfully"
              : "staff details updated successfully"
          }
        />
      ) : step === 1 ? (
        <Box p={2} width={"40vw"} height={"90vh"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {forEdit ? "Edit personal details" : "Add new staff"}
            </Typography>

            <IconButton
              onClick={() => {
                dispatch(forEditState({ forEdit: false }));
                dispatch(changeDialogState(null));
              }}
            >
              <CloseIcon sx={{ color: "black" }} />
            </IconButton>
          </Box>
          {!forEdit ? (
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-evenly"}
              width={"100%"}
              mt={2}
            >
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <Typography
                  sx={{
                    height: "32px",
                    width: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "primary.main",
                    color: "black",
                    borderRadius: "5px",
                    mb: 0.5,
                  }}
                >
                  1
                </Typography>
                <Typography
                  sx={{
                    color: "black",
                    mb: 0.5,
                  }}
                >
                  Step 1
                </Typography>
                <Typography
                  sx={{
                    color: "#373737",
                    fontSize: "12px",
                  }}
                >
                  Details
                </Typography>
              </Box>
              <Divider sx={{ border: "dashed 1px #AAAAAA", width: "50%" }} />
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <Typography
                  sx={{
                    height: "32px",
                    width: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#F6F6F6",
                    color: "black",
                    borderRadius: "5px",
                    mb: 0.5,
                  }}
                >
                  2
                </Typography>
                <Typography
                  sx={{
                    color: "black",
                    mb: 0.5,
                  }}
                >
                  Step 2
                </Typography>
                <Typography
                  sx={{
                    color: "#373737",
                    fontSize: "12px",
                  }}
                >
                  Subscription
                </Typography>
              </Box>
            </Box>
          ) : (
            ""
          )}

          <Box mt={3}>
            {imageLoader ? (
              <Box
                width={"100%"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <CircularProgress />
              </Box>
            ) : image ? (
              <Box
                width={"100%"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleDivClick}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <Avatar
                  src={image}
                  variant="square"
                  sizes="small"
                  sx={{
                    width: "30%",
                    height: "auto",
                    mb: 3,
                    cursor: "pointer",
                  }}
                />
              </Box>
            ) : (
              <>
                <Box
                  width={"100%"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={handleDivClick}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <Box
                    sx={{
                      height: "200px",
                      width: "200px",
                      border: "dashed 1px #DBB11C",
                      borderRadius: "50%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#FFFBED",
                      cursor: "pointer",
                      mb: 2,
                    }}
                  >
                    <Avatar
                      src="/icons/camera-icon.svg"
                      variant="square"
                      sizes="small"
                      sx={{ width: "18%", height: "auto", mb: 3 }}
                    />
                    <Typography
                      fontSize={"16px"}
                      color={"#000000"}
                      fontWeight={400}
                      textAlign={"center"}
                      mb={2}
                    >
                      {"Click / Drag to upload"}
                    </Typography>
                    <Typography
                      fontSize={"12px"}
                      color={"#373737"}
                      fontWeight={400}
                      textAlign={"center"}
                      width={"55%"}
                    >
                      {"Click on this box or drag the image of the logo."}
                    </Typography>
                  </Box>
                </Box>
                {errors.avatar !== "" ? (
                  <Typography textAlign={"center"} color={"red"} mb={1}>
                    {errors.avatar}
                  </Typography>
                ) : (
                  ""
                )}
              </>
            )}
            <EnTextField
              data={name}
              setData={setName}
              label="Name of the staff"
              placeHolder="Enter your name"
              disabled={false}
              size="small"
              error={errors.name}
            />
            <EnTextField
              data={email}
              setData={setEmail}
              label="Official email id"
              placeHolder="Enter your email id"
              disabled={false}
              size="small"
              error={errors.email}
            />
            <EnTextField
              data={phone}
              setData={setPhone}
              label="Phone no."
              placeHolder="Enter phone number"
              disabled={false}
              type="number"
              size="small"
              error={errors.phone}
              stringLength={10}
            />
            {!forEdit ? (
              <EnTextField
                data={password}
                setData={setPassword}
                label="New password"
                placeHolder="Enter new password"
                disabled={false}
                passwordType={true}
                endAdornment={true}
                size="small"
                error={errors.password}
              />
            ) : (
              ""
            )}
            {!forEdit ? (
              <EnTextField
                data={confirmPassword}
                setData={setConfirmPassword}
                label="Confirm password"
                placeHolder="Enter confirm password"
                disabled={false}
                passwordType={true}
                endAdornment={true}
                size="small"
                error={errors.password}
              />
            ) : (
              ""
            )}
            <Typography color={"black"} fontSize="15px" fontWeight={600} mb={1}>
              {"Set access"}
            </Typography>

            <Grid container spacing={1}>
              {accessArray.map((e: any, i: number) => (
                <Grid item xs={6} md={6} key={i}>
                  <FormGroup>
                    <FormControlLabel
                      key={i}
                      value={e.meta_name}
                      control={
                        <Checkbox
                          checked={access.includes(e.meta_name)}
                          onChange={() => handleChange(e.meta_name)}
                          sx={{
                            "&.Mui-checked": {
                              color: "#50AB59",
                            },
                          }}
                        />
                      }
                      label={e.name}
                    />
                  </FormGroup>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box sx={{ mt: 2, pb: 2 }}>
            <EnPrimaryButton
              disabled={loader}
              loading={loader}
              onClick={() => {
                checkForValidationAndGoToPayment();
              }}
              hoverColor="#373737"
            >
              {forEdit ? "Save details" : "Add staff"}
            </EnPrimaryButton>
          </Box>
        </Box>
      ) : (
        <Subscription planMaster={planMaster} handleAddStaff={handleAddStaff} />
      )}
    </>
  );
};

export default AddStaff;
