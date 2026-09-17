export const generateSeatShowtime = (seatCount: number): string[] | undefined => {
    const SEAT_NUMBER = [1, 2, 3, 4, 5, 6, 7, 8, 9 , 10]
    const SEAT_CODE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    
    if (seatCount > SEAT_NUMBER.length || seatCount < 1) return;

    const SeatNumberGenerate = SEAT_NUMBER.slice(0, seatCount)
    const seatCodeGenerate = SEAT_CODE.slice(0, seatCount)

    const seatNumber: string[] = SeatNumberGenerate.flatMap(sn => {
        return seatCodeGenerate.map(sc => `${sn}${sc}`)
    })

    return seatNumber
}