import './Paragraph.css';

export default function Paragraph({ children }) {
  return (
    <p className="Paragraph">
      {children}
    </p>
  );
}