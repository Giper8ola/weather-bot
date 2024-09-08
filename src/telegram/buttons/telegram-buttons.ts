import { Markup } from 'telegraf';

export function actionButtons() {
    return Markup.keyboard([
        Markup.button.callback('Выбор города', 'city'),
        Markup.button.locationRequest('Погода в моем городе'),
        Markup.button.callback('Выбор единицы измерения', 'measuring')
    ]);
}

export function inlineButtons() {
    return Markup.inlineKeyboard([
        Markup.button.callback('По Цельсию', 'changeCelsius'),
        Markup.button.callback('По Фаренгейту', 'changeFahrenheit')
    ]);
}
