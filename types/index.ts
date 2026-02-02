export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  status: boolean;
  token: string;
  refresh_token: string;
  message: string;
};

export type ErrorrResponse = {
  error: {
    status: boolean;
    status_code: number;
    message: string;
  };
};

export type UserTypeId = {
  _id: string;
  testing: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type UserType = {
  value: string;
  type_id: UserTypeId;
};

export type AddAdminPayload = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  otp: string;
  gender: string;
};

export type AddStaffPayload = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  gender: string;
  role?: string;
  otp?: string;
};

export type AddPickupStationPayload = {
  address: string;
  area: string;
  state: string;
  country: string;
};

export type AddTripRoute = {
  rate: number;
  flat_rate: number;
  rate_per_km: number;
  code: string;
  destination: string;
  starting_point: string;
  state: string;
  country: string;
  route_distance: string;
  number_of_stops: string[];
};

export type AddBusStopPayload = {
  routes: number;
  location: string;
  area: string;
  state: string;
  country: string;
};

export type AddBusPayload = {
  image?: File | null;
  imageUrl?: string | undefined;
  id_code: string;
  name_label: string;
  routes_assigned: string[];
  drivers_assigned: string[];
  plate_number: string;
  capacity: string;
  operation_schedule: {
    from: string;
    to: string;
  };
  status: boolean;
  fuel_type: FuelType;
  bus_id?: string;
  tracker_id: string;
  mileage: string;
};

export type EditBusPayload = {
  image?: File | null;
  imageUrl?: string | undefined;
  bus_id: string;
  id_code: string;
  name_label: string;
  routes_assigned: string[];
  drivers_assigned: string[];
  plate_number: string;
  capacity: number;
  operation_schedule: {
    from: string;
    to: string;
  };
  status: boolean;
  fuel_type: FuelType;
  tracker_id: string;
  mileage: string;
};

export type EditPickupStationPayload = {
  pickup_station_id: string;
  address: string;
  area: string;
  state: string;
  country: string;
};

export type EditTripRoute = {
  trip_route_id: string;
  rate: number;
  flat_rate: number;
  rate_per_km: number;
  code: string;
  destination: string;
  starting_point: string;
  state: string;
  country: string;
  route_distance: string;
  number_of_stops: string[];
};

export type EditDropOffStationPayload = {
  drop_off_location_id: string;
  address: string;
  area: string;
  state: string;
  country: string;
};

export type EditBusStopPayload = {
  bus_stop_id: string;
  routes: number;
  location: string;
  area: string;
  state: string;
  country: string;
};

export type UserData = {
  user_type: UserType;
  _id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_image: string;
  email: string;
  date_of_birth: string;
  verify_email: boolean;
  deactivate: boolean;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};

export type UserDataResponse = {
  status: boolean;
  user: UserData;
};

export type AdminDataResponse = {
  status: boolean;
  admin: UserData;
  message: string;
};

export type Response = {
  status: boolean;
  message: string;
};

export type NewPasswordPayload = {
  otp: string;
  email: string;
  password: string;
  confirm_password: string;
};

export type ProfileUpdate = {
  image?: File | null; // for upload
  imageUrl?: string | undefined; // for display
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
};

export enum ActiveType {
  Active = "active",
  InActive = "in-active",
}

export enum FuelType {
  Petrol = "petrol",
  Diesel = "diesel",
}

export type StatusPayload = {
  isActive: ActiveType;
  staffId: string;
};

export type TypeId = {
  _id: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  status: string;
};

export type DashboardStats = {
  _id: string;
  count: number;
};

export type StaffDashboardStats = {
  status: boolean;
  staffs: DashboardStats[];
};

export type CustomerDashboardStats = {
  status: boolean;
  customers: DashboardStats[];
};

export interface StatusResponse extends Response {
  staffs: TypeId;
}

export type StaffData = {
  _id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_image: string;
  email: string;
  date_of_birth: string;
  password: string;
  user_type: {
    value: string;
    type_id: TypeId;
  };
  verify_email: boolean;
  deactivate: boolean;
  secret: string;
  refresh_token: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type StaffListResponse = {
  status: boolean;
  staffs: {
    data: StaffData[];
    pagination: {
      limit: number;
      page: number;
      count: number;
      totalPages: number;
    };
  };
};

export interface BasicLocationData {
  address: string;
  area: string;
  state: string;
  country: string;
}

export interface PickupStation extends BasicLocationData {
  added_by: string;
  status: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PickupStationDetail extends BasicLocationData {
  added_by: StaffData;
  status: ActiveType;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PickupStationResponse extends Response {
  pickup_station: PickupStation;
}

export interface DropOffLocationResponse extends Response {
  drop_off_station: PickupStation;
}

export type PickupStationDetails = {
  status: boolean;
  pickup_station: {
    data: PickupStationDetail[];
    pagination: Pagination;
  };
};

export type DropOffDetails = {
  status: boolean;
  drop_off_station: {
    data: PickupStationDetail[];
    pagination: Pagination;
  };
};

type Pagination = {
  limit: number;
  page: number;
  count: number;
  totalPages: number;
};

// Temporary Driver

export type Driver = {
  _id: string;
  name: string;
};

export type Bus = {
  _id: string;
  id_code: string;
  name_label: string;
  routes_assigned: string[];
  plate_number: string;
  capacity: number;
  bus_photo: string;
  operation_schedule: {
    from: string;
    to: string;
  };
  drivers_assigned: string[];
  added_by: NormalStaffData;
  status: string;
  fuel_type: string;
  tracker_id: string;
  mileage: string;
  outsourcing: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type BusesResponse = {
  status: boolean;
  buses: {
    data: Bus[];
    pagination: Pagination;
  };
};

export type BusStop = {
  location: string;
  area: string;
  state: string;
  country: string;
  added_by: string;
  routes: number;
  status: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface BusStopResponse extends Response {
  bus_stop: BusStop;
}

export type BusStopDataDetails = {
  _id: string;
  location: string;
  area: string;
  state: string;
  country: string;
  added_by: {
    user_type: {
      value: string;
      type_id: string;
    };
    _id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    profile_image: string;
    email: string;
    date_of_birth: string;
    verify_email: false;
    deactivate: false;
    createdAt: string;
    updatedAt: string;
    __v: 0;
  };
  routes: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type BusStopData = {
  status: boolean;
  bus_stop: {
    data: BusStopDataDetails[];
    pagination: Pagination;
  };
};

export type TripRoute = {
  starting_point: string;
  destination: string;
  code: string;
  number_of_stops: [string[]];
  route_distance: string;
  state: string;
  country: string;
  added_by: string;
  rate: number;
  rate_per_km: number;
  flat_rate: number;
  status: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};

export interface GetRoutesResponse extends Response {
  trip_route: TripRoute;
}

export type NormalStaffData = {
  user_type: {
    value: string;
    type_id: string;
  };
  _id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_image: string;
  email: string;
  date_of_birth: string;
  verify_email: boolean;
  deactivate: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type RouteData = {
  _id: string;
  starting_point: string;
  destination: string;
  code: string;
  number_of_stops: [string[]];
  route_distance: string;
  state: string;
  country: string;
  added_by: NormalStaffData;
  rate: number;
  rate_per_km: number;
  flat_rate: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface GetAllRoutesData {
  status: boolean;
  trip_route: {
    data: RouteData[];
    pagination: Pagination;
  };
}

export interface Trip {
  id: number;
  busImage: string;
  pickupLocation: string;
  destination: string;
  journeyCode: string;
  pickupTime: string;
  duration: string;
  passengers: number;
}
