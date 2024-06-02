import './Section.css';

export default function Section({ children }) {
  return (
    <section className="Section">
      {children}
    </section>
  );
}