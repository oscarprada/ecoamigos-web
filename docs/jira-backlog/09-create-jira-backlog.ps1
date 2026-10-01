#requires -Version 5.1
<#
Jira Cloud REST v3. Offline preview is the default. NOT executed during audit.
Execute requires separate user approval and reviewed project mappings (document 08).
Credentials only: JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN.
Config only: JIRA_PROJECT_KEY, JIRA_TYPE_IDS_JSON, JIRA_PRIORITY_IDS_JSON,
JIRA_STATUS_IDS_JSON (logical status -> actual target status ID).
Resolve direct transitions by target status ID; preserve logical status in description and labels.
All standard work items remain under their Epic; logical Story parents use links.
#>
[CmdletBinding()]
param(
    [switch]$Execute,
    [switch]$DryRun,
    [string[]]$InternalIds,
    [string]$Approval,
    [switch]$ConfigurationReviewed,
    [string]$DependencyLinkName = 'Blocks',
    [string]$ParentLinkName = 'Relates',
    [string]$EpicNameField
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$csvPath = Join-Path $PSScriptRoot '05-tickets-propuestos.csv'
$mapPath = Join-Path $PSScriptRoot 'jira-key-map.json'
$lockPath = Join-Path $PSScriptRoot 'jira-import.lock'
$rows = @(Import-Csv -LiteralPath $csvPath -Encoding UTF8)
$byId = @{}
$summaries = @{}
$expected = @{ Epic = 11; Story = 17; Task = 31; Bug = 41 }
$statuses = @('Done', 'Cancelled', 'Partially Completed', 'Pending Institutional Decision')
if ($rows.Count -ne 100) { throw 'Expected exactly 100 records.' }
foreach ($r in $rows) {
    $id = $r.'Internal ID'
    if ($id -notmatch '^(EP|ST|TK|BG)[A-Z0-9-]+$' -or $byId.ContainsKey($id)) { throw "Invalid/duplicate ID: $id" }
    if ($summaries.ContainsKey($r.Summary)) { throw "Duplicate summary: $id" }
    if (-not $expected.ContainsKey($r.'Issue Type') -or $r.Status -notin $statuses) { throw "Invalid type/status: $id" }
    if ($r.Phase -notmatch '^F[1-4]$' -or $r.Deliverable -ne $r.Phase.Replace('F','E')) { throw "Invalid phase/deliverable: $id" }
    foreach ($field in @('Summary','Description','Acceptance Criteria','Evidence','Closing Notes')) {
        if ([string]::IsNullOrWhiteSpace($r.$field)) { throw "Missing $field on $id" }
    }
    $byId[$id] = $r
    $summaries[$r.Summary] = $true
}
foreach ($type in $expected.Keys) {
    if (@($rows | Where-Object { $_.'Issue Type' -eq $type }).Count -ne $expected[$type]) { throw "Invalid count: $type" }
}
function Get-References($r) {
    ((@($r.'Parent Internal ID', $r.Dependencies) -join ';') -split ';') | ForEach-Object { $_.Trim() } | Where-Object { $_ }
}
$visited = @{}
function Test-Graph([string]$id, [string[]]$stack) {
    if ($id -in $stack) { throw "Relationship cycle: $id" }
    if ($visited.ContainsKey($id)) { return }
    foreach ($ref in @(Get-References $byId[$id])) {
        if (-not $byId.ContainsKey($ref)) { throw "Unknown reference $ref on $id" }
        Test-Graph $ref ($stack + $id)
    }
    $visited[$id] = $true
}
foreach ($r in $rows) {
    Test-Graph $r.'Internal ID' @()
    if ($r.'Issue Type' -ne 'Epic') {
        $ep = $r.'Epic Internal ID'
        if (-not $byId.ContainsKey($ep) -or $byId[$ep].'Issue Type' -ne 'Epic') { throw "Invalid Epic: $($r.'Internal ID')" }
    }
}
$order = @{ Epic = 0; Story = 1; Task = 2; Bug = 3 }
$selectedRows = $rows
if ($PSBoundParameters.ContainsKey('InternalIds')) {
    $selection = @{}
    foreach ($id in @(($InternalIds -join ',') -split ',' | ForEach-Object { $_.Trim() })) {
        if (-not $id -or -not $byId.ContainsKey($id)) { throw "Unknown or empty selected Internal ID: $id" }
        if ($selection.ContainsKey($id)) { throw "Duplicate selected Internal ID: $id" }
        $selection[$id] = $true
    }
    if (-not $selection.Count) { throw 'InternalIds must not be empty.' }
    $selectedRows = @($rows | Where-Object { $selection.ContainsKey($_.'Internal ID') })
    # Never silently expand a trial to parents/dependencies outside its allowlist.
    foreach ($r in $selectedRows) {
        foreach ($ref in @(@(Get-References $r) + @($r.'Epic Internal ID') | Where-Object { $_ })) {
            if (-not $selection.ContainsKey($ref)) { throw "Selected $($r.'Internal ID') references unselected $ref. Include it explicitly or choose a closed selection." }
        }
    }
}
$ordered = @($selectedRows | Sort-Object @{Expression={$order[$_.'Issue Type']}}, @{Expression={$_.'Internal ID'}})
if ($DryRun -or -not $Execute) {
    foreach ($r in $ordered) {
        Write-Output ("PREVIEW {0} {1}: {2}; Epic={3}; logical parent={4}; dependencies={5}; status={6}" -f $r.'Internal ID',$r.'Issue Type',$r.Summary,$r.'Epic Internal ID',$r.'Parent Internal ID',$r.Dependencies,$r.Status)
    }
    Write-Output "$($ordered.Count) selected records of 100 validated. No network, credentials read, files written or issues created."
    return
}
if ($Approval -cne 'BACKLOG APROBADO. CREAR EN JIRA.' -or -not $ConfigurationReviewed) { throw 'Explicit approval and reviewed configuration required.' }
foreach ($name in @('JIRA_BASE_URL','JIRA_EMAIL','JIRA_API_TOKEN','JIRA_PROJECT_KEY','JIRA_TYPE_IDS_JSON','JIRA_PRIORITY_IDS_JSON','JIRA_STATUS_IDS_JSON')) {
    if ([string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable($name))) { throw "Missing environment variable: $name" }
}
$base = $env:JIRA_BASE_URL.TrimEnd('/')
$uri = [Uri]$base
if ($uri.Scheme -ne 'https' -or $uri.UserInfo -or $uri.Query -or $uri.Fragment -or $uri.AbsolutePath -ne '/') { throw 'JIRA_BASE_URL must be an HTTPS origin without credentials or path.' }
$project = $env:JIRA_PROJECT_KEY
if ($project -notmatch '^[A-Z][A-Z0-9_]*$') { throw 'Invalid project key.' }
function Read-Mapping([string]$json) {
    $map = @{}
    ($json | ConvertFrom-Json).PSObject.Properties | ForEach-Object { $map[$_.Name] = [string]$_.Value }
    return $map
}
# KAN: logical CSV type -> actual Jira type name. Subtask is not substituted.
# JIRA_TYPE_IDS_JSON must map Epic, Historia, Tarea and Error to their real IDs.
$jiraTypeNames = @{ Epic = 'Epic'; Story = 'Historia'; Task = 'Tarea'; Bug = 'Error' }
$jiraTypeIds = Read-Mapping $env:JIRA_TYPE_IDS_JSON
$types = @{}
foreach ($logicalType in @($ordered | ForEach-Object { $_.'Issue Type' } | Select-Object -Unique)) {
    $jiraTypeName = $jiraTypeNames[$logicalType]
    if (-not $jiraTypeIds.ContainsKey($jiraTypeName) -or [string]::IsNullOrWhiteSpace($jiraTypeIds[$jiraTypeName])) {
        throw "Missing Jira type ID for $logicalType -> $jiraTypeName in JIRA_TYPE_IDS_JSON."
    }
    $types[$logicalType] = $jiraTypeIds[$jiraTypeName]
}
$priorities = Read-Mapping $env:JIRA_PRIORITY_IDS_JSON
$statusIds = Read-Mapping $env:JIRA_STATUS_IDS_JSON
foreach ($r in $ordered) {
    if (-not $types[$r.'Issue Type'] -or -not $priorities[$r.Priority] -or -not $statusIds[$r.Status]) { throw 'Incomplete type, priority or status mapping.' }
}
$headers = @{ Accept = 'application/json'; Authorization = 'Basic ' + [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($env:JIRA_EMAIL + ':' + $env:JIRA_API_TOKEN)) }
function Invoke-Jira([string]$Method, [string]$Path, $Body = $null) {
    $args = @{ Uri = "$base/rest/api/3/$Path"; Method = $Method; Headers = $headers; ContentType = 'application/json; charset=utf-8'; MaximumRedirection = 0; TimeoutSec = 60 }
    if ($null -ne $Body) { $args.Body = [Text.Encoding]::UTF8.GetBytes(($Body | ConvertTo-Json -Depth 30)) }
    try { Invoke-RestMethod @args }
    catch { throw "Jira $Method $Path failed. Stop; reconcile journal and remote issue before retry. No automatic POST retry. Details withheld to protect authentication." }
}
function Identity-Label([string]$id) { 'ecoamigos-id-' + $id.ToLowerInvariant() }
function Make-Description($r) {
    $paragraphs = @()
    foreach ($prop in $r.PSObject.Properties) {
        $value = if ([string]::IsNullOrEmpty($prop.Value)) { '(empty)' } else { [string]$prop.Value }
        $paragraphs += @{ type='paragraph'; content=@(@{type='text';text=($prop.Name + ': ' + $value)}) }
    }
    return @{type='doc';version=1;content=$paragraphs}
}
function Sync-IssueStatus($r, [string]$key) {
    $id = $r.'Internal ID'
    # CSV Status is the logical status, also exposed as LogicalStatus in results.
    $targetStatusId = [string]$statusIds[$results[$id].LogicalStatus]
    try {
        $actual = Invoke-Jira GET "issue/${key}?fields=status,issuetype"
        $results[$id].CreatedType = $actual.fields.issuetype.name
        $results[$id].JiraStatus = $actual.fields.status.name
        if ([string]$actual.fields.status.id -ceq $targetStatusId) {
            $results[$id].StatusAction = 'Already matches target; no transition'
            Write-Output "$key status already matches target $targetStatusId; no transition."
            return
        }
        $available = Invoke-Jira GET "issue/${key}/transitions"
        $matches = @($available.transitions | Where-Object { [string]$_.to.id -ceq $targetStatusId })
        if ($matches.Count -eq 0) {
            throw "No direct available transition to status ID $targetStatusId. No alternative states attempted; logical status preserved in Description."
        }
        if ($matches.Count -gt 1) {
            throw "Multiple transitions to status ID $targetStatusId; ambiguous workflow requires review. No transition attempted."
        }
        $transitionId = [string]$matches[0].id
        if ([string]::IsNullOrWhiteSpace($transitionId)) { throw 'Transition response has no ID; no transition attempted.' }
        # Never retry a mutation automatically, follow intermediate states or invent fields.
        $null = Invoke-Jira POST "issue/${key}/transitions" @{transition=@{id=$transitionId}}
        $verified = Invoke-Jira GET "issue/${key}?fields=status,issuetype"
        $results[$id].CreatedType = $verified.fields.issuetype.name
        $results[$id].JiraStatus = $verified.fields.status.name
        if ([string]$verified.fields.status.id -cne $targetStatusId) {
            throw "Transition returned but target status $targetStatusId was not verified. No further transition attempted."
        }
        $results[$id].StatusAction = 'Transition applied and target verified'
        Write-Output "$key transitioned to verified target status $targetStatusId."
    }
    catch {
        $results[$id].StatusAction = 'Unresolved; review required'
        $results[$id].ErrorsOrUnmappedFields += " Status reconciliation for ${key}: $($_.Exception.Message)"
        Write-Warning "$key status reconciliation failed; recorded for final import failure."
    }
}
$journal = @{ Version=1; BaseUrl=$base; Project=$project; CsvHash=(Get-FileHash -LiteralPath $csvPath -Algorithm SHA256).Hash; Keys=@{}; Pending=$null }
function Save-Journal {
    $temp = $mapPath + '.tmp'
    $journal | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $temp -Encoding UTF8
    Move-Item -LiteralPath $temp -Destination $mapPath -Force
}
$lock = $null
$results = @{}
foreach ($r in $ordered) {
    $results[$r.'Internal ID'] = [ordered]@{
        InternalId = $r.'Internal ID'; JiraKey = ''; CreatedType = 'Not verified'
        LogicalStatus = $r.Status; JiraStatus = 'Not verified'
        StatusAction = 'Not processed'
        LogicalParent = $r.'Parent Internal ID'; RelatedParentKey = ''; JiraParentKey = ''
        Action = 'Not processed'; ErrorsOrUnmappedFields = ''
    }
}
$currentId = $null
try {
    $lock = [IO.File]::Open($lockPath, [IO.FileMode]::OpenOrCreate, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None)
    if (Test-Path -LiteralPath $mapPath) {
        $saved = Get-Content -LiteralPath $mapPath -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($saved.BaseUrl -ne $base -or $saved.Project -ne $project -or $saved.CsvHash -ne $journal.CsvHash) { throw 'Journal belongs to another destination or CSV version; manual reconciliation required.' }
        if ($saved.Pending) { throw "Uncertain previous creation: $($saved.Pending). Resolve it manually in Jira and journal; do not clear blindly." }
        $saved.Keys.PSObject.Properties | ForEach-Object { $journal.Keys[$_.Name] = [string]$_.Value }
        if (@($journal.Keys.Values | Select-Object -Unique).Count -ne $journal.Keys.Count) { throw 'Duplicate Jira keys in journal.' }
        foreach ($savedId in $journal.Keys.Keys) { if (-not $byId.ContainsKey($savedId)) { throw "Unknown journal ID: $savedId" } }
    }
    # Confirm link type semantics BEFORE creating any issues.
    $linkTypes = @( (Invoke-Jira GET 'issueLinkType').issueLinkTypes )
    if (@($linkTypes | Where-Object name -eq $DependencyLinkName).Count -ne 1 -or @($linkTypes | Where-Object name -eq $ParentLinkName).Count -ne 1) { throw 'Required link types unavailable.' }
    foreach ($r in $ordered) {
        $id = $r.'Internal ID'
        $currentId = $id
        $label = Identity-Label $id
        if ($journal.Keys.ContainsKey($id)) {
            $key = $journal.Keys[$id]
            if ($key -notmatch ('^'+[regex]::Escape($project)+'-\d+$')) { throw "Invalid saved key for $id" }
            $remote = Invoke-Jira GET "issue/${key}?fields=labels,project,issuetype"
            if ($label -notin $remote.fields.labels -or $remote.fields.project.key -ne $project -or $remote.fields.issuetype.id -ne $types[$r.'Issue Type']) { throw "Saved identity mismatch: $id" }
            $results[$id].Action = 'Reused from journal'
            Sync-IssueStatus $r $key
            continue
        }
        $found = Invoke-Jira POST 'search/jql' @{ jql="project = $project AND labels = `"$label`""; maxResults=2; fields=@('labels','issuetype') }
        if (@($found.issues).Count -gt 1) { throw "Duplicate Internal ID in Jira: $id" }
        if (@($found.issues).Count -eq 1) {
            if ($found.issues[0].fields.issuetype.id -ne $types[$r.'Issue Type']) { throw "Existing type mismatch: $id" }
            $journal.Keys[$id] = $found.issues[0].key
            $results[$id].Action = 'Reused from search'
            Save-Journal
            Sync-IssueStatus $r $journal.Keys[$id]
            continue
        }
        $labels = @($r.Labels -split ';' | ForEach-Object { $_.Trim() } | Where-Object { $_ })
        $labels += @($label, ('logical-status-' + ($r.Status.ToLowerInvariant() -replace ' ','-')))
        $fields = @{ project=@{key=$project}; issuetype=@{id=$types[$r.'Issue Type']}; summary=$r.Summary; description=(Make-Description $r); priority=@{id=$priorities[$r.Priority]}; labels=$labels }
        if ($r.'Issue Type' -eq 'Epic' -and $EpicNameField) { $fields[$EpicNameField] = $r.Summary }
        if ($r.'Issue Type' -ne 'Epic') { $fields.parent = @{key=$journal.Keys[$r.'Epic Internal ID']} }
        $journal.Pending = $id
        Save-Journal
        $created = Invoke-Jira POST 'issue' @{fields=$fields}
        if (-not $created.key) { throw "Creation returned no key: $id" }
        $journal.Keys[$id] = $created.key
        $results[$id].Action = 'Created'
        $journal.Pending = $null
        Save-Journal
        Sync-IssueStatus $r $created.key
        Write-Output "$id -> $($created.key)"
    }
    # Links are replayable without comments. Jira treats duplicate links as success.
    foreach ($r in $ordered) {
        $currentId = $r.'Internal ID'
        $key = $journal.Keys[$r.'Internal ID']
        $parent = $r.'Parent Internal ID'
        # Verify native Epic parent even when the issue was reused.
        $parentCheck = Invoke-Jira GET "issue/${key}?fields=parent"
        if ($r.'Issue Type' -ne 'Epic') {
            $parentProperty = $parentCheck.fields.PSObject.Properties['parent']
            if ($null -eq $parentProperty -or $parentProperty.Value.key -ne $journal.Keys[$r.'Epic Internal ID']) {
                throw "Epic parent mismatch on $currentId; no automatic reparenting."
            }
            $results[$currentId].JiraParentKey = $parentProperty.Value.key
        }
        if ($parent -and $byId[$parent].'Issue Type' -ne 'Epic') {
            $null = Invoke-Jira POST 'issueLink' @{type=@{name=$ParentLinkName};inwardIssue=@{key=$key};outwardIssue=@{key=$journal.Keys[$parent]}}
        }
        if ($parent) { $results[$currentId].RelatedParentKey = $journal.Keys[$parent] }
        foreach ($dep in @($r.Dependencies -split ';' | ForEach-Object { $_.Trim() } | Where-Object { $_ })) {
            # For Blocks: dependency blocks current item (inward end -> outward end).
            $null = Invoke-Jira POST 'issueLink' @{type=@{name=$DependencyLinkName};inwardIssue=@{key=$journal.Keys[$dep]};outwardIssue=@{key=$key}}
        }
    }
    $mismatch = 0
    foreach ($r in $ordered) {
        $currentId = $r.'Internal ID'
        $key = $journal.Keys[$r.'Internal ID']
        # Final read-only reconciliation; no second transition attempt on failure.
        try {
            $actual = Invoke-Jira GET "issue/${key}?fields=status,issuetype"
            $results[$currentId].CreatedType = $actual.fields.issuetype.name
            $results[$currentId].JiraStatus = $actual.fields.status.name
            if ([string]$actual.fields.status.id -cne [string]$statusIds[$r.Status]) {
                $results[$currentId].ErrorsOrUnmappedFields += " Final status does not match target $($statusIds[$r.Status]); logical status preserved in Description."
            }
        }
        catch { $results[$currentId].ErrorsOrUnmappedFields += " Final status verification failed: $($_.Exception.Message)" }
        if ($results[$currentId].ErrorsOrUnmappedFields) { $mismatch++ }
    }
    if ($mismatch) { throw "$mismatch selected issues have unresolved status transitions or verification errors. Logical states and journal keys preserved; import NOT complete. Review ErrorsOrUnmappedFields before resuming." }
    Write-Output "$($ordered.Count) selected identities reconciled. Stopping; no other tickets processed."
}
catch {
    if ($currentId) { $results[$currentId].ErrorsOrUnmappedFields += " $($_.Exception.Message)" }
    else { foreach ($r in $ordered) { $results[$r.'Internal ID'].ErrorsOrUnmappedFields = $_.Exception.Message } }
    throw
}
finally {
    if ($null -ne $lock) { $lock.Dispose() }
    foreach ($r in $ordered) {
        $id = $r.'Internal ID'
        if ($journal.Keys.ContainsKey($id)) { $results[$id].JiraKey = $journal.Keys[$id] }
        [pscustomobject]$results[$id]
    }
    Write-Output 'All 26 CSV columns are preserved in Description; no custom traceability fields assumed.'
}
