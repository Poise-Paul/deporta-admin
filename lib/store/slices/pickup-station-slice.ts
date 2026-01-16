import { PickupStation, PickupStationDetail, StaffData } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PickupStationState {
  selStation: PickupStationDetail | null;
}

const initialState: PickupStationState = {
  selStation: null,
};

const staffSlice = createSlice({
  name: "pickupStation",
  initialState,
  reducers: {
    updateSelPickupStation: (state, action) => {
      state.selStation = action.payload;
    },
    updatePickupDetails: (state, action) => {
      if (state.selStation) {
        state.selStation.address = action.payload.address;
        state.selStation.area = action.payload.area;
        state.selStation.state = action.payload.state;
        state.selStation.country = action.payload.country;
        state.selStation.status = action.payload.status;
      }
    },
    resetPickupStation: () => initialState,
  },
});

export const {
  updateSelPickupStation,
  updatePickupDetails,
  resetPickupStation,
} = staffSlice.actions;
export default staffSlice.reducer;
