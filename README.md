# RSS HOOK

<img src='./img/logo.png' height=440 align='center'/>

This project aims to connect one or more [RSS flux](https://en.wikipedia.org/wiki/RSS) to [webhooks](https://en.wikipedia.org/wiki/Webhook), more specifically [discord webhooks](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks).

## Getting started

### Prerequisites

To use **RSS Hook** you need to :
+ Have nodejs 16 installed. You can do it via [nvm](https://github.com/nvm-sh/nvm).
+ Know the JSON syntax. You can start from [here](www.json.org)

### How to launch it

Firstly, clone the repository on your computer and then go into it.

Now, you need to install all the necessaries nodes modules. For that, execute the following command :

``` shell
npm i
```

If everything is ok, now you have to create your own `parameters.json` in which all your webhooks and rss flux are stored. For that you have the `parameters-example.json` to help you. 

Finally, you can start the app with the following command :

``` shell
npm run server
```
By default, if you don't specify a parameters file, it will look for a file named `parameters.json` in the current directory.
