declare module server {
    interface DeliveryState {
        receiver: string;
        sent?: Date;
        delivered?: Date;
        deliveryConfirmed?: Date;
        accepted?: Date;
        acceptedConfirmed?: Date;
        acceptedBy: string;
    }
}
