import { HStack, UIController, UIRouteOutlet, UIView } from '@tuval/forms'
import { PortalMenu } from '../../../components/PortalMenu'

export class CustomerController extends UIController {
  public LoadView(): UIView {
    window.document.title = 'Müşteriler'

    return HStack(
      PortalMenu('Müşteriler'),
      UIRouteOutlet().width('100%').height('100%')
    )
  }
}
