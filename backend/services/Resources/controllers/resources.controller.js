import { TECHNICAL_RESOURCES } from "../data/technicalResources.js";

export const getCareerResources = (_req, res) => {
    return res.status(200).json({
        success: true,
        count: TECHNICAL_RESOURCES.length,
        data: TECHNICAL_RESOURCES,
    });
};

export const getResourcesForCareer = (req, res) => {
    const careerResources = TECHNICAL_RESOURCES.find(
        (path) => path.careerId === req.params.careerId
    );

    if (!careerResources) {
        return res.status(404).json({
            success: false,
            message: "Learning resources not found for this career.",
        });
    }

    return res.status(200).json({
        success: true,
        data: careerResources,
    });
};
