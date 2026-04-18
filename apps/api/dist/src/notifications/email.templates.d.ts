export declare function orderPlacedEmail(data: {
    customerName?: string;
    orderNumber: string;
    items: {
        productName: string;
        quantity: number;
        total: number;
    }[];
    subtotal: number;
    deliveryCharge: number;
    discount: number;
    total: number;
    paymentMethod: string;
}): {
    subject: string;
    html: string;
};
export declare function lowStockAlertEmail(data: {
    productName: string;
    sku: string;
    stock: number;
}): {
    subject: string;
    html: string;
};
