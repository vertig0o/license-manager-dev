import {
  Query,
  useCreateDocument,
  useGetDocument,
  useListDocuments,
  useUpdateDocument,
} from '@realmocean/sdk'
import AppInfo from '../../../AppInfo'
import Collections from '../../core/Collections'

namespace AccountRelation {
  export const Create = () => {
    const { createDocument } = useCreateDocument(
      AppInfo.Name,
      AppInfo.Database,
      Collections.AccountRelation
    )
    return {
      createAccountRelation: createDocument,
    }
  }

  export const List = () => {
    const { documents, isLoading } = useListDocuments(
      AppInfo.Name,
      AppInfo.Database,
      Collections.AccountRelation,
      [Query.equal('is_deleted', false)]
    )
    return {
      listAccountRelation: documents,
      isLoadingAccountRelationList: isLoading,
    }
  }

  export const Update = () => {
    const { updateDocument } = useUpdateDocument(AppInfo.Name)

    return { updateAccountRelation: updateDocument }
  }
}

export default AccountRelation
