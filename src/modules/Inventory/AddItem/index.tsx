import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { changeDialogState, forEditState } from "../../app/slice";
import { AppDispatch, AppStoreState } from "../../../store/store";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import SuccessPage from "../../../components/SuccessPage";
import { EnTextField } from "../../../components/EnTextField";
import {
  getAllIventoryItemService,
  uploadService,
} from "../../../apis/rest.app";
import { useSnackbar } from "notistack";
import { notEmpty } from "../../../utils/validators";

export interface AddItemProps {}

const AddItem: React.FC<AddItemProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { forEdit } = useSelector((state: AppStoreState) => state.app);

  const [success, setSuccess] = useState(false);
  const [itemName, setItemName] = useState("");
  const [availableStocks, setAvailableStocks] = useState("");
  const [minThreshold, setMinThreshold] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState("");
  const [imageLoader, setImageLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [errors, setErrors] = useState({
    itemName: "",
    availableStocks: "",
    minThreshold: "",
    description: "",
  });

  const validate = () => {
    const newErrors: any = {};
    if (!notEmpty(itemName)) {
      newErrors.itemName = "name is required!";
    }
    if (!notEmpty(availableStocks)) {
      newErrors.availableStocks = "Stock is required!";
    }
    if (!notEmpty(minThreshold)) {
      newErrors.minThreshold = "Threshold is required!";
    }
    if (!notEmpty(description)) {
      newErrors.description = "description is required!";
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

  const handleAddItem = () => {
    if (validate()) {
      setLoader(true);
      getAllIventoryItemService
        .create({
          name: itemName,
          description: description,
          quantity: Number(availableStocks),
          min_threshold: Number(minThreshold),
          image: image,
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
          successText="Item stock added successfully"
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
              {"Add new item"}
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
              data={itemName}
              setData={setItemName}
              placeHolder="Enter Name"
              label="Name"
              error={errors.itemName}
            />
            <EnTextField
              data={availableStocks}
              setData={setAvailableStocks}
              placeHolder="Enter stock"
              label="Enter available stock"
              type="number"
              error={errors.availableStocks}
            />
            <EnTextField
              data={minThreshold}
              setData={setMinThreshold}
              placeHolder="Enter Minimum Threshold"
              label="Minimum Threshold"
              type="number"
              error={errors.minThreshold}
            />
            <EnTextField
              data={description}
              setData={setDescription}
              placeHolder="Write description"
              label="Description of the item"
              multiline={true}
              rows={5}
              error={errors.description}
            />
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            gap={2}
            width={"100%"}
            mt={2}
          >
            <EnPrimaryButton
              disabled={loader}
              loading={loader}
              onClick={() => {
                handleAddItem();
              }}
              hoverColor=""
              width={"100%"}
            >
              {"Add item"}
            </EnPrimaryButton>
          </Box>
        </Box>
      )}
    </>
  );
};

export default AddItem;
