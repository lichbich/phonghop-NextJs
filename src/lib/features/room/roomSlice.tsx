import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';


const roomSlice = createSlice({
    name: 'room',
    initialState : {
        selectedRoom: null
      },
    reducers: {
        setSelectedRoom: (state, action: PayloadAction<any>) => {
            state.selectedRoom = action.payload;
        },
    },
});

const store = configureStore({
    reducer: roomSlice.reducer
  })

export const { setSelectedRoom } = roomSlice.actions;
export default roomSlice.reducer;
