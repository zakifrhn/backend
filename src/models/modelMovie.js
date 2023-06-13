const db = require('../config/db')
const model = {}
const escape = require('pg-format')

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
    release_date,  
    directed_by, 
    duration, 
    casts_movie, 
    image_movie, 
    synopsis_movie, 
    date_user, 
    kota_user,
    // id_movie, id_genre 
}) => {
    return new Promise((resolve,rejected) => {
        db.query (`INSERT INTO public.movie (    
            title_movie, 
            release_date,  
            directed_by, 
            duration,
            casts_movie,
            image_movie, 
            synopsis_movie ,
            date_user,
            kota_user)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [
        	title_movie, 
            release_date,  
            directed_by, 
            duration,
            casts_movie,
            image_movie, 
            synopsis_movie ,
            date_user,
            kota_user ])
            // .then(() =>{
            //     return db.query(`INSERT INTO public.bridge_movie_genre (id_movie, id_genre) VALUES ($1, $2)`, [id_movie, id_genre]);
            // })
        .then(() => {
            resolve('Data Succesfully Added! ')
        }).catch((error) => {
            rejected ({
                throw : error})
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
        }).catch((error) => {
            rejected("Failed to deleted the data" + error)
        })
    })
}


model.editMovie = ({id_movie, title_movie,image_movie,synopsis_movie, updated_at}) =>{
    return new Promise((resolve,rejected) => {
        db.query(` UPDATE public.movie SET title_movie = $2, image_movie = $3, synopsis_movie = $4, updated_at = $5
        WHERE id_movie = $1`, [id_movie,title_movie,image_movie, synopsis_movie, updated_at])
        .then(() => {
            resolve("Data Succesfully Updated")
        }).catch((error) => {
            rejected('Failed to Updated The Data' + error   )
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

        db.query(`SELECT COUNT (id_movie) as "count" FROM public.movie WHERE 
        true ${filterQuery}`).then((v)=> {
            count = v.rows[0].count
        })

        const data = await db.query(`
            SELECT 
                mv.id_movie,
                mv.title_movie,
                mv.release_date,
                mv.directed_by,
                mv.duration,
                mv.casts_movie,
                mv.image_movie,
                mv.synopsis_movie,
                json_agg(
                    JSONB_BUILD_OBJECT(
                        'id', bmg.id_bridge,
                        'value', g.genre_movie
                    )
                ) as genre,
                mv.created_at,
                mv.updated_at

                FROM public.movie mv
                JOIN public.bridge_movie_genre bmg ON bmg.id_movie = mv.id_movie
                JOIN public.genre g ON bmg.id_genre = g.id_genre
                WHERE true ${filterQuery}
                GROUP BY mv.id_movie
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