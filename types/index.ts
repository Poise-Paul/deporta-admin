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
  address: EntryPoint;
  area: string;
  state: string;
  country: string;
};

export type BusStopEntryPoint = {
  value: string;
  location_id: string;
  coordinates: [number, number];
};

export type AddTripRoute = {
  rate: number;
  flat_rate: number;
  rate_per_km: number;
  code: string;
  destination: BusStopEntryPoint;
  starting_point: BusStopEntryPoint;
  routine: {
    monday: WeekdayType;
    tuesday: WeekdayType;
    wednesday: WeekdayType;
    thursday: WeekdayType;
    friday: WeekdayType;
    saturday: WeekdayType;
    sunday: WeekdayType;
  };
  state: string;
  country: string;
  route_distance: string;
  number_of_stops: BusStopEntryPoint[];
};

export type AddBusStopPayload = {
  routes: number;
  address: EntryPoint;
  area: string;
  state: string;
  country: string;
};

export type AddBusPayload = {
  image?: File[] | null;
  imageUrl?: string[] | string | undefined;
  delete_bus_photo?: string[];
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
  image?: File[] | null;
  imageUrl?: string[] | string | undefined;
  delete_bus_photo?: string[];
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
  address: EntryPoint;
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
  destination: BusStopEntryPoint;
  starting_point: BusStopEntryPoint;
  state: string;
  country: string;
  route_distance: string;
  number_of_stops: BusStopEntryPoint[];
  routine: {
    monday: WeekdayType;
    tuesday: WeekdayType;
    wednesday: WeekdayType;
    thursday: WeekdayType;
    friday: WeekdayType;
    saturday: WeekdayType;
    sunday: WeekdayType;
  };
};

