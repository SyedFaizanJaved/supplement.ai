import axiosInstance from "../axios";

export const getTodaySupplementLog = async () => {
  const response = await axiosInstance.get("/api/v1/supplement-log/today/");
  return response.data;
};

export const submitSupplementTracking = async () => {
  const response = await axiosInstance.post("/api/v1/supplement-log/");
  console.log('resopnse',response)
  return response.data;
};

export const getTodayWellnessJournal = async () => {
  const response = await axiosInstance.get("/api/v1/wellness-journal/today/");
  return response.data;
};

export const submitSymptomTracking = async (
  energyLevel,
  sleepQuality,
  stressLevel,
  otherSymptoms
) => {
  const payload = {
    energy_level: energyLevel,
    sleep_quality: sleepQuality,
    stress_level: stressLevel,
    other_symptoms_notes: otherSymptoms || "",
  };

  const response = await axiosInstance.post(
    "/api/v1/wellness-journal/",
    payload
  );
  return response.data;
};
