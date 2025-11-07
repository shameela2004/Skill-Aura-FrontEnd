import axios from "axios";
import axiosInstance from "./axiosInstance";

export const applyMentor = async (data: object) => {
  const res = await axiosInstance.post("/mentor/apply-mentor", data);
  return res.data;
};

export const getMentorStatus = async () => {
  const res = await axiosInstance.get("/mentor/mentor-status");
  return res.data;
};
