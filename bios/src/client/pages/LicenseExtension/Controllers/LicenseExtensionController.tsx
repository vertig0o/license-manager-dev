import { HStack, UIController, UIRouteOutlet, UIView } from '@tuval/forms'
import { PortalMenu } from '../../../components/PortalMenu'

export class LicenseExtensionController extends UIController {
  public LoadView(): UIView {
    window.document.title = 'Lisanslar'

    return HStack(
      // PortalMenu('Lisans Uzatmalar'),
      PortalMenu('Lisanslar'),
      UIRouteOutlet().width('100%').height('100%')
    )
  }
}
