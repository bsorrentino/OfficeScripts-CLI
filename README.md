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
osts unpack [--path, -p <dest dir>] // download OSTS package and extract body (.ts) to dest dir (default 'osts')

osts pack [--path, -p <src dir>] // bundle source (.ts) in src dir (default 'osts') to OSTS package and upload it
```