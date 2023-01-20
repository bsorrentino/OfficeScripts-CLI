[![npm](https://img.shields.io/npm/v/@bsorrentino/osts-cli.svg)](https://www.npmjs.com/package/@bsorrentino/osts-cli)&nbsp;
<img src="https://img.shields.io/github/forks/bsorrentino/OfficeScripts-CLI.svg">&nbsp;
<img src="https://img.shields.io/github/stars/bsorrentino/OfficeScripts-CLI.svg">&nbsp;
<a href="https://github.com/bsorrentino/OfficeScripts-CLI/issues">
<img src="https://img.shields.io/github/issues/bsorrentino/OfficeScripts-CLI.svg"></a>&nbsp;
![npm publishing](https://github.com/bsorrentino/OfficeScripts-CLI/actions/workflows/npm-publish.yml/badge.svg)

# OfficeScripts-CLI
CLI for manage OSTS files


## Prerequisites

Install [CLI for Microsoft 365](https://pnp.github.io/cli-microsoft365/)
>
> ```
> npm i -g @pnp/cli-microsoft365
> ```
>
> or using yarn:
>
> ```
> yarn global add @pnp/cli-microsoft365
> ```

## Install

```
npm install -g @bsorrentino/osts-cli
```

## Usage 

```
Usage:
========
osts list[--path]  // list OSTS packages in SPO path. 

osts unpack [--path, -p <dest dir> [--dts] ] // download OSTS package and extract body (.ts) to dest dir (default 'osts'). 
                                             // If --dts is specified an Office Script Simplified TS Declaration  file will be copied in dest dir

osts pack [--path, -p <src dir>] // bundle source (.ts) in src dir (default 'osts') to OSTS package and upload it

osts dts [--path, -p <dest dir>] // an Office Script Simplified TS Declaration file is copied in dest dir

```