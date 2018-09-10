declare module server {
    interface DocflowState {
        Approvals: Array<DocflowStateItem>;
        Signing: Array<DocflowStateItem>;
        datePlan?: Date;
        dateFact?: Date;
        comment: string;
    }

    interface DocflowStateItem {
        UserID: number;
        UserString: string;
        State: string;
        StateString: string;
        Note: string;
        DateCompleted?: Date
    }
}
