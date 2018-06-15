declare module server {
    interface Operation {
        id: number;
        name: string;
        /** @deprecated */
        datePlan?: Date;
        /** @deprecated */
        dateFact?: Date;

        zeroHour: Date;

        state: string;
        stateString: string;

        createUser: number;
        createUserString: string;
        createUserPosition: string;
        createReason: string;
        createDate: Date;

        closeUser: number;
        closeUserString: string;
        closeUserPosition: string;
        closeReason: string;
        closeDate: Date | null;

        resumeUser: number;
        resumeUserString: string;
        resumeUserPosition: string;
        resumeReason: string;
        resumeDate: Date | null;
    }
}
