import next from "next"
import { server } from "./server.js"

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const PORT = 10555

app.prepare()
    .then(() => {
        server.get('*', (req, res) => {
            return handle(req, res)
        })
        server.listen(PORT, (err) => {
            if (err) throw err
            console.log(`Ready on http://localhost:${PORT}`)
        })
    })
    .catch((ex) => {
        process.exit(1)
    })