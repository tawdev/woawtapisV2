export const orderStatusMap = {
    pending: {
        label: 'En attente',
        color: 'text-amber-600 bg-amber-50',
    },
    processing: {
        label: 'En cours',
        color: 'text-blue-600 bg-blue-50',
    },
    shipped: {
        label: 'Expédiée',
        color: 'text-purple-600 bg-purple-50',
    },
    delivered: {
        label: 'Livrée',
        color: 'text-green-600 bg-green-50',
    },
    cancelled: {
        label: 'Annulée',
        color: 'text-red-600 bg-red-50',
    },
};
