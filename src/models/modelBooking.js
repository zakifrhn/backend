const db = require('../config/db')
const model = {}
const escape =  require('pg-format')
const respone = require('../utils/respon')
// const authCheck = require('../middleware/authCheck')// Sesuaikan dengan path yang benar

// model.addBooking = (req, res) => {
//     return authCheck('user', () => {
//         const { id_movie, seat_user, id_schedule, total_payment } = req.body;

//         db.query(`INSERT INTO public.order_user (id_movie, seat_user, id_schedule, total_payment)
//                   VALUES ($1, $2, $3, $4)`, [id_movie, seat_user, id_schedule, total_payment])
//             .then(() => {
//                 res.status(200).json({ message: 'Data successfully added!' });
//             })
//             .catch((error) => {
//                 console.log(error);
//                 res.status(500).json({ message: 'Failed to add the data' });
//             });
//     });
// };

// module.exports = model;


//version kak ebi
// model.save = async ({ id_movie, seat_user, id_schedule, total_payment, users }) => {
//     const pg = await db.connect()
//     try {
//         await pg.query('BEGIN')

//         const order = await pg.query(
//             `INSERT INTO public.order_user
//                 (id_movie, seat_user, id_schedule, total_payment)
//             VALUES($1, $2, $3, $4) RETURNING id_order`,
//             [id_movie, seat_user, id_schedule, total_payment]
//         )

//         console.log(order)

//         if (users && users.length > 0) {
//             users.map(async (v) => {
//                 return await pg.query(
//                     `
//                     INSERT INTO public.bridge_order_users
//                         (id_user, id_order,)
//                     VALUES($1, $2)`,
//                     [v, order.rows[0].id_order ]
//                 )
//             })
//         }

//         // if(users == undefined){
//         //     console.log('blm dapet dataynya nih')
//         // }else{
//         //     console.log('udh ada nih datanya')
//         // }
//         await pg.query('COMMIT')
//         // await pg.end()
//         console.log(`${id_movie}, ${seat_user}, ${id_schedule}, ${total_payment}, ${users}`)
//         return `${order.rowCount} order succesfully created`


//     } catch (error) {
//         await pg.query('ROLLBACK')
//         throw error
//     }
// }

// model.addBooking = ({
// 	id_movie, seat_user, id_schedule, total_payment, id_order, id_user }) => {
//     return new Promise((resolve,reject) => {
//         db.query (`INSERT INTO public.order_user (    
//             id_movie, seat_user, id_schedule, total_payment)
//         VALUES($1,$2,$3,$4)`, [id_movie, seat_user, id_schedule, total_payment])
//         .then(() =>{
//             db.query(`INSERT INTO public.order_user() values($1, $2)`, [id_order,id_user])
//         })
//             .then(() => {
//                 resolve('Data Succesfully Added!')
//             }).catch((error) => {
//                 reject('erorrnya adalah ' + error)
//             })
//     })
// }


model.addBooking = ({
	id_movie, seat_user, id_schedule, total_payment, id_order, id_user }) => {
    return new Promise((resolve,reject) => {
        db.query (`INSERT INTO public.order_user (    
            id_movie, seat_user, id_schedule, total_payment)
        VALUES($1,$2,$3,$4)`, [id_movie, seat_user, id_schedule, total_payment])
            .then(() => {
                return db.query(`INSERT INTO public.bridge_order_users (id_order, id_user) VALUES ($1, $2)`, [id_order, id_user]);
            })
            .then(() => {
                resolve('Data Successfully Added!');
            })
            .catch((error) => {
                reject('The error is: ' + error);
            });
    });
}



// model.update = async ({ name, banner, release, genre }, id) => {
//     try {
//         const pg = await db.connect()
//         await pg.query('BEGIN')

//         const movie = await pg.query(
//             `UPDATE public.movie SET
//                 movie_name=$1, movie_banner=$2, release_date=$3
//             WHERE movie_id=$4`,
//             [name, banner, release, id]
//         )

