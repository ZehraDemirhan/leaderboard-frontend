"use client"
import React, { useState, useEffect, useRef, useMemo } from "react"
import styled from "styled-components"
import debounce from "lodash.debounce"
import LeaderboardService from "@/services/LeaderboardService"
import SearchIcon from '@mui/icons-material/Search'
import CircularProgress from '@mui/material/CircularProgress'
import { Player } from "@/app/components/LeaderboardTable"

interface AutocompleteProps {
    value: string
    onChange: (newVal: string) => void
    onSelect: (player: Player) => void
    placeholder?: string
}

const Wrapper = styled.div`
    position: relative;
    width: 100%;
`
const SearchIconWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 0.75rem;
    transform: translateY(-50%);
    color: #AAA;
`
const Input = styled.input`
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 2.5rem;
    background-color: ${({ theme }) => theme.colors.inputBg};
    border: none;
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.text};
    &::placeholder { color: #AAA; }
`
const List = styled.ul`
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.colors.background};
    border: 1px solid #ccc;
    border-radius: 4px;
    max-height: 240px;
    overflow-y: auto;
    z-index: 1001;
    margin: 0;
    padding: 0;
    list-style: none;
`
const Item = styled.li<{ highlighted: boolean }>`
    padding: 0.5rem;
    cursor: pointer;
    background: ${({ highlighted, theme }) =>
            highlighted ? theme.colors.primary : theme.colors.background};
    color: ${({ highlighted, theme }) =>
            highlighted ? theme.colors.background : theme.colors.text};
`
const LoadingItem = styled.li`
    padding: 0.5rem;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: #AAA;
`

export default function Autocomplete({
                                         value,
                                         onChange,
                                         onSelect,
                                         placeholder = "Search…",
                                     }: AutocompleteProps) {
    const [suggestions, setSuggestions] = useState<Player[]>([])
    const [open, setOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [didSelect, setDidSelect] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    // Debounced fetch for autocomplete
    const fetchSuggestions = useMemo(
        () =>
            debounce(async (val: string) => {
                setIsLoading(true)
                try {
                    const results: Player[] =
                        await LeaderboardService.getAutoCompleteSuggestions(val)
                    setSuggestions(results)
                    setHighlightedIndex(0)
                } catch {
                    setSuggestions([])
                } finally {
                    setIsLoading(false)
                }
            }, 500),
        []
    )

    // Trigger fetch and manage dropdown visibility,
    // but skip if we've just selected
    useEffect(() => {
        if (value.length < 2 || didSelect) {
            setSuggestions([])
            setOpen(false)
            return
        }
        setOpen(true)
        fetchSuggestions(value)
    }, [value, fetchSuggestions, didSelect])

    // Cleanup debounce on unmount
    useEffect(() => () => {
        fetchSuggestions.cancel()
    }, [fetchSuggestions])

    // Close on outside click
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", onClick)
        return () => document.removeEventListener("mousedown", onClick)
    }, [])

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (!open || isLoading) return
        if (e.key === "ArrowDown") {
            e.preventDefault()
            setHighlightedIndex(i => Math.min(i + 1, suggestions.length - 1))
        }
        if (e.key === "ArrowUp") {
            e.preventDefault()
            setHighlightedIndex(i => Math.max(i - 1, 0))
        }
        if (e.key === "Enter") {
            e.preventDefault()
            const sel = suggestions[highlightedIndex]
            if (sel) {
                onSelect(sel)
                setDidSelect(true)
                setOpen(false)
            }
        }
        if (e.key === "Escape") {
            setOpen(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDidSelect(false)          // reset after typing
        const val = e.target.value
        onChange(val)
        setOpen(val.length >= 2)
    }

    return (
        <Wrapper ref={wrapperRef}>
            <SearchIconWrapper>
                <SearchIcon fontSize="small" />
            </SearchIconWrapper>
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onFocus={() => { if (value.length >= 2) setOpen(true) }}
                onKeyDown={onKeyDown}
            />
            {open && (
                <List>
                    {isLoading ? (
                        <LoadingItem>
                            <CircularProgress size={20} color="inherit" />
                            <span style={{ marginLeft: '0.5rem' }}>
                Fetching suggestions...
              </span>
                        </LoadingItem>
                    ) : suggestions.length > 0 ? (
                        suggestions.map((p, i) => (
                            <Item
                                key={`autocomplete-item-${i}`}
                                highlighted={i === highlightedIndex}
                                onMouseEnter={() => setHighlightedIndex(i)}
                                onClick={() => {
                                    onSelect(p)
                                    setDidSelect(true)    // tell us we’ve just selected
                                    setOpen(false)
                                }}
                            >
                                {p.name} &mdash; <small>{p.country}</small>
                            </Item>
                        ))
                    ) : (
                        <LoadingItem>No suggestions found</LoadingItem>
                    )}
                </List>
            )}
        </Wrapper>
    )
}
