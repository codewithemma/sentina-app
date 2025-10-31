import { GoogleGenAI, Type } from "@google/genai";
import { AIRecommendation, PatientIntakeData, StaffMember } from "../types";

// This would come from a real-time data source in a real app
const mockAvailableStaff: StaffMember[] = [
  {
    id: "s1",
    name: "Dr. Anya Sharma",
    role: "MD",
    languages: ["English", "Hindi"],
    certifications: ["ACLS", "PALS"],
    status: "Available",
  },
  {
    id: "s2",
    name: "RN Carlos Rey",
    role: "RN",
    languages: ["English", "Spanish"],
    certifications: ["TNCC"],
    status: "Available",
  },
  {
    id: "s4",
    name: "RN Charon",
    role: "RN",
    languages: ["English", "Russian"],
    certifications: ["Isolation Certified"],
    status: "Available",
  },
];

const resolveApiKey = (): string | undefined => {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn(
      "⚠️ VITE_GEMINI_API_KEY not found. Please check your .env file."
    );
  }

  return apiKey;
};

const getRoutingRecommendation = async (
  intakeData: PatientIntakeData
): Promise<AIRecommendation> => {
  const apiKey = resolveApiKey();

  if (!apiKey) {
    console.warn(
      "Gemini API key not set. Using mock data. To enable real AI calls, set a server-side GOOGLE_API_KEY (recommended) or VITE_GEMINI_API_KEY for dev builds."
    );
    return getMockRecommendation(intakeData);
  }

  // Warn if running in a browser context — API keys should not be exposed client-side.
  if (typeof window !== "undefined") {
    console.warn(
      "Gemini API key is available in the client bundle. This is insecure — prefer calling Gemini from a server-side endpoint/proxy so the key remains secret."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are SENTINA, an AI Flow Engine for a hospital Emergency Department. 
    Your goal is to eliminate patient-care delays by providing real-time, AI-driven optimal patient routing and resource matching.
    You will receive patient intake data and the current ED status. Your response MUST be a single, valid JSON object matching the provided schema.
    Prioritize patient safety by matching them with the right location and staff. For example, a Russian-speaking patient needs a Russian-speaking nurse. An isolation risk patient needs an isolation-certified nurse and an isolation bay.`;

  const currentEDStatus = `
    - Homeostasis Score: 68 (Strained)
    - Available Acuity Beds: 2/20
    - Available Fast Track Bays: 4/12
    - Available Overflow Beds: 5/5
    - Available Isolation Bays: 0/2 (CRITICAL SHORTAGE)
    - Available Staff: ${JSON.stringify(mockAvailableStaff, null, 2)}
    - Equity Watch: Alert for patients from underserved communities approaching wait time thresholds.
    `;

  const userPrompt = `
    A new patient has arrived. Here is their intake data:
    - Patient Name: ${intakeData.patientName}
    - Age: ${intakeData.age}
    - Sex: ${intakeData.sex}
    - Current Location: ${intakeData.location}
    - Chief Complaint: ${intakeData.chiefComplaint}
    - Vitals:
        - Blood Pressure: ${intakeData.bpSystolic} / ${intakeData.bpDiastolic} mmHg
        - Heart Rate: ${intakeData.heartRate} bpm
        - O2 Saturation: ${intakeData.o2Sat}%
        - Body Temperature: ${intakeData.temperature}°${intakeData.temperatureUnit}
        - Height: ${intakeData.height} ${intakeData.heightUnit}
    - ESI Level: ${intakeData.esiLevel}
    - Patient's Primary Language: ${intakeData.language}
    - Contextual Flags:
        - Has Fever: ${intakeData.hasFever}
        - Isolation/Infection Risk: ${intakeData.isIsolationRisk}
        - Vulnerability Flag: ${intakeData.isVulnerable}

    Given the current ED status below, provide the optimal routing recommendation, including the best staff member to assign.
    Current ED Status:
    ${currentEDStatus}
    
    Analyze the patient's data, especially for language needs and infectious disease markers. 
    The lack of isolation bays is a major constraint; suggest a contingency plan if necessary (e.g., 'Convert Acuity 10 to temp Isolation').
    Match the patient with the most appropriate staff member from the available list.
    `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      patientId: {
        type: Type.STRING,
        description: "A generated unique patient ID, e.g., P8452.",
      },
      optimalPath: {
        type: Type.STRING,
        description:
          "The single best location for the patient (e.g., 'Isolation Bay 1', 'Fast Track Bay 5').",
      },
      matchedResource: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description:
              "The name of the best-matched staff member (e.g., 'RN Charon').",
          },
          reason: {
            type: Type.STRING,
            description:
              "Brief reason for the match (e.g., 'Speaks Russian', 'Isolation Certified').",
          },
        },
        required: ["name", "reason"],
      },
      predictedWaitTimeMinutes: {
        type: Type.NUMBER,
        description:
          "Predicted wait time in minutes from arrival to treatment beginning.",
      },
      confidenceScore: {
        type: Type.NUMBER,
        description: "Your confidence in this recommendation (0-100).",
      },
      rationale: {
        type: Type.STRING,
        description:
          "A brief, human-readable reason for the overall recommendation.",
      },
      equityAlert: {
        type: Type.OBJECT,
        properties: {
          triggered: { type: Type.BOOLEAN },
          reason: {
            type: Type.STRING,
            description: "Reason if triggered, otherwise null.",
          },
        },
        required: ["triggered", "reason"],
      },
    },
    required: [
      "patientId",
      "optimalPath",
      "matchedResource",
      "predictedWaitTimeMinutes",
      "confidenceScore",
      "rationale",
      "equityAlert",
    ],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      // FIX: The `contents` field can be a simple string for single-turn text prompts. The previous structure was valid but unnecessarily verbose.
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AIRecommendation;
  } catch (error: any) {
    // Try to surface the underlying API error for easier debugging (e.g., invalid API key)
    console.error("Error calling Gemini API:", error);

    // Some SDKs return an error.message that contains JSON with more details.
    const message = typeof error === "string" ? error : error?.message;
    if (
      typeof message === "string" &&
      (message.includes("API key not valid") ||
        message.includes("API_KEY_INVALID") ||
        message.includes("invalid API key"))
    ) {
      throw new Error(
        "Gemini API returned INVALID API KEY. Verify your API key is correct and provided via a server-side environment variable (do not expose keys in client bundles). For local dev you can set VITE_GEMINI_API_KEY but it will be public."
      );
    }

    // Fallback generic error
    throw new Error(
      "Failed to get routing recommendation from AI. See console for details."
    );
  }
};

// Mock function for development without an API key
const getMockRecommendation = (
  intakeData: PatientIntakeData
): AIRecommendation => {
  if (intakeData.isIsolationRisk) {
    return {
      patientId: `P${Math.floor(1000 + Math.random() * 9000)}`,
      optimalPath: "Convert Acuity Bed 1 to Temp Isolation",
      matchedResource: { name: "RN Charon", reason: "Isolation Certified" },
      predictedWaitTimeMinutes: 25,
      confidenceScore: 88,
      rationale:
        "High risk of infectious disease with no available isolation bays. Converting a room is the safest immediate action. RN Charon is certified for isolation protocols.",
      equityAlert: { triggered: false, reason: null },
    };
  }
  if (intakeData.language.toLowerCase().includes("russian")) {
    return {
      patientId: `P${Math.floor(1000 + Math.random() * 9000)}`,
      optimalPath: "Fast Track Bay 3",
      matchedResource: { name: "RN Charon", reason: "Speaks Russian" },
      predictedWaitTimeMinutes: 12,
      confidenceScore: 98,
      rationale:
        "Patient's primary language is Russian. RN Charon is the only available Russian-speaking nurse, ensuring clear communication and reducing risk.",
      equityAlert: { triggered: false, reason: null },
    };
  }
  return {
    patientId: `P${Math.floor(1000 + Math.random() * 9000)}`,
    optimalPath: "Acuity Bed 4",
    matchedResource: { name: "RN Carlos Rey", reason: "First available RN" },
    predictedWaitTimeMinutes: 18,
    confidenceScore: 95,
    rationale:
      "Patient meets criteria for an acuity bed based on ESI level. Bed 4 is nearest to nursing station.",
    equityAlert: { triggered: false, reason: null },
  };
};

export { getRoutingRecommendation };
