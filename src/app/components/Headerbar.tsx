import React from 'react'
import styled from 'styled-components'
import { Button, CircularProgress } from '@mui/material'
import { Refresh } from '@mui/icons-material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #28282C;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  padding: 0 10px;
  height: 70px;
`

const RefreshWrapper = styled.div`
  display: flex;
  align-items: center;
  width: max-content;
  justify-content: space-between;
`

const FetchButton = styled(Button)`
  background-color: #FF7F3F;
  color: white;
  display: flex;
  align-items: center;
  padding: 5px 15px;
  margin-right: 10px;
  border-radius: 20px;
  font-size: 14px;
  text-transform: none;
  &:hover {
    background-color: #E85920;
  }
`

const FetchIndicator = styled.div`
  font-size: 12px;
  color: #FFEDD6;
  margin-top: 5px;
    
    @media (max-width: 600px) {
        display: none;
    }
`

const Logo = styled.img`
  height: 70px;
  position: absolute;
  left: 44%;
    @media (max-width: 600px) {
        left: 29%;
    }
`

const ThemeToggle = styled.button`
  color: #ECECEC;
  cursor: pointer;
  background-color: rgba(154, 152, 152, 0.24);
  border-radius: 5px;
  padding: 5px;
  &:hover { color: #AAA; }
`

interface HeaderBarProps {
    isFetching: boolean;
    timeAgo: string;
    lastFetchedAt: Date | null;
    onRefresh: () => void;
    logoSrc: string;
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

export default function HeaderBar({
          isFetching,
          timeAgo,
          lastFetchedAt,
          onRefresh,
          logoSrc,
          isDarkMode,
          onToggleTheme,
      }: HeaderBarProps) {
    return (
        <HeaderContainer>
            <RefreshWrapper>
                <FetchButton
                    onClick={onRefresh}
                    startIcon={isFetching ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
                >
                    Refresh
                </FetchButton>
                {lastFetchedAt && <FetchIndicator>{timeAgo}</FetchIndicator>}
            </RefreshWrapper>
            <Logo src={logoSrc} alt="Logo" />
            <ThemeToggle onClick={onToggleTheme}>
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </ThemeToggle>
        </HeaderContainer>
    )
}