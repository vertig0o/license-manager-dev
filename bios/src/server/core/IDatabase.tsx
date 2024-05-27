interface IDatabase {
  id: string
  name: string
  description: IDescription
  seed_admin: IAdmin
  author: string
  version: number
  enabled: boolean
  collections: ICollection[]
}

interface IDescription {
  en: string
  tr: string
  fr?: string
  es?: string
  de?: string
}

interface ICollection {
  id: string
  name: string
  description: IDescription
  version: number
  attributes: {
    key: string
    version: number
    type: string
    size?: number
    default?: boolean
  }[]
}

interface IAdmin {
  name: 'pedasoft'
  email: 'info@pedasoft.com'
  password: 'pedasoft'
}

export default IDatabase
