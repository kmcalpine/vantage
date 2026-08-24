# Client Portal — Phase 1: Foundation and Identity — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the `vantage-portal` repository, Azure infrastructure, and Entra External ID tenant, and prove end to end that a real client token reaches a deployed API which returns that caller's organisations from SQL — and that the API can provision Entra accounts via Graph without holding a secret.

**Architecture:** A .NET 10 minimal API runs on Azure Container Apps with a user-assigned managed identity. Entra External ID (a separate tenant) issues tokens via an email-OTP user flow with self-service sign-up disabled. The API validates those tokens, loads the caller's `AppUser` and `UserClient` memberships from Azure SQL, and resolves the `X-Client-Org-Id` header in an endpoint filter so handlers stay tenancy-agnostic. Account creation happens through Microsoft Graph against the External ID tenant, authorised by a federated identity credential that trusts the managed identity — so no client secret exists.

**Tech Stack:** .NET 10 minimal API, EF Core 10, Azure SQL (Basic), Azure Container Apps, Bicep, Microsoft.Identity.Web, Microsoft.Graph SDK, xUnit, Testcontainers, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-22-client-document-portal-design.md` (this repo; moves to `vantage-portal` in Task 1)

## Global Constraints

Every task's requirements implicitly include these. Values are copied verbatim from the spec.

- Target framework: **.NET 10**.
- Azure SQL tier: **Basic (5 DTU, 2GB)**. Serverless is explicitly rejected — its unpaused floor exceeds $200/month.
- Container Apps: **Consumption**, `minReplicas: 0`.
- Storage account: **`allowBlobPublicAccess: false`** and **`allowSharedKeyAccess: false`**. No account keys anywhere.
- SQL authentication: **Entra-only**, no SQL logins.
- Sign-in method: **email one-time passcode**. Self-service sign-up disabled via `isSignUpAllowed = false`. MFA is knowingly unavailable as a consequence.
- Header name: **`X-Client-Org-Id`**. Absent → **400**. Naming an organisation outside the caller's permitted set → **403**.
- `GET /api/organizations` is the **only** route without tenant resolution.
- Handlers never read the header, `TenantContext`, or `ClientId`.
- No secrets in application configuration. A Graph client secret is a **fallback of last resort** and must be recorded as a regression if used.
- Domains: `portal.vantagesafetyservices.co.uk` (SPA), `api.vantagesafetyservices.co.uk` (API).
- Azure region: `uksouth`. Resource prefix: `vantage-portal`.

## File Structure

```
vantage-portal/
├── Vantage.Portal.sln
├── Directory.Build.props                  net10.0, nullable, warnings-as-errors
├── src/Vantage.Portal.Api/
│   ├── Program.cs                         pipeline composition only
│   ├── Dockerfile
│   ├── Auth/
│   │   ├── TenantContext.cs               scoped holder for the resolved org id
│   │   ├── CallerContext.cs               scoped holder for AppUser + memberships
│   │   ├── CallerContextMiddleware.cs     token → AppUser → memberships (cached)
│   │   └── ResolveTenantFilter.cs         header → validate → TenantContext
│   ├── Data/
│   │   ├── PortalDbContext.cs
│   │   └── Entities/{Client,AppUser,UserClient}.cs
│   ├── Provisioning/
│   │   ├── IUserProvisioner.cs
│   │   └── GraphUserProvisioner.cs
│   └── Endpoints/OrganizationEndpoints.cs
├── tests/
│   ├── Vantage.Portal.Api.Tests/          unit — no I/O
│   └── Vantage.Portal.Api.IntegrationTests/
│       ├── TestTokens.cs                  self-signed JWT + in-memory JWKS
│       └── PortalAppFactory.cs            WebApplicationFactory + Testcontainers SQL
├── infra/main.bicep
├── docs/entra-setup.md                    manual steps, with verification commands
└── .github/workflows/api.yml
```

Files split by responsibility, not layer: `Auth/` owns everything that turns a request into an authorised caller, and nothing else touches it.

---

### Task 1: Repository scaffold and CI

**Files:**
- Create: `Vantage.Portal.sln`, `Directory.Build.props`, `src/Vantage.Portal.Api/Vantage.Portal.Api.csproj`, `src/Vantage.Portal.Api/Program.cs`, `tests/Vantage.Portal.Api.Tests/Vantage.Portal.Api.Tests.csproj`, `.github/workflows/api.yml`, `.gitignore`
- Move: the spec from this repo into `vantage-portal/docs/superpowers/specs/`

**Interfaces:**
- Consumes: nothing
- Produces: a solution that builds and tests green; `GET /health` returning `200 "ok"`

- [ ] **Step 1: Create the repository and solution**

```bash
mkdir -p ~/projects/vantage-portal && cd ~/projects/vantage-portal && git init
dotnet new gitignore
dotnet new sln -n Vantage.Portal
dotnet new web    -o src/Vantage.Portal.Api   -n Vantage.Portal.Api   -f net10.0
dotnet new xunit  -o tests/Vantage.Portal.Api.Tests -n Vantage.Portal.Api.Tests -f net10.0
dotnet sln add src/Vantage.Portal.Api tests/Vantage.Portal.Api.Tests
dotnet add tests/Vantage.Portal.Api.Tests reference src/Vantage.Portal.Api
```

- [ ] **Step 2: Add `Directory.Build.props`**

```xml
<Project>
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  </PropertyGroup>
</Project>
```

- [ ] **Step 3: Write the failing health test**

`tests/Vantage.Portal.Api.Tests/HealthTests.cs`:

```csharp
using Microsoft.AspNetCore.Mvc.Testing;

public class HealthTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    public HealthTests(WebApplicationFactory<Program> factory) => _factory = factory;

    [Fact]
    public async Task Health_returns_ok()
    {
        var response = await _factory.CreateClient().GetAsync("/health");
        Assert.Equal(System.Net.HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("ok", await response.Content.ReadAsStringAsync());
    }
}
```

Add the test package and expose `Program`:

```bash
dotnet add tests/Vantage.Portal.Api.Tests package Microsoft.AspNetCore.Mvc.Testing
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `dotnet test`
Expected: FAIL — `Program` is inaccessible, or 404 on `/health`.

