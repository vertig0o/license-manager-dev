import {
  HStack,
  ReactView,
  Spinner,
  Text,
  UIContextMenu,
  UIController,
  UIView,
  VStack,
  State,
  cLeading,
  cTop,
  useNavigate,
  UIViewBuilder,
  nanoid,
} from '@tuval/forms'
import React, { Fragment, useEffect, useState } from 'react'

import ContentUI from '../../../components/ContentUI'
import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
} from '@mui/material'
import {
  Services,
  setUpProject,
  useCreateAccount,
  useGetMe,
  useListAccounts,
  useUpdateDocument,
} from '@realmocean/sdk'
import IAccount from '../../../../interfaces/IAccount'
import { Toast } from '../../../components/Toast'
import { Tab } from '../Views/Form'
import { BsFillPersonFill } from 'react-icons/bs'
import { TbBuildingCommunity } from 'react-icons/tb'
import { IoPersonAddOutline } from 'react-icons/io5'
import AppInfo from '../../../../AppInfo'
import Collections from '../../../../server/core/Collections'
import IAccountRelation from '../../../../interfaces/IAccountRelation'
import StyledDataGrid from '../../../components/StyledDataGrid'
import AccountRelation from '../../../../server/hooks/accountRelation/Main'
import removeDollarProperties from '../../../assets/Functions/removeDollarProperties'

