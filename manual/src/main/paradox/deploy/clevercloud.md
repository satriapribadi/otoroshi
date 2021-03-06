# Clever Cloud

Now you want to use Otoroshi on Clever Cloud. Otoroshi has been designed and created to run on Clever Cloud and a lot of choices were made because of how Clever Cloud works.

## Create an Otoroshi instance on CleverCloud

First, fork our project template on Github at https://github.com/MAIF/otoroshi-jar-clevercloud-template.

If you want to customize the build script, edit `./clevercloud/build.sh`

If you want to customize the configuration @ref:[use env. variables](../firstrun/env.md), you can use [the example provided below](#example-of-clevercloud-env-variables)

Create a new CleverCloud app based on your fork.

@@@ div { .centered-img }
<img src="../img/deploy-cc-jar-0.png" />
@@@

Then choose what kind of app your want to create, for Otoroshi, choose `Java + Jar`

@@@ div { .centered-img }
<img src="../img/deploy-cc-jar-1.png" />
@@@

Next, set up choose instance size and auto-scalling. Otoroshi can run on small instances, especially if you just want to test it.

@@@ div { .centered-img }
<img src="../img/deploy-cc-2.png" />
@@@

Finally, choose a name for your app

@@@ div { .centered-img }
<img src="../img/deploy-cc-3.png" />
@@@

Now you just need to customize environnment variables and add the custom build script as pre buid hook :

`CC_PRE_BUILD_HOOK=./clevercloud/build.sh`

at this point, you can also add other env. variables to configure Otoroshi like in [the example provided below](#example-of-clevercloud-env-variables)

@@@ div { .centered-img }
<img src="../img/deploy-cc-4-bis.png" />
@@@

You can also use expert mode :

@@@ div { .centered-img }
<img src="../img/deploy-cc-4.png" />
@@@

Now, your app is ready, don't forget to add a custom domains name on the CleverCloud app matching the Otoroshi app domain. For instance if you used domain names in env. variables like `changeme`, `changeme-admin-internal-api`, `changeme-api` on the `cleverapps.io` domain, declare `changeme.cleverapps.io`, `changeme-api.cleverapps.io`,  `changeme-admin-internal-api.cleverapps.io`.

You will find the login/password tuple for first login in the app. logs.

## Build and deploy Otoroshi from its source code

First, fork our project template on Github at https://github.com/MAIF/otoroshi-clevercloud-template.

If you want to customize the build script, edit `./clevercloud/build.sh`

If you want to customize the configuration file, edit `./clevercloud/prod.conf` or @ref:[use env. variables](../firstrun/env.md)

Create a new Clever Cloud app based on your fork.

@@@ div { .centered-img }
<img src="../img/deploy-cc-0.png" />
@@@

Then, you need to choose what kind of app your want to create, for Otoroshi, choose `Java or Scala + Play 2`

@@@ div { .centered-img }
<img src="../img/deploy-cc-1.png" />
@@@

Then, you will be asked to choose what kind of machine you want to use. `M` instances are a good choice but you can use a less powerful ones. You can also activate auto-scaling or multi-instances to provie high availibility.

@@@ div { .centered-img }
<img src="../img/deploy-cc-2.png" />
@@@

Then choose a name for your app :

@@@ div { .centered-img }
<img src="../img/deploy-cc-3.png" />
@@@

Now you just need to customize environnment variables and add the custom build script as pre build hook :

`CC_PRE_BUILD_HOOK=./clevercloud/build.sh`

at this point, you can also add other env. variables to configure Otoroshi like in [the example provided below](#example-of-clevercloud-env-variables)

@@@ div { .centered-img }
<img src="../img/deploy-cc-4-bis.png" />
@@@

You can also use expert mode :

@@@ div { .centered-img }
<img src="../img/deploy-cc-4.png" />
@@@

Now, your app is ready, don't forget to add a custom domains name on the CleverCloud app matching the Otoroshi app domain. For instance if you used domain names in env. variables like `changeme`, `changeme-admin-internal-api`, `changeme-api` on the `cleverapps.io` domain, declare `changeme.cleverapps.io`, `changeme-api.cleverapps.io`,  `changeme-admin-internal-api.cleverapps.io`.

You will find the login/password tuple for first login in the app. logs.

## Example of CleverCloud env. variables

You can add more env variables to customize your Otoroshi instance like the following. Use the expert mode to copy/paste all the values in one shot :

```
APP_ENV=prod
APP_STORAGE=inmemory
APP_DOMAIN=cleverapps.io
APP_ROOT_SCHEME=https
APP_BACKOFFICE_SUBDOMAIN=changeme
ADMIN_API_TARGET_SUBDOMAIN=changeme-admin-internal-api
ADMIN_API_EXPOSED_SUBDOMAIN=changeme-api
ADMIN_API_GROUP=psIZ0hI6eAQ2vp7DQoFfdUSfdmamtlkbXwYCe9WQHGBZMO6o5Kn1r2VVSmI61IVX
ADMIN_API_CLIENT_ID=pWkwudAifrflg8Bh
ADMIN_API_CLIENT_SECRET=ip53UuY5BFiM3wXkVUhhYrVdbsDYsANCNdRMnW3pU4I268ylsF6xxkvusS6Wv4AW
ADMIN_API_SERVICE_ID=GVQUWMZHaEYr1tCTNe9CdXOVE4DQnu1VUAx7YyXDlo5XupY3laZlWUnGyDt1vfGx
CACHE_DEPENDENCIES=true
CC_PRE_BUILD_HOOK=./clevercloud/build.sh
CLAIM_SHAREDKEY=Tx1uQXW11pLNlZ25S4A08Uf8HbWDPxZ3KGSSm0B1s90gRk10PNy4d1HKY4Dnvvv5
ENABLE_METRICS=true
JAVA_VERSION=8
PORT=8080
PLAY_CRYPTO_SECRET=7rNFga4AComd6ey09W9PaHqllLmPHb8WHBhlRe9xjTHOPlN15BCeSQf610cmLU1w
SESSION_SECURE_ONLY=true
SESSION_MAX_AGE=259200000
SESSION_DOMAIN=changeme.cleverapps.io
SESSION_NAME=otoroshi-session
USER_AGENT=otoroshi
```