- [ ] **Step 5: Write `Program.cs`**

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/health", () => Results.Text("ok"));

app.Run();

public partial class Program { }
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `dotnet test`
Expected: PASS, 1 test.

- [ ] **Step 7: Add the CI workflow**

`.github/workflows/api.yml`:

```yaml
name: API
on:
  push: { branches: [main] }
  pull_request:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-dotnet@v4
        with: { dotnet-version: '10.0.x' }
      - run: dotnet restore
      - run: dotnet build --no-restore -c Release
      - run: dotnet test --no-build -c Release --verbosity normal
```

- [ ] **Step 8: Move the spec across and commit**

```bash
mkdir -p docs/superpowers/specs
cp ~/projects/vantage/docs/superpowers/specs/2026-08-22-client-document-portal-design.md docs/superpowers/specs/
git add -A
git commit -m "chore: scaffold vantage-portal solution, health endpoint, CI"
```

---

### Task 2: Entra External ID tenant and app registrations

This task is manual Azure configuration. It has no unit tests; each step ends with a command whose output proves it worked. Record every id produced — later tasks consume them.

**Files:**
- Create: `docs/entra-setup.md`

**Interfaces:**
- Produces: `EXTERNAL_TENANT_ID`, `EXTERNAL_TENANT_DOMAIN`, `API_APP_ID` (audience), `SPA_APP_ID`, `USER_FLOW_ID`, and an API scope `access_as_user`

- [ ] **Step 1: Create the external tenant**

In the Azure portal: **Microsoft Entra ID → Manage tenants → Create → External**. Name it `vantagesafety`, region United Kingdom. Tenant creation is portal-only; there is no CLI equivalent.

Record the tenant id and the `<name>.onmicrosoft.com` domain in `docs/entra-setup.md`.

- [ ] **Step 2: Enable email one-time passcode at tenant level**

In the external tenant: **External Identities → All Identity Providers →
Email One-time-passcode**.

**Do not use Entra ID → Authentication methods → Email OTP.** That blade configures
the B2B *guest* email-OTP feature for workforce tenants and will not give customers
OTP sign-in. The docs page titled "Email one-time passcode authentication"
(`entra/external-id/one-time-passcode`) describes that same guest feature — it is
the wrong article for this tenant.

This is a prerequisite for the option to appear in Step 5's user flow.

- [ ] **Step 3: Register the API application**

Supported account types must be **Single tenant only — VantageSafetyServices**
(`AzureADMyOrg`). Your clients are local accounts inside the external tenant; the
multi-tenant and personal-Microsoft-account options are wrong here.

```bash
az login --tenant <EXTERNAL_TENANT_DOMAIN> --allow-no-subscriptions
az ad app create --display-name "vantage-portal-api" --sign-in-audience AzureADMyOrg
```

Record `appId` as `API_APP_ID`. Then in the portal:

1. **API permissions → Grant admin consent for VantageSafetyServices.** Required
   even for the default `User.Read`: in external tenants customers cannot consent
   for themselves, so an unconsented permission blocks sign-in.
2. **Expose an API** → set the Application ID URI to `api://<API_APP_ID>` → add a
   scope named `access_as_user`, **Admins only**, description "Access the Vantage
   client portal API".

- [ ] **Step 4: Register the SPA application**

Same account type: **Single tenant only — VantageSafetyServices**. The redirect
URIs must be registered under the **Single-page application (SPA)** platform, not
Web — a SPA using auth-code-with-PKCE is rejected under the Web platform.

```bash
az ad app create --display-name "vantage-portal-spa" \
  --sign-in-audience AzureADMyOrg \
  --is-fallback-public-client true \
  --spa-redirect-uris "http://localhost:5173" "https://portal.vantagesafetyservices.co.uk"
```

Record `appId` as `SPA_APP_ID`. In the portal, under **API permissions**, add a
delegated permission to `api://<API_APP_ID>/access_as_user`, then **Grant admin
consent for VantageSafetyServices** — again mandatory, not optional, in an
external tenant.

- [ ] **Step 5: Create the sign-up and sign-in user flow**

In the external tenant: **External Identities → User flows → New user flow**. Path: **Entra ID → External Identities → User flows → New user flow**.

Name it `portal-signin`. Under **Identity providers**, tick the **Email Accounts**
check box, then select **Email one-time passcode** — *Email with password* is the
default and must be changed. Under **User attributes**, collect **Email Address**
and **Display Name**. Select **OK**, then **Create**.

Then associate the `vantage-portal-spa` application with the flow.

**On MFA:** choosing Email one-time passcode still permits multifactor
authentication, with **SMS text codes** as the second factor. What is impossible is
email OTP acting as both factors. Phase 1 does not enable MFA; the option remains
open without changing the sign-in method.

Record the user flow id as `USER_FLOW_ID`.

- [ ] **Step 6: Add `email` as an optional claim — do not skip this**

In the portal, on the **`vantage-portal-api`** registration: **Token configuration
→ Add optional claim → Access token → `email`**.

External ID access tokens do **not** carry `email` by default. The API binds a
provisioned client's identity on first sign-in by matching that claim, so without
it every newly provisioned client authenticates successfully and then receives 403
forever. The shipped middleware falls back to `preferred_username`, so this is
defence in depth rather than a single point of failure — but configure it anyway,
and verify it in the next step.

- [ ] **Step 7: Verify a real token can be obtained**

Sign in as a test user through the flow and capture an **access token** (not the id
token — they carry different claims). Paste it into <https://jwt.ms> and confirm:

- `iss` is `https://<EXTERNAL_TENANT_ID>.ciamlogin.com/<EXTERNAL_TENANT_ID>/v2.0`
- `aud` equals `API_APP_ID`
- `scp` contains `access_as_user`
- `oid` is present
- **`email` is present** (or, failing that, `preferred_username` — the middleware
  accepts either, but if neither appears, stop: first sign-in cannot bind)

