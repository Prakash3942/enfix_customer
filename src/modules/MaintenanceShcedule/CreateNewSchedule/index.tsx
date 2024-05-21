import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllMaintenanceShedulesService,
  machineService,
} from "../../../apis/rest.app";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import { EnTextField } from "../../../components/EnTextField";
import SuccessPage from "../../../components/SuccessPage";
import { AppDispatch, AppStoreState } from "../../../store/store";
import { formateString } from "../../../utils/string";
import { notEmpty } from "../../../utils/validators";
import { changeDialogState, forEditState } from "../../app/slice";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import moment from "moment";

export interface CreateNewScheduleProps { }

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const weekArray = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 7 },
];

export const getGeneratedRenderValue = (selected: any[]) => {
  let _weekDays = [];
  selected.forEach((_each) => {
    const selectedArray = weekArray.filter((_e) => _e.value === _each);
    if (selectedArray.length > 0) {
      _weekDays.push(selectedArray[0].label);
    }
  });
  return _weekDays.join(", ");
};

const CreateNewSchedule: React.FC<CreateNewScheduleProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { forEdit, selectedId } = useSelector((state: AppStoreState) => state.app);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);
  const [maintenanceName, setMaintenanceName] = useState("");
  const [frequency, setFrequency] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyFrequency, setMonthlyFrequency] = useState([]);
  const [weeklyFrequency, setWeeklyFrequency] = useState([]);
  const [lastMaintained, setLastMaintained] = useState(null);
  const { machineId } = router.query;

  const [checkListItems, setCheckListItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [checkListValue, setCheckListValue] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      const newTodoItem = { text: inputValue, checked: false };
      setCheckListItems([...checkListItems, newTodoItem]);
      setCheckListValue([...checkListValue, inputValue]); // Store the value in the array
      setInputValue('');
    }
  };

  const handleDeleteItem = (index) => {
    const newItems = [...checkListItems];
    newItems.splice(index, 1);
    setCheckListItems(newItems);

    const newTodoValues = [...checkListValue];
    newTodoValues.splice(index, 1);
    setCheckListValue(newTodoValues); // Remove the value from the array
  };

  const handleAddButtonClick = () => {
    if (inputValue.trim() !== '') {
      const newTodoItem = { text: inputValue, checked: false };
      setCheckListItems([...checkListItems, newTodoItem]);
      setCheckListValue([...checkListValue, inputValue]); // Store the value in the array
      setInputValue('');
    }
  };


  const [errors, setErrors] = useState({
    maintenanceName: "",
    frequency: "",
    lastMaintained: "",
    description: "",
  });

  const [access, setAccess] = useState({
    image_video_start: false,
    image_video_end: false,
    selfie_start: false,
    selfie_end: false,
  });

  const handleChangeCheckbox = (item: any) => {
    setAccess((prevItems) => {
      let _prevItems = prevItems;
      _prevItems[item] = !_prevItems[item];
      return { ..._prevItems };
    });
  };

  const frequencyOptions = [
    { key: "WEEKLY", value: "Weekly" },
    { key: "DAILY", value: "Daily" },
    { key: "MONTHLY", value: "Monthly" },
    { key: "MONTHLY_CUSTOM", value: "Custom Monthly" },
    { key: "WEEKLY_CUSTOM", value: "Custom Weekly" },
  ];

  const months = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];

  const handleMonthlyFrequencyChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setMonthlyFrequency(typeof value === "string" ? value.split(",") : value);
  };

  const handleWeeklyFrequencyChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setWeeklyFrequency([...value]);
  };

  const validate = () => {
    const newErrors: any = {};
    if (!notEmpty(maintenanceName)) {
      newErrors.maintenanceName = "maintenance name is required";
    }
    if (!notEmpty(frequency)) {
      newErrors.frequency = "frequency type is required";
    }

    // if (!notEmpty(lastMaintained)) {
    //   newErrors.lastMaintained = "last maintained is required";
    // }
    if (!notEmpty(description)) {
      newErrors.description = "description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createSchedule = async () => {
    let data: any = {
      name: maintenanceName,
      machine_id: forEdit ? Number(machineId) : Number(machineId),
      description: description,
      iteration: frequency,
      check_list: checkListValue,
      ...access,
    };
    if (frequency === "MONTHLY_CUSTOM") {
      data = {
        ...data,
        Days_of_month: monthlyFrequency,
      };
    } else if (frequency === "WEEKLY_CUSTOM") {
      data = {
        ...data,
        Days_of_week: weeklyFrequency,
      };
    } else if (frequency === "WEEKLY") {
      data = {
        ...data,
        Days_of_month: [],
        Days_of_week: [],
      };
    } else if (frequency === "MONTHLY") {
      data = {
        ...data,
        Days_of_month: [],
        Days_of_week: [],
      };
    }

    if (!forEdit) {
      if (validate()) {
        await getAllMaintenanceShedulesService
          .create({
            ...data,
            last_maintained_on: moment(new Date(lastMaintained)).format('DD/MM/YYYY'),
          })
          .then((res: any) => {
            console.log(res, "ressss");

            setSuccess(true);
          })
          .catch((err: any) => {
            enqueueSnackbar(err?.message, { variant: "error" });
          });
      }
    } else if (forEdit) {
      await getAllMaintenanceShedulesService
        .patch(selectedId, { ...data })
        .then((res: any) => {
          setSuccess(true);
        })
        .catch((err: any) => {
          enqueueSnackbar(err?.message, { variant: "error" });
        });
    }
  };

  //for edit
  const loadScheduleData = async () => {
    await getAllMaintenanceShedulesService
      .get(selectedId)
      .then((res: any) => {
        setMaintenanceName(res?.name);
        setDescription(res?.description);
        setFrequency(res?.iteration);
        setWeeklyFrequency(res?.Days_of_week);
        setMonthlyFrequency(res?.Days_of_month);
        setAccess({
          ...{
            image_video_start: res?.image_video_start || false,
            image_video_end: res?.image_video_end || false,
            selfie_start: res?.selfie_start || false,
            selfie_end: res?.selfie_end || false,
          },
        });
        // setLastMaintained(dayjs(res?.last_maintained_on));
        setLastMaintained(new Date(res?.last_maintained_on));
        // setMachineId(res?.machine_id);
        // setCustomerId(res?.customer_id)

        // Load existing check list items
        setCheckListItems(res?.check_list.map((item) => ({ text: item, checked: false })));
        setCheckListValue(res?.check_list);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  useEffect(() => {
    if (forEdit) {
      loadScheduleData();
    }
  }, [forEdit]);

  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => { }}
          successText={forEdit ? "Schedule edited" : "Added schedule"}
          successSubText={
            forEdit
              ? "Schedule edited successfully"
              : "Added the schedule successfully"
          }
        />
      ) : (
        <Box p={2} width={"40vw"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {forEdit ? "Edit schedule" : "Create schedule"}
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

          <EnTextField
            setData={setMaintenanceName}
            label="Name of the maintenance"
            placeHolder="Enter Name of the maintenance"
            data={maintenanceName}
            error={errors.maintenanceName}
          />

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Select frequency type</InputLabel>
            <Select
              value={frequency}
              label="Select frequency type"
              onChange={(e: any) => setFrequency(e.target.value)}
            >
              {frequencyOptions.map((option) => (
                <MenuItem key={option.key} value={option.key}>
                  {option.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {frequency === "MONTHLY_CUSTOM" ? (
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Custom monthly frequency</InputLabel>
              <Select
                multiple
                value={monthlyFrequency}
                label="Custom monthly frequency"
                onChange={handleMonthlyFrequencyChange}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    <Checkbox checked={monthlyFrequency.indexOf(month) > -1} />
                    <ListItemText primary={month} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}

          {frequency === "WEEKLY_CUSTOM" ? (
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Custom weekly frequency</InputLabel>
              <Select
                multiple
                value={weeklyFrequency}
                label="Custom weekly frequency"
                onChange={handleWeeklyFrequencyChange}
                renderValue={(selected) => getGeneratedRenderValue(selected)}
                MenuProps={MenuProps}
              >
                {weekArray.map((week, pos) => (
                  <MenuItem key={pos} value={week.value}>
                    <Checkbox
                      checked={weeklyFrequency.indexOf(week.value) > -1}
                    />
                    <ListItemText primary={week.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Enter last maintained on"
              value={lastMaintained}
              maxDate={new Date()}
              disabled={forEdit ? true : false}
              onChange={(newValue: any) => {
                setLastMaintained(newValue);
              }}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  size="small"
                  sx={{ width: "100%", mb: 2 }}
                />
              )}
            />
          </LocalizationProvider>

          <EnTextField
            setData={setDescription}
            label="Description of the schedule"
            placeHolder="Write description"
            data={description}
            multiline={true}
            rows={6}
            error={errors.description}
          />

          {/* <TextField
            label="Add List Items"
            variant="outlined"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            size="small"
            fullWidth
          /> */}
          <Box display="flex" justifyContent={"center"} alignItems="center" mb={1} gap={1}>
          
            <TextField
              label="Add List Items"
              variant="outlined"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              size="small"
              fullWidth
            />
        
            <Button onClick={handleAddButtonClick} variant="contained">Add</Button>
          </Box>

          <Grid container spacing={1}>
            {checkListItems?.map((item, index) => (
              <Grid item key={index} mt={1}>
                <Chip
                  label={item.text}
                  onDelete={() => handleDeleteItem(index)}
                  color={item.checked ? "primary" : "default"}
                  deleteIcon={<IconButton sx={{ '&:hover': { backgroundColor: 'transparent' } }}><CloseIcon /></IconButton>}
                />
              </Grid>
            ))}
          </Grid>

          <Typography color={"black"} fontSize="15px" fontWeight={600} mb={1} mt={2}>
            {"Proof of work"}
          </Typography>

          <Grid container spacing={1}>
            {Object.keys(access).map((item: any, i: any) => (
              <Grid item xs={6} md={6} key={i}>
                <FormGroup>
                  <FormControlLabel
                    key={i}
                    value={item}
                    control={
                      <Checkbox
                        checked={access[item]}
                        onChange={() => handleChangeCheckbox(item)}
                        sx={{
                          "&.Mui-checked": {
                            color: "#50AB59",
                          },
                        }}
                      />
                    }
                    label={formateString(item)}
                  />
                </FormGroup>
              </Grid>
            ))}
          </Grid>

          <EnPrimaryButton
            disabled={false}
            loading={false}
            onClick={() => createSchedule()}
            hoverColor="#373737"
          >
            {forEdit ? "Save schedule" : "Save schedule"}
          </EnPrimaryButton>
        </Box>
      )}
    </>
  );
};

export default CreateNewSchedule;
