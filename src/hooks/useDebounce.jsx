import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        // Cleanup function clears the timer if value changes before delay finishes
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}
