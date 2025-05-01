"use client"
import React, { useEffect, useState } from 'react'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import LeaderboardTable, { Player } from './components/LeaderboardTable'
import SearchIcon from '@mui/icons-material/Search'
import LayersIcon from '@mui/icons-material/Layers'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { lightTheme, darkTheme } from '../theme'
import LeaderboardService from '../services/LeaderboardService'

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

    &:hover {
        color: #AAA;
    }
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

    &::placeholder {
        color: #AAA;
    }
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

export default function Home() {
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [groupByCountry, setGroup] = useState(false)
    const [players, setPlayers] = useState<Player[]>([])

    useEffect(() => {
        async function fetchPlayers() {
            try {
                const data = await LeaderboardService.getTopPlayers()
                const withRanks = data.map((p, i) => ({ ...p, rank: i + 1 }))
                setPlayers(withRanks)
            } catch (err) {
                console.error('Failed to fetch leaderboard:', err)
            }
        }

        fetchPlayers()
    }, [])

    const filtered = players.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.country.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <GlobalStyle />

            <HeaderBar>
                <Logo />
                <ThemeToggle onClick={() => setIsDarkMode(dm => !dm)}>
                    {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </ThemeToggle>
            </HeaderBar>

            <PageWrapper>
                <Title>Leaderboard</Title>

                <Controls>
                    <SearchWrapper>
                        <SearchIconWrapper>
                            <SearchIcon fontSize="small" />
                        </SearchIconWrapper>
                        <SearchInput
                            type="text"
                            placeholder="Search by name or country . . ."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </SearchWrapper>
                    <GroupButton onClick={() => setGroup(g => !g)}>
                        <LayersIcon />
                    </GroupButton>
                </Controls>

                <LeaderboardTable
                    players={filtered}
                    groupByCountry={groupByCountry}
                />
            </PageWrapper>
        </ThemeProvider>
    )
}
