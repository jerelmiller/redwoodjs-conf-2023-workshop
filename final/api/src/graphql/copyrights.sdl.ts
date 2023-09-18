export const schema = gql`
  type Copyright {
    """
    The copyright text for this content.
    """
    text: String!

    """
    The type of copyright: \`C\` = the copyright, \`P\` = the sound recording
    (performance) copyright.
    """
    type: CopyrightType
  }

  enum CopyrightType {
    """
    The copyright
    """
    C

    """
    The sound recording (performance) copyright.
    """
    P
  }
`