export class AccountManagementPage extends UIController {
  public LoadView(): UIView {
    const { me, isLoading } = useGetMe('console')
    const { accounts, isLoading: isLoadingAccounts } = useListAccounts()
    const { listAccountRelation, isLoadingAccountRelationList } =
      AccountRelation.List()

    const { updateAccountRelation } = AccountRelation.Update()

    const [passwordChange, setPasswordChange] =
      useState<IAccount.IPasswordChange>({
        password: '',
        newPassword: '',
        newPasswordConfirm: '',
      })

    const [isRegexError, setIsRegexError] = useState(false)

    const [selectedTab, setSelectedTab] = useState(0)
    const [phone, setPhone] = useState<string>('')

    const resetAccountRelation: IAccountRelation.IBase = {
      // id: '',
      account_id: '',
      is_active: true,
      is_deleted: false,
      tenant_id: '',
      role: '',
    }

    const [createAccountForm, setCreateAccount] = useState({
      email: '',
      username: '',
      password: '',
      passwordConfirm: '',
      role: '',
    })

    const resetMe = {
      $createdAt: '',
      $id: '',
      $updatedAt: '',
      accessedAt: '',
      email: '',
      emailVerification: false,
      labels: [],
      name: '',
      passwordUpdate: '',
      phone: '+',
      phoneVerification: false,
      prefs: { organization: '' },
      registration: '',
      status: false,
    }

    const [accountRelation, setAccountRelation] =
      useState<IAccountRelation.IBase>(resetAccountRelation)

    const handleChangePassword = () => {
      if (passwordChange.newPassword !== passwordChange.newPasswordConfirm) {
        Toast.fire({
          icon: 'error',
          title: 'Yeni şifreler uyuşmuyor',
        })
        return
      }
      setUpProject('console', undefined)
      Services.Accounts.updatePassword(
        passwordChange.newPassword,
        passwordChange.password
      )
        .then(() => {
          Toast.fire({
            icon: 'success',
            title: 'Şifre değiştirildi',
          })
          setPasswordChange({
            password: '',
            newPassword: '',
            newPasswordConfirm: '',
          })
        })
        .catch((e) => {
          Toast.fire({
            icon: 'error',
            text: JSON.stringify(e),
          })
        })
    }

    const [accountType, setAccountType] = React.useState('')

    const handleChange = (event: SelectChangeEvent) => {
      setAccountType(event.target.value as string)
    }

    const {
      createAccount,
      isSuccess: isCreateAccountSuccess,
      isError: isCreateAccountError,
      error: createAccountError,
    } = useCreateAccount('console')

    const { createAccountRelation } = AccountRelation.Create()

    const handleCreateAccount = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (createAccountForm.password !== createAccountForm.passwordConfirm) {
        Toast.fire({
          icon: 'error',
          title: 'Şifreler uyuşmuyor',
        })
        return
      }
      if (
        createAccountForm.password.length < 8 ||
        !/[A-Z]/.test(createAccountForm.password) ||
        !/[a-z]/.test(createAccountForm.password) ||
        !/[!@#$%^&*.]/.test(createAccountForm.password)
      ) {
        Toast.fire({
          icon: 'error',
          title:
            'Şifre en az 8 karakter olmalı, büyük harf, küçük harf ve özel karakter içermelidir!',
        })
        return
      }
      createAccount(
        {
          name: createAccountForm.username,
          email: createAccountForm.email,
          password: createAccountForm.password,
          organizationId: me?.prefs?.organization,
        },
        (data) => {
          const docId: string = nanoid()
          createAccountRelation(
            {
              documentId: docId,
              data: {
                // id: docId,
                tenant_id: me?.prefs?.organization,
                account_id: data.$id,
                role: accountType,
                // is_admin: false,
              },
            },
            () => {
              Toast.fire({
                icon: 'success',
                title: 'Kullanıcı oluşturuldu',
              })
              setCreateAccount({
                email: '',
                username: '',
                password: '',
                passwordConfirm: '',
                role: '',
              })
              console.log(accounts)
            }
          )
        }
      )
      if (isCreateAccountError) {
        Toast.fire({
          icon: 'error',
          title: createAccountError?.message,
        })
      }
      setTimeout(() => {
        setSelectedTab(1)
      }, 1000)
    }

    //edit
    const updateSelectedAccountRelation = (e) => {
      e.preventDefault()
    }
    const [selectedAccount, setSelectedAccount] = useState<IAccount.IBase>()
    const [selectedAccountRelation, setSelectedAccountRelation] =
      useState<IAccountRelation.IBase>(resetAccountRelation)
    const setEditAccount = (account: IAccount.IBase) => {
      console.log(account, 'accounts')
      setSelectedAccount(account)
      setSelectedAccountRelation(
        listAccountRelation.find((x) => x.account_id === account.$id) as any
      )
      setSelectedTab(3)
    }

    return isLoading || isLoadingAccounts || isLoadingAccountRelationList
      ? VStack(Spinner())
      : UIViewBuilder(() => {
          // useEffect(() => {
          //   Services.Databases.getDocument(
          //     AppInfo.Name,
          //     AppInfo.Database,
          //     Collections.AccountRelation,
          //     me?.$id
          //   ).then((result) => {
          //     setAccountRelation(result as any)
          //   })
          // })
          useEffect(() => {
            Services.Databases.getDocument(
              AppInfo.Name,
              AppInfo.Database,
              Collections.AccountRelation,
              me?.$id
            ).then((result) => {
              setAccountRelation(result as any)
            })
            console.log(accounts)
            console.log(me, 'me')
          }, [])

          return VStack({ alignment: cTop })(
            ContentUI({
              title: 'Hesap Yönetimi',
              useView: (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                    }}
                  >
                    <Tab
                      active={selectedTab === 0}
                      onClick={() => setSelectedTab(0)}
                    >
                      <BsFillPersonFill />
                      <div>Hesabım</div>
                    </Tab>
                    {accountRelation.role === 'admin' && (
                      <Tab
                        active={selectedTab === 1}
                        onClick={() => setSelectedTab(1)}
                      >
                        <TbBuildingCommunity />
                        <div>Organizasyon Kullanıcı Listesi</div>
                      </Tab>
                    )}
                    {accountRelation.role === 'admin' && (
                      <Tab
                        active={selectedTab === 2}
                        onClick={() => setSelectedTab(2)}
                      >
                        <IoPersonAddOutline />
                        <div>Yeni Kullanıcı</div>
                      </Tab>
                    )}
                  </div>
                  {selectedTab === 0 && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                      }}
                    >
                      <div
                        style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '5px',
                          padding: '20px',
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          background: 'rgb(250 250 250)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: '1px solid #e0e0e0',
                            paddingBottom: '10px',
                            fontSize: '16px',
                          }}
                        >
                          Profil Detayları
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            marginTop: '10px',
                          }}
                        >
                          <TextField
                            label="E-posta"
                            value={me?.email}
                            size="small"
                          />
                          <TextField
                            size="small"
                            label="Adı Soyadı"
                            value={me?.name}
                          />
                          <TextField
                            size="small"
                            label="Telefon"
                            value={me?.phone}
                            onChange={(e) => {
                              let enteredValue = e.target.value
                              // Eğer boşsa, varsayılan olarak + karakterini ekle
                              if (!enteredValue.startsWith('+')) {
                                enteredValue = '+' + enteredValue
                              }
                              // Max 15 basamaklı olmalı ve + ile başlamalı
                              if (/^\+?\d{0,15}$/.test(enteredValue)) {
                                setPhone(enteredValue)
                              }
                            }}
                          />
                          {/* <TextField
                                      size="small"
                                      label="Ad"
                                      value={accountRelation.first_name}
                                      onChange={(e) => setAccountRelation({ ...accountRelation, first_name: e.target.value })}
                                  />
                                  <TextField
                                      size="small"
                                      label="Soyad"
                                      value={accountRelation.last_name}
                                      onChange={(e) => setAccountRelation({ ...accountRelation, last_name: e.target.value })}
                                  /> */}
                          {accountRelation.role === 'admin' && (
                            <FormControlLabel
                              sx={{ alignContent: 'end' }}
                              control={
                                <Switch checked={accountRelation.is_active} />
                              }
                              label="Hesap aktif mi?"
                            />
                          )}
                          <Button variant="contained">Kaydet</Button>
                        </div>
                      </div>
                      <div
                        style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '5px',
                          padding: '20px',
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          background: 'rgb(250 250 250)',
                          height: 'fit-content',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: '1px solid #e0e0e0',
                            paddingBottom: '10px',
                            fontSize: '16px',
                          }}
                        >
                          Şifre Yönetimi
                        </div>
                        <form
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            marginTop: '10px',
                          }}
                        >
                          <TextField
                            size="small"
                            placeholder="Eski Şifre"
                            type="password"
                            value={passwordChange.password}
                            onChange={(e) =>
                              setPasswordChange({
                                ...passwordChange,
                                password: e.target.value,
                              })
                            }
                          />
                          <TextField
                            size="small"
                            placeholder="Yeni Şifre"
                            type="password"
                            value={passwordChange.newPassword}
                            onChange={(e) => {
                              if (
                                e.target.value.length < 8 ||
                                !/[A-Z]/.test(e.target.value) ||
                                !/[a-z]/.test(e.target.value) ||
                                !/[!@#$%^&?*.]/.test(e.target.value)
                              ) {
                                setIsRegexError(true)
                              } else {
                                setIsRegexError(false)
                              }
                              setPasswordChange({
                                ...passwordChange,
                                newPassword: e.target.value,
                              })
                            }}
                            error={isRegexError}
                            helperText={
                              isRegexError
                                ? 'Şifreniz en az 8 karakter olmalı, büyük harf, küçük harf ve özel karakter içermelidir'
                                : ''
                            }
                          />
                          <TextField
                            size="small"
                            placeholder="Yeni Şifre Tekrar"
                            type="password"
                            value={passwordChange.newPasswordConfirm}
                            onChange={(e) =>
                              setPasswordChange({
                                ...passwordChange,
                                newPasswordConfirm: e.target.value,
                              })
                            }
                          />
                          <Button
                            variant="contained"
                            onClick={handleChangePassword}
                            disabled={isRegexError}
                          >
                            Şifreyi Değiştir
                          </Button>
                        </form>
                      </div>
                    </div>
                  )}
                  {selectedTab === 1 && (
                    <div
                      style={{
                        height: 'calc(100vh - 150px)',
                        width: 'calc(100vw - 310px)',
                      }}
                    >
                      <StyledDataGrid
                        sx={{
                          height: '550px',
                        }}
                        columns={[
                          { field: '$id', headerName: 'ID', width: 100 },
                          { field: 'email', headerName: 'E-posta', flex: 1 },
                          { field: 'name', headerName: 'Adı Soyadı', flex: 1 },
                          {
                            field: 'value',
                            headerName: 'İşlemler',
                            width: 150,
                            renderCell: (params: any) => (
                              <Button
                                variant="text"
                                onClick={() => setEditAccount(params.row)}
                              >
                                Düzenle
                              </Button>
                            ),
                          },
                        ]}
                        rows={accounts}
                        getRowId={(row) => row.$id}
                      />
                    </div>
                  )}
                  {selectedTab === 2 && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                      }}
                    >
                      <form
                        onSubmit={handleCreateAccount}
                        style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '5px',
                          padding: '20px',
                          width: '50%',
                          display: 'flex',
                          flexDirection: 'column',
                          background: 'rgb(250 250 250)',
                          gap: '10px',
                        }}
                      >
                        <TextField
                          size="small"
                          label="E-posta"
                          value={createAccountForm.email}
                          onChange={(e) =>
                            setCreateAccount({
                              ...createAccountForm,
                              email: e.target.value,
                            })
                          }
                          fullWidth
                          required
                        />
                        <TextField
                          size="small"
                          label="Adı Soyadı"
                          value={createAccountForm.username}
                          onChange={(e) =>
                            setCreateAccount({
                              ...createAccountForm,
                              username: e.target.value,
                            })
                          }
                          fullWidth
                          required
                        />
                        <TextField
                          size="small"
                          label="Şifre"
                          value={createAccountForm.password}
                          onChange={(e) =>
                            setCreateAccount({
                              ...createAccountForm,
                              password: e.target.value,
                            })
                          }
                          fullWidth
                          type="password"
                          required
                        />
                        <TextField
                          size="small"
                          label="Şifre Tekrar"
                          value={createAccountForm.passwordConfirm}
                          onChange={(e) =>
                            setCreateAccount({
                              ...createAccountForm,
                              passwordConfirm: e.target.value,
                            })
                          }
                          fullWidth
                          type="password"
                          required
                        />
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Hesap Türü
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={accountType}
                            label="Hesap Türü"
                            onChange={handleChange}
                          >
                            <MenuItem value={'undifend'}> </MenuItem>
                            <MenuItem value={'trainer'}>Eğitmen</MenuItem>
                            <MenuItem value={'parent'}>Veli</MenuItem>
                          </Select>
                        </FormControl>
                        <Button variant="contained" type="submit" fullWidth>
                          Kullanıcı Oluştur
                        </Button>
                      </form>
                    </div>
                  )}
                  {selectedTab === 3 && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                      }}
                    >
                      <form
                        onSubmit={updateSelectedAccountRelation}
                        style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '5px',
                          padding: '20px',
                          width: '50%',
                          display: 'flex',
                          flexDirection: 'column',
                          background: 'rgb(250 250 250)',
                          gap: '10px',
                        }}
                      >
                        <TextField
                          size="small"
                          label="E-posta"
                          value={selectedAccount.email}
                          fullWidth
                          required
                          onChange={(e) =>
                            setSelectedAccount({
                              ...selectedAccount,
                              email: e.target.value,
                            })
                          }
                        />
                        <TextField
                          size="small"
                          label="Adı Soyadı"
                          value={selectedAccount.name}
                          fullWidth
                          required
                          onChange={(e) =>
                            setSelectedAccount({
                              ...selectedAccount,
                              name: e.target.value,
                            })
                          }
                        />
                        <TextField
                          size="small"
                          label="Telefon Numarası"
                          value={selectedAccount.phone}
                          fullWidth
                          onChange={(e) =>
                            setSelectedAccount({
                              ...selectedAccount,
                              phone: e.target.value,
                            })
                          }
                        />
                        {/* <TextField
                                  size="small"
                                  label="Adı"
                                  value={selectedAccountRelation.first_name}
                                  onChange={(e) => setSelectedAccountRelation({ ...selectedAccountRelation, first_name: e.target.value })}
                                  fullWidth
                              />
                              <TextField
                                  size="small"
                                  label="Soyadı"
                                  value={selectedAccountRelation.last_name}
                                  onChange={(e) => setSelectedAccountRelation({ ...selectedAccountRelation, last_name: e.target.value })}
                                  fullWidth
                              /> */}
                        {accountRelation.role === 'admin' && (
                          <FormControlLabel
                            sx={{ alignContent: 'end' }}
                            control={
                              <Switch
                                checked={accountRelation.is_active}
                                onChange={(e) =>
                                  setSelectedAccountRelation({
                                    ...selectedAccountRelation,
                                    is_active: e.target.checked,
                                  })
                                }
                              />
                            }
                            label="Hesap aktif mi?"
                          />
                        )}
                        <Button variant="contained" type="submit" fullWidth>
                          Kullanıcıyı Düzenle
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              ),
            })
          ).paddingTop('35px')
        })
  }
}
