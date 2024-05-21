import { User } from './../../types/UserResponse';
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthenticationResult } from "@feathersjs/authentication";
import restApp, { authCookieName, cookieStorage } from "../../apis/rest.app";
import { useRouter } from "next/router";
import { ReduxState } from "../../types/State";

export enum DialogState {
  ADD_STAFF,
  ADD_CUSTOMER,
  SUBSCRIPTION,
  DELETE_DIALOG,
  SCHEDULE_DELETE,
  ADD_MACHINE,
  MACHINE_TYPE,
  EDIT_MACHINE,
  CREATE_SCHEDULE,
  ADD_NEW_ITEM,
  ASSIGN_NEW_STAFF,
  UPLOAD_MANUAL,
  RENAME_FILE,
  REQUEST_DETAILS,
  TRANSACTION_DETAILS,
  EDIT_ITEM,
  ADD_ITEM,
  ADD_STOCK,
  ITEM_DELETE,
  REMOVE_ASSIGNED_STAFF,
  UPLOAD_FILES,
  CREATE_TRANSACTION,
  ASSIGN_TO_STAFF,
  CREATE_LOG,
  LOG_DETAILS,
  CONFIRM_LOGOUT,
  CHANGE_PASSWORD,
}


// Define a type for the slice state
export interface AppState {
  user: User | any | null | AuthenticationResult;
  error?: string;
  activeTabId?: string;
  dialogState: DialogState | null;
  setDataToUpdate: any;
  userType: string;
  forEdit: boolean
  selectedPage?: any;
  selectedId?: any;
  selectedRowId?: any;
  selectedFileId?: any;
  selectedMaintenanceId?: any;
  deleteMaintenanceId?: any;
  status: ReduxState;
  setEmail?: string;
  machineData?: any;
  setToken?: any;
}

// Define the initial state using that type
export const initialState: AppState = {
  user: null,
  dialogState: null,
  setDataToUpdate: null,
  userType: "",
  forEdit: false,
  status: ReduxState.INIT,
  setEmail: "",
  setToken: ""
};


export const fetchRefreshToken = createAsyncThunk<
  User | null | AuthenticationResult
>("app/fetchRefreshToken", async () => {
  const token = localStorage.getItem(authCookieName);
  if (!token) return null;
   else if (token){
  return await restApp
    .authenticate(
      {
        deviceType: 1,
        strategy: "jwt",
        deviceId: localStorage.getItem("deviceId"),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(async (res: AuthenticationResult) => {
      // localStorage.setItem(authCookieName, res.accessToken);
      // cookieStorage.setItem(authCookieName, res.accessToken);
      await restApp.reAuthenticate();
      if (res) {
        return res;
      }
    })
    .catch((err: any) => {
      const router = useRouter();
      if (err) {
        router.push("/login");
        localStorage.removeItem(authCookieName);
        cookieStorage.removeItem(authCookieName);
      }
    });
  }
});



export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    changeDialogState: (state: AppState, action: PayloadAction<DialogState | null>) => {
      state.dialogState = action.payload;
    },
    forEditState: (state: AppState, action: PayloadAction<{
      forEdit: boolean
    }>) => {
      state.forEdit = action.payload.forEdit;
    },
    setSelectedPage: (state: AppState, action: PayloadAction<{
      selectedPage: any
    }>) => {
      state.selectedPage = action.payload.selectedPage;
    },
    setSelectedId: (state: AppState, action: PayloadAction<{
      selectedId: any
    }>) => {
      state.selectedId = action.payload.selectedId;
    },
    setSelectedRowId: (state: AppState, action: PayloadAction<{
      selectedRowId: any
    }>) => {
      state.selectedRowId = action.payload.selectedRowId;
    },
    setSelectedFileId: (state: AppState, action: PayloadAction<{
      selectedFileId: any
    }>) => {
      state.selectedFileId = action.payload.selectedFileId;
    },
    setSelectedMaintenanceId: (state: AppState, action: PayloadAction<{
      selectedMaintenanceId: any
    }>) => {
      state.selectedMaintenanceId = action.payload.selectedMaintenanceId;
    },
    setDeleteMaintenanceId: (state: AppState, action: PayloadAction<{
      deleteMaintenanceId: any
    }>) => {
      state.deleteMaintenanceId = action.payload.deleteMaintenanceId;
    },
    setForgetEmail: (state: AppState, action: PayloadAction<{
      setEmail: string;
    }>) => {
      state.setEmail = action.payload.setEmail
    },
    setMachineData: (state: AppState, action: PayloadAction<{
      machineData: any;
    }>) => {
      state.machineData = action.payload.machineData
    },
    setUser: (state: AppState, action: PayloadAction<{
      user: any;
    }>) => {
      state.user = action.payload.user
    },
    setAccessToken: (state: AppState, action: PayloadAction<{
      setToken: string;
    }>) => {
      state.setToken = action.payload.setToken
    },
  },
  extraReducers: (builder) => { },
});

export const { changeDialogState, forEditState, setSelectedPage, setSelectedId, setSelectedRowId, setSelectedFileId, setSelectedMaintenanceId, setDeleteMaintenanceId, setForgetEmail, setAccessToken, setMachineData, setUser } = appSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default appSlice.reducer;
