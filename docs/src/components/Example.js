import "./Example.css";

export default function Example({ children }) {
    return (
        <div className="Example">
            <div className="Example-inner">
                {children}
            </div>
        </div>
    )
}