export interface IRailwayResponse {
  data: Data;
  extra: Extra;
}

export interface Data {
  trains: Train[];
  selected_seat_class: string;
}

export interface Train {
  trip_number: string;
  departure_date_time: string;
  departure_full_date: string;
  departure_date_time_jd: string;
  arrival_date_time: string;
  travel_time: string;
  origin_city_name: string;
  destination_city_name: string;
  seat_types: SeatType[];
  train_model: string;
  is_open_for_all: boolean;
  boarding_points: BoardingPoint[];
  is_international: number;
  is_from_city_international: boolean;
}

export interface SeatType {
  key: number;
  type: string;
  trip_id: number;
  trip_route_id: number;
  route_id: number;
  fare: string;
  vat_percent: number;
  vat_amount: number;
  seat_counts: SeatCounts;
}

export interface SeatCounts {
  online: number;
  offline: number;
  is_divided: boolean;
}

export interface BoardingPoint {
  trip_point_id: number;
  location_id: number;
  location_name: string;
  location_time: string;
}

export interface Extra {
  hash: string
}
