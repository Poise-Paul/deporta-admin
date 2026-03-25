import { CoOperateUser } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

interface CoOperateAccountState {
  selCoOperate: CoOperateUser | null;
}

const initialState: CoOperateAccountState = {
  selCoOperate: null,
};

const corporateSlice = createSlice({
  name: "corporate",
  initialState,
  reducers: {
    updateSelCorporate: (state, action) => {
      state.selCoOperate = action.payload;
    },

    resetCorporate: () => initialState,
  },
});

export const { updateSelCorporate } = corporateSlice.actions;
export default corporateSlice.reducer;
