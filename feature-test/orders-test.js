const COOKIES = {
    LINDAN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoibGluZGFuQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzg4MjQ4MzI5LCJleHAiOjE3ODgzMzQ3Mjl9.llnwQv4GaFXis5qSCQsb0U2RQ4vlPr19y41DYZaSS5M',
    SATRIA: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImVtYWlsIjoic2F0cmlhQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzg4MjQ4MzQ2LCJleHAiOjE3ODgzMzQ3NDZ9.LgRG6oop5KW9WAUWPVrk8qNZQOR3iEwr4yISNITmoAs',
    BUDI: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImVtYWlsIjoiYnVkaUBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc4ODI1MDI5MSwiZXhwIjoxNzg4MzM2NjkxfQ.rD2W7vU97kpQ2aO8j14N-smDVlSIZxPgffVYXHU8mUc",
    ADMA: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImVtYWlsIjoiYWRtYUBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc4ODI1MDM3MCwiZXhwIjoxNzg4MzM2NzcwfQ.M7xZcA4DLuZ00u6qkemt2Z_I-e0r28IxuYAwl4poQOI'
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
        fetch(`http://localhost:3000/api/v1${getCancelOrderUrl(43)}`, optionsLindan), // 5
        // fetch(`http://localhost:3000/api/v1${getCancelOrderUrl(43)}`, optionsSatria), // 7
        // fetch(`http://localhost:3000/api/v1${getCancelOrderUrl(41)}`, optionsBudi), // 8
        // fetch(`http://localhost:3000/api/v1${getCancelOrderUrl(40)}`, optionsAdma), // 9
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