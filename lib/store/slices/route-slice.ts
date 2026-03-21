import { RouteData } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TripRouteState {
  selRoute: RouteData | null;
}

const initialState: TripRouteState = {
  selRoute: null,
};

const routeSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    updateSelRoute: (state, action) => {
      state.selRoute = action.payload;
    },
    updateRouteDetails: (state, action) => {
      if (state.selRoute) {
        state.selRoute.starting_point = action.payload.starting_point;
        state.selRoute.destination = action.payload.destination;
        state.selRoute.code = action.payload.code;
        state.selRoute.number_of_stops = action.payload.number_of_stops;
        state.selRoute.route_distance = action.payload.route_distance;
        state.selRoute.state = action.payload.state;
        state.selRoute.country = action.payload.country;
        state.selRoute.rate = action.payload.rate;
        state.selRoute.rate_per_km = action.payload.rate_per_km;
        state.selRoute.flat_rate = action.payload.flat_rate;
        state.selRoute.status = action.payload.status;
        state.selRoute.routine = action.payload.routine
      }
    },
    resetTripRoute: () => initialState,
  },
});

export const { updateSelRoute, updateRouteDetails } = routeSlice.actions;
export default routeSlice.reducer;
