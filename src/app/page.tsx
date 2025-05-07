"use client"
import React, {useEffect, useState, useMemo, useCallback, useRef} from 'react'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import LeaderboardTable, { Player } from './components/LeaderboardTable'
import Autocomplete from "@/app/components/PlayerAutocomplete";
import LayersIcon from '@mui/icons-material/Layers'
import HeaderBar from "@/app/components/Headerbar";
import { lightTheme, darkTheme } from '../theme'
import LeaderboardService from '../services/LeaderboardService'
import { pusher } from '@/lib/broadcast'
import debounce from 'lodash.debounce';


const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        background: ${({ theme }) => theme.colors.background};
        color: ${({ theme }) => theme.colors.text};
        transition: background 0.3s, color 0.3s;
        font-family: 'Orbitron', sans-serif;
        background-image: ${({ theme }) => `url(${theme.background_url})`};
    }
`

const PageWrapper = styled.div`
    margin-top: 2rem;
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
  padding: 0.75rem 2rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-weight: bold;
  text-align: center;
`



export default function Home() {
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [groupByCountry, setGroup] = useState(false)
    const [players, setPlayers] = useState<Player[]>([])

    const [pool, setPool]       = useState<number>(0)
    const [nextResetAt, setNextResetAt] = useState<Date | null>(null)
    const [secondsLeft, setSecondsLeft] = useState(0)
    const [message, setMessage] = useState('')

    const [showDistributedMessage, setShowDistributedMessage] = useState(false)
    const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);
    const [isFetching, setIsFetching] = useState(false);// Tracks the last fetch time
    const [timeAgo, setTimeAgo] = useState('');

    const [highlightedId, setHighlightedId] = useState<number | null>(null);

    const [inputValue, setInputValue] = useState('');
    const debouncedSetSearch = useMemo(
        () => debounce((val: string) => setSearchTerm(val), 500),
        []
    );

    const skipNextFetch = useRef(false)

    useEffect(() => {
        return () => {
            debouncedSetSearch.cancel();
        };
    }, [debouncedSetSearch]);

    useEffect(() => {
        setTimeAgo('Last updated 0 secs ago')
        const interval = setInterval(() => {
            if (lastFetchedAt) {
                const now = new Date();
                const diffInSeconds = Math.floor((now.getTime() - lastFetchedAt.getTime()) / 1000);

                const hours = Math.floor(diffInSeconds / 3600);
                const minutes = Math.floor((diffInSeconds % 3600) / 60);
                const seconds = diffInSeconds % 60;

                setTimeAgo(
                    `Last updated ${hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''}` : ''} ${
                        minutes > 0 ? `${minutes} minute${minutes !== 1 ? 's' : ''}` : ''
                    } ${seconds > 0 ? `${seconds} second${seconds !== 1 ? 's' : ''}` : ''} ago`
                );
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [lastFetchedAt]);


    const fetchData = useCallback(() => {
        setIsFetching(true);
        LeaderboardService.getLeaderboard(searchTerm)
            .then(({ data, pool, nextResetAt }) => {
                console.log('DATA', data)
                // map in rank …
                setPlayers(data.map((p, i) => ({ ...p, rank: p.rank ?? i + 1 })));
                setPool(pool);
                setNextResetAt(new Date(nextResetAt));
                setLastFetchedAt(new Date());

                // FIND exact match
                const match = data.find(p => p?.name?.toLowerCase() === searchTerm?.toLowerCase());
                if (match) {
                    setHighlightedId(match.playerId);
                    // scroll will happen via ref effect (below)
                } else {
                    setHighlightedId(null);
                }

                setIsFetching(false);
            })
            .catch(console.error);
    }, [searchTerm]);


    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        const interval = setInterval(() => {
            fetchData(); // Fetch data every 5 minutes
        }, 20 * 60000); // 60000 ms = 1 minute

        return () => clearInterval(interval);
    }, [fetchData]);


    useEffect(() => {
        if (secondsLeft === 1) {
            fetchData();
        }
    }, [secondsLeft]);



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

    useEffect(() => {
        const channel = pusher.subscribe('private-leaderboard')

        /*
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
        })*/

        channel.bind('prize', (payload: {
            playerId: number;
            award: number;
            pool: number;
            isFirst: boolean;
            isLast: boolean;
        }) => {
            setHighlightedId(null)
            const CHUNK = 1000;
            if (payload.isFirst) {
                setMessage('Distributing prizes…');
                setShowDistributedMessage(true);
            }
            setPool(payload.pool);
            setPlayers(prev =>
                prev.map(p =>
                    p.playerId === payload.playerId
                        ? { ...p, justWon: payload.award }
                        : p
                )
            );
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
                        }, 4000);
                    }
                    return;
                }

                // compute how much to award this tick (never more than what's left)
                const awardThisTick = Math.min(remaining, CHUNK);

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
    }, [fetchData])

    const handleFetchNow = () => {
        fetchData(); // Trigger manual data fetch
    };


    const handleSelect = (player: Player) => {
        // e.g. set both searchTerm & inputValue
        setInputValue(player.name)
        setSearchTerm(player.name)
    }

    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
    const seconds = String(secondsLeft % 60).padStart(2, '0')

    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <GlobalStyle />

            <HeaderBar
                isFetching={isFetching}
                timeAgo={timeAgo}
                lastFetchedAt={lastFetchedAt}
                onRefresh={handleFetchNow}
                logoSrc="https://www.panteon.games/wp-content/uploads/2021/05/news03.png"
                isDarkMode={isDarkMode}
                onToggleTheme={() => setIsDarkMode(dm => !dm)}
            />

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
                    <Autocomplete
                        value={inputValue}
                        onChange={val => {
                            setInputValue(val)
                            debouncedSetSearch(val)
                        }}
                        onSelect={handleSelect}
                        placeholder="Search by name…"
                    />
                    <GroupButton onClick={() => setGroup(g => !g)}>
                        <LayersIcon/>
                    </GroupButton>
                </Controls>

                <LeaderboardTable
                    players={players}
                    groupByCountry={groupByCountry}
                    highlightedId={highlightedId}
                />
            </PageWrapper>
        </ThemeProvider>
    )
}
