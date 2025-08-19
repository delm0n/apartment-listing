import type { IApartment } from '~/types/IApartment';

// Имитация API-запроса к JSON-файлу
export const fetchApartments = async (): Promise<IApartment[]> => {
    // В Nuxt 3 можно использовать `useFetch` или `fetch`, но для статики — просто импорт
    // Поместите JSON в папку `public/data/apartments.json`
    const response = await fetch('/data.json');
    if (!response.ok) {
        throw new Error('Failed to fetch apartments');
    }
    return await response.json();
};