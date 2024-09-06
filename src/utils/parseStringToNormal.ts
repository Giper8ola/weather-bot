export const parseStringToNormal = (str: string) => {
    return str
        .split('')
        .filter((el) => el != '\n' && el != '\t')
        .join('');
};
