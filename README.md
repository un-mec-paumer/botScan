# BotScan

BotScan is a tool designed to scan and analyze bots for various platforms. This README provides an overview of the project, installation instructions, and usage guidelines.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)


## dev

To dev on your verson BotScan, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/botScan.git
    ```
2. Navigate to the project directory:
    ```sh
    cd botScan
    ```
3. run into docker:
    ```sh
    docker compose -f docker-compose-dev up -d (--build) (--watch) / make dev
    ```
you can enable the watch or the build when you add the option
## Usage

To use BotScan, run the following command:
```sh
    docker compose -f docker-compose-prod up -d (--build) (--watch)  make start
``` 

## env file
to see what put into .env file see ./src/variable.ts
