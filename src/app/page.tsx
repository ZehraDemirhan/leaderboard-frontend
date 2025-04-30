"use client";
import React, { useState } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import LeaderboardTable, { Player } from './components/LeaderboardTable';
import SearchIcon from '@mui/icons-material/Search';
import LayersIcon from '@mui/icons-material/Layers';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { lightTheme, darkTheme } from '../theme';

const mockData: Player[] = [
    { playerId: 1, name: 'Alice', country: 'US', rank: 1, money: 1500 },
    { playerId: 2, name: 'Bob', country: 'UK', rank: 2, money: 1400 },
    { playerId: 3, name: 'Chen', country: 'CN', rank: 3, money: 1300 },
    { playerId: 4, name: 'Diego', country: 'BR', rank: 4, money: 1200 },
    { playerId: 5, name: 'Eva', country: 'DE', rank: 5, money: 1100 },
    { playerId: 6, name: 'Frank', country: 'US', rank: 6, money: 1000 }
];

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        background: ${({ theme }) => theme.colors.background};
        color: ${({ theme }) => theme.colors.text};
        transition: background 0.3s, color 0.3s;
        font-family: 'Orbitron', sans-serif;
        background-image: ${({ theme }) => `url(${theme.background_url})`};
    }
`;

const HeaderBar = styled.header`
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #28282C;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const Logo = styled.img`
    height: 70px;
`;

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
`;

const PageWrapper = styled.div`
    margin-top: 4rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Controls = styled.div`
    width: 100%;
    max-width: 800px;
    display: flex;
    align-items: center;
    margin: 1rem 0;
`;

const SearchWrapper = styled.div`
    position: relative;
    flex: 1;
`;

const SearchIconWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 0.75rem;
    transform: translateY(-50%);
    color: #AAA;
`;

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
`;

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
`;

const Title = styled.h1`
    font-size: 2rem;
    margin: 1rem 0;
    color: ${({ theme }) => theme.colors.primary};
`;

export default function Home() {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [groupByCountry, setGroup] = useState(false);

    const filtered = mockData.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
    );
}