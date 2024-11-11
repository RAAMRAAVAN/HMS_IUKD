// Import necessary dependencies
import type { PayloadAction } from "@reduxjs/toolkit";
// import { getUser } from "./userAPI"; // Adjust the import path as necessary
import { createAppSlice } from "../../createAppSlice"; // Adjust the import path as necessary

// Define the state interface for UserSlice
export interface IpdCaseEntrySliceState {
  Entries: {}[]
}

// Define the initial state
const initialState: IpdCaseEntrySliceState = {
  Entries: []
};

// Create the user slice
export const ipdCaseEntrySlice = createAppSlice({
  name: "ipdCaseEntrySlice",
  initialState,

  reducers: (create) => ({
    // Use the `PayloadAction` type t+o declare the contents of `action.payload`
    updateCaseEntries: create.reducer(
      (state, action: PayloadAction<{Entry: {}; index: number}>) => {
        const {Entry, index} = action.payload
        let TempEntry = [...state.Entries];
        TempEntry[index] = action.payload
        state.Entries = TempEntry;
      },
    ),
    setCaseEntry: create.reducer(
      (state, action: PayloadAction<{Entry: {};}>) => {
        const {Entry} = action.payload
        state.Entries = [...state.Entries, Entry];
      },
    ),
    deleteCaseEntry: create.reducer(
      (state, action: PayloadAction<{index: number;}>) => {
        const {index} = action.payload;
        console.log("Temp=", index)
        const TempEntry = [...state.Entries];
        TempEntry.splice(index, 1)
        console.log("TempEntry=",TempEntry)
        state.Entries =  TempEntry;
      },
    ),
  })
});

// Action creators are generated for each case reducer function.
export const { updateCaseEntries, setCaseEntry, deleteCaseEntry } =
ipdCaseEntrySlice.actions;

// Define selectors for accessing state
export const selectCaseEntryItems = (state: { ipdCaseEntrySlice: IpdCaseEntrySliceState }) => state.ipdCaseEntrySlice.Entries;
// export const selectselectedPatient = (state: { ipdCaseEntrySlice: IpdCaseEntrySliceState }) => state.ipdCaseEntrySlice.selectedPatient;