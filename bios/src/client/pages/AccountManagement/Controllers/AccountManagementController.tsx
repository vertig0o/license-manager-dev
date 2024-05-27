import { HStack, UIController, UIRouteOutlet, UIView } from '@tuval/forms'
import { PortalMenu } from '../../../components/PortalMenu'

export class AccountManagementController extends UIController {
  public LoadView(): UIView {
    window.document.title = 'Hesap Yönetimi'

    return HStack(
      PortalMenu('Hesap Yönetimi'),
      UIRouteOutlet().width('100%').height('100%')
    )
  }
}
