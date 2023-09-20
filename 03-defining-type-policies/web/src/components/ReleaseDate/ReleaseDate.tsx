import { format, parse } from 'date-fns'
import {
  ReleaseDate as ReleaseDateType,
  ReleaseDatePrecision,
} from 'types/graphql'

interface ReleaseDateProps {
  releaseDate: ReleaseDateType
}

const ReleaseDate = ({ releaseDate }: ReleaseDateProps) => {
  return <>{formatDate(releaseDate)}</>
}

const formatDate = (releaseDate: ReleaseDateType) => {
  switch (releaseDate.precision) {
    case 'YEAR':
      return releaseDate.date
    case 'MONTH':
      return format(
        parse(releaseDate.date, 'yyyy-MM', new Date()),
        FORMATS[releaseDate.precision]
      )
    case 'DAY':
      return format(
        parse(releaseDate.date, 'yyyy-MM-dd', new Date()),
        FORMATS[releaseDate.precision]
      )
  }
}

const FORMATS: Record<ReleaseDatePrecision, string> = {
  DAY: 'MMM d, yyyy',
  MONTH: 'MMM yyyy',
  YEAR: 'yyyy',
}

export default ReleaseDate
