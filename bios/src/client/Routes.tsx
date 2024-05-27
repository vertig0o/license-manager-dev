import { UIRoute, UIRoutes } from '@tuval/forms'
import { LayoutController } from './controllers/LayoutController'
import { LoginController } from './controllers/LoginController'
import { SignupController } from './controllers/SignupController'
import { NotFoundController } from './pages/NotFound/Controllers/NotFoundController'
import { SetupController } from './pages/Setup/Controllers/SetupController'
import { AccountManagementController } from './pages/AccountManagement/Controllers/AccountManagementController'
import { AccountManagementPage } from './pages/AccountManagement/Controllers/AccountManagementPage'
import { LogoutController } from './controllers/LogoutController'
import { ParameterController } from './pages/Parameters/Controllers/ParameterController'
import { ParameterControllers } from './pages/Parameters/Controllers/ParameterControllers'
import { DashboardViewController } from './pages/Dashboard/Controllers/DashboardViewController'
import { CustomerController } from './pages/Customer/Controllers/CustomerController'
import { CreateCustomer } from './pages/Customer/Controllers/CreateCustomer'
import { LicenseController } from './pages/Licenses/Controllers/LicenseController'
import { CreateLicenseController } from './pages/Licenses/Controllers/CreateLicenseController'
import { LicenseListController } from './pages/Licenses/Controllers/LicenseListController'
import { LicenseExtensionController } from './pages/LicenseExtension/Controllers/LicenseExtensionController'
import { CreateLicenseExtensionController } from './pages/LicenseExtension/Controllers/CreateLicenseExtensionController'
import { LicenseExtensionListController } from './pages/LicenseExtension/Controllers/LicenseExtensionListController'
import { CustomerListController } from './pages/Customer/Controllers/CustomerListController'
import { UpdateCustomerController } from './pages/Customer/Controllers/UpdateCustomerController'
import { UpdateLicenseExtensionController } from './pages/LicenseExtension/Controllers/UpdateLicenseExtensionController'

export const Routes = () => {
  return UIRoutes(
    UIRoute('/app', LayoutController).children(
      // setup
      UIRoute('setup', SetupController),

      // dashboard
      UIRoute('dashboard', DashboardViewController),

      // reports

      // account management
      UIRoute('account-management', AccountManagementController).children(
        UIRoute('list', AccountManagementPage)
      ),

      // parameters
      UIRoute('parameters', ParameterController).children(
        UIRoute('view', ParameterControllers)
      ),

      // customer
      UIRoute('customer', CustomerController).children(
        UIRoute('create', CreateCustomer),
        UIRoute('list', CustomerListController),
        UIRoute(':id', UpdateCustomerController)
      ),

      // license
      UIRoute('license', LicenseController).children(
        UIRoute('create', CreateLicenseController),
        UIRoute('list', LicenseListController)
        // UIRoute(':id', UpdateLicenseController)
      ),
      // licence-extension
      UIRoute('license-extension', LicenseExtensionController).children(
        // UIRoute('create', CreateLicenseExtensionController),
        // UIRoute('list', LicenseExtensionListController),
        UIRoute(':id', UpdateLicenseExtensionController)
      ),

      // not found
      UIRoute('*', NotFoundController)
    ),

    UIRoute('', LoginController),
    UIRoute('login', LoginController),
    UIRoute('signup', SignupController),
    UIRoute('logout', LogoutController)
  )
}
