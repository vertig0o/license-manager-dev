import IRoot from "./IRoot";

namespace ICustomer {
    export interface IBase extends IRoot {
        name: string;
        manager_name: string;
        manager_email: string;
        is_active: boolean;
        is_deleted: boolean;
    }

    export interface ICreate {
        name: string;
        manager_name: string;
        manager_email: string;
        is_active: boolean;

    }
}

export default ICustomer