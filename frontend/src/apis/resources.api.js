import api from "../utils/axios.js";

export async function getCareerResources() {
    const response = await api.get("/api/resources");
    const payload = response?.data;

    if (!payload?.success || !Array.isArray(payload.data)) {
        throw new Error(
            payload?.message || "The resources service returned invalid data."
        );
    }

    return payload.data;
}

export async function getResourcesForCareer(careerId) {
    if (!careerId) {
        throw new Error("A career path must be selected.");
    }

    const response = await api.get(
        `/api/resources/${encodeURIComponent(careerId)}`
    );
    const payload = response?.data;

    if (!payload?.success || !payload.data) {
        throw new Error(
            payload?.message || "The resources service returned invalid data."
        );
    }

    return payload.data;
}
