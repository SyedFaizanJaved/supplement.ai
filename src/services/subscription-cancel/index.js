import axiosInstance from "../axios";

export const cancelSubscription = async () => {
  const response = await axiosInstance.post("/payments/subscription/cancel/");
  return response.data;
};