Record the exact `iss` string in `docs/entra-setup.md` — Task 3 hardcodes it as the expected issuer.

- [ ] **Step 8: Commit the setup documentation**

```bash
git add docs/entra-setup.md
git commit -m "docs: record External ID tenant, app registrations, user flow ids"
```

**Do not disable sign-up yet.** Task 7 does that, after Graph provisioning is proven — disabling it earlier locks you out of creating test users.

---

### Task 3: Token validation

**Files:**
- Create: `tests/Vantage.Portal.Api.IntegrationTests/` project, `TestTokens.cs`, `PortalAppFactory.cs`, `tests/.../TokenValidationTests.cs`
- Modify: `src/Vantage.Portal.Api/Program.cs`

**Interfaces:**
- Consumes: `API_APP_ID`, issuer string (Task 2)
- Produces: `PortalAppFactory` (used by every later integration test); `TestTokens.Create(oid, email, extraClaims)` returning a bearer string; authenticated requests reach endpoints with an `oid` claim

- [ ] **Step 1: Create the integration test project**

```bash
dotnet new xunit -o tests/Vantage.Portal.Api.IntegrationTests -n Vantage.Portal.Api.IntegrationTests -f net10.0
dotnet sln add tests/Vantage.Portal.Api.IntegrationTests
dotnet add tests/Vantage.Portal.Api.IntegrationTests reference src/Vantage.Portal.Api
dotnet add tests/Vantage.Portal.Api.IntegrationTests package Microsoft.AspNetCore.Mvc.Testing
dotnet add tests/Vantage.Portal.Api.IntegrationTests package System.IdentityModel.Tokens.Jwt
dotnet add src/Vantage.Portal.Api package Microsoft.AspNetCore.Authentication.JwtBearer
```

- [ ] **Step 2: Write the test token helper**

Real Entra tokens expire and can't be minted in CI. Tests sign their own with a known key and the factory configures the API to trust that key — the validation logic under test is identical, only the signing key differs.

`tests/Vantage.Portal.Api.IntegrationTests/TestTokens.cs`:

```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

public static class TestTokens
{
    public const string Issuer   = "https://test.ciamlogin.com/test/v2.0";
    public const string Audience = "test-api-app-id";

    public static readonly SymmetricSecurityKey SigningKey =
        new(System.Text.Encoding.UTF8.GetBytes("integration-test-signing-key-32-bytes!!"));

    public static string Create(string oid, string email)
    {
        var creds = new SigningCredentials(SigningKey, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: Issuer,
            audience: Audience,
            claims: new[]
            {
                new Claim("oid", oid),
                new Claim("email", email),
                new Claim("scp", "access_as_user"),
            },
            expires: DateTime.UtcNow.AddMinutes(10),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

- [ ] **Step 3: Write the app factory**

`tests/Vantage.Portal.Api.IntegrationTests/PortalAppFactory.cs`:

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

public class PortalAppFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            services.Configure<JwtBearerOptions>(
                JwtBearerDefaults.AuthenticationScheme, options =>
            {
                options.Authority = null;
                options.MetadataAddress = null!;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = TestTokens.Issuer,
                    ValidAudience = TestTokens.Audience,
                    IssuerSigningKey = TestTokens.SigningKey,
                    ValidateIssuerSigningKey = true,
                };
            });
        });
    }
}
```

- [ ] **Step 4: Write the failing tests**

`tests/Vantage.Portal.Api.IntegrationTests/TokenValidationTests.cs`:

```csharp
using System.Net;
using System.Net.Http.Headers;

public class TokenValidationTests : IClassFixture<PortalAppFactory>
{
    private readonly PortalAppFactory _factory;
    public TokenValidationTests(PortalAppFactory factory) => _factory = factory;

    [Fact]
    public async Task No_token_is_rejected()
    {
        var response = await _factory.CreateClient().GetAsync("/api/whoami");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Valid_token_reaches_the_endpoint()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer", TestTokens.Create("oid-123", "a@example.com"));

        var response = await client.GetAsync("/api/whoami");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("oid-123", await response.Content.ReadAsStringAsync());
    }
}
```

- [ ] **Step 5: Run the tests to verify they fail**

Run: `dotnet test tests/Vantage.Portal.Api.IntegrationTests`
Expected: FAIL — 404 on `/api/whoami`.

- [ ] **Step 6: Add authentication to `Program.cs`**

Insert before `builder.Build()`:

```csharp
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Entra:Authority"];
        options.Audience  = builder.Configuration["Entra:Audience"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
        };
    });
builder.Services.AddAuthorization();
```

And after `var app = builder.Build();`:

```csharp
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/api/whoami", (ClaimsPrincipal user) =>
    Results.Ok(new { oid = user.FindFirstValue("oid") }))
   .RequireAuthorization();
```

Add `using System.Security.Claims;` and the JWT usings at the top.

- [ ] **Step 7: Add real configuration**

`src/Vantage.Portal.Api/appsettings.json` — substitute the values recorded in Task 2:

```json
{
  "Entra": {
    "Authority": "https://<EXTERNAL_TENANT_ID>.ciamlogin.com/<EXTERNAL_TENANT_ID>/v2.0",
    "Audience": "<API_APP_ID>"
  }
}
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `dotnet test`
Expected: PASS, 3 tests.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: validate Entra External ID access tokens"
```

`/api/whoami` is scaffolding for this task's tests. Task 6 deletes it.

---

### Task 4: Azure infrastructure

**Files:**
- Create: `infra/main.bicep`

**Interfaces:**
- Produces: resource names and the managed identity's `principalId` and `clientId`, consumed by Tasks 5, 6 and 7

- [ ] **Step 1: Write the Bicep template**

`infra/main.bicep`:

