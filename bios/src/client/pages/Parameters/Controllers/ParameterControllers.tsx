import {
  cTop,
  cTopLeading,
  HStack,
  ReactView,
  Spacer,
  Spinner,
  Text,
  Toggle,
  UIFormController,
  UINavigate,
  UIViewBuilder,
  useNavigate,
  useState,
  VStack,
} from '@tuval/forms'


import React from 'react'

import {  Button, Switch, TextField } from '@mui/material'

import { useGetMe } from '@realmocean/sdk'

export class ParameterControllers extends UIFormController {
  public LoadView() {
    const { me, isLoading: isLoad } = useGetMe('console')
    const navigate = useNavigate()

    return isLoad
      ? VStack(Spinner())
      : me == null
      ? UINavigate('/login')
      : UIViewBuilder(() => {
          const [theme, setTheme] = useState(
            JSON.parse(localStorage.getItem('pedavalans_theme'))
          )

          const updateParameterProperty = null as any

          return HStack({ alignment: cTopLeading })(
            VStack({ alignment: cTop })(
              HStack({ spacing: 20 })(
                Text('Parametreler').fontSize(19),
                Spacer(),
                ReactView(<Button variant="contained">Kaydet</Button>)
              )
                .shadow('rgb(0 0 0 / 5%) 0px 4px 2px -2px')
                .height(50)
                .marginBottom(20),
              VStack({ alignment: cTopLeading })(
                ReactView(
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderBottom: '0.5px solid lightgray',
                        alignItems: 'center',
                        padding: '10px',
                      }}
                    >
                      <div style={{ fontSize: '14px', fontWeight: 400 }}>
                        {
                          'Eğitmenlere program atamaları ile ilgili mail atansın mı?  '
                        }
                      </div>
                      <div
                        style={{
                          width: '100px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Switch color="primary" checked={true} />
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        borderBottom: '0.5px solid lightgray',
                        alignItems: 'center',
                        padding: '10px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 400,
                          marginRight: '10px',
                        }}
                      >
                        {'Biten Beceriler için başarı kriteri'}
                      </div>
                      <div
                        style={{
                          width: '100px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: '10px',
                        }}
                      >
                        <TextField size="small" variant="standard" />
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 400,
                          marginRight: '10px',
                        }}
                      >
                        {'Seans ve'}
                      </div>
                      <div
                        style={{
                          width: '100px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: '10px',
                        }}
                      >
                        <TextField size="small" variant="standard" />
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 400 }}>
                        {'Puan'}
                      </div>
                    </div>
                  </div>
                )
              )
            )
              .padding(40)
              .background(theme ? 'rgba(0,0,0,.85)' : '')
              .foregroundColor(theme ? 'white' : '')
          )
        })
  }
}
