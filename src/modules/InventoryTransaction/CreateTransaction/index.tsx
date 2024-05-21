import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import SuccessPage from "../../../components/SuccessPage";
import { AppDispatch, AppStoreState } from "../../../store/store";
import { changeDialogState, forEditState } from "../../app/slice";
import { getAllInventoryTransactionService } from "../../../apis/rest.app";
import { useSnackbar } from "notistack";

export interface CreateTransactionProps { }

const CreateTransaction: React.FC<CreateTransactionProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { forEdit } = useSelector((state: AppStoreState) => state.app);
  const [success, setSuccess] = useState(false);
  const [type, setType] = useState("CREDIT");
  const [loader, setLoader] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [rows, setRows] = useState([{ id: 1, transaction_items: [{ name: "", quantity: null }] }]);

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  const handleRemoveRow = (rowIndex: any) => {
    const updatedRows = [...rows];
    updatedRows.splice(rowIndex, 1);
    setRows(updatedRows);
  };

  const handleTransactionItemChange = (rowIndex: any, itemIndex: any, key: any, value: any) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].transaction_items[itemIndex][key] = value;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { id: rows.length + 1, transaction_items: [{ name: '', quantity: null }] }]);
  };

  const handleCreateTransaction = async () => {
    setLoader(true);
    await getAllInventoryTransactionService.create({
      type: type,
      transaction_items: rows.map((e) => e.transaction_items[0])
    })
      .then((res: any) => {
        setSuccess(true);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => { }}
          successText="Added item stocks"
          successSubText="Stocks added successfully"
        />
      ) : (
        <Box p={2} width={"40vw"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {forEdit ? "Edit item" : "Create Transaction"}
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

          <FormControl size="small" fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Select type</InputLabel>
            <Select
              value={type}
              label="Select type"
              onChange={handleChange}

            >
              <MenuItem value={'CREDIT'}>Credit</MenuItem>
              <MenuItem value={'DEBIT'}>Debit</MenuItem>
            </Select>
          </FormControl>

          {
            rows.map((each: any, rowIndex: any) => (
              <Box key={rowIndex} sx={{ mb: 1 }}>
                {
                  each?.transaction_items.map((e: any, itemIndex: any) => (
                    <Grid container spacing={1} key={itemIndex}>
                      <Grid item xs={7}>
                        <TextField fullWidth size="small" value={e?.name}
                          onChange={(e) => handleTransactionItemChange(rowIndex, itemIndex, 'name', e.target.value)}
                          label={'Enter item name'}
                        />
                      </Grid>

                      <Grid item xs={4}>

                        <TextField fullWidth size="small" value={e?.quantity} type="number"
                          onChange={(e) => handleTransactionItemChange(rowIndex, itemIndex, 'quantity', parseInt(e.target.value))}
                          label={'Enter quantity'}
                        />
                      </Grid>

                      <Grid item xs={1}>

                        <CloseIcon
                          onClick={() => handleRemoveRow(rowIndex)}
                          fontSize="large"
                          sx={{
                            background: "#373737",
                            borderRadius: "5px",
                            color: "#FFFFFF",
                            mt: 0.3,
                            cursor: "pointer",
                          }}
                        />
                      </Grid>

                    </Grid>
                  ))
                }
              </Box>
            ))
          }

          <Box sx={{ display: "flex", justifyContent: 'flex-end', mb: 1 }}>
            <Button variant='text' onClick={() => { addRow() }}>
              {"Add new item"}
            </Button>
          </Box>

          <EnPrimaryButton
            disabled={false}
            loading={false}
            onClick={handleCreateTransaction}
            hoverColor="#373737"
          >
            {"Create Transaction"}
          </EnPrimaryButton>
        </Box>
      )}
    </>
  );
};

export default CreateTransaction;
