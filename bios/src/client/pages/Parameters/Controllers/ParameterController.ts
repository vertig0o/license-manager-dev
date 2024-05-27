import { HStack, UIController, UIRouteOutlet, UIView } from '@tuval/forms'
import { PortalMenu } from '../../../components/PortalMenu'

export class ParameterController extends UIController {
  public LoadView(): UIView {
    window.document.title = 'Parametreler'

    return HStack(
      PortalMenu('Parametreler'),
      UIRouteOutlet().width('100%').height('100%')
    )
  }
}
