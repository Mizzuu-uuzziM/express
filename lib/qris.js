import axios from 'axios';

export async function createQris({ username, nominal, note }) {
    const res1 = await axios.post(`https://qris.zone.id/api/users/${username}/payments`, {
        amount: nominal,
        sender: "",
        note
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const orderId = res1.data.payment.order_id;

    const headers = {
        'Content-Type': 'application/json',
        'Referer': `https://pakasir.zone.id/pay/qris-zone-id/${nominal}?order_id=${orderId}&qris_only=1`
    };

    const res2 = await axios.post(`https://pakasir.zone.id/api/transactions`, {
        project: "qris-zone-id",
        amount: nominal,
        order_id: orderId
    }, {
        headers
    });

    const res3 = await axios.post(`https://pakasir.zone.id/api/transactions/${res2.data.transaction.id}/payment`, {
        payment_method: "qris"
    }, {
        headers
    });

    const paymentNumber = res3.data.transaction.payment_number;

    return {
        orderId,
        nominal,
        total: res3.data.transaction.total_payment,
        expiresAt: res3.data.transaction.payment_number_expires_at,
        qris: `https://quickchart.io/qr?size=300&margin=2&text=${encodeURIComponent(paymentNumber)}`
    };
}

export async function checkStatus(orderId, nominal) {
    const res = await axios.post(`https://pakasir.zone.id/api/transactions`, {
        project: "qris-zone-id",
        amount: nominal,
        order_id: orderId
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Referer': `https://pakasir.zone.id/pay/qris-zone-id/${nominal}?order_id=${orderId}&qris_only=1`
        }
    });

    return res.data.transaction;
}