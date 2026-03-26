import { Booking, CoOperateUser } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

interface BookingState {
  selBooking: Booking | null;
}

const initialState: BookingState = {
  selBooking: null,
};

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    updateSelBooking: (state, action) => {
      state.selBooking = action.payload;
    },

    resetBooking: () => initialState,
  },
});

export const { updateSelBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
