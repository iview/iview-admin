const DEV_URL = 'https://www.easy-mock.com/mock/5add9213ce4d0e69998a6f51/iview-admin/'
const PRO_URL = 'https://produce.com'

export default process.env.NODE_ENV === 'development' ? DEV_URL : PRO_URL
