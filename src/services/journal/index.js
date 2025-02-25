import axiosInstance from "../axios";

export const submitSupplementTracking = async (tookSupplements) => {
  // Prepare payload; you can include additional fields if needed.
  const payload = {
    // Convert "yes"/"no" to a boolean value
    took_supplements: tookSupplements === "yes",
    date: new Date().toISOString(),
  };

  // Post the payload to your supplement tracking endpoint.
  const response = await axiosInstance.post("/api/v1/supplement-tracking/", payload);
  return response.data;
};

export const submitSymptomTracking = async (energyLevel, sleepQuality, stressLevel, otherSymptoms) => {
  // Prepare an array of symptom entries
  const payload = [
    {
      symptom: "Energy Level",
      severity: energyLevel,
      notes: "Daily energy tracking",
    },
    {
      symptom: "Sleep Quality",
      severity: sleepQuality,
      notes: "Daily sleep quality tracking",
    },
    {
      symptom: "Stress/Anxiety",
      severity: stressLevel,
      notes: "Daily stress tracking",
    },
    //agar koi or symptoms bhi track karnay hain to unko bhi include karo
    ...(otherSymptoms
      ? [
          {
            symptom: "Other",
            severity: 0,
            notes: otherSymptoms,
          },
        ]
      : []),
  ];

  // Post the payload to your symptom tracking endpoint.
  const response = await axiosInstance.post("/api/v1/symptom-tracking/", payload);
  return response.data;
};
