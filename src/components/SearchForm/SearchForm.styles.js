import styled from 'styled-components'
import { ReactComponent as SearchSvgComponent } from '../../media/search.svg'

export const Form = styled.form`
  display: flex;
`

export const H2 = styled.h2`
  margin-left: 3.8rem;
  line-height: 1;
`

export const Input = styled.input`
  font-family: UniversCondensed;
  font-size: 1.6rem;
  height: 2.5rem;
  outline: none;
  border: none;
  border-bottom: 1px solid white;
  background-color: black;
  margin-right: 3.8rem;
  flex: 1;
  transition: opacity 0.1s ease-in-out;

  &:disabled {
    opacity: 0.3;
  }
`

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3.8rem;
  outline: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.1s ease-in-out;
  background-color: black;

  &:hover {
    opacity: 0.75;
  }

  &:disabled {
    opacity: 0.3;
  }
`

export const SearchIcon = styled(SearchSvgComponent)`
  width: 2.5rem;
  height: 2.5rem;
  & path {
    fill: white;
  }
`
