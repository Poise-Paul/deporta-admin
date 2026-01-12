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
  image: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
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
    type_id: {
      _id: string;
      role: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
      status: string;
    };
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
