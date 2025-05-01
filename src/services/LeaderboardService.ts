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
    public async getTopPlayers(): Promise<Player[]> {
        const res: AxiosResponse<{ data: Player[] }> = await this.index()
        return res.data.data
    }
}

export default new LeaderboardService()
