$files = Get-ChildItem -Path "src" -Recurse -Filter "*.tsx"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    # Match imports like "package@1.2.3" or "@scope/package@1.2.3"
    # and replace them with "package" or "@scope/package"
    $newContent = $content -replace '(["''])(@?[^''"@\s/]+(?:/[^''"@\s/]+)?)@[\d\.]+(["''])', '$1$2$3'
    if ($content -ne $newContent) {
        Set-Content $file.FullName $newContent
        Write-Host "Updated $($file.FullName)"
    }
}
