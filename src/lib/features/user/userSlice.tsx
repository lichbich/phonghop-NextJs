import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: null
  },
  reducers: {
    initializeUser: (state, action: PayloadAction<any>) => {
      state.value = action.payload
    }
  }
})

export const { initializeUser } = userSlice.actions

const store = configureStore({
  reducer: userSlice.reducer
})

export default userSlice.reducer