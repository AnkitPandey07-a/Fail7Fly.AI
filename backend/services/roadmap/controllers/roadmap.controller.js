import { TECHNICAL_CAREER_PATHS } from "../data/technicalCareerPaths.js";

export const getCareerPaths = (_req, res) => {
    return res.status(200).json({
        success: true,
        count: TECHNICAL_CAREER_PATHS.length,
        data: TECHNICAL_CAREER_PATHS,
    });
};

export const getCareerPath = (req, res) => {
    const careerPath = TECHNICAL_CAREER_PATHS.find(
        (path) => path.id === req.params.careerId
    );

    if (!careerPath) {
        return res.status(404).json({
            success: false,
            message: "Career roadmap not found.",
        });
    }

    return res.status(200).json({
        success: true,
        data: careerPath,
    });
};
