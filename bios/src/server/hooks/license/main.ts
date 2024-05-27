import { Query, useGetDocument, useListDocuments, useCreateDocument, useUpdateDocument } from "@realmocean/sdk";
import AppInfo from "../../../AppInfo";
import Collections from "../../core/Collections";
import ILicense from "../../../interfaces/ILicense";

namespace License {
    export const Get = (id: string) => {
        const { document, isLoading } = useGetDocument({ projectId: AppInfo.Name, databaseId: AppInfo.Database, collectionId: Collections.License, documentId: id })

        return {
            license: document,
            isLoading
        }
    }
    export const List = (): { licenseList: ILicense.IBase[], isLoading: boolean } => {
        const { documents, isLoading } = useListDocuments(AppInfo.Name, AppInfo.Database, Collections.License)
        return {
            licenseList: documents as any,
            isLoading
        }

    }
    export const Update = () => {
        const { updateDocument } = useUpdateDocument(AppInfo.Name)
        return {
            updateLicense: updateDocument
        }
    }
}
export default License