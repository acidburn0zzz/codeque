import { search } from '/search'
import { compareCode } from '/astUtils';
import path from 'path'
import { getFilesList } from '/getFilesList'

const filesList = getFilesList(path.resolve(__dirname, '__fixtures__'))

describe('JSX', () => {
  it('Should find all imports including some keys with persisted order', () => {
    const query = `
      import {
        Button,
        IconButton
      } from 'react-native-paper'
    `
    const results = search({
      mode: 'include',
      filePaths: filesList,
      queries: [query],
    })

    expect(results.length).toBe(1)
  })

  it('Should not find any imports including some keys when order changed', () => {
    const query = `
      import {
        IconButton,
        Button,
      } from 'react-native-paper'
    `
    const results = search({
      mode: 'include-with-order',
      filePaths: filesList,
      queries: [query],
    })

    expect(results.length).toBe(0)
  })

  it('Should find all imports of library', () => {
    const query = `
      import $$ from 'react-native';
    `
    const results = search({
      mode: 'include',
      filePaths: filesList,
      queries: [query],
    })

    expect(results.length).toBe(41)
  })

  it('Should find all default imports of a dependency', () => {
    const query = `
      import $ from '../ScreenWrapper';
    `
    const results = search({
      mode: 'include',
      filePaths: filesList,
      queries: [query],
    })

    expect(results.length).toBe(33)
  })

  it('Should find all aliased imports of a dependency', () => {
    const query = `
      import { Provider as $ } from 'react-native-paper';
    `
    const results = search({
      mode: 'include',
      filePaths: filesList,
      queries: [query],
    })

    expect(results.length).toBe(2)
  })

})