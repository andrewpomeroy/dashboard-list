import React from 'react';
import styled from '@emotion/styled'
import TableTest from './TableTest';
// import ScrollSync, { ScrollSyncPane } from 'react-scroll-sync';


const FullScreenLayout = styled.div`
  width: 100vw;
  height: 100vh;
  background: hsl(0,0%,97%);
`;

const SplitH = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow: hidden;
  padding-left: 5px;
  padding-right: 5px;
  > * {
    padding-left: 5px;
    padding-right: 5px;
  }
`

const HeaderAndTableFixedWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`

const Header = styled.div`
  flex: 0 0 auto;
`

const TableScrollWrap = styled.div`
  flex: 1;
  overflow: auto;
`

const ScrollY = styled.div`
  overflow: auto;
`

function App() {
  return (
    <FullScreenLayout>
      <SplitH>
        <HeaderAndTableFixedWrap>
          <Header><h1>Fixed Pre-Header Area</h1></Header>
          <TableScrollWrap>
            <TableTest />
          </TableScrollWrap>
        </HeaderAndTableFixedWrap>
        <ScrollY>
          <Header><h1>Scrollable Pre-Header Area</h1></Header>
          <TableTest />
        </ScrollY>
      </SplitH>
    </FullScreenLayout>
    


  );
}

export default App;
