import { search } from '/search'
import { compareCode } from '/astUtils'
import path from 'path'
import { getFilesList } from '/getFilesList'

describe('JSX', () => {
  let filesList = [] as string[]

  beforeAll(async () => {
    filesList = await getFilesList(path.resolve(__dirname, '__fixtures__'))
  })

  it('Should find all imports including some keys with persisted order', () => {
    const query = `
      import {
        Button,
        IconButton
      } from 'react-native-paper'
    `
    const { matches } = search({
      mode: 'include',
      filePaths: filesList,
      queryCodes: [query]
    })

    expect(matches.length).toBe(1)
  })

  it('Should not find any imports including some keys when order changed', () => {
    const query = `
      import {
        IconButton,
        Button,
      } from 'react-native-paper'
    `
    const { matches } = search({
      mode: 'include-with-order',
      filePaths: filesList,
      queryCodes: [query]
    })

    expect(matches.length).toBe(0)
  })

  it('Should find all imports of library', () => {
    const query = `
      import $$$ from 'react-native';
    `
    const { matches } = search({
      mode: 'include',
      filePaths: filesList,
      queryCodes: [query]
    })

    expect(matches.length).toBe(41)
  })

  it('Should find all default imports of a dependency', () => {
    const query = `
      import $$ from '../ScreenWrapper';
    `
    const { matches } = search({
      mode: 'include',
      filePaths: filesList,
      queryCodes: [query]
    })

    expect(matches.length).toBe(33)
  })

  it('Should find all default imports with case insensitive query', () => {
    const query = `
      import $$screenwrapper from '../screenwrapper';
    `
    const { matches } = search({
      mode: 'include',
      filePaths: filesList,
      caseInsensitive: true,
      queryCodes: [query]
    })

    expect(matches.length).toBe(33)
  })

  it('Should find all aliased imports of a dependency', () => {
    const query = `
      import { Provider as $$ } from 'react-native-paper';
    `
    const { matches } = search({
      mode: 'include',
      filePaths: filesList,
      queryCodes: [query]
    })

    expect(matches.length).toBe(2)
  })

  it('Should find all imports with both default and named', () => {
    const query = `
      import $$, { $$$ } from '$$'; 
    `
    const { matches } = search({
      mode: 'include',
      filePaths: filesList,
      queryCodes: [query]
    })

    expect(matches.length).toBe(2)
  })

  it('Should find all aliased reexports ', () => {
    // TODO: fix - it matches "export {default} from " but it shouldn't
    const query = `
      export { $$ as $$$ } from '$$'; 
    `
    const { matches } = search({
      mode: 'include',
      filePaths: filesList,
      queryCodes: [query]
    })

    expect(matches.length).toBe(6)
  })
})
