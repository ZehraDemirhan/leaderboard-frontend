import BaseService from './BaseService'
import type { Player } from '@/app/components/LeaderboardTable'
import axios, { AxiosResponse } from 'axios'

class LeaderboardService extends BaseService {
    constructor() {
        super('/api/v1/leaderboard')
    }

    public async getLeaderboard(searchTerm: string): Promise<LeaderboardResponse> {
        const res: AxiosResponse<LeaderboardResponse> =
            await this.index({ searchTerm })

        return res.data
    }

    /**
     * Fetch autocomplete suggestions for player names.
     * @param searchTerm prefix to search (must be at least 2 chars on server)
     * @returns array of matching players
     */
    public async getAutoCompleteSuggestions(searchTerm: string): Promise<Player[]> {
        // If you want, you can early-return an empty array for very short terms:
        if (searchTerm.length < 2) {
            return []
        }

        const res: AxiosResponse<Player[]> = await axios.get(`${this.resource}/autocomplete`, {
            params: { q: searchTerm },
        })

        return res.data
    }
}

const leaderboardService = new LeaderboardService()
export default leaderboardService

export interface LeaderboardResponse {
    data: Player[]
    pool: number
    nextResetAt: string
}