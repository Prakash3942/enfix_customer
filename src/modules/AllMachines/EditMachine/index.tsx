import CloseIcon from "@mui/icons-material/Close";
import { Avatar, Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { machineService, uploadService } from "../../../apis/rest.app";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import { EnTextField } from "../../../components/EnTextField";
import SuccessPage from "../../../components/SuccessPage";
import { AppDispatch, AppStoreState } from "../../../store/store";
import { changeDialogState, forEditState } from "../../app/slice";

export interface EditMachineProps { }

const EditMachine: React.FC<EditMachineProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { forEdit } = useSelector((state: AppStoreState) => state.app);
  const router = useRouter();
  const { machineId } = router.query;
  const [imageLoader, setImageLoader] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);
  const [machineName, setMachineName] = useState("");
  const [Manufacturer, setManufacturer] = useState("");
  const [modelName, setModelName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");

  // image upload
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

  //image

  const loadAllMachine = () => {
    machineService.get(machineId).then((res: any) => {
      setMachineName(res?.name);
      setModelName(res?.model_no);
      setManufacturer(res?.manufacturer_name);
      setEmail(res?.manufacturer_email);
      setPhone(res?.manufacturer_phone);
      setImage(res?.avatar);
    });
  };

  const handleUpdateItem = () => {
    setLoader(true);
    machineService
      .patch(machineId, {
        avatar: image,
        name: machineName,
        model_no: modelName,
        manufacturer_name: Manufacturer,
        manufacturer_email: email,
        manufacturer_phone: phone,
      })
      .then((res: any) => {
        if (res) {
          setSuccess(true);
        }
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, {
          variant: "error",
        });
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    if (selectedFile) {
      uploadImage();
    }
  }, [selectedFile]);

  useEffect(() => {
    loadAllMachine();
  }, []);

  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => { }}
          successText="Machine details updated"
          successSubText=""
        />
      ) : (
        <Box p={2} width={"40vw"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {forEdit ? "Edit machine" : "Edit machine"}
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
          )}
          <Box p={2}>
            <EnTextField
              data={machineName}
              setData={setMachineName}
              label="Name of the machine"
              placeHolder=""
            />
            <EnTextField
              data={Manufacturer}
              setData={setManufacturer}
              label="Manufacturer"
              placeHolder=""
            />
            <EnTextField
              data={modelName}
              setData={setModelName}
              label="Model name"
              placeHolder=""
            />
            <EnTextField
              data={email}
              setData={setEmail}
              label="Manufacturer email"
              placeHolder=""
            />
            <EnTextField
              data={phone}
              setData={setPhone}
              label="Manufacturer phone no."
              placeHolder=""
              type="number"
              stringLength={10}
            />
          </Box>
          <EnPrimaryButton
            disabled={false}
            loading={false}
            onClick={() => {
              handleUpdateItem();
              // setSuccess(true);
            }}
            hoverColor="#373737"
          >
            {"Update details"}
          </EnPrimaryButton>
        </Box>
      )}
    </>
  );
};

export default EditMachine;
