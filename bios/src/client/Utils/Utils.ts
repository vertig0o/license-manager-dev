export namespace Utils {
  // https://github.com/mgulener/turkiye-regex-kaliplari

  export const EmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  export const PhoneNumberRegex =
    /^(05)([0-9]{2})\s?([0-9]{3})\s?([0-9]{2})\s?([0-9]{2})$/

  export const TCKNORegex = /^[1-9]{1}[0-9]{9}[02468]{1}$/

  export function DateDifference({ date }: { date: string }): string {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month?.length < 2) month = '0' + month
    if (day?.length < 2) day = '0' + day
    const old = new Date([year, month, day].join('-'))

    const now = new Date()
    const diff = now.getTime() - old.getTime()

    const diffInDays = Math.floor(diff / (1000 * 3600 * 24))
    const diffInMonths = Math.floor(diffInDays / 30.44)
    const diffInYears = Math.floor(diffInMonths / 12)

    const remainingMonths = diffInMonths % 12
    const remainingDays = Math.ceil(diffInDays % 30.44)
    return `${diffInYears} yıl, ${remainingMonths} ay, ${remainingDays} gün`
  }

  export function FormattedDate({ inputDate }: { inputDate: Date }): string {
    let date, month, year

    date = inputDate.getDate()
    month = inputDate.getMonth() + 1
    year = inputDate.getFullYear()

    date = date.toString().padStart(2, '0')

    month = month.toString().padStart(2, '0')

    return `${date}/${month}/${year}`
  }
}
