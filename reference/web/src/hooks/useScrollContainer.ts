import { useContext } from 'react'

import ScrollableListContext from 'src/components/ScrollableListContext'

const useScrollContainer = () => useContext(ScrollableListContext).current

export default useScrollContainer
