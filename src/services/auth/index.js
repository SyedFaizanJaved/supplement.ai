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
  const response = await axiosInstance.post("/api/v1/auth/password_reset/",
    { email: body.email },
    { auth: false }
  );
  return response.data;
};

export const resetPassword = async (body) => {
  const { password, passwordResetToken } = body;
  const payload = { password, token: passwordResetToken };
  const response = await axiosInstance.post("/api/v1/auth/password_reset/confirm/",
    payload,
    { auth: false }
  );
  return response.data;
};
