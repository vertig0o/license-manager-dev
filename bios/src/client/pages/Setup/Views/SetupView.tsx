import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 20px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  width: 400px;
`

const HeaderLabel = styled.div`
  font-size: 25px;
  color: #3ba2ee;
  font-weight: 400;
`

const ConsoleView = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  padding: 10px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 200px;
  overflow-y: scroll;
`

const ConsoleText = styled.li`
  font-size: 12px;
  color: white;
  font-weight: 400;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  color: white;
  font-family: monospace;
  list-style: none;
  width: 100%;
`

export { Container, HeaderLabel, ConsoleView, ConsoleText }
