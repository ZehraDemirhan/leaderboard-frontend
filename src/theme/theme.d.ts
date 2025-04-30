// src/styled.d.ts
import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        background_url: string;
        colors: {
            background: string;
            text: string;
            primary: string;
            secondary: string;
            accent: string;
            headerBg: string;
            controlBg: string;
            inputBg: string;
            inputBorder: string;
            hoverBg: string;
            tableHeaderBg: string;
            groupBg: string;
            tableHeaderText: string;
            tableRowBg: string;
            tableRowText: string;
            tableRowHoverBg: string;
            tableRowHoverText: string;
        };
    }
}
