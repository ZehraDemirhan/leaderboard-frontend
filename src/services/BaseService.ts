import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL
// axios.defaults.headers.common['Authorization'] = 'Bearer YOUR_TOKEN' (optional)

declare module 'axios' {
    export interface AxiosRequestConfig {
        buildQuery?: boolean
    }
}

abstract class BaseService<
    TIndexParams = Record<string, unknown>,
    TShowParams = Record<string, unknown>,
    TPayload = unknown,
    TResponse = AxiosResponse
> {
    public resource: string

    protected constructor(resource: string) {
        this.resource = resource
    }

    public index(params: TIndexParams = {} as TIndexParams, buildQuery = false): Promise<TResponse> {
        return axios.get(this.resource, {
            params,
            buildQuery,
        })
    }

    public show(id: string | number, params: TShowParams = {} as TShowParams, buildQuery = false): Promise<TResponse> {
        return axios.get(`${this.resource}/${id}`, {
            params,
            buildQuery,
        })
    }

    public store(payload: TPayload, config: AxiosRequestConfig = {}): Promise<TResponse> {
        return axios.post(this.resource, payload, config)
    }

    public update(
        id: string | number,
        payload: TPayload,
        config: AxiosRequestConfig = {},
        likePut = false
    ): Promise<TResponse> {
        return axios[likePut ? 'post' : 'put'](
            `${this.resource}/${id}${likePut ? '?_method=PUT' : ''}`,
            payload,
            config
        )
    }

    public destroy(id: string | number): Promise<TResponse> {
        return axios.delete(`${this.resource}/${id}`)
    }
}

export default BaseService
