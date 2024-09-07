const transliterationMap = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya'
};

function transliterate(text) {
    return text
        .toLowerCase()
        .split('')
        .map((char) => transliterationMap[char] || char)
        .join('');
}

export const getTranslatedCity = (str: string) => {
    const transliteratedCity = transliterate(str);
    console.log(transliteratedCity);
    return transliteratedCity.replace(/\s+/g, '_');
};
