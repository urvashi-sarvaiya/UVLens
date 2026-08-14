import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/bills';

export const billApi = {
  // Fetch summary of all bills
  getBills: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  // Fetch full details of a single bill
  getBillById: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Delete a bill by ID
  deleteBill: async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Upload and analyze a new bill
  uploadBill: async (file) => {
    const formData = new FormData();
    formData.append('bill', file);
    const response = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default billApi;
