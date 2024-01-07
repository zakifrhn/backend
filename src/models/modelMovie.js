const db = require('../config/db')
const model = {}
const escape = require('pg-format')



model.addMovie = ({
    title_movie, 
    release_date,  
    directed_by, 
    duration, 
    casts_movie, 
    image_movie, 
    synopsis_movie,
    id_genre
}) => {
    return new Promise((resolve,rejected) => {((
        db.query (`INSERT INTO public.movie (    
            title_movie, 
            release_date,  
            directed_by, 
            duration,
            casts_movie,
            image_movie, 
            synopsis_movie)
        VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id_movie`, [
        	title_movie, 
            release_date,  
            directed_by, 
            duration,
            casts_movie,
            image_movie, 
            synopsis_movie])
        ).then((result)=> {
            const idMovie = result.rows[0].id_movie
            const genrePromise = id_genre.map((genreId) =>{
                db.query(`INSERT INTO public.bridge_movie_genre(id_movie, id_genre) VALUES ($1, $2)`,[idMovie, genreId])
            })

            return Promise.all(genrePromise)
        })
        .catch((error)=>{
            console.error(error)
        })
        )
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
            resolve("Data Succesfully Deleted!")
        }).catch((error) => {
            rejected("Failed to deleted the data" + error)
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
        const data = db.query(`
            SELECT public.movie 
            WHERE title_movie = $1`,[title_movie])
        .then(()=> {
            resolve(data.rows)
        }).catch(()=>{
            rejected("Data is Not Found!")
        })
    })
}

model.getByMonth = ({release_date}) =>{
    return new Promise((resolve,reject) => {
        const data = db.query(`
            SELECT 
            mv.id_movie,
            mv.title_movie,
            mv.release_date,
            mv.directed_by,
            mv.duration,
            mv.casts_movie,
            mv.image_movie,
            mv.synopsis_movie,
            string_agg( g.genre_movie, ', ') as genre,
            mv.created_at,
            mv.updated_at

        FROM public.movie mv
        JOIN public.bridge_movie_genre bmg ON bmg.id_movie = mv.id_movie
        JOIN public.genre g ON bmg.id_genre = g.id_genre
            WHERE release_date::text LIKE '% ${release_date} %' GROUP BY mv.id_movie`)
        .then((data)=> {
            console.log(data)
            resolve(data.rows)
        }).catch((error)=>{
            console.log(error)
            reject("Data is Not Found!")
        })
    })
}

model.getBy = async({page,limit,orderBy,search,genre, month}) =>{
    try {
        let filterQuery = ''
        let orderQuery = ''
        let metaQuery = ''
        let count = 0

        month = "%"+month+"%"
        search = "%"+search+"%"

        if(search || genre || month){
            filterQuery += search ? escape(' AND LOWER(mv.title_movie) LIKE LOWER(%L)', search) : ''
            filterQuery += genre ? escape(' AND LOWER(g.genre_movie) = LOWER(%L)', genre) : ''
            filterQuery += month ? escape(' AND LOWER(mv.release_date) LIKE LOWER(%L)', month) : ''
        }

        if(orderBy){
            orderQuery += escape(' ORDER BY %s DESC', orderBy)
        }

        if(page && limit){
            const offset = (page - 1) * limit
            metaQuery += escape(' LIMIT %s OFFSET %s', limit, offset)
        }

        db.query(`SELECT COUNT (mv.id_movie) as "count" FROM public.movie mv
        JOIN public.bridge_movie_genre bmg ON bmg.id_movie = mv.id_movie
        JOIN public.genre g ON bmg.id_genre = g.id_genre  
        WHERE true ${filterQuery}`).then((v)=> {
            count = v.rows[0].count
        })

        console.log(`
        SELECT 
            mv.id_movie,
            mv.title_movie,
            mv.release_date,
            mv.directed_by,
            mv.duration,
            mv.casts_movie,
            mv.image_movie,
            mv.synopsis_movie,
            string_agg( g.genre_movie, ', ') as genre,
            mv.created_at,
            mv.updated_at

            FROM public.movie mv
            JOIN public.bridge_movie_genre bmg ON bmg.id_movie = mv.id_movie
            JOIN public.genre g ON bmg.id_genre = g.id_genre
            WHERE true ${filterQuery}
            GROUP BY mv.id_movie
            ${orderQuery} ${metaQuery}
    `)

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
                string_agg( g.genre_movie, ', ') as genre,
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

        if(data.rows < 0){
            return (filterQuery)
        }else{
            return { data: data.rows,meta}
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}



model.getDetail = ({id_movie}) =>{
    return new Promise((resolve,rejected) => {
        db.query(`
        SELECT 
        mv.id_movie,
        mv.title_movie,
        mv.release_date,
        mv.directed_by,
        mv.duration,
        mv.casts_movie,
        mv.image_movie,
        mv.synopsis_movie,
        string_agg (g.genre_movie, ', ') as genre,
        mv.created_at,
        mv.updated_at
        FROM public.movie mv
                JOIN public.bridge_movie_genre bmg ON bmg.id_movie = mv.id_movie
                JOIN public.genre g ON bmg.id_genre = g.id_genre
                where mv.id_movie = $1 GROUP BY mv.id_movie`,[id_movie])
        .then((data)=> {
            console.log(data)
            resolve(data.rows)
        }).catch((er)=>{
            console.log(er)
            rejected("Data is Not Found!")
        })
    })
}



model.editMovie = ({
    id_movie,
    title_movie,
    image_movie,
    synopsis_movie, 
    release_date,  
    directed_by, 
    duration,
    casts_movie,
    genre}) => {
    return new Promise((resolve, reject) => {
        const id_genre = Array.isArray(genre) ? genre : [genre]; // Parsing data JSON menjadi array id_genre


        db.query(`
            UPDATE public.movie SET 
            title_movie = COALESCE(NULLIF($2,''), title_movie), 
            image_movie = COALESCE(NULLIF($3,''), image_movie), 
            synopsis_movie = COALESCE(NULLIF($4,''), synopsis_movie), 
            release_date = COALESCE(NULLIF($5,''), release_date),  
            directed_by = COALESCE(NULLIF($6,''), directed_by), 
            duration = COALESCE(NULLIF($7,''), duration),
            casts_movie = COALESCE(NULLIF($8,''), casts_movie),
            updated_at = now()
            WHERE id_movie = $1
        `, [
            id_movie,
            title_movie,
            image_movie,
            synopsis_movie,
            release_date,
            directed_by,
            duration,
            casts_movie
        ])
        .then(() => {
            return db.query(`
                DELETE FROM public.bridge_movie_genre
                WHERE id_movie = $1
            `, [id_movie]);
        })
        .then(() => {
            const genrePromises = id_genre.map((genreId) => {
                return db.query(`
                    INSERT INTO public.bridge_movie_genre (id_movie, id_genre)
                    VALUES ($1, $2)
                `, [id_movie, genreId]);
            });

            return Promise.all(genrePromises);
        })
        .then(() => {
            resolve('Data has been updated');
        })
        .catch((error) => {
            reject('Sorry, data could not be updated', 500, console.error(error));
        });
    });
};



module.exports = model