export const schema = gql`
  type PageInfo {
    "Whether there is a next page of items."
    hasNextPage: Boolean!

    "Whether there is a previous page of items."
    hasPreviousPage: Boolean!

    """
    The maximum number of items in the response (as set in the query or default)
    """
    limit: Int!

    "The offset of the items returned (as set in the query or default)"
    offset: Int!

    "The total number of items returned for the page."
    total: Int!
  }
`
