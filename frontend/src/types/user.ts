export interface User {
  name: string;
}

export interface CurrentUser extends User {
  email: string;
  access_token: string;
  refresh_token: string;
}
