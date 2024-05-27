import { ReactView } from '@tuval/forms'
import React from 'react'
import { GridAddIcon, GridColDef, GridEventListener } from '@mui/x-data-grid'
import { Button } from '@mui/material'
import StyledDataGrid from './StyledDataGrid'
import styled from 'styled-components'

const ContentH6 = styled.h6`
  color: white;
  letter-spacing: 0;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  @media screen and (max-width: 1000px) {
    font-size: 0.8rem;
    font-weight: 500;
  }
`

const ContentUI = ({
  title,
  headerButton,
  headerViewTuval,
  headerViewReact,
  useDataGrid,
  useView,
}: {
  title: string

  headerViewTuval?: React.ReactNode

  headerViewReact?: React.ReactNode

  headerButton?: {
    headerOnClickEvent: React.MouseEventHandler<HTMLButtonElement>
    headerOnClickTitle: string
  }

  useDataGrid?: {
    columns: GridColDef[]
    rows: object[]
    rowOnDbClick?: GridEventListener<'rowDoubleClick'>
    searchTextField?: React.ReactNode
  }

  useView?: React.ReactNode
}) => {
  return ReactView(
    <div
      style={{
        width: '100%',
        position: 'sticky',
      }}
    >
      <div
        style={{
          width: '100%',
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          backgroundClip: 'border-box',
          borderRadius: '0.75rem',
          backgroundColor: 'white',
          color: 'rgb(97,97,97)',
          boxShadow:
            '0 0 #0000, 0 0 #0000, 0 0 #0000, 0 0 #0000, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        }}
      >
        <div
          style={{
            position: 'relative',
            backgroundClip: 'border-box',
            marginLeft: '1rem',
            marginRight: '1rem',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            backgroundImage: 'linear-gradient(to top right, #1e88e5, #42a5f5)',
            color: 'white',
            boxShadow:
              '0 0 #0000, 0 0 #0000, 0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgb(33 150 243 / .4), 0 4px 6px -4px rgb(33 150 243 / .4)',
            marginTop: '-1.5rem',
            marginBottom: '2rem',
            padding: '1.5rem',
            maxHeight: '74px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <ContentH6>
            {title}
            <div>{headerViewReact ? headerViewReact : headerViewTuval}</div>
          </ContentH6>
          {headerButton ? (
            <Button
              variant="text"
              color="inherit"
              size="small"
              startIcon={<GridAddIcon />}
              onClick={headerButton.headerOnClickEvent}
            >
              {headerButton.headerOnClickTitle}
            </Button>
          ) : (
            <div style={{ width: '5px' }}></div>
          )}
        </div>
        <div
          style={{
            paddingBottom: '0.5rem',
            paddingTop: '0',
            paddingLeft: '0',
            paddingRight: '0',
          }}
        >
          <div
            style={{
              padding: '0 1.4rem',
              height: 'calc(100vh - 185px)',
              width: '100%',
            }}
          >
            {useDataGrid ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  height: '100%',
                }}
              >
                {useDataGrid.searchTextField
                  ? useDataGrid.searchTextField
                  : null}
                <StyledDataGrid
                  rows={useDataGrid.rows}
                  columns={useDataGrid.columns}
                  isCellEditable={() => false}
                  rowSelection={false}
                  hideFooterSelectedRowCount
                  disableColumnSelector
                  disableRowSelectionOnClick
                  onRowDoubleClick={useDataGrid.rowOnDbClick}
                />
              </div>
            ) : (
              useView
            )}
          </div>
        </div>
      </div>
    </div>
  ).fontFamily('Roboto, sans-serif')
}

export default ContentUI