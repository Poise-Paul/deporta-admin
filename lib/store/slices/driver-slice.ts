import { DriverData } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DriverState {
  driverDetails: DriverData | null;
}

const initialState: DriverState = {
  driverDetails: null,
};

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    updateSelDriver: (state, action) => {
      state.driverDetails = action.payload;
    },

    resetDriver: () => initialState,
  },
});

export const { updateSelDriver, resetDriver } = driverSlice.actions;
export default driverSlice.reducer;
