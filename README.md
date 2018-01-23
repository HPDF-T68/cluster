# hello-react

This quickstart consists of a basic hasura project with a simple react as well as a nodejs express app running on it. Once this project is deployed on to a hasura cluster, you will have the react app running at https://ui.cluster-name.hasura-app.io and the nodejs app will run at https://api.cluster-name.hasura-app.io

This is the right place to start if you are planning to build or want to learn to build a react app with hasura.

## Sections

* [Introduction](#introduction)
* [Quickstart](#quickstart)
* [Data API](#data-apis)
* [Auth API](#auth-apis)
* [Filestore API](#filestore-apis)
* [Custom service](#custom-service)
* [Migrate from an existing react app](#migrate-from-an-existing-react-app)
* [Local development](#local-development)
* [Project Structure](#project-structure)

## Introduction

This quickstart project comes with the following by default:
1. A basic hasura project
2. Two tables `article` and `author` with some dummy data
3. A basic react app which runs at the `ui` subdomain which fetches a list of articles available
4. A basic nodejs-express app which runs on the `api` subdomain.

## Quickstart

Follow this section to get this project working. Before you begin, ensure you have the latest version of hasura cli tool installed.

### Step 1: Getting the project

```sh
$ hasura quickstart hello-react
$ cd hello-react
```

The above command does the following:
1. Creates a new folder in the current working directory called `hello-react`
2. Creates a new trial hasura cluster for you and sets that cluster as the default cluster for this project
3. Initializes `hello-react` as a git repository and adds the necessary git remotes.
4. Adds your SSH public key to the cluster so that you can push to it.

### Step 2: Getting cluster information

Every hasura project is run on a Hasura cluster. To get details about the cluster this project is running on:

```sh
$ hasura cluster status
```

This will give you your cluster status like so

```sh
INFO Status:                                      
Cluster Name:       h34-fisherman22-stg
Cluster Alias:      hasura
Kube Context:       h34-fisherman22-stg
Platform Version:   v0.15.3
Cluster State:      Synced
```

Keep a note of your cluster name. Alternatively, you can also go to your [hasura dashboard](https://dashboard.hasura.io) and see the clusters you have.

### Step 3: Deploying on a hasura cluster

1. Open the package.json file at `microservices/ui/app/`
2. Find the key `scripts` and then replace `cluster-name` with the name of your cluster (in this case, `h34-fisherman22-stg`) in the `build` & `start` key.

To deploy your app:

```sh
$ git add .
$ git commit -m "Initial Commit"
$ git push hasura master
```

Once the above commands are executed successfully, head over to `https://ui.cluster-name.hasura-app.io` (in this case `https://ui.h34-fisherman22-stg.hasura-app.io`) to view your react app.

Alternatively, you can use `hasura microservice open ui` to open the browser and navigate to that link automatically.

### Api console

Every hasura cluster comes with an api console that gives your a GUI to test out the baas features of hasura. To open the api console

```sh
$ hasura api-console
```

## Data APIs

Hasura provides ready to use data apis to make powerful data queries on your tables. This means that you have ready-to-use JSON apis on any tables created. The url to be used to make these queries is always of the type: `https://data.cluster-name.hasura-app.io/v1/query` (in this case `https://data.h34-fisherman22-stg.hasura-app.io`)

As mentioned earlier, this quickstart app comes with two pre-created tables `author` and `article`.

**author**

column | type
--- | ---
id | integer NOT NULL *primary key*
name | text NOT NULL

**article**

column | type
--- | ---
id | serial NOT NULL *primary key*
title | text NOT NULL
content | text NOT NULL
rating | numeric NOT NULL
author_id | integer NOT NULL

Alternatively, you can also view the schema for these tables on the api console by heading over to the tab named `data` as shown in the screenshots below.

![Data1](https://raw.githubusercontent.com/hasura/hello-react/master/readme-assets/data-1.png "Data1")
![Data2](https://raw.githubusercontent.com/hasura/hello-react/master/readme-assets/data-2.png "Data2")

This means that you can now leverage the hasura data queries to perform CRUD operations on these tables.

The react app uses these data apis to show the respective data, to see it in action check out `https://ui.cluster-name.hasura-app.io/data` (replace cluster-name with your cluster name) and check out `api.js` at `microservices/ui/app/src/api.js` to see how the calls are being made. You can also check out all the apis provided by Hasura from the api console by heading over to the `API EXPLORER` tab.

For eg, to fetch a list of all articles from the article table, you have to send the following JSON request to the data api endpoint -> `https://data.cluster-name.hasura-app.io/v1/query` (replace `cluster-name` with your cluster name)

```json
{
    "type": "select",
    "args": {
        "table": "article",
        "columns": [
            "id",
            "title",
            "content",
            "rating",
            "author_id"
        ]
    }
}
```

To learn more about the data apis, head over to our [docs](https://docs.hasura-stg.hasura-app.io/0.15/manual/data/index.html)

## Auth APIs

Every app almost always requires some form of authentication. This is useful to identify a user and provide some sort of personalised experience to the user. Hasura provides various types of authentication (username/password, mobile/otp, email/password, Google, Facebook etc).  

You can try out these in the `API EXPLORER` tab of the `api console`. To learn more, check out our [docs](https://docs.hasura-stg.hasura-app.io/0.15/manual/users/index.html)

The react app in this quickstart shows us an example of the username/password authentication. To see it in action navigate to `https://ui.cluster-name.hasura-app.io/auth` and also take a look at the `auth.js` file to see how this is done in code.

## Filestore APIs

Sometimes, you would want to upload some files to the cloud. This can range from a profile pic for your user or images for things listed on your app. You can securely add, remove, manage, update files such as pictures, videos, documents using Hasura filestore.

You can try out these in the `API EXPLORER` tab of the `api console`. To learn more, check out our [docs](https://docs.hasura-stg.hasura-app.io/0.15/manual/users/index.html)

The react app in this quickstart shows us an example of uploading a file to the filestore. To see it in action navigate to `https://ui.cluster-name.hasura-app.io/filestore` and take a look at `filestore.js` for the code.

## Custom Service

There might be cases where you might want to perform some custom business logic on your apis. For example, sending an email/sms to a user on sign up or sending a push notification to the mobile device when some event happens. For this, you would want to create your own custom service which does these for you on the endpoints that you define.

This quickstart comes with one such custom service written in `nodejs` using the `express` framework. Check it out in action at `https://app.cluster-name.hasura-app.io` . Currently, it just returns a "Hello-React" at that endpoint.

In case you want to use another language/framework for your custom service. Take a look at our docs to see how you can add a new custom service.

## Migrate from an existing react app

If you have an existing create-react-app and would like to migrate it to Hasura:

- Replace the `microservices/ui/app` directory with your app directory.
- Ensure that the structure of the ui directory is

```
ui
└─── app
|     └───src
|     └───public
|     |   package.json
|    Dockerfile
|    k8s.yaml
```

- `cd path-to-hello-react/hello-react`
- `git add . && git commit -m "Migration Commit"`
- `git push hasura master`

Now your existing app should be running on `https://ui.cluster-name.hasura-app.io`

## Local development

Everytime you push, your code will get deployed on a public URL. However, for faster iteration you should locally test your changes.

### Testing your react app locally

```sh
$ cd microservices/ui/app
$ npm start
```

### Testing your custom service locally

Since we are directly accessing the internal data endpoint (Read more about internal and external endpoints here) in the nodejs-express app. We need to forward our requests to the port at which the data service is running.

```sh
$ hasura forward -s data -n hasura --local-port 6432 --remote-port 8080
$ cd microservices/api/app
$ ENVIRONMENT=dev npm start
```
