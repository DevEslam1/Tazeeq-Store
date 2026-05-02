import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Address } from '../../types/app';
import { AddressRepository } from '../../services/addressService';

interface AddressState {
  addresses: Address[];
  selectedAddressId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  selectedAddressId: null,
  loading: false,
  error: null,
};

export const fetchAddresses = createAsyncThunk(
  'address/fetchAll',
  async (userId: string) => {
    return await AddressRepository.getAll(userId);
  }
);

export const addNewAddress = createAsyncThunk(
  'address/add',
  async ({ userId, address }: { userId: string; address: Omit<Address, 'id'> }) => {
    const id = await AddressRepository.add(userId, address);
    return { id, ...address } as Address;
  }
);

export const selectAndSyncAddress = createAsyncThunk(
  'address/select',
  async ({ userId, addressId }: { userId: string; addressId: string }) => {
    await AddressRepository.setSelected(userId, addressId);
    return addressId;
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearAddresses: (state) => {
      state.addresses = [];
      state.selectedAddressId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
        const selected = action.payload.find(a => a.selected);
        state.selectedAddressId = selected ? selected.id : (action.payload[0]?.id || null);
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch addresses';
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(selectAndSyncAddress.fulfilled, (state, action) => {
        state.selectedAddressId = action.payload;
        state.addresses.forEach(a => {
          a.selected = a.id === action.payload;
        });
      });
  },
});

export const { clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;

export const selectAllAddresses = (state: { address: AddressState }) => state.address.addresses;
export const selectSelectedAddress = (state: { address: AddressState }) => 
  state.address.addresses.find(a => a.id === state.address.selectedAddressId);
export const selectAddressLoading = (state: { address: AddressState }) => state.address.loading;