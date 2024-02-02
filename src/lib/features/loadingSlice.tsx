import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    value: false
  },
  reducers: {
    setLoading: (state, action: PayloadAction<any>) => {      
      state.value = action.payload
    }
  }
})

export const { setLoading } = loadingSlice.actions

const store = configureStore({
  reducer: loadingSlice.reducer
})

export default loadingSlice.reducer