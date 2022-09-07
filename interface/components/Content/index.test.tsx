import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Content } from '.'

jest.mock('../../hooks/Contents')

describe('test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    render(<Content />)
  })
  it('text check', () => {
    expect(screen.queryByTestId('text')).toHaveTextContent('welcome to web3 template')
  })
  it('item check', () => {
    expect(screen.queryByTestId('item-0')).toHaveTextContent('Hello')
    expect(screen.queryByTestId('item-1')).toHaveTextContent('World')
    expect(screen.queryByTestId('item-2')).toHaveTextContent('This')
    expect(screen.queryByTestId('item-3')).toHaveTextContent('Is')
    expect(screen.queryByTestId('item-4')).toHaveTextContent('Mock')
  })
})
