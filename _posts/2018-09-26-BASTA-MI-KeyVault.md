---
layout: blog
title: Managed Identities and Azure Key Vault
excerpt: Learn how to manage your secrets using Managed Identities for Azure Resources and Azure Key Vault.
author: Rainer Stropek, Stefan Selig
date: 2018-09-26
bannerimage: /content/images/blog/2018/09/top-secret-square.png
lang: en
tags: [Azure, .NET, JWT, Node]
permalink: /devblog/2018/09/26/BASTA-MI-KeyVault
showtoc: true
---

{: .banner-image}
![Intro Logo]({{site.baseurl}}/content/images/blog/2018/09/top-secret.png)

# Session

This year, I did sessions about *Managed Identities for Azure Resources* and *Azure Key Vault* at Techorama (Belgium) and BASTA (Germany) conferences. This blog post contains a summary of the content and links to recording, slides, and samples.

Sesson Title: *Managing secrets using Azure Key Vault*

Abstract: *This session is all about managing secrets securely and easily without storing them in application code. For that we take advantage of Azure Key Vault and Managed Service Identity.*

## Recording

<div class="videoWrapper">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/XV5SF7lTEw8" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>

## The Problem

Very often developers store secrets in an unsecure way, e.g. as plaintext in code or config files on their PCs or even checked in to a public repository on GitHub. Azure provides a solution for that problem handling all challenges we could face along the way, including

* Scalability
  * Managing a larger number of secrets
  * Large number of autonomous teams using heterogeneous technologies
* Security
  * Secure storage and handling of secrets by default
  * Key rotation
* Availabilty
  * Ensuring data access for authorized users
* Governance
  * Access control
  * Auditing

## Azure Key Vault

* Centralized storage of secrets in *Vaults*
  * Controlled distribution
  * Monitor and log access to secrets and TLS certificates
* Vaults = secure containers for secrets
  * Hardware Security Modules (HSMs)
* Can be accessed via APIs (.NET, REST)
* Protected by Azure Active Directory
  * User accounts and service principles
* Integrated with other Azure Services
  * E.g. Managed Service Identity

## Managed identities for Azure resources

> Note: *Managed identities for Azure resources* is the new name for the service formerly known as *Managed Service Identity* (MSI). When you browse the web you will often encounter both old and the new name and we will also use both terms in this tutorial.

Key Vault is the place to store all secrets needed including keys, certificates, credentials, but what's the way to access it? If you stored the master password to get into Key Vault in a config file or in code, you'd have the same problem. The solution to that problem is *Managed Service Identity*. It's a way to handle secrets for Azure services including Key Vault. The most important aspects are:

* Simplifies handling secrets for Azure services
  * Creation, use, key rotation
* Never stores credentials in code or config
  * Integrated with Azure Active Directory
* Supports development and production
  * Use developer's credentials during dev
  * Handle access credentials automatically in production
* Integrated with many Azure Services
  * In this talk we focus on the integration with Azure Key Vault

## Azure CLI

For this demo we need the Azure CLI tools. We could also use the visual Azure Website to do all that, but in real life everything is done via scripts with automation in mind.

In this session I use Visual Studio Code with bash and the Extension *Azure CLI Tools* installed. Most of the demo code is a .azcli file, but we will later also explore a little .NET code as well as some JavaScript.

Now let's get started, the first few lines have configuration purposes and set up everything.

```bash
#!/bin/sh

# Prepare Azure CLI environment
az login
az account set --subscription "<your subscription>"
az provider register -n Microsoft.KeyVault

# Get access token for Key Vault using Azure CLI
# Note that this is an option for programming languages that does not support
# a ready-made package for MSI like C# does (Microsoft.Azure.Services.AppAuthentication).
# See also Node sample in NodeDemo/server.js
az account get-access-token --resource "https://vault.azure.net"

# Some naming constants
export RG=techorama-msi-live
export PLAN=msi-demo-plan-live
export APP=msi-demo-app-live
export VAULT=msi-demo-vault-live
export KEY=API-Key
export VM=techorama-msi-demo-live

# Create Resource Group if not exists
if [ "$(az group exists --resource-group $RG)" == "false" ]
then
    az group create --name $RG --location westeurope
fi
```

## Azure Key Vault and Managed Service Identity

After that let's dive into using key vault/msi with web apps. We create an app service plan in the resource group defined earlier and assign the Service Identity to it.

```bash
# === App Service demo =================================================================
# For details read https://docs.microsoft.com/en-us/azure/app-service/app-service-managed-service-identity?context=azure/active-directory/context/msi-context

# Create App Service Plan if not exists
# Note: MSIs for Linux plans currently not supported
if [ "$(az appservice plan list --resource-group $RG --query "[?name=='$PLAN']")" == "[]" ]
then
    az appservice plan create --name $PLAN --resource-group $RG --sku S1
fi

# Create web app and assign MSI
if [ "$(az webapp list --resource-group $RG --query "[?name=='$APP']")" == "[]" ]
then
    az webapp create --name $APP --resource-group $RG --plan $PLAN
    az webapp identity assign --name $APP --resource-group $RG
fi
```

## Connect your web app with Key Vault

Next is getting the ID of your web app's service principal and create a Key Vault to use it with.

