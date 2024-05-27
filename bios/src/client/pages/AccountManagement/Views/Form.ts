import styled from 'styled-components'

export const Tab = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  background: ${(props) => (props.active ? '#3BA2EE' : '')};
  color: ${(props) => (props.active ? 'white' : '')};
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: lightblue;
  }
`
