# Prosty skrypt PowerShell do backupu bazy danych (Windows)
param()

$DB_NAME = 'app_database'
$BACKUP_DIR = 'C:\Backups\db'
$DATE = Get-Date -Format 'yyyyMMdd_HHmmss'
$SQLFILE = Join-Path $BACKUP_DIR ("${DB_NAME}_${DATE}.sql")
$GZFILE = "${SQLFILE}.gz"

# Sprawdź czy katalog istnieje
if (-not (Test-Path -Path $BACKUP_DIR)) {
  New-Item -ItemType Directory -Path $BACKUP_DIR -Force | Out-Null
  Write-Output "Utworzono katalog $BACKUP_DIR"
}

# Wykonaj backup
Write-Output "Rozpoczynam backup bazy $DB_NAME..."

# Uruchom mysqldump (zostaniesz poproszony o hasło jeśli używasz -p)
# Zapisz wynik do pliku .sql, a następnie skompresuj do .gz
& mysqldump -u root -p $DB_NAME > $SQLFILE

if ($LASTEXITCODE -eq 0) {
  try {
    # Kompresja pliku do formatu gzip przy użyciu .NET
    $source = [System.IO.File]::OpenRead($SQLFILE)
    $dest = [System.IO.File]::Create($GZFILE)
    $gzip = New-Object System.IO.Compression.GZipStream($dest,[System.IO.Compression.CompressionMode]::Compress)
    $source.CopyTo($gzip)
    $gzip.Close()
    $source.Close()
    $dest.Close()

    # Usuń tymczasowy plik .sql
    Remove-Item -Path $SQLFILE -ErrorAction SilentlyContinue

    Write-Output "Backup zakończony sukcesem: $GZFILE"
    exit 0
  } catch {
    Write-Error "Błąd podczas kompresji: $_"
    if (Test-Path $SQLFILE) { Remove-Item -Path $SQLFILE -ErrorAction SilentlyContinue }
    exit 1
  }
} else {
  Write-Error "Błąd podczas wykonywania backupu!"
  if (Test-Path $SQLFILE) { Remove-Item -Path $SQLFILE -ErrorAction SilentlyContinue }
  exit 1
}
