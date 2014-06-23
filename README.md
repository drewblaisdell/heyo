heyo
====

An extremely simple way to send Yo notifications in your terminal.

[![NPM version](https://badge.fury.io/js/heyo.svg)](http://badge.fury.io/js/heyo)

## Installation

    $ npm install -g heyo

## Usage

    $ heyo register <username>    register a new Yo account
    $ heyo <username>             send a Yo to <username>
    $ heyo switch <username>      switch to send from <username>
    $ heyo list                   list accounts registered with heyo

## How does it work?

heyo is a CLI built on the excellently named [yoplait](https://github.com/tec27/yoplait) wrapper. Registering a user with heyo will create a new account with a randomly generated UDID and store it internally.

## License

MIT