import IRoot from "./IRoot";

namespace ILicense {
    export interface IBase extends IRoot {

        name: string;
        customer_name: string;
        customer_id: string;
        app: string;
        licence_type: string;
        start_date: string;
        licence_renewal: string;
        is_active: boolean;
        is_deleted: boolean;

    }
    export interface ICreate {
        id: string;
        name: string;
        customer_name: string;
        customer_id: string;
        app: string;
        licence_type: string;
        start_date: string;
        licence_renewal: string;
        is_active: boolean;
        licence_renewal_type: string;


    }
}

export default ILicense