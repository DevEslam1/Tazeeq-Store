import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address } from '../../types/app';

interface AddressState {
  addresses: Address[];
  selectedAddressId: string | null;
}

const mockAddresses: Address[] = [
  {
    id: '1',
    title: 'المنزل',
    details: 'الرياض - حي النرجس - شارع العلياء',
    phone: '+966501234567',
    city: 'الرياض',
    selected: true,
  },
  {
    id: '2',
    title: 'العمل',
    details: 'الرياض - حي الملقا - برج الأعمال',
    phone: '+966501234568',
    city: 'الرياض',
    selected: false,
  },
];

const initialState: AddressState = {
  addresses: mockAddresses,
  selectedAddressId: '1',
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    addAddress: (state, action: PayloadAction<Address>) => {
      state.addresses.push(action.payload);
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.filter(a => a.id !== action.payload);
    },
    updateAddress: (state, action: PayloadAction<Address>) => {
      const index = state.addresses.findIndex(a => a.id === action.payload.id);
      if (index > -1) {
        state.addresses[index] = action.payload;
      }
    },
    selectAddress: (state, action: PayloadAction<string>) => {
      state.addresses.forEach(a => {
        a.selected = a.id === action.payload;
      });
      state.selectedAddressId = action.payload;
    },
  },
});

export const { addAddress, removeAddress, updateAddress, selectAddress } = addressSlice.actions;
export default addressSlice.reducer;

export const selectAllAddresses = (state: { address: AddressState }) => state.address.addresses;
export const selectSelectedAddress = (state: { address: AddressState }) => 
  state.address.addresses.find(a => a.id === state.address.selectedAddressId);