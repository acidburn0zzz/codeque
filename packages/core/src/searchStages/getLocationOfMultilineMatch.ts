import { PoorNodeType, Match, SearchSettingsWithOptionalLogger } from '../types'
import { traverseAndMatch } from './traverseAndMatch'

export const getLocationOfMultilineMatch = (
  match: Match,
  queryNode: PoorNodeType,
  searchSettings: SearchSettingsWithOptionalLogger,
  traverseAndMatchFn: typeof traverseAndMatch,
) => {
  const { blockNodeBodyKey } =
    searchSettings.parserSettings.programNodeAndBlockNodeUtils

  const statements = queryNode[blockNodeBodyKey] as PoorNodeType[]

  const alreadyPickedStatementNodes: PoorNodeType[] = []

  const subMatches = statements
    .map((statement) => {
      // we take only first match, as given statement node might be present several times in query
      // But only first occurrence matched during previous search phase
      // Also there might be the same node in query repeated several times, so we have to flag which statements have been already picked
      const subMatchedStatements = traverseAndMatchFn(
        match.node,
        statement,
        searchSettings,
      )

      const notYetPickedStatementMatches = subMatchedStatements.filter(
        (subMatch) => !alreadyPickedStatementNodes.includes(subMatch.node),
      )
      const statementMatchToPick = notYetPickedStatementMatches[0]

      alreadyPickedStatementNodes.push(statementMatchToPick.node)

      return statementMatchToPick
    })
    .sort((matchA, matchB) => matchA.start - matchB.end)

  const firstSubMatch = subMatches[0]
  const lastSubMatch = subMatches[subMatches.length - 1]

  return {
    start: firstSubMatch.start,
    end: lastSubMatch.end,
    loc: {
      start: firstSubMatch.loc.start,
      end: lastSubMatch.loc.end,
    },
  } as Match
}
