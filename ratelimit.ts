

let bulk = { tokens: 10, exceededTime: 0 }

export default (req: any, res: any, next: any) => {
    console.log(bulk)
    if (bulk.tokens == 0) {
        // console.log('timeeeee' , bulk.exceededTime - new Date().getTime())
        if ((new Date().getTime() - bulk.exceededTime) >= 500*1000) {
            bulk.tokens = 10;
            bulk.exceededTime = 0;
            console.log('bulk full again . . .')
            next()
        } else {
            console.log('bulk is empty . . .')
            if (bulk.exceededTime == 0) {
                bulk.exceededTime = new Date().getTime()
            }
            return res.status(429).json({
                success: false,
                scope: 'gateway ratelimit',
                error: 'maximum try exceeded',
                data: null
            })
        }
    } else {
        bulk.tokens--;
        console.log('mines bulk', bulk)
        next()
    }
}
