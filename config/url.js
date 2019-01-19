import env from './env'

const DEV_URL = 'http://localhost:3000/'
const PRO_URL = 'http://localhost:3000'

export default env === 'development' ? DEV_URL : PRO_URL
