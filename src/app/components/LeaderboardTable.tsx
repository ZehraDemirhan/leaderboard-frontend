"use client";
import React, { useState } from 'react';
import styled from 'styled-components';
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from '@hello-pangea/dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

export type Player = {
    playerId: number;
    name:     string;
    country:  string;
    rank:     number;
    money:    number;
};

interface LeaderboardTableProps {
    players:         Player[];
    groupByCountry?: boolean;
}

interface CellProps {
    align: 'left' | 'center' | 'right';
    isMoney?: boolean;
}

const Container = styled.div`
    width: 100%;
    max-width: 800px;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const CountryWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const Flag = styled.img`
    width: 1.5rem;
    height: 1.5rem;
    object-fit: cover;
    clip-path: circle(50% at 50% 50%);
    margin-right: 0.5rem;
`;

const HeaderRow = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: center;
    background-color: ${({ theme }) => theme.colors.tableHeaderBg};
    color:            ${({ theme }) => theme.colors.tableHeaderText};
    padding: 0.75rem 1rem;
    margin-top: 1rem;
`;

const HeaderCell = styled.div<{ isDragging?: boolean }>`
    display: flex;
    align-items: center;
    cursor: grab;
    opacity: ${p => (p.isDragging ? 0.5 : 1)};
    font-size: 0.95rem;
    font-weight: bold;
`;

const CountryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.groupBg};
  color:            ${({ theme }) => theme.colors.tableHeaderText};
  font-weight: bold;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  clip-path: polygon(
    5% 0%, 100% 0%, 100% 5%, 100% 55%,
    95% 100%, 5% 100%, 0% 100%, 0% 55%
  );
  font-size: 1.1rem;
  width: 100%;
`;

const RowContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  background-color: ${({ theme }) => theme.colors.tableRowBg};
  color:            ${({ theme }) => theme.colors.tableRowText};
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  clip-path: polygon(
    5% 0%, 100% 0%, 100% 5%, 100% 55%,
    95% 100%, 5% 100%, 0% 100%, 0% 55%
  );
  font-size: 0.95rem;
  width: 95%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.tableRowHoverBg};
    color:            ${({ theme }) => theme.colors.tableRowHoverText};
  }
`;

export const Cell = styled.div<CellProps>`
  text-align: ${({ align }) => align};
  color: ${({ isMoney, theme }) =>
    isMoney ? theme.colors.tableRowHoverText : theme.colors.text};
`;

const columnMeta = {
    rank:    { label: 'Ranking',     align: 'center' },
    name:    { label: 'Player Name', align: 'left'   },
    country: { label: 'Country',     align: 'left'   },
    money:   { label: 'Money',       align: 'left'   }
};

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
                                                               players,
                                                               groupByCountry = false
                                                           }) => {
    const [columns, setColumns] = useState<keyof Player[]>([
        'rank',
        'name',
        'country',
        'money'
    ]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const newCols = Array.from(columns);
        const [moved] = newCols.splice(result.source.index, 1);
        newCols.splice(result.destination.index, 0, moved);
        setColumns(newCols);
    };

    const grouped = groupByCountry
        ? players.reduce((acc: Record<string, Player[]>, p) => {
            acc[p.country] ||= [];
            acc[p.country].push(p);
            return acc;
        }, {})
        : { ALL: players };

    return (
        <Container>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="columns" direction="horizontal">
                    {provided => (
                        <HeaderRow ref={provided.innerRef} {...provided.droppableProps}>
                            {columns.map((col, i) => (
                                <Draggable key={col} draggableId={col} index={i}>
                                    {(dragProv, snap) => (
                                        <HeaderCell
                                            ref={dragProv.innerRef}
                                            {...dragProv.draggableProps}
                                            {...dragProv.dragHandleProps}
                                            isDragging={snap.isDragging}
                                        >
                                            <DragIndicatorIcon
                                                fontSize="small"
                                                style={{ marginRight: 4 }}
                                            />
                                            {columnMeta[col].label}
                                        </HeaderCell>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </HeaderRow>
                    )}
                </Droppable>
            </DragDropContext>

            {Object.entries(grouped).map(([country, list]) => {
                const sortedList = [...list].sort((a, b) => a.rank - b.rank);

                return (
                    <React.Fragment key={country}>
                        <Wrapper>
                            {groupByCountry && (
                                <CountryHeader>
                                    <Flag
                                        src={`https://flagsapi.com/${country}/shiny/64.png`}
                                        alt={`${country} flag`}
                                    />
                                    {country}
                                </CountryHeader>
                            )}

                            {sortedList.map((p, idx) => (
                                <RowContainer key={p.playerId}>
                                    {columns.map(col => {
                                        if (col === 'country' && groupByCountry) {
                                            return (
                                                <Cell
                                                    key={col}
                                                    align={columnMeta[col].align}
                                                />
                                            );
                                        }

                                        let value: React.ReactNode;
                                        if (col === 'rank') {
                                            value = groupByCountry ? idx + 1 : p.rank;
                                        } else if (col === 'country') {
                                            value = (
                                                <CountryWrapper>
                                                    <Flag
                                                        src={`https://flagsapi.com/${p.country}/shiny/64.png`}
                                                        alt={`${p.country} flag`}
                                                    />
                                                    <span>{p.country}</span>
                                                </CountryWrapper>
                                            );
                                        } else if (col === 'money') {
                                            value = p.money.toLocaleString();
                                        } else {
                                            value = p[col];
                                        }

                                        return (
                                            <Cell
                                                key={col}
                                                align={columnMeta[col].align}
                                                isMoney={col === 'money'}
                                            >
                                                {value}
                                            </Cell>
                                        );
                                    })}
                                </RowContainer>
                            ))}
                        </Wrapper>
                    </React.Fragment>
                );
            })}
        </Container>
    );
};

export default LeaderboardTable;
