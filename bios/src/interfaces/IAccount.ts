import IRoot from './IRoot'

namespace IAccount {
  export interface IBase extends IRoot {
    accessedAt: string
    email: string
    emailVerification: boolean
    labels: any[]
    name: string
    passwordUpdate: string
    phone: string
    phoneVerification: boolean
    prefs: { organization: string }
    registration: string
    status: boolean
  }
  export interface IPasswordChange {
    password: string
    newPassword: string
    newPasswordConfirm: string
  }
}

export default IAccount
