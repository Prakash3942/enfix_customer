import CloseIcon from "@mui/icons-material/Close";
import { Autocomplete, Box, IconButton, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InventoryItemManagementService, MaintenanceProductService } from "../../../apis/rest.app";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import { EnTextField } from "../../../components/EnTextField";
import SuccessPage from "../../../components/SuccessPage";
import { AppDispatch, AppStoreState } from "../../../store/store";
import { changeDialogState, forEditState } from "../../app/slice";

export interface AddNewItemProps { }

const AddNewItem: React.FC<AddNewItemProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { forEdit, selectedId } = useSelector((state: AppStoreState) => state.app);
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [itemName, setItemName] = useState(null)
  const [quantity, setQuantity] = useState('');
  const [loader, setLoader] = useState(false);
  const [items, setItems] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { scheduleId } = router.query;


  //to show all the items
  const loadRequiredItems = async () => {
    setLoader(true);
    await MaintenanceProductService.find({ query: { maintenance_id: scheduleId, $eager: "[product]", } })
      .then((res: any) => {
        console.log(res?.data, "all requiredd datas");
        setData(res?.data);
        setLoader(false);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error", });
        setLoader(false);
      }).finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    loadRequiredItems();
  }, []);


  //to show items data InventoryItemManagementService
  const getAllInventoryItems = async () => {
    setLoader(true);
    await InventoryItemManagementService.find({ query: { $limit: -1 } })
      .then((res: any) => {

        console.log(res, "itemssss");
        setItems(res);
        setLoader(false);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error", });
        setLoader(false);
      }).finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    getAllInventoryItems();
  }, []);


  //load data for edit
  const loadDataForEdit = async () => {
    setLoader(true);
    await MaintenanceProductService.get(selectedId, { query: { maintenance_id: scheduleId, $eager: "[product]" } })
      .then((res: any) => {
        setItemName({ name: res?.product?.name });
        setQuantity(res?.quantity);
        setLoader(false);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error", });
        setLoader(false);
      }).finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    if (forEdit) {
      loadDataForEdit();
    }
  }, [forEdit]);


  const AddEditRequiredItems = async () => {
    if (!forEdit) {
      await MaintenanceProductService.create({
        maintenance_id: Number(scheduleId),
        product_id: itemName?.id,
        quantity: parseInt(quantity)
      })
        .then((res: any) => {
          setSuccess(true);
        })
        .catch((err: any) => {
          enqueueSnackbar(err?.message, { variant: "error", });
        });
    } else if (forEdit) {
      await MaintenanceProductService.patch(selectedId, {
        quantity: parseInt(quantity)
      })
        .then((res: any) => {
          setSuccess(true);
        })
        .catch((err: any) => {
          enqueueSnackbar(err?.message, { variant: "error", });
        });
    }

  }

  const nonCommonObjects = items.filter((obj1: any) => !data.some((obj2: any) => obj1.id === obj2?.product.id));

  const options = nonCommonObjects?.map((item: any) => ({ id: item.id, name: item.name }));


  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => { }}
          successText="Added item"
          successSubText="Added the item successfully"
        />
      ) : (
        <Box p={2} width={"40vw"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {forEdit ? "Edit item" : "Add required items"}
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
          {/* {
            !forEdit ? <EnSearchTextField data={search} setData={setSearch} width="100%" background="transparent"  /> : ""
          }
          {
            !forEdit ? 
            <Box mt={'1%'}>
                <ItemCard />
                <ItemCard />
                <ItemCard />
                <ItemCard />
                <ItemCard />
            </Box> : (
                <Box>
                <EnTextField
                  data={itemName}
                  setData={setItemName}
                  disabled={false}
                  label="Item name"
                  placeHolder="Enter item name"
                />
                <EnTextField
                  data={quantity}
                  setData={setQuantity}
                  disabled={false}
                  label="Enter Quantity"
                  placeHolder="Enter item name"
                  type="number"
                />
              </Box>
            )
          } */}

          <Autocomplete
            disabled={forEdit ? true : false}
            size="small"
            id="combo-box-demo"
            options={options}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Enter item name" />}
            value={itemName}
            sx={{ mb: 2 }}
            onChange={(event, newValue) => {
              setItemName(newValue);
            }}
          />

          <EnTextField
            data={quantity}
            setData={setQuantity}
            disabled={false}
            label="Enter Quantity"
            placeHolder="Enter quantity"
            type="number"
          />


          <EnPrimaryButton
            disabled={false}
            loading={false}
            onClick={AddEditRequiredItems}
            hoverColor="#373737"
          >
            {forEdit ? "Save" : "Add items"}
          </EnPrimaryButton>
        </Box>
      )}
    </>
  );
};

export default AddNewItem;
