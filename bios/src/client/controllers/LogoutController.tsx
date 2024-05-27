import { useDeleteSession } from '@realmocean/sdk'
import {
  Spinner,
  Text,
  UIController,
  UIView,
  VStack,
  useEffect,
  useNavigate,
} from '@tuval/forms'

export class LogoutController extends UIController {
  public override LoadView(): UIView {
    const { deleteSession } = useDeleteSession('console')

    useEffect(() => {
      deleteSession(
        { sessionId: 'current' },
        () => (window.location.href = '/login')
      )
    }, [])

    return VStack(Spinner(), Text('Çıkış Yapılıyor...'))
  }
}
