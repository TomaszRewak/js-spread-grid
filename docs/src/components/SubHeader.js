import './SubHeader.css';

export default function SubHeader({ children }) {
    return (
        <h4 className='SubHeader'>{children}</h4>
    );
}