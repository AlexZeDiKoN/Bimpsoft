declare module server {
    interface CalculatedParam {
        id: number;
        name: string;
        parentID: number;
        Online: Date;
        readiness: CalculatedParamItem;
        potential: CalculatedParamItem;
    }

    interface CalculatedParamItem {
        groupCode: string;
        statusString: string;
        statusID: number;
        dateFor: Date;
        dateForString: string
    }
}
