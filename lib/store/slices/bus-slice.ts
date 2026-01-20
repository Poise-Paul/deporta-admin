import { Bus } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface BusState {
  selBus: Bus | null;
}

const initialState: BusState = {
  selBus: null,
};

const busSlice = createSlice({
  name: "bus",
  initialState,
  reducers: {
    updateSelBus: (state, action) => {
      state.selBus = action.payload;
    },
    updateBusDetails: (state, action) => {
      if (state.selBus) {
        state.selBus.id_code = action.payload.id_code;
        state.selBus.name_label = action.payload.name_label;
        state.selBus.routes_assigned = action.payload.routes_assigned;
        state.selBus.plate_number = action.payload.plate_number;
        state.selBus.capacity = action.payload.capacity;
        state.selBus.bus_photo = action.payload.bus_photo;
        state.selBus.operation_schedule = action.payload.operation_schedule;
        state.selBus.drivers_assigned = action.payload.drivers_assigned;
        state.selBus.added_by = action.payload.added_by;
        state.selBus.status = action.payload.status;
        state.selBus.fuel_type = action.payload.fuel_type;
        state.selBus.tracker_id = action.payload.tracker_id;
        state.selBus.mileage = action.payload.mileage;
        state.selBus.outsourcing = action.payload.outsourcing;
        state.selBus.mileage = action.payload.mileage;
      }
    },

    resetBus: () => initialState,
  },
});

export const { updateBusDetails, updateSelBus, resetBus } = busSlice.actions;
export default busSlice.reducer;
