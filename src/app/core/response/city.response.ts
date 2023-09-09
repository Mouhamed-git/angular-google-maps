export interface CityGlobalResponse {
  error: boolean
  msg: string
  data: CityResponse[];
}

export interface CityResponse{
  city: string;
  country: string;
}
