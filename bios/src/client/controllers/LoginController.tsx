import {
  Fragment,
  ReactView,
  UIController,
  UINavigate,
  UIView,
  VStack,
  cTop,
  useNavigate,
  useState,
} from '@tuval/forms'
import { useCreateEmailSession, useGetMe } from '@realmocean/sdk'
import React from 'react'
import {
  Container,
  Header,
  LoginContainer,
  LoginError,
  LoginForm,
  LoginInput,
  LoginLabel,
  LoginToSignUp,
  customLogo,
} from './LoginStyles/Styles'
import { Button } from '@mui/material'

export class LoginController extends UIController {
  public LoadView(): UIView {
    const navigate = useNavigate()

    const { me, isLoading, isError: isAccountGetError } = useGetMe('console')

    const { createEmailSession, isSuccess, isError, error } =
      useCreateEmailSession('console')

    const [form, setForm] = useState({
      email: '',
      password: '',
      disabled: false,
    })

    const handleFormChange = (e: any) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      })
    }

    const onSubmit = (e: any) => {
      e.preventDefault()
      setForm({ ...form, disabled: true })
      createEmailSession(
        {
          email: form.email,
          password: form.password,
        },
        () => {
          navigate('/app/dashboard')
        }
      )
    }

    const HeaderInfo = () => {
      return (
        <Header>
          <img src={customLogo} style={{ width: '60px', height: '60px' }} />
          <LoginLabel>License Manager</LoginLabel>
        </Header>
      )
    }

    return isLoading
      ? Fragment()
      : me != null
      ? UINavigate('/app/dashboard')
      : VStack({ alignment: cTop })(
          ReactView(
            <Container>
              <LoginContainer>
                <HeaderInfo />
                <LoginForm onSubmit={onSubmit}>
                  <LoginInput
                    onChange={handleFormChange}
                    placeholder="E-posta"
                    name="email"
                    type="email"
                    value={form.email}
                    required
                  />
                  <LoginInput
                    onChange={handleFormChange}
                    placeholder="Şifre"
                    type="password"
                    name="password"
                    value={form.password}
                    required
                  />
                  <Button variant="contained" fullWidth type="submit">
                    Giriş Yap
                  </Button>
                  {isError && <LoginError>{error?.message}</LoginError>}
                </LoginForm>
                <LoginToSignUp onClick={() => navigate('/signup')}>
                  Kayıt Ol
                </LoginToSignUp>
              </LoginContainer>
            </Container>
          )
        ).height()
  }
}
