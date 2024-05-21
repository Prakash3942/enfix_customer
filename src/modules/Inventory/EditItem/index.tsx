import CloseIcon from "@mui/icons-material/Close";
import { Avatar, Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllIventoryItemService, uploadService } from "../../../apis/rest.app";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import { EnTextField } from "../../../components/EnTextField";
import SuccessPage from "../../../components/SuccessPage";
import { AppDispatch } from "../../../store/store";
import { changeDialogState, forEditState } from "../../app/slice";

export interface EditItemProps { }

const EditItem: React.FC<EditItemProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [inventoryItemDetails, setInventoryItemDetails] = useState<any>({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minThreshold, setMinThreshold] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState("");
  const [imageLoader, setImageLoader] = useState(false);
  const fileInputRef = useRef(null);

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

  const loadInventoryItemDetails = () => {
    getAllIventoryItemService.get(router?.query?.itemId).then((res: any) => {
      setName(res?.name);
      setDescription(res?.description);
      setMinThreshold(res?.min_threshold);
      setInventoryItemDetails(res);
      setImage(res?.image);
    });
  };

  const handleUpdateItem = () => {
    setLoader(true);
    getAllIventoryItemService
      .patch(router?.query?.itemId, {
        name: name,
        description: description,
        min_threshold: Number(minThreshold),
        image: image,
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
    loadInventoryItemDetails();
  }, []);

  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => { }}
          successText="Item details updated successfully"
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
              {"Edit item"}
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
              data={name}
              setData={setName}
              placeHolder=""
              label="Name"
            />
            <EnTextField
              data={minThreshold}
              setData={setMinThreshold}
              placeHolder="Enter Minimum Threshold"
              label="Minimum Threshold"
              type="number"
            />
            <EnTextField
              data={description}
              setData={setDescription}
              placeHolder="Write description"
              label="Description of the item"
              multiline={true}
              rows={5}
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
                handleUpdateItem();
                // setSuccess(true);
              }}
              hoverColor=""
              width={"100%"}
            >
              {"Save item"}
            </EnPrimaryButton>
          </Box>
        </Box>
      )}
    </>
  );
};

export default EditItem;
