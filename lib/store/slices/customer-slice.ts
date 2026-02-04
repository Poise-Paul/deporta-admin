import { UserData } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CustomerState {
  customerDetails: UserData | null;
}

const initialState: CustomerState = {
  customerDetails: null,
};

const staffSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    updateSelCustomer: (state, action) => {
      state.customerDetails = action.payload;
    },

    resetCustomer: () => initialState,
  },
});

export const { updateSelCustomer, resetCustomer } = staffSlice.actions;
export default staffSlice.reducer;
