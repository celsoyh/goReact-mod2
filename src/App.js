import React, { Fragment } from 'react';
import styled from 'styled-components';
import GlobalStyle from './styles/global';

const Title = styled.h1`
  color: red;
  font-size: 32px;
`;

const App = () => (
  <div className="App">
    <Title>Olá!</Title>
  </div>
);

export default App;
