const db = require('../config/db')
const model = {}

model.addBooking = ({
	movie_id,
	pick_cinema,
	pick_date , 
	duration, 
	price,
	seat_user ,
	total_payment }) => {
    return new Promise((resolve,rejected) => {
        db.query (`INSERT INTO public.book (    
            movie_id,
            pick_cinema,
            pick_date , 
            duration, 
            price,
            seat_user ,
            total_payment)
        VALUES($1,$2,$3,$4,$5,$6,$7)`, [
            movie_id,
            pick_cinema,
            pick_date , 
            duration, 
            price,
            seat_user ,
            total_payment])
            .then(() => {
                resolve('Data Succesfully Added! ')
            }).catch(() => {
                rejected('Failed to added the data')
            })
    })
}



model.editBooking = ({
    id_order,
	pick_cinema,
	pick_date, 
	price,
	seat_user ,
	total_payment,
    updated_at}) => {
    return new Promise((resolve,rejected) =>{
        db.query(` UPDATE public.book
        SET pick_cinema = $2, pick_date = $3, price = $4, 
        seat_user = $5, total_payment = $6, updated_at = $7 
        WHERE id_order = $1`, [	
            id_order,
            pick_cinema,
            pick_date, 
            price,
            seat_user ,
            total_payment,
            updated_at])
            .then(() => {
                resolve("Data Succesfully Updated")
            }).catch(() => {
                rejected('Failed to Updated The Data')
            })
    })
}


model.deleteBooking = ({id_order}) =>{
    return new Promise((resolve,rejected) => {
        db.query('DELETE FROM public.book WHERE id_order = $1', [id_order])
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


model.getAllBooking = () =>{
    return new Promise((resolve,rejected) => {
        db.query('select * from public.book order by id_order desc')
        .then(res => {
            resolve(res.rows)
        }).catch(() => {
            rejected('Failed to show the data')
        })
    })
}


module.exports = model