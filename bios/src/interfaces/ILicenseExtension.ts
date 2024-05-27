import IRoot from "./IRoot";

namespace ILicenseExtension {
    export interface IBase extends IRoot {
        // id: string;
        name: string;
        customer_id: string;
        customer_name: string;
        app: string;
        validity_date: string;
        new_validity_date: string;
        is_active: boolean;
        is_deleted: boolean;
    }
    export interface ICreate {
        id: string;
        customer_name: string;
        app: string;
        validity_date: string;
        new_validity_date: string;
        customer_id: string;
    }


}

export default ILicenseExtension