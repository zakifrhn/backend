const db = require('../config/db')
const model = {}

// model.createProduct = () =>{
//     return new Promise ((resolve, rejected) => {
//         db.query(`CREATE TABLE public.movie(	
//             movie_id SERIAL primary key,
//             title_movie VARCHAR not NULL,
//             genre_movie VARCHAR not NULL, 
//             release_date VARCHAR not NULL, 
//             directed_by VARCHAR not NULL,
//             duration varchar not NULL,
//             casts_movie ,
//             image_movie varchar, 
//             synopsis_movie TEXT not NULL,
//             date_user DATE not NULL,
//             kota_user VARCHAR not NULL, 
//             created_at TIMESTAMP not NULL,
//             updated_at TIMESTAMP);`)
//         .then(res =>{
//             resolve(res.rows)
//         }).catch(er => {
//             rejected(er)
//         })
//     })
// }


model.addMovie = ({
    title_movie, 
    genre_movie,  
    release_date,  
    directed_by, 
    duration, 
    casts_movie, 
    image_movie, 
    synopsis_movie, 
    date_user, 
    kota_user }) => {
    return new Promise((resolve,rejected) => {
        db.query (`INSERT INTO public.movie (    
            title_movie, 
            genre_movie,  
            release_date,  
            directed_by, 
            duration,
            casts_movie,
            image_movie, 
            synopsis_movie ,
            date_user,
            kota_user)
        VALUES($1, $2, $3,$4,$5,$6,$7,$8,$9,$10)`, [
        	title_movie, 
            genre_movie,  
            release_date,  
            directed_by, 
            duration,
            casts_movie,
            image_movie, 
            synopsis_movie ,
            date_user,
            kota_user ])
        .then(() => {
            resolve('Data Succesfully Added! ')
        }).catch(() => {
            rejected('Failed to added the data')
        })
    })
}

model.deleteMovie = ({id_movie}) =>{
    return new Promise((resolve,rejected) => {
        db.query('DELETE FROM public.movie WHERE id_movie = $1', [id_movie])
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

/**
 * 
 * delete masih blm bisa
 * 
 * error: syntax error at or near "movie"
    at Parser.parseErrorMessage (D:\Seleksi Fazztrack\Rabu (31-05-23)\movie_tickitz\node_modules\pg-protocol\dist\parser.js:287:98)
    at Parser.handlePacket (D:\Seleksi Fazztrack\Rabu (31-05-23)\movie_tickitz\node_modules\pg-protocol\dist\parser.js:126:29)
    at Parser.parse (D:\Seleksi Fazztrack\Rabu (31-05-23)\movie_tickitz\node_modules\pg-protocol\dist\parser.js:39:38)
    at Socket.<anonymous> (D:\Seleksi Fazztrack\Rabu (31-05-23)\movie_tickitz\node_modules\pg-protocol\dist\index.js:11:42)
    at Socket.emit (node:events:513:28)
    at addChunk (node:internal/streams/readable:324:12)
    at readableAddChunk (node:internal/streams/readable:297:9)
    at Readable.push (node:internal/streams/readable:234:10)
    at TCP.onStreamRead (node:internal/stream_base_commons:190:23) {
  length: 94,
  severity: 'ERROR',
  code: '42601',
  detail: undefined,
  hint: undefined,
  position: '29',
  internalPosition: undefined,
  internalQuery: undefined,
  where: undefined,
  schema: undefined,
  table: undefined,
  column: undefined,
  dataType: undefined,
  constraint: undefined,
  file: 'scan.l',
  line: '1192',
  routine: 'scanner_yyerror'
 */

model.editMovie = ({id_movie, title_movie,date_user,kota_user, updated_at}) =>{
    return new Promise((resolve,rejected) => {
        db.query(` UPDATE public.movie
        SET title_movie = $2 ,date_user = $3 ,kota_user = $4, updated_at = $5
        WHERE id_movie = $1`, [id_movie,title_movie,date_user,kota_user, updated_at])
        .then(() => {
            resolve("Data Succesfully Updated")
        }).catch(() => {
            rejected('Failed to Updated The Data')
        })
    })
}


model.getAllMovie = () =>{
    return new Promise((resolve,rejected) => {
        db.query('select * from public.movie order by id_movie desc')
        .then((res) => {
            resolve(res.rows)
        }).catch(()=>{
            rejected("Data is Not Found!")
        })
    })
}


model.getName = ({title_movie}) =>{
    return new Promise((resolve,rejected) => {
        db.query(`
            SELECT movie.* from movie
            where title_movie = $1`,[title_movie])
        .then(res => {
            resolve(res.rows)
        }).catch(()=>{
            rejected("Data is Not Found!")
        })
    })
}

model.sortNameRelease = () => {
    return new Promise((resolve,rejected) => {
        db.query(`SELECT movie.* from movie
        ORDER BY title_movie ASC, release_date DESC`) 
        .then(res => {
            resolve(res.rows)
        }).catch(()=>{
            rejected("Data is Not Found!")
        })
    })
}

// SELECT public.movie.*, public.schedule.*, public.book.*
// FROM movie  
// JOIN schedule ON movie.id_movie = schedule.movie_id 
// JOIN book ON movie.id_movie = book.movie_id  
// order BY title_movie ASC, release_date DESC;


// JOIN schedule ON movie.id_movie = schedule.movie_id join book on movie.id_movie = book.movie_id 
// select title_movie, release_date from public.movie order by id_movie desc
// // SELECT public.movie.*, public.schedule.*, public.book.*
// FROM movie  
// JOIN schedule ON movie.id_movie = schedule.movie_id join book on movie.id_movie = book.movie_id  where title_movie = $1

module.exports = model