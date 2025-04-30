// src/theme/index.ts
import { DefaultTheme } from 'styled-components'

export const lightTheme: DefaultTheme = {
    background_url: 'https://static.vecteezy.com/system/resources/previews/010/547/365/large_2x/light-purple-to-dark-purple-gradient-background-free-photo.jpg',
    colors: {
        // fundamentals
        background: '#FFFFFF',  // pure white canvas
        text:       '#1D1D1F',  // almost-black for high contrast

        // brand accents (you can reuse these in buttons, links…)
        primary:   '#1D1D1F',   // deep warm red
        secondary: '#24132A',   // your dark purple
        accent:    '#2D2159',   // mid-tone purple

        // UI surfaces
        headerBg:   '#F7F7F7',  // very light grey for top bar
        controlBg:  '#ECECEC',  // light grey for buttons/toggles
        inputBg:    '#F5F4F8',  // white inputs
        inputBorder:'#CCCCCC',  // soft grey outline
        hoverBg:    '#F0F0F0',   // subtle hover on controls
        tableHeaderBg:    '#F5F4F8',  // softer lavender-grey
        tableHeaderText:  '#6B5B7A',  // a bit deeper muted purple for legibility

        tableRowBg:       '#F3E8FE',  // very pale lilac — almost white
        tableRowText:     '#2D2A35',
        groupBg: '#E1D5F7',           // keep the deep charcoal for clear reading

        tableRowHoverBg:  '#ECE1F5',  // gentle purple tint on hover
        tableRowHoverText:'#4A366F',  // rich grape tone for hover text
    }
}

export const darkTheme: DefaultTheme = {
    background_url: 'https://images.unsplash.com/photo-1673526759327-54f1f5b27322?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JhZGllbnQlMjBwdXJwbGV8ZW58MHx8MHx8fDA%3D'
,    colors: {
        background: '#121023',  // deep navy-purple
        text:       '#E0E0E0',  // off-white

        primary:   '#ECECEC',   // light orange
        secondary: '#24132A',   // same dark purple anchor
        accent:    '#FF7F3F',   // vibrant orange pop

        headerBg:   '#28282C',  // almost-black bar
        controlBg:  '#3E3265',  // muted purple surface
        inputBg:    '#251e40',  // very dark purple input
        inputBorder:'#3E3265',  // same as controlBg
        hoverBg:    '#2C2250',  // on-hover for rows/controls

        tableHeaderBg:    '#1c172b',
        groupBg: '#2d2159',
        tableHeaderText:  '#AAA',
        tableRowBg:        '#251e40',
        tableRowText:      '#CCC',
        tableRowHoverBg:   '#2c2250',
        tableRowHoverText: '#7661d2',
    }
}