//         if (genre.length > 0) {
//             genre.map(async (v) => {
//                 return await pg
//                     .query(
//                         `
//                     UPDATE public.movie_genre SET
//                         genre_id = $1
//                     WHERE movie_genre = $2`,
//                         [v.id, v.movie_genre]
//                     )
//                     .catch((err) => {
//                         console.log(err)
//                     })
//             })
//         }

//         await pg.query('COMMIT')
//         return `${movie.rowCount} data movie updated`
//     } catch (error) {
//         await pg.query('ROLLBACK')
//         throw error
//     }
// }


model.editBooking = ({
    id_order,
    id_movie, seat_user, id_schedule, total_payment,
    updated_at}) => {
    return new Promise((resolve,rejected) =>{
        db.query(` UPDATE public.order_user
        SET id_movie = $2, seat_user = $3, id_schedule = $4, 
        total_payment = $5, updated_at = $6 
        WHERE id_order = $1`, [	
            id_order,
            id_movie, seat_user, id_schedule, total_payment,updated_at])
            .then(() => {
                resolve(res, 200, "Data Succesfully Updated")
            }).catch(() => {
                rejected(res, 400, 'Failed to Updated The Data')
            })
    })
}


model.deleteBooking = ({id_order}) =>{
    return new Promise((resolve,rejected) => {
        db.query('DELETE FROM public.order_user WHERE id_order = $1', [id_order])
        .then(()=> {
            
            // resolve(res.status(201).send("Data berhasil di hapus"))
            
            resolve("Data Succesfully Deleted!")

            // resolve(res.status(200).json({
            //     success: true,
            //     messaage: 'berhasil Hapus data'
            // }))
        }).catch(() => {
            rejected("Failed to deleted the data")
        })
    })
}



model.getBy = async ({ page, limit, orderBy, search }) => {
    try {
        let filterQuery = ''
        let orderQuery = ''
        let metaQuery = ''
        let count = 0

        if (search) {
            filterQuery += escape('AND id_user = %L', search)
        }

        if (orderBy) {
            orderQuery += escape('ORDER BY %s DESC ', orderBy)
        }

        if (page && limit) {
            const offset = (page - 1) * limit
            metaQuery += escape('LIMIT %s OFFSET %s', limit, offset)
        }

        db.query(`SELECT COUNT(id_user) as "count" FROM public.users WHERE true ${filterQuery}`).then((v) => {
            count = v.rows[0].count
        })

        const data = await db.query(`
        SELECT 
        ou.id_order,
        json_agg(
            JSONB_BUILD_OBJECT(
                'id_movie', mv.id_movie,
                'title_movie', mv.title_movie,
                'date_user', mv.date_user 
            )
        ) as movie,
        json_agg(
            JSONB_BUILD_OBJECT(
                'id_schedule', sch.id_schedule,
                'price', sch.price_movie
            )
        ) as schedule,
        ou.seat_user,
        ou.total_payment,
        ou.created_at, 
        ou.updated_at
        FROM public.order_user ou
        JOIN public.movie mv ON mv.id_movie = ou.id_movie
        JOIN public.schedule sch ON sch.id_schedule = ou.id_schedule
        WHERE true ${filterQuery}
        GROUP BY ou.id_order
        ${orderQuery} ${metaQuery}        
        `)

        const meta = {
            next: count <= 0 ? null : page == Math.ceil(count / limit) ? null : Number(page) + 1,
            prev: page == 1 ? null : Number(page) - 1,
            total: count
        }

        if (data.rows <= 0) {
            return 'data not found'
        } else {
            return { data: data.rows, meta }
        }
    } catch (error) {
        throw error
    }
}

// model.getAllBooking = ({id_user}) =>{
//     return new Promise((resolve,rejected) => {
//         db.query(`SELECT ou.*
//         FROM users u
//         JOIN bridge_order_users bou ON bou.user_id = u.id_user
//         JOIN order_user ou ON ou.id_order = bou.id_order
//         WHERE u.id_user = $1`, [id_user])
//         .then(res => {
//             resolve(res.rows)
//         }).catch(() => {
//             rejected('Failed to show the data')
//         })
//     })
// }


module.exports = model