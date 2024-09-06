import { Markup } from 'telegraf';

export function actionButtons() {
    return Markup.keyboard([
        Markup.button.callback('Выбор города', 'city'),
        Markup.button.callback('Прогноз на 5 дней', 'weather'),
        Markup.button.callback('Выбор единиц измерения', 'measuring')
    ]);
}
