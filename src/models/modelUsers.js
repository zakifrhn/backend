const db = require('../config/db')
const model = {}

model.getData = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM public.users ORDER BY created_at DESC')
            .then((res) => {
                let result = res.rows
                if (res.rows <= 0) {
                    result = 'data not found'
                }

                resolve(result)
            })
            .catch((er) => {
                reject(er)
            })
    })
}

model.getByUser = (username) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT id_user, email, roles, fullname, phone_number, image_user FROM public.users WHERE username = $1', [username])
            .then((res) => {
                resolve(res.rows)
            })
            .catch((er) => {
                reject(er)
            })
    })
}

model.getByRole =(username) =>{
    return new Promise ((resolve, reject) =>{
        db.query('SELECT roles from public.users WHERE username = $1', [username])
        .then((res)=>{
            if(res.rows.length){
                resolve(res.rows[0].roles)
            }
            else[
                resolve(false)
            ]
        })
        .catch((er)=>{
            reject(er)
        })
    })
}


model.getByPassword = (username) =>{
    return new Promise ((resolve,reject) =>{
        db.query('SELECT pass, roles from public.users WHERE username = $1', [username])
        .then((res)=>{
            if(res.rows.length){
                resolve(res.rows[0].pass)
                //resolve()
            }
            else{
                resolve(false)
            }
        })
        .catch((er)=>{
            reject(er)
        })
    })
}

model.dataExists = (username) => {
    return new Promise ((resolve,reject) =>{
        db.query(`SELECT id_user from users WHERE username = $1`, [username])
        .then((res) =>{
         resolve(res.rows)   
        })
        .catch((er) =>{
            reject(er)
        })
    })
}

model.emailExists = (email) =>{
    return new Promise ((resolve, reject) =>{
        db.query(`SELECT * from users WHERE email = $1`, [email])
        .then((res) =>{
            resolve(res.rows)
        })
        
        .catch((er)=>{
            error = "Failed"
            reject(er)
        })
    })
    }

model.updateStatus = ({status, email}) => {
    return new Promise ((resolve, reject) =>{
        db.query(`
        UPDATE public.users 
        SET
        status = $1
        WHERE email=$2`, 
        [status, email]
        )
        .then((result)=>{
            resolve(result)
        })
        .catch((error)=>{
            console.log(error)
            reject(error)
        })
    })
}

model.readStatus = (username) => {
    return new Promise ((resolve, reject) =>{
        db.query(`
        SELECT status from public.users
        WHERE username = $1`, 
        [username]
        )
        .then((result)=>{
            if(result.rows.length){
                resolve(result.rows[0].status)
        }})
        .catch((error)=>{
            error ='verification failed'
            
            reject(error)
        })
    })
}


model.saveData = ({fullname, username, pass, email, roles }) => {
    return new Promise((resolve, reject) => {

          db.query(
                    `INSERT INTO public.users
                    (fullname, username, pass, email, roles)
                    VALUES($1, $2, $3, $4, $5);            
                `,
                    [fullname, username, pass, email, roles]
                )

            .then((res) => {
                resolve(`${res.rowCount} user updated`)
            })
            .catch((er) => {
                er = "update failed"
                reject(er)
            })
    })
}


model.updateData = ({ fullname, phone_number, email, id_user}) => {
    return new Promise((resolve, reject) => {

        db.query(
            `UPDATE public.users SET
                fullname = COALESCE(NULLIF($1,''), fullname),
                phone_number = COALESCE(NULLIF($2,''), phone_number),
                email = COALESCE(NULLIF($3,''), email),
                updated_at = now()
            WHERE id_user = $4           
        `,
            [fullname, phone_number, email, id_user]
        )
            .then((res) => {
                resolve(`${res.rowCount} user updated`)
            })
            .catch((er) => {
                reject(er)
                console.log(er)
            })
    })
}

model.updatePassword = ({pass, id_user}) =>{
    return new Promise((resolve, reject)=>{
        
        db.query(
            `UPDATE public.users SET
            pass = $1, updated_at = now()
            WHERE id_user = $2
        `,
        [pass,id_user]
        )
        .then((res)=>{
            console.log(pass)
            resolve (`${res.rowCount} password has been updated`)
        })
        .catch((er)=>{
            reject(er, 'sorry update password failed ')
            console.log(er)
        })
    })
}

model.updateImg = ({image_user, id_update})=>{
    return new Promise ((resolve, reject)=>{
        db.query(
            `UPDATE public.users SET
            image_user = $1, updated_at = now()
            WHERE id_user = $2
            `,[image_user, id_update]
        ).then((res)=>{
            resolve(`${res.rowCount} image has been updated`)
        })
        .catch((er)=>{
            reject(er, 'sorry update password failed ')
        })
    })
}

model.deleteData = (username) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM public.users WHERE username = $1`, [username])
            .then((res) => {
                resolve(`${res.rowCount} user deleted`)
            })
            .catch((er) => {
                reject(er)
            })
    })
}

module.exports = model
