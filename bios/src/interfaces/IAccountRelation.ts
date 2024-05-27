import IRoot from './IRoot'

namespace IAccountRelation {
  export interface IBase extends IRoot {
    // id: string
    account_id: string
    tenant_id: string
    role: string
    is_active: boolean
    is_deleted: boolean
  }
}

export default IAccountRelation