```bicep
param location string = 'uksouth'
param prefix string = 'vantage-portal'
@description('Object id of the Entra group or user to make SQL admin')
param sqlAdminObjectId string
param sqlAdminLogin string

resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${prefix}-id'
  location: location
}

resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: replace('${prefix}sa', '-', '')
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
  properties: {
    allowBlobPublicAccess: false
    allowSharedKeyAccess: false
    minimumTlsVersion: 'TLS1_2'
  }
}

resource blob 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = {
  parent: storage
  name: 'default'
}

resource documents 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  parent: blob
  name: 'documents'
  properties: { publicAccess: 'None' }
}

resource previews 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  parent: blob
  name: 'previews'
  properties: { publicAccess: 'None' }
}

resource sqlServer 'Microsoft.Sql/servers@2023-05-01-preview' = {
  name: '${prefix}-sql'
  location: location
  properties: {
    administrators: {
      administratorType: 'ActiveDirectory'
      principalType: 'Group'
      login: sqlAdminLogin
      sid: sqlAdminObjectId
      tenantId: subscription().tenantId
      azureADOnlyAuthentication: true
    }
    publicNetworkAccess: 'Enabled'
  }
}

resource sqlDb 'Microsoft.Sql/servers/databases@2023-05-01-preview' = {
  parent: sqlServer
  name: 'portal'
  location: location
  sku: { name: 'Basic', tier: 'Basic', capacity: 5 }
  properties: { maxSizeBytes: 2147483648 }
}

resource allowAzure 'Microsoft.Sql/servers/firewallRules@2023-05-01-preview' = {
  parent: sqlServer
  name: 'AllowAzureServices'
  properties: { startIpAddress: '0.0.0.0', endIpAddress: '0.0.0.0' }
}

resource acr 'Microsoft.ContainerRegistry/registries@2023-11-01-preview' = {
  name: 'vantageportalacr'
  location: location
  sku: { name: 'Basic' }
  properties: { adminUserEnabled: false }
}

resource acrPull 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: acr
  name: guid(acr.id, identity.id, 'acr-pull')
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions',
      '7f951dda-4ed3-4680-a7ca-43fe172d538d')  // AcrPull
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

resource logs 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${prefix}-logs'
  location: location
  properties: { sku: { name: 'PerGB2018' }, retentionInDays: 30 }
}

resource env 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '${prefix}-env'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logs.properties.customerId
        sharedKey: logs.listKeys().primarySharedKey
      }
    }
  }
}

resource api 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${prefix}-api'
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: { '${identity.id}': {} }
  }
  properties: {
    managedEnvironmentId: env.id
    configuration: {
      ingress: { external: true, targetPort: 8080, transport: 'auto' }
      registries: [
        { server: '${acr.name}.azurecr.io', identity: identity.id }
      ]
    }
    template: {
      containers: [
        {
          name: 'api'
          image: 'mcr.microsoft.com/k8se/quickstart:latest'
          resources: { cpu: json('0.25'), memory: '0.5Gi' }
        }
      ]
      scale: { minReplicas: 0, maxReplicas: 3 }
    }
  }
}

resource blobReader 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: storage
  name: guid(storage.id, identity.id, 'blob-data-reader')
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions',
      '2a2b9908-6ea1-4ae2-8e65-a410df84e7d1')  // Storage Blob Data Reader
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

resource blobDelegator 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: storage
  name: guid(storage.id, identity.id, 'blob-delegator')
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions',
      'db58b8e5-c6ad-4a2a-8342-4190687cbf4a')  // Storage Blob Delegator
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

output identityClientId string = identity.properties.clientId
output identityPrincipalId string = identity.properties.principalId
output sqlServerName string = sqlServer.name
output apiFqdn string = api.properties.configuration.ingress.fqdn
output storageAccountName string = storage.name
output acrLoginServer string = acr.properties.loginServer
```

Storage Blob Delegator is required in addition to Data Reader — generating a user delegation key is a separate permission from reading blobs. Phase 3 needs both; assigning them now avoids a second infra change.

- [ ] **Step 2: Deploy**

```bash
az login
az group create -n vantage-portal-rg -l uksouth
az deployment group create -g vantage-portal-rg -f infra/main.bicep \
  --parameters sqlAdminObjectId=<YOUR_ENTRA_OBJECT_ID> sqlAdminLogin=<YOUR_UPN>
```

- [ ] **Step 3: Verify the hardening actually applied**

```bash
az storage account show -n <storageAccountName> -g vantage-portal-rg \
  --query "{public:allowBlobPublicAccess, sharedKey:allowSharedKeyAccess}"
```

Expected: `{"public": false, "sharedKey": false}`. If either is `true`, the constraint is violated — stop and fix before continuing.

```bash
az sql server ad-only-auth get -n <sqlServerName> -g vantage-portal-rg
```

Expected: `"azureAdOnlyAuthentication": true`.

- [ ] **Step 4: Record outputs and commit**

Append the deployment outputs to `docs/entra-setup.md`.

```bash
git add infra/main.bicep docs/entra-setup.md
git commit -m "feat: Bicep infrastructure — storage, SQL Basic, Container Apps, managed identity"
```

---

### Task 5: Container build and deployment

**Files:**
- Create: `src/Vantage.Portal.Api/Dockerfile`
- Modify: `.github/workflows/api.yml`

**Interfaces:**
- Consumes: `apiFqdn`, container app name (Task 4)
- Produces: a deployed API answering `GET /health` at its public FQDN

