import axiosInstance from "../axios";
export async function getSupplementPlan() {
  return await axiosInstance.get("/api/v1/supplement-plan");
}
