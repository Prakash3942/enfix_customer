import CloseIcon from "@mui/icons-material/Close";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addInventoryStockItemService, getAllIventoryItemService, } from "../../../apis/rest.app";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import { EnTextField } from "../../../components/EnTextField";
import SuccessPage from "../../../components/SuccessPage";
import { AppDispatch, AppStoreState } from "../../../store/store";
import { notEmpty } from '../../../utils/validators';
import { changeDialogState, forEditState } from "../../app/slice";

export interface AddStockProps { }

const AddStock: React.FC<AddStockProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedId } = useSelector((state: AppStoreState) => state.app);
  const [loader, setLoader] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [inventoryItemDetails, setInventoryItemDetails] = useState<any>({});
  const [success, setSuccess] = useState(false);
  const [quantity, setQuantity] = useState("");
  const router = useRouter();
  const [errors, setErrors] = useState({
    quantity: "",
  });

  // validation
  const validate = () => {
    const newErrors: any = {};
    if (!notEmpty(quantity)) {
      newErrors.quantity = "Please add stock quantity";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadInventoryItemDetails = () => {
    getAllIventoryItemService.get(selectedId).then((res: any) => {
      setInventoryItemDetails(res);
    });
  };

  const handleUpdateStock = () => {
    if (validate()) {
      setLoader(true);
      addInventoryStockItemService
        .patch(selectedId, {
          quantity: Number(quantity),
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
    }

  };

  useEffect(() => {
    loadInventoryItemDetails();
  }, []);

  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => { }}
          successText="Item stock updated successfully"
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
              {"Add stock"}
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
          <Box>
            <Box>
              <Box display={"flex"} alignItems={"center"} mb={3} mt={2}>
                <Avatar
                  variant="square"
                  src={inventoryItemDetails?.image}
                  sx={{ width: "15%", height: "auto" }}
                />
                <Typography fontSize={"18px"} fontWeight={600} ml={2}>
                  {inventoryItemDetails?.name}
                </Typography>
              </Box>
              <EnTextField
                disabled={true}
                data={inventoryItemDetails?.quantity}
                setData={() => { }}
                placeHolder=""
                label="Current available Stock"
              />
              <EnTextField
                data={quantity}
                setData={setQuantity}
                placeHolder="Enter quantity"
                label="Enter Quantity to add"
                type="number"
                error={errors.quantity}
              />
            </Box>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            gap={2}
            width={"100%"}
            mt={2}
          >
            <EnPrimaryButton
              disabled={false}
              loading={false}
              onClick={() => {
                // setSuccess(true);
                handleUpdateStock();
              }}
              hoverColor=""
              width={"100%"}
            >
              {"Update stock"}
            </EnPrimaryButton>
          </Box>
        </Box>
      )}
    </>
  );
};

export default AddStock;