export interface DropOffStation {
  drop_off_location_id?: string;
  pickup_station_id?: string;
  address: {
    value: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  area: string;
  state: string;
  country: string;
}

export interface PickUpStation {
  pickup_station_id?: string;
  drop_off_location_id?: string;
  address: {
    value: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  area: string;
  state: string;
  country: string;
}

export type EditDropOffStationPayload = {
  drop_off_location_id: string;
  address: {
    value: string;
    coordinates: [number, number];
  };
  area: string;
  state: string;
  country: string;
};

export type EditBusStopPayload = {
  bus_stop_id: string;
  routes: number;
  location: EntryPoint;
  area: string;
  state: string;
  country: string;
};

export type UserData = {
  user_type: UserType;
  status?: string;
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

export enum PriorityType {
  Normal = "normal",
  High = "high",
  Urgent = "urgent",
}

export enum MaintenanceStatusType {
  Pending = "pending",
  Completed = "completed",
}

export type StatusPayload = {
  status: ActiveType;
  user_id: string;
};

export type TypeId = {
  _id: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type DashboardStats = {
  _id: string;
  count: number;
};

export type StaffDashboardStats = {
  status: boolean;
  staffs: DashboardStats[];
};

export type TotalIncomeResponse = {
  status: true;
  income: [
    {
      _id: any;
      amount: number;
    },
  ];
};

export type OnsiteDriverDataResponse = {
  status: boolean;
  staffs: {
    data: DriverData[];
    pagination: Pagination;
  };
};

export type OutsourceDriverDataResponse = {
  status: boolean;
  staffs: {
    data: DriverData[];
    pagination: Pagination;
  };
};

export type OutsourceBusDataResponse = {
  status: boolean;
  buses: {
    data: Bus[];
    pagination: Pagination;
  };
};

export type CustomerDashboardStats = {
  status: boolean;
  customers: DashboardStats[];
};

export interface StatusResponse extends Response {
  staffs: TypeId;
}

export type BusEditResponse = {
  message: string;
  status: boolean;
  buses: Bus;
};

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
  status: string;
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
  address: EntryPoint;
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

export type PickupStationData = {
  address: {
    location: {
      type: string;
      coordinates: [number, number];
    };
    value: string;
  };
  _id: string;
  area: string;
  state: string;
  country: string;
  added_by: StaffData;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type PickupStationDetails = {
  status: boolean;
  pickup_station: {
    data: PickupStationData[];
    pagination: Pagination;
  };
};

export type DropOffStationData = {
  address: {
    location: {
      type: string;
      coordinates: [number, number];
    };
    value: string;
  };
  _id: string;
  area: string;
  state: string;
  country: string;
  added_by: StaffData;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type DropOffDetails = {
  status: boolean;
  drop_off_station: {
    data: DropOffStationData[];
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

export type RouteCode = {
  _id: string;
  code: string;
};

export type DriverBusData = {
  _id: string;
  first_name: string;
  last_name: string;
  profile_image: string;
};

export type Bus = {
  operation_schedule: {
    from: string;
    to: string;
  };
  _id: string;
  id_code: string;
  name_label: string;
  routes_assigned: RouteCode[];
  plate_number: string;
  capacity: number;
  bus_photos: string[];
  drivers_assigned: DriverBusData[];
  added_by: NormalStaffData;
  status: string;
  fuel_type: string;
  tracker_id: string;
  mileage: string;
  outsourcing: {
    value: boolean;
    amount_per_day: number;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
  is_maintenance: boolean;
};

export type BusesResponse = {
  status: boolean;
  buses: {
    data: Bus[];
    pagination: Pagination;
  };
};

export type BusStop = {
  address: NewEntryPoint;
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

export type NewBusStopPayload = {
  bus_stop_id?: string;
  routes: number;
  address: {
    value: string;
    coordinates: [number, number];
  };
  area: string;
  state: string;
  country: string;
};

export type BusStopDataDetails = {
  address: NewEntryPoint;
  _id: string;
  area: string;
  state: string;
  country: string;
  added_by: NormalStaffData;
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

export type EntryPoint = {
  value: string;
  location_id: string;
  coordinates: [number, number];
};

export type MaintenanceReport = {
  title: string;
  description: string;
  technician_notes: string;
};

export type MaintenancePayload = {
  bus_id: string;
  priority: PriorityType;
  status: MaintenanceStatusType;
  report: MaintenanceReport;
};

export type MaintenanceResponse = {
  status: boolean;
  maintenance_report: {
    bus_id: string;
    added_by: string;
    report: {
      title: string;
      description: string;
      technician_notes: string;
    };
    priority: string;
    status: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: 0;
  };
  message: string;
};

export type WeekdayType = {
  active: boolean;
  value: {
    from: string;
    too: string;
    // status: string;
  }[];
};

export type NewEntryPoint = {
  location: {
    type: string;
    coordinates: [number, number];
  };
  location_id: string;
  value: string;
};

// NewEntryPoint - Old

export type RouteData = {
  starting_point: NewEntryPoint;
  destination: NewEntryPoint;
  routine: {
    monday: WeekdayType;
    tuesday: WeekdayType;
    wednesday: WeekdayType;
    thursday: WeekdayType;
    friday: WeekdayType;
    saturday: WeekdayType;
    sunday: WeekdayType;
  };
  _id: string;
  code: string;
  number_of_stops: EntryPoint[];
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

export interface UsersDataListResponse {
  status: boolean;
  users: {
    data: UserData[];
    pagination: Pagination;
  };
}

export interface CustomerListResponse {
  status: boolean;
  staffs: {
    data: UserData[];
    pagination: Pagination;
  };
}

export type UpdateStaff = {
  status: string;
  user_id: string;
};

export type DriverUserType = {
  value: string;
  type_id: {
    _id: string;
    role: string;
    is_on_site: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    outsourcing: {
      value: boolean;
      amount_per_day: number;
    };
  };
};

export type DriverData = {
  _id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_image: string;
  email: string;
  date_of_birth: string;
  password: string;
  user_type: DriverUserType;
  verify_email: boolean;
  deactivate: boolean;
  status: string;
  secret: string;
  refresh_token: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};

export type DriversDataResponse = {
  status: boolean;
  staffs: {
    data: DriverData[];
    pagination: Pagination;
  };
};

interface TotalCount {
  _id: any;
  count: number;
}

export type UsersTotalResponse = {
  status: boolean;
  users: TotalCount[];
};

export type MaintenanceData = {
  report: {
    title: string;
    description: string;
    technician_notes: string;
  };
  _id: string;
  bus_id: string;
  added_by: NormalStaffData;
  priority: PriorityType;
  status: MaintenanceStatusType;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type MaintenanceReportResponse = {
  status: boolean;
  maintenance_report: {
    data: MaintenanceData[];
    pagination: Pagination;
  };
};

export type BookingTotalIncomeResponse = {
  status: boolean;
  booking: [
    {
      _id: any;
      amount: number;
    },
  ];
};

export type BookingTotalResponse = {
  status: boolean;
  booking: [
    {
      _id: any;
      count: number;
    },
  ];
};

export type Booking = {
  _id: string;
  driver_assigned: string[];
  buses_assigned: string[];
  added_by: NormalStaffData;
  booking_type: string;
  rental_charge_rate: number;
  contract_start: string;
  contract_end: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type AllBookingsResponse = {
  status: boolean;
  booking: {
    data: Booking[];
    pagination: Pagination;
  };
};

export type NewBookingPayload = {
  cooperate_user_id: string;
  buses_assigned: string[];
  driver_assigned: string[];
  contract_start: string;
  contract_end: string;
};
