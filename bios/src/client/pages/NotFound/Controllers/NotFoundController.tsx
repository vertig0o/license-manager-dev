import {
  ReactView,
  UIController,
  UIView,
  VStack,
  cTop,
  useNavigate,
} from '@tuval/forms'
import React from 'react'
import {
  CenteredContent,
  ContentContainer,
  ErrorButton,
  WrapError,
} from '../Views/PageStyles'

export class NotFoundController extends UIController {
  public LoadView(): UIView {
    const navigate = useNavigate()
    return VStack({ alignment: cTop })(
      ReactView(
        <WrapError>
          <CenteredContent>
            <ContentContainer>
              <h1>
                <span>4</span>
                <span>0</span>
                <span>4</span>
              </h1>
              <h5>Bir sorun oluştu! Sayfa bulunamadı</h5>
              <p>
                Aradığınız sayfa bulunamadı. Lütfen adresi kontrol edin veya ana
                sayfaya dönün.
              </p>
              <ErrorButton
                title="Ana Sayfa"
                onClick={() => navigate('/app/dashboard')}
              >
                Ana Sayfa
              </ErrorButton>
            </ContentContainer>
          </CenteredContent>
        </WrapError>
      )
    ).height()
  }
}
