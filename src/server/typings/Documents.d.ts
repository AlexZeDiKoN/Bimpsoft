declare module server {
    interface Document {
        id: number;
        /** Идентификатор конкретного обьекта */
        entityID?: number;
        /** Тип обьекта */
        entityType: string;
        /** Тип */
        type: string;
        /** Тип на человеческом */
        typeName: string;

        /** Название */
        name: string;
        /** Название файла */
        fileName: string;

        /** подразделение */
        unitID?: number;

        /** Станом на */
        dateFor?: Date;
        /** Дата плановая */
        datePlan?: Date;
        /** Дата фактическая */
        dateFact?: Date;

        /** Состояние в документообороте */
        docFlowStatus: string;
        docFlowStatusString: string;


        /** Дата створення*/
        dateCreate: Date;
        userCreate: number;
        userCreateString: string;
        /** Дата последнего изменения */
        dateModify: Date;
        userModify: number;
        userModifyString: string;


        receivedDate?: Date;
        receivedFromOrg: number;
        receivedFromOrgString: string;
        receivedFromUser: number;
        receivedFromUserString: string;

        /** Реестрационный номер */
        regNum: string;
        /** идентификатор операции */
        operation_id: number;

        /** ссылка для загрузки */
        uri: string;

        /** Можно затвердити */
        CanApprove: boolean
        /** Можно підписати */
        CanSign: boolean

        /**  */
        Receivers : Array<Receivers>
    }

    interface Receivers {
        userID: number;
        /** получатель */
        userString:string;
        /** дата отправления */
        dateSend: Date;
        /** когда доставлено */
        dateDelivered: Date;
        /** когда отчитались о доставке */
        dateOpened: Date;
    }


    /**
     *
     * @enum {string}
     */
    const DocumentType = {
        folder : 'folder',
        back : 'back',
        document : 'document',
        layer : 'layer'
    }
}
