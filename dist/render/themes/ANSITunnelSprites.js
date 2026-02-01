"use strict";
var ANSITunnelSprites = {
    left: [
        {
            lines: [
                '│',
                '│',
                '│',
                '│'
            ],
            colors: [LIGHTCYAN, CYAN, LIGHTCYAN, CYAN],
            width: 1,
            height: 4
        },
        {
            lines: [
                '┌┐',
                '└┘'
            ],
            colors: [CYAN, CYAN],
            width: 2,
            height: 2
        },
        {
            lines: [
                ' ◊',
                ' │',
                ' │'
            ],
            colors: [LIGHTCYAN, DARKGRAY, DARKGRAY],
            width: 2,
            height: 3
        },
        {
            lines: [
                '1',
                '0',
                '1',
                '0'
            ],
            colors: [LIGHTCYAN, CYAN, LIGHTCYAN, CYAN],
            width: 1,
            height: 4
        }
    ],
    right: [
        {
            lines: [
                '│',
                '│',
                '│',
                '│'
            ],
            colors: [LIGHTCYAN, CYAN, LIGHTCYAN, CYAN],
            width: 1,
            height: 4
        },
        {
            lines: [
                '┌┐',
                '└┘'
            ],
            colors: [CYAN, CYAN],
            width: 2,
            height: 2
        },
        {
            lines: [
                '◊ ',
                '│ ',
                '│ '
            ],
            colors: [LIGHTCYAN, DARKGRAY, DARKGRAY],
            width: 2,
            height: 3
        },
        {
            lines: [
                '0',
                '1',
                '0',
                '1'
            ],
            colors: [CYAN, LIGHTCYAN, CYAN, LIGHTCYAN],
            width: 1,
            height: 4
        }
    ],
    background: {
        layers: [
            {
                speed: 0.1,
                sprites: [
                    {
                        x: 10,
                        lines: ['·'],
                        colors: [DARKGRAY],
                        width: 1,
                        height: 1
                    },
                    {
                        x: 30,
                        lines: ['·'],
                        colors: [CYAN],
                        width: 1,
                        height: 1
                    },
                    {
                        x: 50,
                        lines: ['·'],
                        colors: [DARKGRAY],
                        width: 1,
                        height: 1
                    },
                    {
                        x: 70,
                        lines: ['·'],
                        colors: [CYAN],
                        width: 1,
                        height: 1
                    }
                ]
            }
        ]
    }
};
