import { Button, Flex, Text, Spinner } from '@chakra-ui/react'
import { Mode, SearchResults } from '@codeque/core'
import { darkTheme, lightTheme } from '../../components/codeHighlightThemes'
import { useThemeType } from '../../components/useThemeType'
import { SearchResult } from './SearchResult'
import { TextModeNoResults } from './TextModeNoResults'
import { StructuralModeNoResults } from './StructuralModeNoResults'

type SearchResultsListProps = {
  matches: SearchResults['matches']
  getRelativePath: (filePath: string) => string | undefined
  displayLimit: number
  extendDisplayLimit: () => void
  showAllResults: () => void
  removeMatch: (filePath: string, start: number, end: number) => void
  isLoading: boolean
  searchMode: Mode | null
}

export function SearchResultsList({
  matches,
  getRelativePath,
  displayLimit,
  showAllResults,
  extendDisplayLimit,
  removeMatch,
  isLoading,
  searchMode,
}: SearchResultsListProps) {
  const themeType = useThemeType()
  const highlightTheme = themeType === 'dark' ? darkTheme : lightTheme

  if (matches.length === 0) {
    return (
      <Flex width="100%" height="100%" justifyContent="center" overflowY="auto">
        {isLoading ? (
          <Spinner margin="auto" />
        ) : searchMode === 'text' ? (
          <TextModeNoResults />
        ) : (
          <StructuralModeNoResults />
        )}
      </Flex>
    )
  }

  return (
    <Flex flexDir="column" mt="5" overflowY={'auto'}>
      {matches.slice(0, displayLimit).map((match) => {
        const key = `${match.filePath}-${match.start}-${match.end}`

        return (
          <SearchResult
            key={key}
            match={match}
            getRelativePath={getRelativePath}
            removeMatch={removeMatch}
          />
        )
      })}
      {matches.length > displayLimit ? (
        <Flex justifyContent="center" ml="5" mr="5" mb="5">
          <Button onClick={extendDisplayLimit} colorScheme="blue">
            Show more
          </Button>
          <Button ml="5" onClick={showAllResults} colorScheme="blue">
            Show all ({matches.length})
          </Button>
        </Flex>
      ) : null}
      {isLoading ? (
        <Flex justifyContent="center" mt="5" mb="5">
          <Spinner margin="auto" />
        </Flex>
      ) : null}
    </Flex>
  )
}
