import axios from "axios";

export default class DevPlusApiService
{
    async Post(url, data, token?) {

        const headers = {};
        
        if (token) {
          headers["accesstoken"] = `${token}`;
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}`+ url, data, { headers });
            return response.data;
        } catch (err) {
            console.error(err);
            return err;
        }
    }
}
