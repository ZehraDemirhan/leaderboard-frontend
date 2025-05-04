import BaseService from './BaseService'
import type { Player } from '@/app/components/LeaderboardTable'
import type { AxiosResponse } from 'axios'

class LeaderboardService extends BaseService {
    constructor() {
        super('/api/v1/leaderboard')
    }

    /**
     * Fetches the top leaderboard players
     */
    public async getLeaderboard(searchTerm: string): Promise<LeaderboardResponse> {
        const res: AxiosResponse<{ data: LeaderboardResponse }> = await this.index({searchTerm})
        return res.data
    }
}

export default new LeaderboardService()

export interface LeaderboardResponse {
    data: Player[]
    pool: number
    nextResetAt: string
}