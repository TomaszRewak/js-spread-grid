import './Paragraph.css';

function getClassName(children) {
  if (typeof children === 'object' && children.type === 'code') {
    return 'Paragraph CodeBlock';
  }

  return 'Paragraph';
}

export default function Paragraph({ children }) {
  const className = getClassName(children);

  return (
    <p className={className}>
      {children}
    </p>
  );
}