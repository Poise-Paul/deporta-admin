import { PickupStationDetail } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DropOffStationState {
  selStation: PickupStationDetail | null;
}

const initialState: DropOffStationState = {
  selStation: null,
};

const dropOffSlice = createSlice({
  name: "dropOffStation",
  initialState,
  reducers: {
    updateSelDropOffStation: (state, action) => {
      state.selStation = action.payload;
    },
    updateDropOffDetails: (state, action) => {
      if (state.selStation) {
        state.selStation.address = action.payload.address;
        state.selStation.area = action.payload.area;
        state.selStation.state = action.payload.state;
        state.selStation.country = action.payload.country;
        state.selStation.status = action.payload.status;
      }
    },
    resetDropOffStation: () => initialState,
  },
});

export const {
  updateSelDropOffStation,
  updateDropOffDetails,
  resetDropOffStation,
} = dropOffSlice.actions;
export default dropOffSlice.reducer;
