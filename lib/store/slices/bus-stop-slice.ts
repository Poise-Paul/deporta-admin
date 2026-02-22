import { BusStopDataDetails } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface BusStopState {
  selBusStop: BusStopDataDetails | null;
}

const initialState: BusStopState = {
  selBusStop: null,
};

const busStopSlice = createSlice({
  name: "busStop",
  initialState,
  reducers: {
    updateSelBusStop: (state, action) => {
      state.selBusStop = action.payload;
    },
    updateBusStopDetails: (state, action) => {
      if (state.selBusStop) {
        state.selBusStop.routes = action.payload.routes;
        state.selBusStop.address = action.payload.address;
        state.selBusStop.area = action.payload.area;
        state.selBusStop.country = action.payload.country;
        state.selBusStop.state = action.payload.state;
        state.selBusStop.status = action.payload.status;
      }
    },
    resetBusStop: () => initialState,
  },
});

export const { updateSelBusStop, updateBusStopDetails, resetBusStop } =
  busStopSlice.actions;
export default busStopSlice.reducer;
