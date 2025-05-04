"use client"
import React, {useEffect, useRef, useState} from 'react'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import LeaderboardTable, { Player } from './components/LeaderboardTable'
import SearchIcon from '@mui/icons-material/Search'
import LayersIcon from '@mui/icons-material/Layers'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { lightTheme, darkTheme } from '../theme'
import LeaderboardService from '../services/LeaderboardService'
import { pusher } from '@/lib/broadcast'

// Extend Player to include optional justWon for UI highlighting
interface PlayerWithPrize extends Player {
    justWon?: number
}

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        background: ${({ theme }) => theme.colors.background};
        color: ${({ theme }) => theme.colors.text};
        transition: background 0.3s, color 0.3s;
        font-family: 'Orbitron', sans-serif;
        background-image: ${({ theme }) => `url(${theme.background_url})`};
        background-repeat: no-repeat;
    }
`

const HeaderBar = styled.header`
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #28282C;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`

const Logo = styled.img`
    height: 70px;
`

const ThemeToggle = styled.button`
    position: absolute;
    right: 2.5rem;
    color: #ECECEC;
    cursor: pointer;
    background-color: rgba(154, 152, 152, 0.24);
    border-radius: 5px;
    padding: 5px;
    &:hover { color: #AAA; }
`

const PageWrapper = styled.div`
    margin-top: 4rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Controls = styled.div`
    width: 100%;
    max-width: 800px;
    display: flex;
    align-items: center;
    margin: 1rem 0;
`

const SearchWrapper = styled.div`
    position: relative;
    flex: 1;
`

const SearchIconWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 0.75rem;
    transform: translateY(-50%);
    color: #AAA;
`

const SearchInput = styled.input`
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 2.5rem;
    background-color: ${({ theme }) => theme.colors.inputBg};
    border: none;
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.text};
    &::placeholder { color: #AAA; }
`

const PoolDisplay = styled.div`
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
`

const GroupButton = styled.button`
    background-color: ${({ theme }) => theme.colors.controlBg};
    border: none;
    border-radius: 4px;
    margin-left: 1rem;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text};
`

const Title = styled.h1`
    font-size: 2rem;
    margin: 1rem 0;
    color: ${({ theme }) => theme.colors.primary};
`

const Timer = styled.div`
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-family: 'Orbitron', sans-serif;
`

const Banner = styled.div`
  background: ${({ theme }) => theme.colors.headerBg};
  color: ${({ theme }) => theme.colors.text};
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-weight: bold;
  text-align: center;
`

