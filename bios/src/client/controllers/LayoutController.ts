import { UIController, UIRouteOutlet, UIView, VStack } from '@tuval/forms'

export class LayoutController extends UIController {
  public LoadView(): UIView {
    return VStack(UIRouteOutlet().width('100%').height('100%'))
  }
}
