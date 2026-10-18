import api from "../utils/axios.js";

async function getData(url) {
    const response = await api.get(url);
    const payload = response?.data;

    if (!payload?.success || payload.data == null) {
        throw new Error(
            payload?.message || "The roadmap service returned an invalid response."
        );
    }

    return payload.data;
}

export async function getCareerPaths() {
    const paths = await getData("/api/roadmap");

    if (!Array.isArray(paths)) {
        throw new Error("The roadmap service did not return career paths.");
    }

    return paths;
}

export async function getCareerPath(careerId) {
    if (!careerId) {
        throw new Error("A career path must be selected.");
    }

    return getData(`/api/roadmap/${encodeURIComponent(careerId)}`);
}
