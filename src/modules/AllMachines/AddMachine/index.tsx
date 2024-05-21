import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  DialogState,
  changeDialogState,
  forEditState,
  setMachineData,
} from "../../app/slice";
import { EnTextField } from "../../../components/EnTextField";
import { AppDispatch, AppStoreState } from "../../../store/store";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import SuccessPage from "../../../components/SuccessPage";
import {
  getAllPlansMaster,
  machineService,
  machineTypeService,
  uploadService,
} from "../../../apis/rest.app";
import {
  isValidEmail,
  isValidPhoneNumber,
  notEmpty,
} from "../../../utils/validators";
import Subscription from "../Subscription";
import MachineType from "../MachineType";
import { useSnackbar } from "notistack";

export interface AddMachineProps {}

const AddMachine: React.FC<AddMachineProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { forEdit } = useSelector((state: AppStoreState) => state.app);
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [manufacturerEmail, setManufacturerEmail] = useState("");
  const [manufacturerPhone, setManufacturerPhone] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState("");
  const [imageLoader, setImageLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [machineData, setMachineData] = useState<any>({});
  const { enqueueSnackbar } = useSnackbar();
  const [machineType, setMachineType] = useState([]);
  const [planMaster, setPlanMaster] = useState<any>({});
  const [machineSize, setMachineSize] = useState(2);

  const [errors, setErrors] = useState({
    name: "",
    model: "",
    manufacturerName: "",
    manufacturerEmail: "",
    manufacturerPhone: "",
    avatar: "",
  });

  useEffect(() => {
    machineTypeService
      .find({
        query: {
          $limit: -1,
        },
      })
      .then((res: any) => {
        setMachineType(res);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });

    getAllPlansMaster
      .find({
        query: {
          type: "MACHINE",
          master_machine_type_id: machineSize,
        },
      })
      .then((res: any) => {
        setPlanMaster(res?.data[0]);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  }, [machineSize]);

  const validate = () => {
    const newErrors: any = {};

    if (!notEmpty(name)) {
      newErrors.name = "name is required!";
    }
    if (!notEmpty(image)) {
      newErrors.avatar = "Avatar is required!";
    }
    if (!notEmpty(model)) {
      newErrors.model = "model is required!";
    }
    if (!notEmpty(manufacturerPhone)) {
      newErrors.manufacturerPhone = "manufacturer phone name is required!";
    } else if (!isValidPhoneNumber(manufacturerPhone)) {
      newErrors.manufacturerPhone = "Please enter a valid phone number!";
    }
    if (!notEmpty(manufacturerName)) {
      newErrors.manufacturerName = "manufacturer name is required!";
    }
    if (!isValidEmail(manufacturerEmail)) {
      newErrors.manufacturerEmail = "Please enter a valid email address!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
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

  const checkForValidationAndGoToMachineType = () => {
    if (validate()) {
      if (!forEdit) {
        setStep(2);
      }
    }
  };

  function loadScript(src: any) {
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

  const handleOpenRazorPay = async (
    amount: any,
    orderId: any,
    machineId: any
  ) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

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
        setTimeout(() => {
          machineService
            .get(machineId)
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
      // prefill: {
      //     name: name,
      //     email: manufacturerEmail,
      //     contact: manufacturerPhone,
      // },
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

  // const handleAddMachine = () => {
  //   if (validate()) {

  //     // dispatch(
  //     //   setMachineData({
  //     //     machineData: {
  //     //       name: name,
  //     //       avatar: image,
  //     //       model_no: model,
  //     //       manufacturer_name: manufacturerName,
  //     //       manufacturer_email: manufacturerEmail,
  //     //       manufacturer_phone: manufacturerPhone,
  //     //     },
  //     //   })
  //     // );
  //     // dispatch(changeDialogState(DialogState.MACHINE_TYPE));
  //   }
  // };

  const handleAddMachine = (price: any) => {
    setLoader(true);
    machineService
      .create({
        name: name,
        avatar: image,
        model_no: model,
        manufacturer_name: manufacturerName,
        manufacturer_email: manufacturerEmail,
        manufacturer_phone: manufacturerPhone,
        machine_type_id: machineSize,
        plan_id: planMaster?.id,
        plan_amount: price,
      })
      .then((res: any) => {
        if (res) {
          setMachineData({ ...res });
          handleOpenRazorPay(
            price,
            res?.transaction_data?.razorpay_payment_id,
            res?.id
          ).then(() => {});
        }
        dispatch(changeDialogState(null));
      })
      .catch((err: any) => {
        enqueueSnackbar(err?.message, { variant: "error" });
        setLoader(false);
      });
  };

  useEffect(() => {
    if (selectedFile) {
      uploadImage();
    }
  }, [selectedFile]);

  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => {}}
          successText="Added succesfully"
          successSubText="Machine added successfully"
        />
      ) : step === 1 ? (
        <Box p={2} width={"40vw"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {forEdit ? "Edit admin" : "Add New Machine"}
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
            <Divider sx={{ border: "dashed 1px #AAAAAA", width: "20%" }} />
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
                Machine type
              </Typography>
            </Box>
            <Divider sx={{ border: "dashed 1px #AAAAAA", width: "20%" }} />
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
                3
              </Typography>
              <Typography
                sx={{
                  color: "black",
                  mb: 0.5,
                }}
              >
                Step 3
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
              label="Name of machine"
              placeHolder="Enter Machine Name"
              error={errors.name}
            />
            <EnTextField
              data={model}
              setData={setModel}
              label="Model of machine"
              placeHolder="Enter Model Number"
              error={errors.model}
            />
            <EnTextField
              data={manufacturerName}
              setData={setManufacturerName}
              label="Manufacturer name"
              placeHolder="Enter Manufacturer Name"
              error={errors.manufacturerName}
            />
            <EnTextField
              data={manufacturerEmail}
              setData={setManufacturerEmail}
              label="Manufacturer email"
              placeHolder="Enter Manufacturer Email"
              error={errors.manufacturerEmail}
            />
            <EnTextField
              data={manufacturerPhone}
              setData={setManufacturerPhone}
              label="Manufacturer phone"
              placeHolder="Enter Manufacturer Phone"
              type="number"
              stringLength={10}
              error={errors.manufacturerPhone}
            />
          </Box>
          <EnPrimaryButton
            disabled={false}
            loading={false}
            onClick={() => {
              // handleAddMachine();
              // dispatch(changeDialogState(DialogState.MACHINE_TYPE));
              checkForValidationAndGoToMachineType();
            }}
            hoverColor="#373737"
          >
            {"Add Machine"}
          </EnPrimaryButton>
        </Box>
      ) : step === 2 ? (
        <MachineType
          setStep={setStep}
          machineType={machineType}
          machineSize={machineSize}
          setMachineSize={setMachineSize}
        />
      ) : (
        <Subscription
          handleAddMachine={handleAddMachine}
          planMaster={planMaster}
          headerText="Machine"
        />
      )}
    </>
  );
};

export default AddMachine;
