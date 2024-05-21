import { createSlice } from "@reduxjs/toolkit";
import { ReduxState } from "../../utils/State";


export interface LoginState {
    status: ReduxState;
    error?: string;
}

const initialState: LoginState = {
    status:ReduxState.INIT,
};


export const loginSlice = createSlice({
    name: "loginDetails",
    initialState,
    reducers: {},
    extraReducers: (builder) => {},
});

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default loginSlice.reducer;
