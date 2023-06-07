const ctrl = {}
const model = require('../models/modelSchedule')

ctrl.saveData = async (req,res) => {
    try {
        const {
            location_user,
            price_movie,
            date_start,
            date_end,
            time_movie,
            pick_cinema,
            movie_id
        } = req.body

        const result = await model.addSch({
            location_user,
            price_movie,
            date_start,
            date_end,
            time_movie,
            pick_cinema,
            movie_id
        })
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}

ctrl.delData = async (req,res) =>{
    try {
        const schedule_id  = req.params.id
        //const { id_movie } = req.params.id
        const result = await model.deleteSch({schedule_id})
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}

ctrl.editData = async(req,res) => {
    try {
        const schedule_id =  req.params.id
        const {movie_id,updated_at} = req.body
        const result = await model.editSch({schedule_id,movie_id,updated_at})
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}

/**
 * app running on port 5200
error: null value in column "title_movie" of relation "movie" violates not-null constraint
    at Parser.parseErrorMessage (D:\Seleksi Fazztrack\Rabu (31-05-23)\movie_tickitz\node_modules\pg-protocol\dist\parser.js:287:98)
    at Parser.handlePacket (D:\Seleksi Fazztrack\Rabu (31-05-23)\movie_tickitz\node_modules\pg-protocol\dist\parser.js:126:29)
    at Parser.parse (D:\Seleksi Fazztrack\Rabu (31-05-23)\movie_tickitz\node_modules\pg-protocol\dist\parser.js:39:38)
    at Socket.<anonymous> (D:\Seleksi Fazztrack\Rabu (31-05-23)\movie_tickitz\node_modules\pg-protocol\dist\index.js:11:42)
    at Socket.emit (node:events:513:28)
    at addChunk (node:internal/streams/readable:324:12)
    at readableAddChunk (node:internal/streams/readable:297:9)
    at Readable.push (node:internal/streams/readable:234:10)
    at TCP.onStreamRead (node:internal/stream_base_commons:190:23) {
  length: 296,
  severity: 'ERROR',
  code: '23502',
  detail: 'Failing row contains (14, null, null, null, null, null, null, null, null, null, null, 2023-06-04 15:44:46.543638, null).',
  hint: undefined,
  position: undefined,
  internalPosition: undefined,
  internalQuery: undefined,
  where: undefined,
  schema: 'public',
  table: 'movie',
  column: 'title_movie',
  dataType: undefined,
  constraint: undefined,
  file: 'execmain.c',
  line: '1974',
  routine: 'ExecConstraints'
}
 */

ctrl.getData = async (req,res) => {
    try{
        const result =  await model.getAllSch()
        return res.status(200).json(result)
    }catch(error){
        console.log(error)
    }
}

module.exports = ctrl