import "./WorkInProgress.css"

export default function WorkInProgress({ step, details }) {
    const steps = [
        "idea",
        "design",
        "implementation",
        "documentation"
    ];

    return (
        <div className="WorkInProgress">
            <label>work in progress</label>
            {details && <label>({details})</label>}
            <div className="Steps">
                {steps.map((s, i) => {
                    const stepIndex = steps.indexOf(step);
                    const stepClass = stepIndex < i ? "Next" : stepIndex === i ? "Current" : "Done";
                    const className = `Step ${stepClass}`;
                    return (
                        <div key={i} className={className}>
                            {s}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}