export const schema = gql`
  type ReleaseDate {
    """
    The date the item was first released, for example \`1981-12-15\`. Depending on
    the precision, it might be shown as \`1981-12\`, or \`1981-12-15\`.
    """
    date: String!

    """
    The precision with which the \`date\` value is known.
    """
    precision: ReleaseDatePrecision!
  }

  enum ReleaseDatePrecision {
    YEAR
    MONTH
    DAY
  }
`
