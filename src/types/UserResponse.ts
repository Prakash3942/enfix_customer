export interface User {
  address1: string;
  address2: string;
  client_admin_email: string;
  designation: string;
  email: string;
  name: string;
  permissions: any;
  id: number;
  middleName: string;
  phone: string;
  role: string;
  status: number;
  credential_id: any;
}

export interface AllUsers extends Array<User> {}

export interface UserResponse {
  total: number;
  skip: number;
  limit: number;
  data: AllUsers;
}
