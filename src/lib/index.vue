<template>
    <div>
        <div class="param">
            <div class="param__form">
                <label for="param-watcher" class="param__title">Первый дежурный:</label>
                <select id="param-watcher" v-model="iFirstWatch">
                    <option
                            v-for="(sName, index) in arNames"
                            v-bind:value="index"
                            :selected="index === iFirstWatch">
                        {{sName}}
                    </option>
                </select>
            </div>
            <div class="param__form">
                <label for="param-year" class="param__title">Год:</label>
                <input id="param-year" type="number" v-model.number="iYear" :placeholder="{iYear}" min="2010" />
            </div>
            <div class="param__form">
                <label for="param-month" class="param__title">Месяц:</label>
                <input id="param-month" type="number" v-model.lazy.number="iMonth" :placeholder="{iMonth}" min="1" max="12">
            </div>
        </div>
        <div
                class="calendar"
                v-bind:style="{gridTemplateColumns : 'repeat('+(iCountDays+1)+', 1fr)'}"
        >
            <div class="calendar__col">
                <div class="calendar__row">
                    <div class="calendar__th">ФИО</div>
                </div>
                <div class="calendar__td calendar__name" v-for="sName in arNames">
                    {{sName}}
                </div>
            </div>
            <div class="calendar__col" v-for="obDate in arDates">
                <div class="calendar__th">{{arWeekDays[obDate.getDay()]}}&nbsp;{{obDate.getDate()}}</div>
                <div
                        class="calendar__td calendar__date"
                        v-bind:class="{
                        current : obDate.toDateString() === new Date().toDateString(),
                        weekend : obDate.getDay() === 0 || obDate.getDay() === 6,
                        select : getWatcher(obDate)  === sName,
                    }"
                        v-for="sName in arNames"
                >
                    &nbsp;
                </div>
            </div>

        </div>
    </div>
</template>
<script>
    'use strict';
    /**
     * Class for generation of calendar.
     * @param patterns
     * @param options
     * @constructor
     */
    export default {
        name: 'Calendar',
        props: {
            arNames: Array,
        },
        data() {
            return {
                arWeekDays: [
                    'Вс',
                    'Пн',
                    'Вт',
                    'Ср',
                    'Чт',
                    'Пт',
                    'Сб',
                ],
                iYear: 0,
                iMonth: 0,
                iFirstWatch: 0,
                iCountDays: 31,
                arDates: []
            }
        },
        mounted() {
            this.arDates = this.getDaysInMonth();
            this.arNames.sort();
            this.iMonth = new Date().getMonth() + 1;
            this.iYear = new Date().getFullYear();
        },
        methods: {
            /**
             * Добавляет количество дней к текущей дате.
             * @param obCurrentDate
             * @param iDays
             * @returns {Date}
             */
            addDays: function (obCurrentDate, iDays) {
                obCurrentDate.setDate(obCurrentDate.getDate() + iDays);
                return obCurrentDate;
            },

            /**
             * Возвращает массив дней в выбранном месяце.
             * {@internal В Date отсутствует такой метод, совместим с Safari}}
             * @returns {number}
             */
            getDaysInMonth() {
                /**
                 * Количество дней в месяце.
                 * @type {number}
                 */
                this.iCountDays = 33 - new Date(this.iYear, this.iMonth - 1, 33).getDate();
                /**
                 * Массив дат в месяце.
                 */
                let arDates = [];
                let obCurrentDate = new Date(this.iYear, this.iMonth - 1, 1);
                const obLastDate = new Date(this.iYear, this.iMonth - 1, this.iCountDays);

                // Заполняем массив датами.
                while (obCurrentDate <= obLastDate) {
                    arDates.push(new Date(obCurrentDate));
                    obCurrentDate = this.addDays(obCurrentDate, 1);
                }

                return arDates;
            },

            /**
             * Дежурный в указанный день.
             */
            getWatcher(obDate) {
                return this.arWatches[obDate.toLocaleString()];
            }
        },

        computed: {
            /**
             * Массив с дежурными.
             */
            arWatches() {
                const arDates = this.arDates;
                const arNames = this.arNames;
                let arWatches = {};

                let iNameKey = this.iFirstWatch;

                // Наполняем массив дежурных, ключ - дата, значение - имя
                arDates.forEach(function (obDate) {
                    // Пропускаем выходные.
                    if (obDate.getDay() === 0 || obDate.getDay() === 6) {
                        return
                    }
                    arWatches[obDate.toLocaleString()] = arNames[iNameKey];
                    iNameKey = arNames.length - 1 > iNameKey ? iNameKey + 1 : 0;
                });
                return arWatches;
            }
        },

        watch: {
            iYear: function () {
                this.arDates = this.getDaysInMonth();
            },
            iMonth: function () {
                this.arDates = this.getDaysInMonth();
            }
        }
    };
</script>

