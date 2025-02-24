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

export const forgotPassword = async (body) => {
  const response = await axiosInstance("/api/v1/forgot-password", body, {
    auth: false,
  });

  return response;
};

export const resetPassword = async (body) => {
  const response = await axiosInstance("/api/v1/reset-password", body, {
    auth: false,
  });

  return response;
};
