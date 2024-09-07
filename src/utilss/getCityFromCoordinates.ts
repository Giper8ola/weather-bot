export async function getCityFromCoordinates(latitude, longitude) {
    const apiKey = 'a944205ea825493bb071ceda8715b52d';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const result = data.results[0];
        return (
            result.components.city ||
            result.components.town ||
            result.components.village
        );
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}
