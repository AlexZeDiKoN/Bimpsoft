declare module client {
    interface IEditItem {
        id?: number;
        type: string;
        tag: string;
        operationId: number;
        optionObj: IEditItemOptions;
    }

    interface IEditItemOptions {
        name: string;
        dateFor?: Date;
    }
}
