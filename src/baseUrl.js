/**
 * Created by user on 2017/1/13.
 */
import env from 'get-env'

const baseUrl = () => {
    if (env() === 'dev') {
        return 'http://localhost:9000';
    } else {
        return '';
    }
};

export default baseUrl;
