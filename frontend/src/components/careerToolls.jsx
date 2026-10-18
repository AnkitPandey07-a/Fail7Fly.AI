
import { useState } from "react";
import Scorer from "./Scorer";
import ResumeBuilder from "./Builder";

export default function CareerTools() {
    const [resumeData, setResumeData] = useState(null);
    const [activePage, setActivePage] = useState("scorer");

    function handleBuildResume(analysis) {
        setResumeData(analysis);
        setActivePage("builder");
    }

    return (
        <>
            {activePage === "scorer" && (
                <Scorer onBuildResume={handleBuildResume} />
            )}

            {activePage === "builder" && (
                <ResumeBuilder
                    resumeData={resumeData}
                    onBack={() => setActivePage("scorer")}
                />
            )}
        </>
    );
}
