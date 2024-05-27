import styled from 'styled-components'
import bgImage from '../../../assets/Values/BackgroundImage'

const WrapError = styled.div`
  background-color: #667bf2;
  background: ${bgImage};
  background-attachment: fixed;
  background-size: cover;
  height: 100vh;
  width: 100vw;
`

const CenteredContent = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`

const ContentContainer = styled.div`
  width: 100%;
  text-align: center;
`

const ErrorButton = styled.button`
  background-color: #343a40; /* btn-dark color */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #23272b; /* darkened version of btn-dark color */
  }
`

export { WrapError, CenteredContent, ContentContainer, ErrorButton }
