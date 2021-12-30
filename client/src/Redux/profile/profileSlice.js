import { createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        value: null
    },
    reducers: {
        update: (state, action) => {
            state.value = action.payload;
        }
    }
})

export const { update } = profileSlice.actions;
export default profileSlice.reducer;