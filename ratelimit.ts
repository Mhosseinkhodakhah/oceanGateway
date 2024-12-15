

// interface bulk = {
//     id : {

//     }
// }


let bulk: any = {}

export default (req: any, res: any, next: any) => {
    // console.log(req.header('x-forwarded-for'))
    console.log(req.header('x-real-ip'))
    let Ip = req.header('x-real-ip')
    if (bulk[Ip]) {
        if (bulk[Ip].tokens == 0) {
            if (bulk[Ip].exceededTime == 0) {
                bulk[Ip].exceededTime = new Date().getTime()
            }
            if ((new Date().getTime() - bulk[Ip].exceededTime) >= 3 * 1000) {
                bulk[Ip].tokens = 10;
                bulk[Ip].exceededTime = 0;
                console.log('bulk[Ip] full again . . .')
                next()
            } else {
                console.log('bulk[Ip] is empty . . .')
                return res.status(429).json({
                    success: false,
                    scope: 'gateway ratelimit',
                    error: 'maximum try exceeded',
                    data: null
                })
            }
        } else {
            bulk[Ip].tokens--;
            console.log('mines bulk[Ip]', bulk[Ip])
            next()
        }
    } else {
        bulk[Ip] = { tokens: 100, exceededTime: 0 }
        next()
    }
}

