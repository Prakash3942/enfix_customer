import CloseIcon from "@mui/icons-material/Close";
import { Avatar, Box, CircularProgress, Grid, IconButton, Typography, } from "@mui/material";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import { FileCard } from "../../../components/FileCard";
import { AppDispatch } from "../../../store/store";
import { changeDialogState, forEditState } from "../../app/slice";

export interface UploadFilesForWorkStartProps {
    selectedWorkEndFile?: any
    setSelectedWorkEndFile?: any
    createCustomLog?: any
}

const UploadFilesForWorkEnd = ({ selectedWorkEndFile, setSelectedWorkEndFile, createCustomLog }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [imageLoader, setImageLoader] = useState(false);
    const [image, setImage] = useState("");
    const fileInputRef = useRef(null);
    const router = useRouter();

    const handleDragOver = (event: any) => {
        event.preventDefault();
    };

    const handleDrop = (event: any) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setSelectedWorkEndFile(file);
    };

    const handleFileClick = () => {
        document.getElementById("fileInput").click();
    };

    const handleFileChange = (event: any) => {
        const file = event.target.files[0]?.name;
        setSelectedWorkEndFile([...selectedWorkEndFile, file]);
    };


    return (
        <>

            <Box p={2} width={"40vw"}>
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
                        {"Upload files for work end"}
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
                        onClick={handleFileClick}
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
                        onClick={handleFileClick}
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
                                width: "100%",
                                border: "dashed 1px #DBB11C",
                                borderRadius: "5px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "transparent",
                                cursor: "pointer",
                                mb: 2,
                            }}
                        >
                            <input
                                type="file"
                                accept="image/*, video/*, application/pdf"
                                style={{ display: 'none' }}
                                id="fileInput"
                                onChange={handleFileChange}
                            />

                            <Avatar
                                src="/icons/camera-icon.svg"
                                variant="square"
                                sizes="small"
                                sx={{ width: "5%", height: "auto", mb: 3 }}
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
                                {
                                    "Click on this box or drag any picture or supported documents to upload."
                                }
                            </Typography>
                        </Box>
                    </Box>
                )}

                <Box>
                    <Typography fontSize={'16px'} fontWeight={600}>
                        {selectedWorkEndFile?.length > 0 ? "Added files" : ''}
                    </Typography>

                    <Grid container display={'flex'} alignItems={'center'} mt={2} mb={2} gap={1}>
                        {
                            selectedWorkEndFile?.map((e: any, i: any) => (
                                <Grid item md={3} key={i}>
                                    <FileCard name={e} />
                                </Grid>
                            ))
                        }
                    </Grid>
                </Box>

                <EnPrimaryButton
                    disabled={selectedWorkEndFile?.length === 0}
                    loading={false}
                    onClick={() => {
                        createCustomLog();
                        dispatch(changeDialogState(null));
                    }}
                    hoverColor="#373737"
                >
                    {"Add files"}
                </EnPrimaryButton>
            </Box>

        </>
    );
};

export default UploadFilesForWorkEnd