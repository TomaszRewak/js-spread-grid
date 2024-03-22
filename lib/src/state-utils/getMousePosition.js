export default function getMousePosition(event) {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}