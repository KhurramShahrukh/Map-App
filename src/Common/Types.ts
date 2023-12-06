import store from "../store";

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export interface DropSliceInitialStateInterface {
  parsedAddresses: string[];
}

export type DropSliceSetAddressPayloadType = string[];

export type LocationType = {
  longitude: number,
  latitude: number,
}

export interface PinLocationInterface extends LocationType {
  address: string
}