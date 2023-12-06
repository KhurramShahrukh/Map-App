// reducers/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  RootState,
  DropSliceInitialStateInterface,
  DropSliceSetAddressPayloadType
} from '../Common/Types';

const initialState: DropSliceInitialStateInterface = {
  parsedAddresses: []
};

const DropSlice = createSlice({
  name: 'DropSlice',
  initialState,
  reducers: {
    setParsedAddresses: (state, action: PayloadAction<DropSliceSetAddressPayloadType>) => {
      state.parsedAddresses = action.payload;
    }
  }
});

export const { setParsedAddresses } = DropSlice.actions;
export const getParsedAddresses = (state: RootState) => state.Drop.parsedAddresses
export default DropSlice.reducer;
