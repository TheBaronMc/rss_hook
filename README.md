# RSS HOOK

<img src='./img/logo.png' height=440 align='center'/>

This project aims to connect one or more [RSS flux](https://en.wikipedia.org/wiki/RSS) to [webhooks](https://en.wikipedia.org/wiki/Webhook), more specifically [discord webhooks](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks).

## Getting started

### Prerequisites

+ Have nodejs 12 or more
+ Know JSON syntax

### How to launch it

Firstly, clone the repository on your computer and then go into it.

Now, you need to install nodes module. For that, execute the following command :

``` shell
npm i
```

If everything is ok, now you have to create your own `parameters.json` in which all your webhooks and rss flux are stored. For that you have the `parameters-example.json` to help you. **THIS FILE HAS TO BE AT THE ROOT OF THE PROJECT.**

Finally, you can start the app with the following command :

``` shell
node index.js
```

