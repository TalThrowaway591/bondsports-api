import 'dotenv/config'

const Config = {
    port: Number(process.env.PORT) || 3000
}

export { Config }