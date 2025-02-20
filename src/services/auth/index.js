import axiosInstance from "../axios";

export const checkEmailPhone = async (email, phone) => {
  const response = await axiosInstance.post("/api/v1/auth/check-email-phone/", {
    email,
    phone_number: phone,
  });
  return response.data;
};
