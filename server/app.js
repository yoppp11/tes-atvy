const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
const errorMiddleware = require('./middlewares/errorMiddleware')

app.use(cors()) 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', require('./routers/index'))
app.use(errorMiddleware)



app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`)
})