- [ ] **Step 1: Write the Dockerfile**

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY Directory.Build.props ./
COPY src/Vantage.Portal.Api/*.csproj src/Vantage.Portal.Api/
RUN dotnet restore src/Vantage.Portal.Api/Vantage.Portal.Api.csproj
COPY . .
RUN dotnet publish src/Vantage.Portal.Api/Vantage.Portal.Api.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "Vantage.Portal.Api.dll"]
```

Port 8080 must match `targetPort` in the Bicep ingress block.

- [ ] **Step 2: Verify the image builds and runs locally**

```bash
docker build -t vantage-portal-api -f src/Vantage.Portal.Api/Dockerfile .
docker run --rm -p 8080:8080 vantage-portal-api &
sleep 5 && curl -sf http://localhost:8080/health && echo " OK"
```

Expected: `ok OK`.

- [ ] **Step 3: Configure GitHub OIDC deployment**

```bash
az ad app create --display-name "vantage-portal-deploy"
# record appId, then create a federated credential for the repo:
az ad app federated-credential create --id <DEPLOY_APP_ID> --parameters '{
  "name": "github-main",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:kmcalpine/vantage-portal:ref:refs/heads/main",
  "audiences": ["api://AzureADTokenExchange"]
}'
az role assignment create --assignee <DEPLOY_APP_ID> --role Contributor \
  --scope /subscriptions/<SUB_ID>/resourceGroups/vantage-portal-rg
```

Add repository secrets `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`.

- [ ] **Step 4: Add the deploy job**

Append to `.github/workflows/api.yml`:

```yaml
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions: { id-token: write, contents: read }
    steps:
      - uses: actions/checkout@v5
      - uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
      - name: Build and push image
        run: |
          az acr build --registry vantageportalacr \
            --image api:${{ github.sha }} \
            --file src/Vantage.Portal.Api/Dockerfile .
      - name: Update container app
        run: |
          az containerapp update -n vantage-portal-api -g vantage-portal-rg \
            --image vantageportalacr.azurecr.io/api:${{ github.sha }}
```

The ACR and its `AcrPull` role assignment were created in Task 4, so no infrastructure change is needed here.

- [ ] **Step 5: Push and verify the deployment**

```bash
git add -A && git commit -m "feat: containerise API and deploy to Container Apps"
git push -u origin main
# wait for the workflow, then:
curl -sf https://<apiFqdn>/health && echo " DEPLOYED"
```

Expected: `ok DEPLOYED`. The first request may take 5–15 seconds — that is the documented scale-to-zero cold start, not a failure.

---

### Task 6: Data model and the organizations endpoint

**Files:**
- Create: `src/Vantage.Portal.Api/Data/Entities/{Client,AppUser,UserClient}.cs`, `Data/PortalDbContext.cs`, `Auth/CallerContext.cs`, `Auth/CallerContextMiddleware.cs`, `Endpoints/OrganizationEndpoints.cs`, `tests/.../OrganizationsTests.cs`
- Modify: `src/Vantage.Portal.Api/Program.cs` (delete `/api/whoami`), `tests/.../PortalAppFactory.cs` (add Testcontainers SQL)

**Interfaces:**
- Consumes: `PortalAppFactory`, `TestTokens.Create` (Task 3)
- Produces: `PortalDbContext`, entities `Client`/`AppUser`/`UserClient`, `CallerContext { AppUser User; IReadOnlyList<Guid> PermittedOrgIds; }`, and `GET /api/organizations` returning `{ isAdmin: bool, organizations: [{ id, businessName }] }`

- [ ] **Step 1: Add packages**

```bash
dotnet add src/Vantage.Portal.Api package Microsoft.EntityFrameworkCore.SqlServer
dotnet add src/Vantage.Portal.Api package Microsoft.EntityFrameworkCore.Design
dotnet add src/Vantage.Portal.Api package Azure.Identity
dotnet add tests/Vantage.Portal.Api.IntegrationTests package Testcontainers.MsSql
```

- [ ] **Step 2: Write the entities**

`src/Vantage.Portal.Api/Data/Entities/Client.cs`:

```csharp
namespace Vantage.Portal.Api.Data.Entities;

public class Client
{
    public Guid Id { get; set; }
    public required string BusinessName { get; set; }
    public required string ContactEmail { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;
    public List<UserClient> Members { get; set; } = [];
}
```

`AppUser.cs`:

```csharp
namespace Vantage.Portal.Api.Data.Entities;

public class AppUser
{
    public Guid Id { get; set; }
    public required string Email { get; set; }
    public string? EntraObjectId { get; set; }
    public string? DisplayName { get; set; }
    public bool IsAdmin { get; set; }
    public DateTime InvitedUtc { get; set; } = DateTime.UtcNow;
    public DateTime? FirstSignInUtc { get; set; }
    public DateTime? LastSeenUtc { get; set; }
    public List<UserClient> Memberships { get; set; } = [];
}
```

`UserClient.cs`:

```csharp
namespace Vantage.Portal.Api.Data.Entities;

public class UserClient
{
    public Guid AppUserId { get; set; }
    public AppUser AppUser { get; set; } = null!;
    public Guid ClientId { get; set; }
    public Client Client { get; set; } = null!;
    public DateTime GrantedUtc { get; set; } = DateTime.UtcNow;
}
```

`EntraObjectId` is nullable because provisioning creates the row before the person has ever signed in.

- [ ] **Step 3: Write the DbContext**

`src/Vantage.Portal.Api/Data/PortalDbContext.cs`:

```csharp
using Microsoft.EntityFrameworkCore;
using Vantage.Portal.Api.Data.Entities;

namespace Vantage.Portal.Api.Data;

public class PortalDbContext(DbContextOptions<PortalDbContext> options) : DbContext(options)
{
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<AppUser> AppUsers => Set<AppUser>();
    public DbSet<UserClient> UserClients => Set<UserClient>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<UserClient>().HasKey(x => new { x.AppUserId, x.ClientId });
        b.Entity<AppUser>().HasIndex(x => x.Email).IsUnique();
        b.Entity<AppUser>().HasIndex(x => x.EntraObjectId).IsUnique()
            .HasFilter("[EntraObjectId] IS NOT NULL");
    }
}
```

The filtered unique index matters: without it, more than one un-bound user row would collide on `NULL`.

- [ ] **Step 4: Write the failing tests**

`tests/Vantage.Portal.Api.IntegrationTests/OrganizationsTests.cs`:

```csharp
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using Vantage.Portal.Api.Data;
using Vantage.Portal.Api.Data.Entities;

public class OrganizationsTests : IClassFixture<PortalAppFactory>
{
    private readonly PortalAppFactory _factory;
    public OrganizationsTests(PortalAppFactory factory) => _factory = factory;

    private HttpClient ClientFor(string oid, string email)
    {
        var c = _factory.CreateClient();
        c.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TestTokens.Create(oid, email));
        return c;
    }

    [Fact]
    public async Task Unknown_user_gets_403()
    {
        var response = await ClientFor("oid-nobody", "nobody@example.com")
            .GetAsync("/api/organizations");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Member_sees_only_their_own_organisations()
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<PortalDbContext>();

        var mine  = new Client { Id = Guid.NewGuid(), BusinessName = "Mine Ltd",  ContactEmail = "m@x.com" };
        var other = new Client { Id = Guid.NewGuid(), BusinessName = "Other Ltd", ContactEmail = "o@x.com" };
        var user  = new AppUser { Id = Guid.NewGuid(), Email = "member@example.com", EntraObjectId = "oid-member" };
        db.AddRange(mine, other, user);
        db.UserClients.Add(new UserClient { AppUserId = user.Id, ClientId = mine.Id });
        await db.SaveChangesAsync();

        var body = await ClientFor("oid-member", "member@example.com")
            .GetFromJsonAsync<OrganizationsResponse>("/api/organizations");

        Assert.False(body!.IsAdmin);
        Assert.Single(body.Organizations);
        Assert.Equal("Mine Ltd", body.Organizations[0].BusinessName);
    }

    [Fact]
    public async Task Admin_sees_every_organisation()
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<PortalDbContext>();
        db.AppUsers.Add(new AppUser
        {
            Id = Guid.NewGuid(), Email = "admin@example.com",
            EntraObjectId = "oid-admin", IsAdmin = true
        });
        await db.SaveChangesAsync();
        var total = db.Clients.Count();

        var body = await ClientFor("oid-admin", "admin@example.com")
            .GetFromJsonAsync<OrganizationsResponse>("/api/organizations");

        Assert.True(body!.IsAdmin);
        Assert.Equal(total, body.Organizations.Count);
    }

    [Fact]
    public async Task First_sign_in_binds_the_entra_object_id()
    {
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<PortalDbContext>();
            db.AppUsers.Add(new AppUser
            {
                Id = Guid.NewGuid(), Email = "invited@example.com", EntraObjectId = null
            });
            await db.SaveChangesAsync();
        }

        var response = await ClientFor("oid-fresh", "invited@example.com")
            .GetAsync("/api/organizations");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<PortalDbContext>();
            var user = db.AppUsers.Single(u => u.Email == "invited@example.com");
            Assert.Equal("oid-fresh", user.EntraObjectId);
            Assert.NotNull(user.FirstSignInUtc);
        }
    }

    public record OrganizationSummary(Guid Id, string BusinessName);
    public record OrganizationsResponse(bool IsAdmin, List<OrganizationSummary> Organizations);
}
```

- [ ] **Step 5: Add SQL Testcontainers to the factory**

Add to `PortalAppFactory`, implementing `IAsyncLifetime`:

```csharp
private readonly MsSqlContainer _sql = new MsSqlBuilder().Build();

public async Task InitializeAsync()
{
    await _sql.StartAsync();
    using var scope = Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<PortalDbContext>();
    await db.Database.EnsureCreatedAsync();
}

public new async Task DisposeAsync() => await _sql.DisposeAsync();
```

And inside `ConfigureTestServices`, replace the DbContext registration:

```csharp
services.RemoveAll(typeof(DbContextOptions<PortalDbContext>));
services.AddDbContext<PortalDbContext>(o => o.UseSqlServer(_sql.GetConnectionString()));
```

- [ ] **Step 6: Run the tests to verify they fail**

Run: `dotnet test tests/Vantage.Portal.Api.IntegrationTests`
Expected: FAIL — 404 on `/api/organizations`.

- [ ] **Step 7: Write `CallerContext` and its middleware**

`src/Vantage.Portal.Api/Auth/CallerContext.cs`:

```csharp
using Vantage.Portal.Api.Data.Entities;

namespace Vantage.Portal.Api.Auth;

public class CallerContext
{
    public AppUser User { get; set; } = null!;
    public IReadOnlyList<Guid> PermittedOrgIds { get; set; } = [];
}
```

`src/Vantage.Portal.Api/Auth/CallerContextMiddleware.cs`:

```csharp
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Vantage.Portal.Api.Data;

namespace Vantage.Portal.Api.Auth;

public class CallerContextMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext ctx, PortalDbContext db, CallerContext caller)
    {
        if (ctx.User.Identity?.IsAuthenticated != true) { await next(ctx); return; }

        var oid   = ctx.User.FindFirstValue("oid");
        var email = ctx.User.FindFirstValue("email");

        var user = await db.AppUsers.Include(u => u.Memberships)
                                    .FirstOrDefaultAsync(u => u.EntraObjectId == oid);

        // First sign-in: bind the oid to the row provisioned by email.
        // Safe only because email OTP *is* the identity — the caller proved
        // control of this address to obtain a token. If federated sign-in is
        // ever added, email claims stop being self-verifying and this must
        // be re-examined.
        if (user is null && email is not null)
        {
            user = await db.AppUsers.Include(u => u.Memberships)
                                    .FirstOrDefaultAsync(u => u.Email == email
                                                           && u.EntraObjectId == null);
            if (user is not null)
            {
                user.EntraObjectId  = oid;
                user.FirstSignInUtc = DateTime.UtcNow;
            }
        }

        if (user is null)
        {
            ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
            return;
        }

        user.LastSeenUtc = DateTime.UtcNow;
        await db.SaveChangesAsync();

        caller.User = user;
        caller.PermittedOrgIds = user.IsAdmin
            ? await db.Clients.Select(c => c.Id).ToListAsync()
            : user.Memberships.Select(m => m.ClientId).ToList();

        await next(ctx);
    }
}
```

- [ ] **Step 8: Write the endpoint**

`src/Vantage.Portal.Api/Endpoints/OrganizationEndpoints.cs`:

```csharp
using Microsoft.EntityFrameworkCore;
using Vantage.Portal.Api.Auth;
using Vantage.Portal.Api.Data;

namespace Vantage.Portal.Api.Endpoints;

public static class OrganizationEndpoints
{
    public static void MapOrganizations(this IEndpointRouteBuilder routes) =>
        routes.MapGet("/organizations", async (CallerContext caller, PortalDbContext db) =>
        {
            var orgs = await db.Clients
                .Where(c => caller.PermittedOrgIds.Contains(c.Id) && c.IsActive)
                .OrderBy(c => c.BusinessName)
                .Select(c => new { c.Id, c.BusinessName })
                .ToListAsync();

            return Results.Ok(new { isAdmin = caller.User.IsAdmin, organizations = orgs });
        }).RequireAuthorization();
}
```

- [ ] **Step 9: Wire it up in `Program.cs`**

Delete the `/api/whoami` endpoint. Register services:

```csharp
builder.Services.AddScoped<CallerContext>();
builder.Services.AddDbContext<PortalDbContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("Portal")));
```

And after `UseAuthorization()`:

```csharp
app.UseMiddleware<CallerContextMiddleware>();

var bootstrap = app.MapGroup("/api");
bootstrap.MapOrganizations();
```

Only the bootstrap group exists in this phase. Task 7 of Phase 2 adds the `tenanted` group with `ResolveTenantFilter`; `/organizations` must never be moved into it.

- [ ] **Step 10: Run the tests to verify they pass**

Run: `dotnet test`
Expected: PASS, 7 tests.

- [ ] **Step 11: Create the migration and apply it to Azure SQL**

```bash
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialIdentity -p src/Vantage.Portal.Api
az sql db show-connection-string -c ado.net -s vantage-portal-sql -n portal
# Set ConnectionStrings__Portal with Authentication="Active Directory Default", then:
dotnet ef database update -p src/Vantage.Portal.Api
```

- [ ] **Step 12: Grant the managed identity access to SQL**

Connect to the database as the Entra admin and run:

```sql
CREATE USER [vantage-portal-id] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [vantage-portal-id];
ALTER ROLE db_datawriter ADD MEMBER [vantage-portal-id];
```

Then set the container app's connection string to use the identity:

```bash
az containerapp update -n vantage-portal-api -g vantage-portal-rg \
  --set-env-vars "ConnectionStrings__Portal=Server=tcp:vantage-portal-sql.database.windows.net,1433;Database=portal;Authentication=Active Directory Managed Identity;User Id=<identityClientId>;Encrypt=True;" \
                 "Entra__Authority=https://<EXTERNAL_TENANT_ID>.ciamlogin.com/<EXTERNAL_TENANT_ID>/v2.0" \
                 "Entra__Audience=<API_APP_ID>"
```

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: identity schema, caller resolution, GET /api/organizations"
```

---

### Task 7: Graph provisioning without a secret

This is the design's highest-risk task. It is last in this phase only because it needs the managed identity from Task 4; if it fails, nothing downstream is wasted.

**Files:**
- Create: `src/Vantage.Portal.Api/Provisioning/IUserProvisioner.cs`, `GraphUserProvisioner.cs`, `tests/Vantage.Portal.Api.Tests/ProvisioningTests.cs`
- Modify: `docs/entra-setup.md`

**Interfaces:**
- Consumes: `identityClientId` (Task 4), `EXTERNAL_TENANT_ID`, `EXTERNAL_TENANT_DOMAIN` (Task 2)
- Produces: `IUserProvisioner.CreateExternalUserAsync(string email, string displayName) → Task<string>` returning the new user's `oid`

- [ ] **Step 1: Register the Graph application in the External ID tenant**

```bash
az login --tenant <EXTERNAL_TENANT_DOMAIN> --allow-no-subscriptions
az ad app create --display-name "vantage-portal-provisioner"
# record appId as PROVISIONER_APP_ID, then create its service principal:
az ad sp create --id <PROVISIONER_APP_ID>
```

Grant it `User.ReadWrite.All` as an **application** permission and grant admin consent. This permission is broad; there is no narrower one that permits user creation.

- [ ] **Step 2: Federate it to the managed identity**

```bash
az ad app federated-credential create --id <PROVISIONER_APP_ID> --parameters '{
  "name": "vantage-portal-api-identity",
  "issuer": "https://login.microsoftonline.com/<HOME_TENANT_ID>/v2.0",
  "subject": "<identityPrincipalId>",
  "audiences": ["api://AzureADTokenExchange"]
}'
```

`<HOME_TENANT_ID>` is the tenant of the **Azure subscription**, not the External ID tenant — that difference is the entire reason this credential is needed.

- [ ] **Step 3: Verify the token exchange before writing any code**

From a shell inside the running container (`az containerapp exec -n vantage-portal-api -g vantage-portal-rg --command /bin/sh`):

```sh
curl -s -H "X-IDENTITY-HEADER: $IDENTITY_HEADER" \
  "$IDENTITY_ENDPOINT?resource=api://AzureADTokenExchange&client_id=<identityClientId>&api-version=2019-08-01"
```

Expected: JSON containing `access_token`. If this fails, **stop** — the federated path is not viable and the fallback (a client secret in Key Vault) must be discussed with Kurtis before proceeding, because the spec records it as a regression, not an equivalent.

- [ ] **Step 4: Write the failing unit test**

`tests/Vantage.Portal.Api.Tests/ProvisioningTests.cs` — this tests the request body shape, which is the part most likely to be wrong. It does not call Graph.

```csharp
using Vantage.Portal.Api.Provisioning;

public class ProvisioningTests
{
    [Fact]
    public void External_user_body_uses_email_identity_and_no_password()
    {
        var user = GraphUserProvisioner.BuildUser(
            email: "site@client.co.uk",
            displayName: "Site Manager",
            tenantDomain: "vantagesafety.onmicrosoft.com");

        var identity = Assert.Single(user.Identities!);
        Assert.Equal("emailAddress", identity.SignInType);
        Assert.Equal("vantagesafety.onmicrosoft.com", identity.Issuer);
        Assert.Equal("site@client.co.uk", identity.IssuerAssignedId);
        Assert.Null(user.PasswordProfile);   // email OTP: no password
        Assert.Equal("Site Manager", user.DisplayName);
    }
}
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `dotnet test tests/Vantage.Portal.Api.Tests`
Expected: FAIL — `GraphUserProvisioner` does not exist.

- [ ] **Step 6: Implement the provisioner**

```bash
dotnet add src/Vantage.Portal.Api package Microsoft.Graph
```

`src/Vantage.Portal.Api/Provisioning/IUserProvisioner.cs`:

```csharp
namespace Vantage.Portal.Api.Provisioning;

public interface IUserProvisioner
{
    Task<string> CreateExternalUserAsync(string email, string displayName, CancellationToken ct = default);
}
```

`src/Vantage.Portal.Api/Provisioning/GraphUserProvisioner.cs`:

```csharp
using Azure.Identity;
using Microsoft.Graph;
using Microsoft.Graph.Models;

namespace Vantage.Portal.Api.Provisioning;

public class GraphUserProvisioner : IUserProvisioner
{
    private readonly GraphServiceClient _graph;
    private readonly string _tenantDomain;

    public GraphUserProvisioner(IConfiguration config)
    {
        _tenantDomain = config["Entra:TenantDomain"]!;

        // Managed identity → federated credential → app in the External ID
        // tenant. No client secret is involved.
        var credential = new ClientAssertionCredential(
            tenantId: config["Entra:TenantId"]!,
            clientId: config["Entra:ProvisionerAppId"]!,
            assertionCallback: async ct =>
            {
                var mi = new ManagedIdentityCredential(
                    ManagedIdentityId.FromUserAssignedClientId(config["Entra:IdentityClientId"]!));
                var token = await mi.GetTokenAsync(
                    new Azure.Core.TokenRequestContext(["api://AzureADTokenExchange/.default"]), ct);
                return token.Token;
            });

        _graph = new GraphServiceClient(credential, ["https://graph.microsoft.com/.default"]);
    }

    public static User BuildUser(string email, string displayName, string tenantDomain) => new()
    {
        DisplayName = displayName,
        Identities =
        [
            new ObjectIdentity
            {
                SignInType = "emailAddress",
                Issuer = tenantDomain,
                IssuerAssignedId = email,
            }
        ],
    };

    public async Task<string> CreateExternalUserAsync(
        string email, string displayName, CancellationToken ct = default)
    {
        var created = await _graph.Users.PostAsync(
            BuildUser(email, displayName, _tenantDomain), cancellationToken: ct);

        return created!.Id!;
    }
}
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `dotnet test tests/Vantage.Portal.Api.Tests`
Expected: PASS.

- [ ] **Step 8: Prove it against the real tenant**

Register the provisioner (`builder.Services.AddSingleton<IUserProvisioner, GraphUserProvisioner>();`), add a temporary admin-only endpoint that calls it, deploy, and create one real user. Then:

```bash
az ad user list --filter "mail eq 'proof@example.co.uk'" --query "[].{id:id,mail:mail}"
```

Expected: one result. Sign in as that user through the portal user flow with an email OTP and confirm a token is issued. **This is the moment the design is proven.** Delete the temporary endpoint afterwards; `POST /api/admin/clients` in Phase 2 is its real home.

- [ ] **Step 9: Disable self-service sign-up**

Only now, with provisioning working:

```bash
az rest --method PATCH \
  --url "https://graph.microsoft.com/beta/identity/authenticationEventsFlows/<USER_FLOW_ID>" \
  --body '{"@odata.type":"#microsoft.graph.externalUsersSelfServiceSignUpEventsFlow","onInteractiveAuthFlowStart":{"@odata.type":"#microsoft.graph.onInteractiveAuthFlowStartExternalUsersSelfServiceSignUp","isSignUpAllowed":false}}'
```

Verify by opening the portal sign-in page: the "No account? Create one" link must be gone. Then confirm the provisioned user from Step 8 can still sign in.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: Graph user provisioning via federated managed identity; disable self-service sign-up"
```

---

## Phase 1 Definition of Done

- [ ] `https://<apiFqdn>/health` returns `ok`
- [ ] A real email-OTP token from the External ID tenant reaches `GET /api/organizations`
- [ ] That token carries `email` (or `preferred_username`) — without one, no
      provisioned client can ever complete first sign-in
- [ ] An unknown `oid` with no `AppUser` row receives **403**
- [ ] A provisioned-but-never-signed-in user has their `EntraObjectId` bound on first sign-in
- [ ] An admin sees every client; a member sees only their own
- [ ] Graph provisioning works with **no client secret in configuration**
- [ ] Self-service sign-up is disabled and verified in the browser
- [ ] `allowSharedKeyAccess` and `allowBlobPublicAccess` are both `false`
- [ ] `dotnet test` is green in CI

## Deliberately Not in Phase 1

- **Custom domains.** `api.vantagesafetyservices.co.uk` and
  `portal.vantagesafetyservices.co.uk` are named in Global Constraints but bound
  in Phase 4, alongside the Static Web App. Phase 1 uses the Container App's
  generated FQDN throughout. Binding the API domain earlier would mean issuing a
  certificate for a service with no consumer.
- **Static Web Apps resource.** Created in Phase 4 with the SPA that occupies it.
- **Blob containers are created but unused.** Task 4 provisions `documents` and
  `previews`, and grants Storage Blob Data Reader and Storage Blob Delegator,
  because both are cheaper to include in the first deployment than to add later.
  Nothing writes to them until Phase 3.

## What Phase 2 Picks Up

`ResolveTenantFilter`, the `tenanted` route group, the `Document` entity with its global query filter, `POST /api/admin/clients` wrapping `IUserProvisioner`, and the 400/403 header tests. None of it is started here.
