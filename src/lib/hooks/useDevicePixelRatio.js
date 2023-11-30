import { useState, useEffect } from 'react';

// TODO: Test this hook
function useDevicePixelRatio() {
    const [devicePixelRatio, setDevicePixelRatio] = useState(window.devicePixelRatio);

    useEffect(() => {
        const media = matchMedia(`(resolution: ${devicePixelRatio}dppx)`);
        const updateDevicePixelRatio = () => {
            console.log('Device pixel ratio changed');
            setDevicePixelRatio(window.devicePixelRatio);
        };

        media.addEventListener('change', updateDevicePixelRatio, { once: true });

        return () => media.removeEventListener('change', updateDevicePixelRatio);
    }, [devicePixelRatio]);

    return devicePixelRatio;
}

export default useDevicePixelRatio;
