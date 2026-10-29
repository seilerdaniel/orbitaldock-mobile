import { WeekDay } from '@/src/types';

const BY_JS_DAY: WeekDay[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/** Local weekday key (Lun..Dom) for the given date; never derived from UTC. */
export const toWeekDay = (date: Date = new Date()): WeekDay => BY_JS_DAY[date.getDay()];

export const todayWeekDay = (): WeekDay => toWeekDay(new Date());
