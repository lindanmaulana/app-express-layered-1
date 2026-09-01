const COOKIES = {
    LINDAN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGluZGFuQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzg4MjQ4MzI5LCJleHAiOjE3ODgzMzQ3Mjl9.llnwQv4GaFXis5qSCQsb0U2RQ4vlPr19y41DYZaSS5M',
    SATRIA: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImVtYWlsIjoic2F0cmlhQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzg4MjQ4MzQ2LCJleHAiOjE3ODgzMzQ3NDZ9.LgRG6oop5KW9WAUWPVrk8qNZQOR3iEwr4yISNITmoAs',
    BUDI: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImVtYWlsIjoiYnVkaUBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc4ODI1MDI5MSwiZXhwIjoxNzg4MzM2NjkxfQ.rD2W7vU97kpQ2aO8j14N-smDVlSIZxPgffVYXHU8mUc",
    ADMA: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImVtYWlsIjoiYWRtYUBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc4ODI1MDM3MCwiZXhwIjoxNzg4MzM2NzcwfQ.M7xZcA4DLuZ00u6qkemt2Z_I-e0r28IxuYAwl4poQOI'
}

const payload = {   
    items: [
        {
            "product_id": 25,
            "quantity": 15
        }
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

async function main() {
    // await committedReadTest()
    // await repeatableReadTest()
    await serializableTest()
}

main()



