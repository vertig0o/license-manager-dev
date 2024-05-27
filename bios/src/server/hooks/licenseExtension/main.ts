import { Query, useGetDocument, useListDocuments, useCreateDocument, useUpdateDocument } from "@realmocean/sdk";
import AppInfo from "../../../AppInfo";
import Collections from "../../core/Collections";
import ILicenseExtension from "../../../interfaces/ILicenseExtension";

namespace LicenseExtension {
    export const Get = (id: string) => {
        const { document, isLoading } = useGetDocument({ projectId: AppInfo.Name, databaseId: AppInfo.Database, collectionId: Collections.LicenseExtension, documentId: id })

        return {
            licenseExtension: document,
            isLoading
        }
    }
    export const List = (): { licenseExtensionList: ILicenseExtension.IBase[], isLoading: boolean } => {
        const { documents, isLoading } = useListDocuments(AppInfo.Name, AppInfo.Database, Collections.LicenseExtension)
        return {
            licenseExtensionList: documents as any,
            isLoading
        }

    }
    export const Update = () => {
        const { updateDocument } = useUpdateDocument(AppInfo.Name)
        return {
            updateLicenseExtension: updateDocument
        }
    }
}
export default LicenseExtension