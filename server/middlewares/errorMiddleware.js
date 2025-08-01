module.exports = async function errorMiddleware(err, req, res, next){
    if(err.name === 'SequelizeValidationError'|| err.name === 'SequelizeUniqueConstraintError') return res.status(400).send({ message: err.errors[0].message })

    if(err.name === 'BadRequest') return res.status(400).send({ message: err.message })
    if(err.name === 'Unauthorized') return res.status(401).send({ message: err.message })
    if(err.name === 'Forbidden') return res.status(403).send({ message: err.message })
    if(err.name === 'NotFound') return res.status(404).send({ message: err.message })
    
    return res.status(500).send({
        message: err.message || 'Internal Server Error'
    })
}