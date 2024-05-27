import { Query, useGetDocument, useListDocuments, useCreateDocument, useUpdateDocument } from "@realmocean/sdk";
import AppInfo from "../../../AppInfo";
import Collections from "../../core/Collections";
import ICustomer from "../../../interfaces/ICustomer";

namespace Customer {
    export const Get = (id: string) => {
        const { document, isLoading } = useGetDocument({ projectId: AppInfo.Name, databaseId: AppInfo.Database, collectionId: Collections.Customer, documentId: id })

        return {
            customer: document,
            isLoading
        }
    }
    export const List = (): { customerList: ICustomer.IBase[], isLoading: boolean } => {
        const { documents, isLoading } = useListDocuments(AppInfo.Name, AppInfo.Database, Collections.Customer)
        return {
            customerList: documents as any,
            isLoading
        }

    }
    export const Update = () => {
        const { updateDocument } = useUpdateDocument(AppInfo.Name)
        return {
            updateCustomer: updateDocument
        }
    }
}
export default Customer