export interface Address {
  geometry: {
    coordinates: number[];
  },
  properties: {
    postcode: string;
    label: string;
    type: string;
    citycode: string;
    context: string;
  };
}