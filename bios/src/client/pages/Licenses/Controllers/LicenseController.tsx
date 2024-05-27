import { HStack, UIController, UIRouteOutlet, UIView } from '@tuval/forms'
import { PortalMenu } from '../../../components/PortalMenu'

export class LicenseController extends UIController {
  public LoadView(): UIView {
    window.document.title = 'Lisanslar'

    return HStack(
      PortalMenu('Lisanslar'),
      UIRouteOutlet().width('100%').height('100%')
    )
  }
}
