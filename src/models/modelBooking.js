const db = require('../config/db')
const model = {}
const escape =  require('pg-format')



model.addBooking = ({
	id_movie, seat_user, id_schedule, total_payment, id_order, idUser }) => {
    return new Promise((resolve,reject) => {
        db.query (`INSERT INTO public.order_user (    
            id_movie, seat_user, id_schedule, total_payment)
        VALUES($1,$2,$3,$4)`, [id_movie, seat_user, id_schedule, total_payment])
            .then(() => {
                return db.query(`INSERT INTO public.bridge_order_users (id_order, id_user) VALUES ($1, $2)`, [id_order, idUser]);
            })
            .then(() => {
                resolve('Data Successfully Added!');
            })
            .catch((error) => {
                reject('The error is: ' + error);
            });
    });
}

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
            resolve(res, 200, "Data Succesfully Updated")
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

module.exports = model