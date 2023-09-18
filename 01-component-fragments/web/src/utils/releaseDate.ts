import { ReleaseDate } from 'types/graphql'

export const yearOfRelease = (releaseDate: Pick<ReleaseDate, 'date'>) => {
  return releaseDate.date.replace(/^(\d{4}).*$/, '$1')
}
