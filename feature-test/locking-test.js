async function testConcurrentOrders() {
    const payload = {   
        items: [
            {
                "product_id": 25,
                "product_name": "Mechanical Keyboard RGB",
                "product_price": 450000.00,
                "quantity": 15
            },
            // {
            //     "product_id": 26,
            //     "product_name": "Wireless Mouse Gaming",
            //     "product_price": 250000.00,
            //     "quantity": 10
            // }
        ] 
    }

    const cookieHeader =  'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGluZGFuQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzg4MDE0MTEyLCJleHAiOjE3ODgwMTUwMTJ9.d9LG3phdDQ4QwafN13ExA3tjsry8NO1kHgcDsDu3jEA' 
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookieHeader
        },

        body: JSON.stringify(payload)
    }

    console.log("Mengirim request konkuren...")
    const startTime = Date.now()
    
    const totalRequests = 80
    const request = Array.from({ length: totalRequests }, () => fetch(`http://localhost:3000/api/v1/orders/rll`, options))
    const responses = await Promise.all(request)

    const results = await Promise.all(responses.map(res => res.json()))
    console.log(`Selesai dalam waktu: ${Date.now() - startTime}ms`);
    console.log(results);
}

testConcurrentOrders()