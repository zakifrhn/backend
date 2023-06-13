const db = require('../config/db')
const model = {}
const escape = require('pg-format')

model.addSch = ({
    id_movie, 
    location_user,
    price_movie,
    date_start,
    date_end,
    time_movie,
    pick_cinema
    }) => {
    return new Promise((resolve,rejected) => {
        db.query (`INSERT INTO public.schedule (    
            id_movie, 
            location_user,
            price_movie,
            date_start,
            date_end,
            time_movie,
            pick_cinema)
        VALUES($1,$2,$3,$4,$5,$6,$7)`, [
            id_movie, 
            location_user,
            price_movie,
            date_start,
            date_end,
            time_movie,
            pick_cinema])
            .then(() => {
                resolve('Data Succesfully Added! ')
            }).catch(() => {
                rejected('Failed to added the data')
            })
    })
}



model.editSch = ({id_schedule, location_user, price_movie, updated_at}) => {
    return new Promise((resolve,rejected) =>{
        db.query(` UPDATE public.schedule
        SET location_user = $2, price_movie = $3, updated_at = $4
        WHERE id_schedule = $1`, [id_schedule, location_user, price_movie, updated_at])
        .then(() => {
            resolve("Data Succesfully Updated")
        }).catch(() => {
            rejected('Failed to Updated The Data')
        })
    })
}


model.deleteSch = ({id_schedule}) =>{
    return new Promise((resolve,rejected) => {
        db.query('DELETE FROM public.schedule WHERE id_schedule = $1', [id_schedule])
        .then(() => {
            
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


model.getAllSch = () =>{
    return new Promise((resolve,rejected) => {
        db.query('select * from public.schedule order by schedule_id desc')
        .then(res => {
            resolve(res.rows)
        }).catch(() => {
            rejected('Failed to show the data')
        })
    })
}


model.getBy = async({page,limit,orderBy,search}) =>{
    try {
        let filterQuery = ''
        let orderQuery = ''
        let metaQuery = ''
        let count = 0

        if(search){
            filterQuery += escape('AND title_movie = %L', search)
        }

        if(orderBy){
            orderQuery += escape('ORDER BY %s DESC', orderBy)
        }

        if(page && limit){
            const offset = (page - 1) * limit
            metaQuery += escape('LIMIT %s OFFSET %s', limit, offset)
        }

        db.query(`SELECT COUNT (id_schedule) as "count" FROM public.schedule WHERE 
        true ${filterQuery}`).then((v)=> {
            count = v.rows[0].count
        })

        const data = await db.query(`
            SELECT 
                sch.id_schedule,
                sch.location_user,
                sch.price_movie,
                sch.date_start,
                sch.date_end,
                sch.time_movie,
                sch.pick_cinema,
                json_agg(
                    JSONB_BUILD_OBJECT(
                        'id', mv.id_movie,
                        'value', title_movie
                    )
                ) as title_movie,
                sch.created_at,
                sch.updated_at

                FROM public.schedule sch
                JOIN public.movie mv ON mv.id_movie = sch.id_movie
                WHERE true ${filterQuery}
                GROUP BY sch.id_schedule
                ${orderQuery} ${metaQuery}
        `)

        const meta = {
            next: count <= 0 ? null : page == Math.ceil(count / limit) ? null : Number(page) + 1,
            prev: page == 1 ? null : Number(page) - 1,
            total: count 
        }

        if(data.rows <= 0){
            return 'data not found'
        }else{
            return { data: data.rows,meta}
        }
    } catch (error) {
        throw error
    }
}


module.exports = model