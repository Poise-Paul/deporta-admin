import { StaffData } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface StaffState {
  staffDetails: StaffData | null;
}

const initialState: StaffState = {
  staffDetails: null,
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    updateSelStaff: (state, action) => {
      state.staffDetails = action.payload;
    },
    resetStaff: () => initialState,
  },
});

export const { updateSelStaff, resetStaff } = staffSlice.actions;
export default staffSlice.reducer;
