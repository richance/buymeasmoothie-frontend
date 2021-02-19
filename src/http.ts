import axios from 'axios';

export interface IHttpResponse<Data = any> {
    status: number;
    data?: Data;
}

export const http = axios.create({
    baseURL: 'https://api.buymeasmoothie.xyz/',
});
