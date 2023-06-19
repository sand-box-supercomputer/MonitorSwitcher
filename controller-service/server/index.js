import next from "next"
import { expressApp, server } from "./server.js"

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const PORT = 443

console.log("Start controller service")

app.prepare()
    .then(() => {
        expressApp.get('*', (req, res) => {
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