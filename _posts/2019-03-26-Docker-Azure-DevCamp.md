---
layout: blog
title: Azure DevCamp Vienna - Docker on Azure
excerpt: Learn how to use Docker on Azure. Material I used during Azure DevCamp Vienna 2019.
author: Rainer Stropek
date: 2019-03-26
bannerimage: /content/images/blog/2019/container2.jpg
lang: en
tags: [Azure, Container, Docker, CLI]
permalink: /devblog/2019/03/Docker-Azure-DevCamp
showtoc: true
---

{: .banner-image}
![Intro Logo]({{site.baseurl}}/content/images/blog/2019/container2.jpg)

## Introduction

This blog container the material I used during *Azure DevCamp Vienna 2019* at Microsoft.

## Prerequisites

In order to follow along, you need the following prerequisites:

1. Linux environment with
   * [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-apt?view=azure-cli-latest)
   * [Docker CE CLI](https://docs.docker.com/install/linux/docker-ce/debian/)
   * [jq](https://stedolan.github.io/jq/)
1. Azure Subscription in which you are administrator ([get one for free](https://azure.microsoft.com/en-us/free/))

If you do not want to bother with installing the first prerequisite, you can use the Docker image I prepared for the training. If you have Docker installed ([Docker Desktop](https://docs.docker.com/docker-for-windows/install/) works, too), run `docker run -it --rm -v /var/run/docker.sock:/var/run/docker.sock rstropek/devcamp`. If you want to build the image yourself, you can find [the *Dockerfile* on GitHub](https://github.com/rstropek/devcamp-vienna-2019/blob/master/Dockerfile).

I recommend using [Visual Studio Code](https://code.visualstudio.com) and its [Azure CLI Plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azurecli) to work with the script mentioned in this lab.

## Get Sources

You can get the sources mentioned in this sample [on GitHub](https://github.com/rstropek/devcamp-vienna-2019). Clone this repository on your machine. **Note** that the image `rstropek/devcamp` already contains the API's source code in the */devcamp* folder.

## Using Docker locally

Here we build an ASP.NET Core Web API and run it locally in Docker Container. **Note:** Execute this script in the folder *HotelsApi* (*/devcamp/HotelsApi* in the image `rstropek/devcamp`).

* Create a docker id on [Docker Hub](https://hub.docker.com/signup)

* Login Docker CLI: `docker login`

* Set variables used in later scripts. **Note**: Replace *rstropek* in the following line with your docker id

```bash
DOCKER_ID="rstropek"
IMG="hotelsapi"
```

* Build API: `docker build -t $DOCKER_ID/$IMG .`

* The web API needs a SQL Server. Start SQL Server in Docker container.

```bash
docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=P@ssw0rd123' -p 1433:1433 -d --name sqldb mcr.microsoft.com/mssql/server`
```

* Start API in Docker container and link it with SQL Server

```bash
docker run -it --rm -p 5000:80 --link sqldb:db -e Logging__LogLevel__Default=Information $DOCKER_ID/$IMG
```

* Push API to Docker Hub: `docker push $DOCKER_ID/$IMG`

* Open [Docker Hub](https://hub.docker.com) and verfiy that your image is available

## Getting Started with Azure

* Later, we will test WebHooks with *Azure Container Registry*. Create a [WebHook test target on https://webhook.site](https://webhook.site) and copy it's URL (something like *https://webhook.site/00000000-0000-0000-0000-000000000000*).

* Set some variables that we will use throughout this demo. **Note** that you have to replace some variables.

```bash
SUBSCRIPTION="Your Azure Subscription Name"
WHTARGET="Your webhook test URL from https://webhook.site"
LOCATION="westeurope"
IMG="hotelsapi"
RG="devcamp"
REG="devcamp19"
SKU="premium"
SP="devcamp19-sp"
PASSWD="P@ssw0rd123" # NEVER do that in real world!!!!
WEB="devcamp19-web"
LINUX_PLAN="devcamp19cplan"
LINUX_WEB_APP="devcamp19cweb" # Choose any unique name here (e.g. something with your name)
KV="vault$IMG"
AKS="devcamp19aks"
SQL="$RG-sql"
SQLPWD="P@ssw0rd123"
DB="Hotels"
AI=$RG-ai
```

* Log in and select correct account

```bash
az login
az account set --subscription "$SUBSCRIPTION"
```

* Create resource groups if it does not exist yet

```bash
if [ $(az group exists --name "$RG") == 'false' ]
then
    az group create --name "$RG" --location "$LOCATION"
fi
```

* Create Azure SQL DB

```bash
if ! az sql server show --resource-group "$RG" --name "$SQL"
then
    # Create server
    az sql server create --resource-group $RG --name $SQL --location $LOCATION --admin-user dev --admin-password $SQLPWD

    # To make testing easier, we allow connections for all IP addresses. In real world, limit access accordingly
    az sql server firewall-rule create --resource-group $RG --server $SQL --name all --start-ip-address 0.0.0.0 --end-ip-address 255.255.255.255

    # Create DB
    az sql db create --server $SQL --resource-group $RG --name $DB
fi
```

* Create application insights instance

```bash
if ! az resource show --resource-group $RG --resource-type Microsoft.Insights/components --name $AI
then
    az resource create --resource-group $RG --name $AI --resource-type Microsoft.Insights/components --location $LOCATION --properties '{"Application_Type":"web"}'

    # Get AI instrumentation key and store it in variable
    AIKEY=$(az resource show --resource-group $RG --resource-type Microsoft.Insights/components --name $AI | jq '.properties.InstrumentationKey' -r)
fi
```

## Azure Container Registry (ACR)

* Create Azure Container Registry if it does not exist yet

```bash
if [ $(az acr check-name --name "$REG" --query nameAvailable) == 'true' ]
then
    az acr create --resource-group "$RG" --name "$REG" --sku "$SKU" --admin-enabled
fi
# Get ID of ACR
ACRID=$(az acr show --name "$REG" --resource-group "$RG" --query "id" -o tsv)
```

* You could use the following command to get the password of the admin account: `az acr credential show --name "$REG" --query "passwords[0].value"`. Prefer service principals (as shown below) for production scenarios.

* Log in with individual account of developer (for e.g. pushing containers using docker cli)

```bash
az acr login --name "$REG"
```

* Create a service principal if it does not exist yet

```bash
if [ $(az ad sp list --display-name "$SP" | jq length) == '0' ]
then
    az ad sp create-for-rbac --name "$SP" --password "$PASSWD"
fi
# Get ID of service principal
SPAPPID=$(az ad sp list --display-name "$SP" --query "[].appId" -o tsv)
```

* You could use the following command to delete the service principal: `az ad sp delete --id "$SPAPPID"`

* Assign service principal the `Contributor` role so it can push images

```bash
if [ $(az role assignment list --assignee "$SPAPPID" --role Contributor --scope "$ACRID" | jq length) == '0' ]
then
    az role assignment create --assignee "$SPAPPID" --role Contributor --scope "$ACRID"
fi
```

* Use usual `docker login` with service principal to authenticate at ACR with Docker CLI

```bash
docker login -u $SPAPPID -p $PASSWD $REG.azurecr.io
```

* Push an image to ACR with Docker CLI

```bash
docker tag $DOCKER_ID/$IMG $REG.azurecr.io/$IMG
docker push $REG.azurecr.io/$IMG
```

* Use ACR quick task to build an image in the cloud

```bash
az acr build --registry "$REG" --image $IMG:v2 .
```

* Inspect storage limits

```bash
az acr show-usage --resource-group "$RG" --name "$REG" --output table
```

* You could use the following statement to delete the image from ACR: `az acr repository delete --name "$REG" --image $IMG:v1`

* Get a list of repositories and tags in the registry

```bash
az acr repository list --name $REG
az acr repository show-tags --repository $IMG --name $REG
```

## Azure Container Instance (ACI)

* Create Keyvault and store store service principal name, secret, and DB connection string

```bash
if ! az keyvault show --resource-group "$RG" --name "$KV"
then
    az keyvault create --resource-group "$RG" --name "$KV"
    # To delete: az keyvault delete --resource-group "$RG" --name "$KV"

    # Create service principal and store the generated password in Keyvault
    az keyvault secret set --vault-name $KV --name $REG-pull-PASSWD \
        --value $(az ad sp create-for-rbac --name $REG-pull2 --scopes $ACRID --role reader --query password --output tsv)
    # To delete: az ad sp delete --id $(az ad sp list --display-name "$REG-pull" --query "[].appId" -o tsv)

    # Store service principal's name in KeyVault
    az keyvault secret set --vault-name $KV --name $REG-pull-usr \
        --value $(az ad sp show --id http://$REG-pull2 --query appId --output tsv)

    # Store connection string in KeyVault
    az keyvault secret set --vault-name $KV --name $REG-sql-conn \
        --value "Server=$SQL.database.windows.net,1433;Initial Catalog=$DB;User ID=dev;Password=$SQLPWD;Persist Security Info=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
fi
```

* Start container from image in ACR if it does not already exist. Note that we use ACI here. Other options would be App Service or AKS (Kubernetes)

```bash
if ! az container show --resource-group "$RG" --name "$WEB"
then
    # Note how we get service principal data from Keyvault
    az container create --resource-group "$RG" --name "$WEB" --image $REG.azurecr.io/$IMG --cpu 1 --memory 1 --ip-address public --ports 80 \
        --registry-login-server $REG.azurecr.io \
        --registry-username $(az keyvault secret show --vault-name $KV --name $REG-pull-usr --query value -o tsv) \
        --registry-password $(az keyvault secret show --vault-name $KV --name $REG-pull-PASSWD --query value -o tsv) \
        --secure-environment-variables "ConnectionStrings__DefaultConnection=$(az keyvault secret show --vault-name $KV --name $REG-sql-conn --query value -o tsv)" \
                                       "ApplicationInsights__InstrumentationKey=$AIKEY"

    # You could use the following statement to see logs
    # az container attach --resource-group "$RG" --name "$WEB"

    # You could use the following statement to delete the container
    # az container delete --resource-group "$RG" --name "$WEB" --yes
fi
```

## ACR Integration Scenarios

* Create a webhook so we get notified about container pushes

```bash
if ! az acr webhook show --registry "$REG" --name "webhook1$REG"
then
    az acr webhook create --registry "$REG" --name "webhook1$REG" --actions push --uri $WHTARGET

    # After creating the webhook, trigger a push or build to ACR and see how the webhook is triggered
fi
```

**Note** that we will not do the following demos in the workshop in Vienna because of limited time. However, I would like to include the scripts so interested people can try the demos at home:

* Demo demo website that displays events happening in EventGrid

```bash
if output=$(az appservice plan show --resource-group "$RG" --name "$EVENT_SITE-plan") && [ -z "$output" ]
then
    az group deployment create --resource-group "$RG" \
        --template-uri "https://raw.githubusercontent.com/Azure-Samples/azure-event-grid-viewer/master/azuredeploy.json" \
        --parameters siteName=$EVENT_SITE hostingPlanName=$EVENT_SITE-plan
fi
```

* Register EventGrid provider if not already registered

```bash
if [ $(az provider show --namespace Microsoft.EventGrid --query "registrationState" --output tsv) != "Registered" ]
then
    az provider register --namespace Microsoft.EventGrid
fi
```

* Add EventGrid subscription if not already exists

```bash
if ! az eventgrid event-subscription show --name event-sub-acr --source-resource-id $ACRID
then
    az eventgrid event-subscription create --name event-sub-acr --source-resource-id $ACRID --endpoint $APP_ENDPOINT
    # az eventgrid event-subscription delete --name event-sub-acr --resource-id $ACRID
fi
```

* After creating the subscription, trigger a push or build to ACR and see how the EventGrid message is sent

* Create a task that listens to change in GitHub and rebuilds images if necessary

```bash
if ! az acr task show --registry "$REG" --name "$TASK"
then
    az acr task create --registry "$REG" --name "$TASK" --image $TASK:{{.Run.ID}} \
        --context $GHREPO --branch master --file Dockerfile --git-access-token $GHPAT
fi
```

* Use the following command to manually trigger the task

```bash
az acr task run --registry "$REG" --name "$TASK"
```

* Use the following command to see a list of task runs

```bash
az acr task list-runs --registry "$REG" --output table
```

## Azure App Service

* Create Linux app service plan if it does not exist

```bash
if output=$(az appservice plan show --resource-group "$RG" --name "$LINUX_PLAN") && [ -z "$output" ]
then
    az appservice plan create --name "$LINUX_PLAN" --resource-group "$RG" --sku b1 --is-linux
fi
```

* Deploy container web app

```bash
if ! az webapp show --resource-group "$RG" --name "$LINUX_WEB_APP"
then
    # Create web app with dummy container image (will be changed later)
    az webapp create --resource-group "$RG" --plan "$LINUX_PLAN" --name "$LINUX_WEB_APP" \
        --deployment-container-image-name nginx:alpine

    # Use managed identity to allow access to Keyvault
    az webapp identity assign --resource-group "$RG" --name "$LINUX_WEB_APP"
    SPWEBAPP=$(az ad sp list --display-name "$LINUX_WEB_APP" --query "[].appId" -o tsv)
    az keyvault set-policy --resource-group $RG --name $KV --secret-permissions get --spn $SPWEBAPP

    # Get URL of connection string in Keyvault and store it in app settings
    CONNSTRINGVERSION=$(az keyvault secret list-versions --vault-name $KV --name $REG-sql-conn | jq '.[0].id' -r)
    az webapp config appsettings set --resource-group $RG --name $LINUX_WEB_APP \
        --settings "ConnectionStrings__DefaultConnection=@Microsoft.KeyVault(SecretUri=$CONNSTRINGVERSION)" \
                   "ApplicationInsights__InstrumentationKey=$AIKEY"

    # Set container of web app to correct image
    az webapp config container set --resource-group "$RG" --name "$LINUX_WEB_APP" \
        --docker-custom-image-name $REG.azurecr.io/$IMG \
        --docker-registry-server-user $(az keyvault secret show --vault-name $KV --name $REG-pull-usr --query value -o tsv) \
        --docker-registry-server-password $(az keyvault secret show --vault-name $KV --name $REG-pull-PASSWD --query value -o tsv)
fi
```

## Azure Kubernetes Service (AKS)

* Register Kubernetes provider if not already registered

```bash
if [ $(az provider show --namespace Microsoft.ContainerService --query "registrationState" --output tsv) != "Registered" ]
then
    az provider register --namespace Microsoft.ContainerService
fi
```

* Create Kubernetes cluster

```bash
if ! az aks show --resource-group "$RG" --name "$AKS"
then
    az aks create --resource-group "$RG" --name "$AKS" --node-count 3 --generate-ssh-keys \
        --location westeurope \
        --client-secret $(az keyvault secret show --vault-name $KV --name $REG-pull-PASSWD --query value -o tsv) \
        --service-principal $(az keyvault secret show --vault-name $KV --name $REG-pull-usr --query value -o tsv)
fi
```

* Connect kubectl with AKS: `az aks get-credentials --resource-group "$RG" --name "$AKS"`

* Check connection to AKS: `kubectl get nodes`

* Deploy demo API to Kubernetes

```bash
cat hotels.yaml \
  | sed "s/{{CONNSTRING}}/$(az keyvault secret show --vault-name $KV --name $REG-sql-conn --query value -o tsv)/g" \
  | sed "s/{{AIKEY}}/$AIKEY/g" \
  | kubectl apply -f -
```

* Watch front-end service to get public IP: `kubectl get service hotelsapi-svc --watch`

* Try to reach web app via public IP

* Create a ClusterRoleBinding which gives the role dashboard-admin to the ServiceAccount

```bash
kubectl create clusterrolebinding kubernetes-dashboard -n kube-system --clusterrole=cluster-admin --serviceaccount=kube-system:kubernetes-dashboard
```

* Start Kubernetes dashboard (CMD, not bash as we need to start a local browser)

```bash
az aks browse --resource-group "$RG" --name "$AKS"
```
