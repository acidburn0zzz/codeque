import { NotNullParsedQuery, SearchSettings } from '../types'
import { measureStart } from '../utils'

type ShallowSearchArgs = Pick<SearchSettings, 'logger' | 'caseInsensitive'> & {
  queries: NotNullParsedQuery[]
  fileContent: string
}

export const shallowSearch = ({
  queries,
  fileContent,
  ...settings
}: ShallowSearchArgs): boolean => {
  const {
    logger: { log },
    caseInsensitive,
  } = settings
  const measureShallowSearch = measureStart('shallowSearch')

  const fileContentForTokensLookup = caseInsensitive
    ? fileContent.toLocaleLowerCase()
    : fileContent

  const includesUniqueTokens = queries.some(({ uniqueTokens }) =>
    uniqueTokens.every((token) => fileContentForTokensLookup.includes(token)),
  )

  log(
    'Shallow search uniqueTokens',
    queries.map(({ uniqueTokens }) => uniqueTokens).flat(1),
  )

  measureShallowSearch()

  return includesUniqueTokens
}
