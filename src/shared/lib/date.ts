import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('ru')

/** Принимает unix-время в секундах, как отдаёт бэкенд. */
const fromUnix = (seconds: number) => dayjs.unix(seconds)

export const formatDeadline = (seconds: number) => fromUnix(seconds).format('D MMM, HH:mm')

export const formatFromNow = (seconds: number) => fromUnix(seconds).fromNow()

export const isSoon = (seconds: number, hours = 24) =>
  fromUnix(seconds).diff(dayjs(), 'hour', true) <= hours

export const formatDuration = (seconds: number) => {
  const minutes = Math.max(1, Math.round(seconds / 60))
  return `${minutes} мин`
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

export interface CalendarDay {
  key: string
  weekday: string
  day: string
  title: string
  isToday: boolean
  isWeekend: boolean
}

/** Ключ дня для группировки: unix-секунды превращаются в локальную дату. */
export const dayKey = (seconds: number) => fromUnix(seconds).format('YYYY-MM-DD')

/** Дата без времени из ISO-строки: «7 окт.». */
export const formatDate = (iso: string) => dayjs(iso).format('D MMM')

export const formatTime = (seconds: number) => fromUnix(seconds).format('HH:mm')

/** Последовательные дни, начиная с сегодняшнего. Нужны и ленте, и будущему календарю. */
export const buildDays = (count: number, offset = 0): CalendarDay[] =>
  Array.from({ length: count }, (_, index) => {
    const date = dayjs()
      .startOf('day')
      .add(offset + index, 'day')
    return {
      key: date.format('YYYY-MM-DD'),
      weekday: capitalize(date.format('dd')),
      day: date.format('DD'),
      title: capitalize(date.format('dddd, D MMMM')),
      isToday: offset + index === 0,
      isWeekend: [0, 6].includes(date.day()),
    }
  })
