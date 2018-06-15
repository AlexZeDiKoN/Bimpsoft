declare module server {
    interface ContactInfo {
        ID: number;
        Org: Org;
        UnitID: number;
        Role: Role;
        RoleID: number;
        Person: string;
        User: User;
        UserID: number;
        Online: Date;
    }

    interface Org {
        ID: number;
        ParentID: number;
        Level: number;
        Name: string;
        Description: any;
        AddressID: any;
        IsDeleted: any;
        Childrens: any;
    }

    interface Role {
        ID: number;
        Code: string;
        Name: string;
        IsDefault: boolean;
        IsPublic: boolean;
        IsSystem: boolean;
        IsDefaultNum: number;
        IsPublicNum: number;
        IsSystemNum: number;
    }

    interface User {
        ID: number;
        Login: string;
        Name: string;
        Description: any;
        Address: any;
        Online: Date;
        Roles: any[];
    }
}
