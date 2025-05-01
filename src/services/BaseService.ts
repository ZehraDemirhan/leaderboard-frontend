import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

// Optional: global axios config (baseURL, auth token, etc.)
axios.defaults.baseURL = 'http://localhost:3333' // ⬅️ your AdonisJS server URL
// axios.defaults.headers.common['Authorization'] = 'Bearer YOUR_TOKEN' (optional)

declare module 'axios' {
    export interface AxiosRequestConfig {
        buildQuery?: boolean
    }
}

/**
 * Abstract base class for API service logic
 */
abstract class BaseService {
    public resource: string

    protected constructor(resource: string) {
        this.resource = resource
    }

    public index(params: any = {}, buildQuery = false): Promise<AxiosResponse> {
        return axios.get(this.resource, {
            params,
            buildQuery,
        })
    }

    public show(id: string | number, params: any = {}, buildQuery = false): Promise<AxiosResponse> {
        return axios.get(`${this.resource}/${id}`, {
            params,
            buildQuery,
        })
    }

    public store(payload: any, config: AxiosRequestConfig = {}): Promise<AxiosResponse> {
        return axios.post(this.resource, payload, config)
    }

    public update(
        id: string | number,
        payload: any,
        config: AxiosRequestConfig = {},
        likePut = false
    ): Promise<AxiosResponse> {
        return axios[likePut ? 'post' : 'put'](
            `${this.resource}/${id}${likePut ? '?_method=PUT' : ''}`,
            payload,
            config
        )
    }

    public destroy(id: string | number): Promise<AxiosResponse> {
        return axios.delete(`${this.resource}/${id}`)
    }
}

export default BaseService
