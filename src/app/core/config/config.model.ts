export interface AppConfig {
  endPoints: EndPoints;
  [key: string]: any;
}
export interface EndPoints {
  BASE_URL: string;
  RESOURCE_URL: string;
  BASE_URL_UPLOAD: string;
  NOTIFICATION_URL: string;
  WEB_URL: string;
  ID_URL: string;
  ADDRESS_URL: string;
  SOCKET_URL: string;
  PROFILE_URL: string;
  AGENCY_API_URL: string;
  AGENCY_NAME: string;
  AGENCY_ROLE_NAME: string;
}
