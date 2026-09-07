const COOKIES = {
    LINDAN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGluZGFuQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzg4NDA3NzE4LCJleHAiOjE3ODg0OTQxMTh9.ATwso-nQHkipINadFmZAzqq4cNBxpYIU2jt0Gtt8Nq0',
    SATRIA: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImVtYWlsIjoic2F0cmlhQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzg4NDA3NzM4LCJleHAiOjE3ODg0OTQxMzh9.nKb2PCrD8WSB1T7QBBXV-JoasVc2bo0b43LE_Ze8ra4',
    BUDI: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImVtYWlsIjoiYnVkaUBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc4ODQwNzc1OCwiZXhwIjoxNzg4NDk0MTU4fQ.707hoAYucnC-VmjDPa0qIaqoBHToxpm_0r6Q0gqu2rk",
    ADMA: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImVtYWlsIjoiYWRtYUBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc4ODQwNzc4NCwiZXhwIjoxNzg4NDk0MTg0fQ.3tUL9qtIq5QTno3TN3_vvI_TQ4wm4WoNkItO46dhM88'
}

const payload = {   
    items: [
        // {
        //     "product_id": 25,
        //     "quantity": 10
        // },
        // {
        //     "product_id": 26,
        //     "quantity": 20
        // },
        // {
        //     "product_id": 27,
        //     "quantity": 35
        // },
        {
            "product_id": 28,
            "quantity": 15
        },
    ] 
}

const createOrderOptions = (payloadData, cookieHeader) => ({
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${cookieHeader}`
    },
    body: JSON.stringify(payloadData)
})

const API_COMMITTED_READ = '/order-playgrounds/committed-read'
const API_REPEATABLE_READ = '/order-playgrounds/repeatable-read'
const API_SERIALIZABLE = '/order-playgrounds/serializable'

const API_REPEATABLE_AND_LOCK = '/order-playgrounds/repeatable-lock'

async function runConcurrentTest(endpoint, testName) {
    const optionsLindan = createOrderOptions(payload, COOKIES.LINDAN)
    const optionsSatria = createOrderOptions(payload, COOKIES.SATRIA)
    const optionsBudi = createOrderOptions(payload, COOKIES.BUDI)
    const optionsAdma = createOrderOptions(payload, COOKIES.ADMA)

    console.log(`\n--- Menjalankan ${testName} ---`)
    const startTime = Date.now()
    
    const requests = [
        fetch(`http://localhost:3000/api/v1${endpoint}`, optionsLindan),
        fetch(`http://localhost:3000/api/v1${endpoint}`, optionsSatria),
        fetch(`http://localhost:3000/api/v1${endpoint}`, optionsBudi),
        fetch(`http://localhost:3000/api/v1${endpoint}`, optionsAdma),
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

async function committedReadTest() {
    await runConcurrentTest(API_COMMITTED_READ, "Committed Read Test")
}

async function repeatableReadTest() {
    await runConcurrentTest(API_REPEATABLE_READ, "Repeatable Read Test")
}

async function serializableTest() {
    await runConcurrentTest(API_SERIALIZABLE, 'Serializable Test')
}

async function repeatableAndLockTest() {
    await runConcurrentTest(API_REPEATABLE_AND_LOCK, 'Repeatable and Lock Test')
}

async function main() {
    // await committedReadTest()
    // await repeatableReadTest()
    // await serializableTest()
    await repeatableAndLockTest()
}

main()



