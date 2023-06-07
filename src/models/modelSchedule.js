const db = require('../config/db')
const model = {}

model.addSch = ({
    location_user,
    price_movie,
    date_start,
    date_end,
    time_movie,
    pick_cinema,
    movie_id, }) => {
    return new Promise((resolve,rejected) => {
        db.query (`INSERT INTO public.schedule (    
            location_user,
            price_movie,
            date_start,
            date_end,
            time_movie,
            pick_cinema,
            movie_id)
        VALUES($1,$2,$3,$4,$5,$6,$7)`, [
        	location_user,
            price_movie,
            date_start,
            date_end,
            time_movie,
            pick_cinema,
            movie_id])
            .then(() => {
                resolve('Data Succesfully Added! ')
            }).catch(() => {
                rejected('Failed to added the data')
            })
    })
}



model.editSch = ({schedule_id,movie_id,updated_at}) => {
    return new Promise((resolve,rejected) =>{
        db.query(` UPDATE public.schedule
        SET movie_id = $2, updated_at = $3
        WHERE schedule_id = $1`, [schedule_id,movie_id,updated_at])
        .then(() => {
            resolve("Data Succesfully Updated")
        }).catch(() => {
            rejected('Failed to Updated The Data')
        })
    })
}


model.deleteSch = ({schedule_id}) =>{
    return new Promise((resolve,rejected) => {
        db.query('DELETE FROM public.schedule WHERE schedule_id = $1', [schedule_id])
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


module.exports = model