# interface

template repository for web3 front-end using typescript, next.js and react.

# stacks

| stack           | category     | description                             |
| --------------- | ------------ | --------------------------------------- |
| typescript      | dev          | for typescript, not javascript          |
| react           | dev          | for react, not vue angular...           |
| next.js         | dev          | framework                               |
| web3-react      | dev          | library for wallet                      |
| chakra-ui       | dev          | ui component for react                  |
| ethers          | dev          | web3 library to interact with ethereum  |
| story book      | test         | for test on browser. builder is webpack |
| jest            | test         | for unit test                           |
| testing-library | test         | for unit test of react                  |
| eslint          | static check | for lint                                |
| prettier        | static check | fix style automatically                 |
| husky           | static check | prevent to commit non checked code      |

# how to use this template?

- update `xxx` on package.json
- this repository is mvp for web3 front-end including only wallet connect. you can start template project with `yarn start` or `yarn dev`.
- codes of mvp are under the `./components` `./config` `./hooks` `./lib` `./pages` `./types` `./utils`. if you don't need it, delete it.
- if you interact with ethereum, add abi and use it via ethers.js. I recommend to use typechain to generate typescript type from abi.
