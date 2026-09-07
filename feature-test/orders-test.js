const COOKIES = {
    LINDAN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGluZGFuQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzg4NDA3NzE4LCJleHAiOjE3ODg0OTQxMTh9.ATwso-nQHkipINadFmZAzqq4cNBxpYIU2jt0Gtt8Nq0',
    SATRIA: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImVtYWlsIjoic2F0cmlhQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzg4NDA3NzM4LCJleHAiOjE3ODg0OTQxMzh9.nKb2PCrD8WSB1T7QBBXV-JoasVc2bo0b43LE_Ze8ra4',
    BUDI: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImVtYWlsIjoiYnVkaUBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc4ODQwNzc1OCwiZXhwIjoxNzg4NDk0MTU4fQ.707hoAYucnC-VmjDPa0qIaqoBHToxpm_0r6Q0gqu2rk",
    ADMA: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImVtYWlsIjoiYWRtYUBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc4ODQwNzc4NCwiZXhwIjoxNzg4NDk0MTg0fQ.3tUL9qtIq5QTno3TN3_vvI_TQ4wm4WoNkItO46dhM88'
}

const getCancelOrderUrl = (orderId) => `/orders/${orderId}/cancel`

const createAuthOptions = (cookieHeader) => ({
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${cookieHeader}`
    },
})

async function cancelOrdersConcurrently(){
    const optionsLindan = createAuthOptions(COOKIES.LINDAN)
    const optionsSatria = createAuthOptions(COOKIES.SATRIA)
    const optionsBudi = createAuthOptions(COOKIES.BUDI)
    const optionsAdma = createAuthOptions(COOKIES.ADMA)

    console.log("Mengirim request konkuren...")
    const startTime = Date.now()
    
    const requests = [
        // fetch(`http://localhost:3000/api/v1${getCancelOrderUrl(46)}`, optionsLindan), // 5
        fetch(`http://localhost:3000/api/v1${getCancelOrderUrl(48)}`, optionsSatria), // 7
        fetch(`http://localhost:3000/api/v1${getCancelOrderUrl(50)}`, optionsBudi), // 8
        fetch(`http://localhost:3000/api/v1${getCancelOrderUrl(49)}`, optionsAdma), // 9
    ]

    const responses = await Promise.all(requests)

    const results = await Promise.all(
        responses.map(async (res) => ({
            status: res.status,
            body: await res.json()
        }))
    )

    console.log(`Selesai dalam waktu: ${Date.now() - startTime}ms`)
    console.log(results)
}

cancelOrdersConcurrently()