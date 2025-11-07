import axiosInstance from "./axiosInstance";

export const ConnectionService = {
  getConnections: async () => {
    const res = await axiosInstance.get("/connection/connections");
    return res.data.data;
  },

  getPendingConnections: async () => {
    const res = await axiosInstance.get("/connection/connections/pending");
    return res.data.data;
  },

  sendRequest: async (otherUserId: number) => {
    return await axiosInstance.post(`/connection/connect/${otherUserId}`);
  },

  acceptRequest: async (connectionId: number) => {
    return await axiosInstance.post(`/connection/connect/accept/${connectionId}`);
  },

  rejectRequest: async (connectionId: number) => {
    return await axiosInstance.post(`/connection/connect/reject/${connectionId}`);
  },

  deleteConnection: async (connectionId: number) => {
    return await axiosInstance.delete(`/connection/connect/${connectionId}`);
  },
};
