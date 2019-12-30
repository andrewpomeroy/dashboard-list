import React from 'react';
import { Global, css } from '@emotion/core'
import styled from '@emotion/styled/macro'
import ReactTable from './react-table'

const globalStyles = css`
  * {
    box-sizing: border-box;
  }
  html, body {
    height: 100vh;
    width: 100vw;
  }
  body {
    font-family: "Inter UI", "Fakt Pro", "Roboto", "Helvetica", sans-serif;
  }
  .u-fullStretch {
    width: 100%;
    height: 100%;
  }
`

const FullScreenLayout = styled.div`
  width: 100%;
  height: 100%;
  background: hsl(0,0%,97%);
`;

const FlexFullScreen = styled(FullScreenLayout)`
  display: flex;
  flex-direction: column;
`

function App () {
  return (
    <>
      <Global styles={globalStyles}></Global>
      <FlexFullScreen>
        <ReactTable></ReactTable>
      </FlexFullScreen>
    </>
  );
}

export default App;
