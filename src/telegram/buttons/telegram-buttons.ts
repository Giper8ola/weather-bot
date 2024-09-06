import { Markup } from 'telegraf';

export function actionButtons() {
    return Markup.keyboard([
        Markup.button.callback('Выбор города', 'city'),
        Markup.button.locationRequest('Погода в моем городе'),
        Markup.button.callback('Выбор единиц измерения', 'measuring')
    ]);
}
