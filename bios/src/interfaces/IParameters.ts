import IRoot from './IRoot'

namespace IParameters {
  export interface IBase extends IRoot {
    tenant_id: string
    name: string
    is_active: boolean
    is_deleted: boolean
    is_show: boolean
  }
}

export default IParameters