```bash
# Show assigned identity for web app in Azure portal

# Display the details about the created service principal
az ad sp list --display-name $APP

# Get Object ID of Service Principal and store it for later use
export OID=$(az ad sp list --display-name $APP --query "[:1].objectId" --out tsv)

# Create Key Vault if not exists and store a sample secret
if [ "$(az keyvault list --resource-group $RG --query "[?name=='$VAULT']")" == "[]" ]
then
    # Note: Seperate Key Vaults for stages (dev, test, prod, etc.)

    az keyvault create --name $VAULT --resource-group $RG --location westeurope
    az keyvault secret set --vault-name $VAULT --name $KEY --value 'P@ssw0rd!123'
fi

# Allow app (=Service Principal) to read secret from Key Vault
az keyvault set-policy --name $VAULT --object-id $OID --secret-permissions get
az keyvault secret show --vault-name $VAULT --name $KEY
```

## How to use Key Vault with a VM that runs within Azure

The following code creates a few things: a vnet, public-ip, nic, and a vm (Ubuntu).
Then it assigns the Managed Service identity to the VM, and allowes it to read the stored secret.
You can try it by running the code in the comments on the bottom.

Previously there was some software atop of the VM for handling secrets, but now that's deprecated and it's recommended to access a REST service that's located at an address only the VM can access for getting the bearer token to authorize for our application. (See bottom two lines).

```bash
# === VM demo =====================================================================
# For detailed information read https://docs.microsoft.com/en-us/azure/active-directory/managed-service-identity/tutorial-linux-vm-access-nonaad

if [ "$(az vm show --resource-group $RG --name $VM)" == "" ]
then
    # Create VM
    az network vnet create --resource-group $RG --name myVnet --address-prefix 192.168.0.0/16 \
        --subnet-name mySubnet --subnet-prefix 192.168.1.0/24
    az network public-ip create --resource-group $RG --name myPublicIP --dns-name $VM
    az network nic create --resource-group $RG --name myNic --vnet-name myVnet --subnet mySubnet \
        --public-ip-address myPublicIP
    az vm create --resource-group $RG --name $VM --location westeurope --nics myNic --image UbuntuLTS \
        --admin-username rainer --admin-password Passw0rd1234

    # Assign MSI to VM
    az vm identity assign --resource-group $RG --name $VM

    # Allow VM MSI to read secret
    export VMOID=$(az ad sp list --display-name $VM --query "[:1].objectId" --out tsv)
    az keyvault set-policy --name $VAULT --object-id $VMOID --secret-permissions get
fi

# SSH into VM and run the folling statements to demo getting access token for Key Vault
# Note that we get the token from the Azure Instance Metadata Service (IMDS) identity endpoint.
# This is the recommended way of retrieving an access token.

# sudo apt-get update
# sudo apt-get install -y curl jq
# curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fvault.azure.net' -H Metadata:true | jq .
# curl 'https://msi-demo-vault-live.vault.azure.net/secrets/API-Key?api-version=2016-10-01' -H "Authorization: Bearer abcdefgh ..." | jq .
```

## A .NET sample project

This is a little .NET Core 2.1 web application with a web service for accessing Key Vault.

The `azureServiceTokenProvider` is the API used for handling access to key vault. It will look up if you're loggin in via:

* Visual Studio
* or Azure CLI
* or as a User that's associated with a Azure Active Directory Domain

in order to get the credentials needed for accessing the key vault.
You can also specify a certain location for the provider to look for as shown in the code comment.

The web service retrieves the secret that's stored in the vault via MSI.

```csharp
// GET api/values
[HttpGet]
public async Task<ActionResult> Get()
{
    // For details about connection string see https://docs.microsoft.com/en-us/azure/key-vault/service-to-service-authentication#connection-string-support
    //var azureServiceTokenProvider = new AzureServiceTokenProvider("RunAs=Developer; DeveloperTool=VisualStudio");
    var azureServiceTokenProvider = new AzureServiceTokenProvider();

    // Get access token for Key Vault
    var token = await azureServiceTokenProvider.GetAccessTokenAsync("https://vault.azure.net", "<your tenant id>");

    // Use MSI to get a KeyVaultClient
    using (var kvClient = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(azureServiceTokenProvider.KeyVaultTokenCallback)))
    {
        var secret = await kvClient.GetSecretAsync("https://msi-demo-vault-live.vault.azure.net/secrets/API-Key");

        return Ok(new
        {
            MsiEndpoint = Environment.GetEnvironmentVariable("MSI_ENDPOINT"),
            MsiSecret = Environment.GetEnvironmentVariable("MSI_SECRET"),
            SecretValue = secret.Value,
            AccessToken = token
        });
    }
}
```

When you run the application you can retrieve the data at `/API/secrets`.
We can also publish the application within Visual Studio and access
`http://msi-demo-app-live.azurewebsites.net/API/secrets` for the same results.

## Key Vault via REST

If you happen to use a technology stack that is not supported by MSI, you can also access the KeyVault via standard-conform REST. All you need is a bearer token, that you can get via Azure CLI tool (Beside of Windows also available for GNU/Linux and macOS).

```http
GET https://msi-demo-vault.vault.azure.net/secrets/API-Key?api-version=2016-10-01
Authorization: Bearer abcdef ...
Content-Type: application/json
Accept: application/json

###
GET https://login.microsoftonline.com/rainertimecockpit.onmicrosoft.com/.well-known/openid-configuration
```

## Additional Links

If you wanna see the session's results, go to GitHub for the complete sample project: [rstropek/AzureKeyVault](https://github.com/rstropek/Samples/tree/master/AzureKeyVault).