export default function Home() {
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [groupByCountry, setGroup] = useState(false)
    const [players, setPlayers] = useState<PlayerWithPrize[]>([])

    const [pool, setPool]       = useState<number>(0)
    const [nextResetAt, setNextResetAt] = useState<Date | null>(null)
    const [secondsLeft, setSecondsLeft] = useState(0)
    const [message, setMessage] = useState('')

    const [showDistributedMessage, setShowDistributedMessage] = useState(false)


    // Fetch leaderboard + pool + nextResetAt
    const fetchData = () => {
        console.log('FETCH DATAHA')
        LeaderboardService.getLeaderboard(searchTerm)
            .then(({ data, pool, nextResetAt }) => {
                setPlayers(
                    data.map((p, i) => ({ ...p, rank: i + 1 }))
                )
                setPool(pool)
                setNextResetAt(new Date(nextResetAt))
            })
            .catch(console.error)
    }

    // Initial load & on searchTerm change
    useEffect(fetchData, [searchTerm])

    // Countdown effect using server timestamp
    useEffect(() => {
        if (!nextResetAt) return
        const tick = () => {
            const diff = Math.floor((nextResetAt.getTime() - Date.now()) / 1000)
            setSecondsLeft(diff > 0 ? diff : 0)
        }
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [nextResetAt])

    /*
    useEffect(() => {
        if (!didInitialRun.current) {
            // skip the first run
            didInitialRun.current = true
            return
        }
        if (pool === 0) {
            // show the “distributed” banner
            setShowDistributedMessage(true)
            // hide banner after 5 seconds
            const t = setTimeout(() => {
                setShowDistributedMessage(false)
                fetchData()
            }, 10000)
            return () => clearTimeout(t)
        }
    }, [pool])
    */


    // Refetch when countdown hits zero


    // Real-time updates & prize events
    useEffect(() => {
        const channel = pusher.subscribe('private-leaderboard')

        // score & pool updates
        channel.bind('update', (payload: { playerId: number; money: number; pool: number }) => {
            setPlayers(prev =>
                prev.map(p =>
                    p.playerId === payload.playerId
                        ? { ...p, money: payload.money }
                        : p
                )
            )
            setPool(payload.pool)
        })

        channel.bind('prize', (payload: {
            playerId: number;
            award: number;
            pool: number;
            isFirst: boolean;
            isLast: boolean;
        }) => {
            const CHUNK = 100;

            // 1) INITIAL BANNER
            if (payload.isFirst) {
                setMessage('Distributing prizes…');
                setShowDistributedMessage(true);
            }

            // 2) UPDATE POOL & HIGHLIGHT WINNER
            setPool(payload.pool);
            setPlayers(prev =>
                prev.map(p =>
                    p.playerId === payload.playerId
                        ? { ...p, justWon: payload.award }
                        : p
                )
            );

            // 3) SMOOTHLY ADD COINS
            let remaining = payload.award;
            const iv = setInterval(() => {
                if (remaining <= 0) {
                    clearInterval(iv);

                    // remove the highlight
                    setPlayers(prev =>
                        prev.map(p =>
                            p.playerId === payload.playerId
                                ? { ...p, justWon: undefined }
                                : p
                        )
                    );

                    // if this was the last prize, show completion banner
                    if (payload.isLast) {
                        setMessage('🎉 All rewards for this week have been distributed!');
                        setShowDistributedMessage(true);
                        setTimeout(() => {
                            setMessage('New data fetching...')
                        }, 1000);
                        setTimeout(() => {

                            setShowDistributedMessage(false);
                            fetchData();
                        }, 5000);
                    }
                    return;
                }

                // compute how much to award this tick (never more than what's left)
                const awardThisTick = Math.min(remaining, CHUNK);

                // award it
                setPlayers(prev =>
                    prev.map(p =>
                        p.playerId === payload.playerId
                            ? { ...p, money: p.money + awardThisTick }
                            : p
                    )
                );
                remaining -= awardThisTick;
            }, 30);
        });


        return () => {
            channel.unbind_all()
            pusher.unsubscribe('private-leaderboard')
        }
    }, [])

    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
    const seconds = String(secondsLeft % 60).padStart(2, '0')

    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <GlobalStyle />

            <HeaderBar>
                <Logo src="https://www.panteon.games/wp-content/uploads/2021/05/news03.png" alt="Logo" />
                <ThemeToggle onClick={() => setIsDarkMode(dm => !dm)}>
                    {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </ThemeToggle>
            </HeaderBar>

            <PageWrapper>
                <Title>Leaderboard</Title>
                <PoolDisplay>Prize pool: {pool.toLocaleString()}</PoolDisplay>
                <Timer>Next reset in: {minutes}:{seconds}</Timer>

                {showDistributedMessage && (
                    <Banner>
                        {message}
                    </Banner>
                )}

                <Controls>
                    <SearchWrapper>
                        <SearchIconWrapper>
                            <SearchIcon fontSize="small" />
                        </SearchIconWrapper>
                        <SearchInput
                            type="text"
                            placeholder="Search by name, country, or ID…"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </SearchWrapper>
                    <GroupButton onClick={() => setGroup(g => !g)}>
                        <LayersIcon />
                    </GroupButton>
                </Controls>

                <LeaderboardTable
                    players={players}
                    groupByCountry={groupByCountry}
                />
            </PageWrapper>
        </ThemeProvider>
    )
}
