// components/PlayerAutocomplete.tsx
/*
'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import debounce from 'lodash.debounce'
import LeaderboardService from "@/services/LeaderboardService";
import {Player} from "@/app/components/LeaderboardTable";

interface PlayerAutocompleteProps {
    inputValue: string
    onInputChange: (value: string) => void
    onSelect: (player: Player) => void
    placeholder?: string
}

export default function PlayerAutocomplete({
                                               inputValue,
                                               onInputChange,
                                               onSelect,
                                               placeholder = 'Search player…',
                                           }: PlayerAutocompleteProps) {
    const [options, setOptions] = useState<Player[]>([])
    const [loading, setLoading] = useState(false)
    const service = useMemo(() => new LeaderboardService(), [])


    // Debounced fetcher using your service
    const fetchSuggestions = useMemo(
        () =>
            debounce(async (q: string) => {
                setLoading(true)
                try {
                    const list = await service.getAutoCompleteSuggestions(q)
                    setOptions(list)
                } catch {
                    setOptions([])
                } finally {
                    setLoading(false)
                }
            }, 300),
        [service]
    )

    useEffect(() => {
        if (inputValue.length >= 2) {
            fetchSuggestions(inputValue)
        } else {
            setOptions([])
        }
        return () => {
            fetchSuggestions.cancel()
        }
    }, [inputValue, fetchSuggestions])

    return (
        <Autocomplete
            freeSolo
            filterOptions={(x) => x}
            options={options}
            getOptionLabel={(opt) => opt.name}
            loading={loading}
            inputValue={inputValue}
            onInputChange={(_, newVal) => onInputChange(newVal)}
            onChange={(_, selected) => {
                if (selected) onSelect(selected)
            }}
            noOptionsText="No players found"
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={placeholder}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    )
}
*/
