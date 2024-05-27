import { BiosController, UIView } from '@tuval/forms'
import { Routes } from '../Routes'

export class MainController extends BiosController {
  public override LoadBiosView(): UIView {
    // title
    window.document.title = 'License Manager'
    localStorage.setItem('pedavalans_theme', 'false')
    return Routes()
  }
}
