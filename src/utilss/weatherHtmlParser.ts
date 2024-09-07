import puppeteer from 'puppeteer';
import { Context } from 'telegraf';

const parseString = (str: string) => {
    return str
        .split('')
        .filter((el) => el != '\n' && el != '\t')
        .join('');
};

export const getWeather = async (ctx: Context, town: string) => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null
    });
    const page = await browser.newPage();

    await page.exposeFunction('parseString', parseString);

    await page.goto(`https://pogoda.mail.ru/prognoz/${town}/`, {
        waitUntil: 'networkidle2'
    });

    await page.setViewport({ width: 1920, height: 1080 });

    const data = await page.evaluate(async () => {
        const returnedObject = {
            today: {
                about: '',
                now: {
                    temp: ''
                },
                periods: []
            },
            after: []
        };

        const about = document.querySelector(
            'div.information__header__left__date'
        );
        const nowTemp = document.querySelector(
            'div.information__content__temperature'
        );

        const nowPeriods = document.querySelectorAll(
            'div.information__content__period'
        );

        const afterPeriods = document.querySelectorAll('a.day__link');

        returnedObject.today.about = await parseString(about.textContent);
        returnedObject.today.now.temp = await parseString(nowTemp.textContent);

        for (let i = 0; i < nowPeriods.length; i++) {
            const arr = [];
            for (let j = 0; j <= 2; j++) {
                if (j === 1)
                    arr.push(nowPeriods[i].children[j].getAttribute('title'));
                else arr.push(nowPeriods[i].children[j].textContent);
            }
            returnedObject.today.periods.push(arr.join(' '));
        }

        for (let i = 0; i < afterPeriods.length; i++) {
            const obj = {
                dayByPeriod: afterPeriods[i].children[0].textContent,
                state: afterPeriods[i].children[3].getAttribute('title'),
                day: afterPeriods[i].children[2].textContent
                    .split('')
                    .splice(0, 4)
                    .join(''),
                night: afterPeriods[i].children[2].children[0].textContent
            };

            returnedObject.after.push(obj);
        }

        return returnedObject;
    });
    await browser.close();
    await ctx.replyWithHTML(
        `<b>Текущий день:</b>\n\n` +
            `${data.today.about}\n` +
            `<b>температура сейчас:  </b>` +
            `${data.today.now.temp}\n` +
            `${data.today.periods[0]}\n` +
            `${data.today.periods[1]}\n\n`
    );
    await ctx.replyWithHTML(
        `<b>Последующие дни:</b>\n\n` +
            `${data.after
                .map(
                    (el) =>
                        `<b>${el.dayByPeriod}:  </b>${el.state}\n` +
                        `<b>Температура днем:  </b>${el.day}\n` +
                        `<b>Температура ночью:  </b>${el.night}\n\n`
                )
                .join('')}`
    );
};
