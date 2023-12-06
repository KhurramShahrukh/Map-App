import { combineReducers } from '@reduxjs/toolkit';
import DropReducer from './DropSlice';

const RootReducer = combineReducers({
    Drop: DropReducer,
});

export default RootReducer;