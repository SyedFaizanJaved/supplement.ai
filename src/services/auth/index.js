import axiosInstance from "../axios";

export const checkEmailPhone = async (email, phone) => {
  const response = await axiosInstance.post(
    "/api/v1/auth/check-email-phone/",
    {
      email,
      phone_number: phone,
    },
    { auth: false }
  );
  return response.data;
};

export const getProfile = async () => {
  const response = await axiosInstance.get("/api/v1/users/profile");
  return response.data;
};
