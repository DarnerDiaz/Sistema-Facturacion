$ErrorActionPreference = 'Stop'
$api = 'http://localhost:5000/api'

function Ensure-Token {
    param($email='prueba1@example.com', $password='password123')
    $login = @{ email=$email; password=$password } | ConvertTo-Json
    $resp = Invoke-RestMethod -Uri "$api/auth/login" -Method Post -Body $login -ContentType 'application/json'
    return $resp.token
}

function Expect-Failure($scriptBlock, $expectedMessage) {
    try {
        & $scriptBlock
        Write-Output "[FAIL] Expected failure but succeeded"
    } catch {
        $err = $_
        if ($err.Exception -and $err.Exception.Response) {
            $sr = New-Object System.IO.StreamReader($err.Exception.Response.GetResponseStream())
            $text = $sr.ReadToEnd()
            if ($text -like "*$expectedMessage*") {
                Write-Output "[PASS] Failure as expected: $expectedMessage"
            } else {
                Write-Output "[WARN] Failure, but message differs: $text"
            }
        } else {
            Write-Output "[PASS] Caught error: $($err.Exception.Message)"
        }
    }
}

Write-Output "== Escenario 1: Login inválido =="
Expect-Failure { Invoke-RestMethod -Uri "$api/auth/login" -Method Post -Body (@{ email='noexist@example.com'; password='x' } | ConvertTo-Json) -ContentType 'application/json' } 'Credenciales inválidas'

Write-Output "== Escenario 2: Registro con email inválido =="
Expect-Failure { Invoke-RestMethod -Uri "$api/auth/registro" -Method Post -Body (@{ nombre='X'; email='bad-email'; password='123456' } | ConvertTo-Json) -ContentType 'application/json' } 'must be a valid email'

Write-Output "== Escenario 3: Crear producto con precio negativo =="
$token = Ensure-Token
Expect-Failure { Invoke-RestMethod -Uri "$api/productos" -Method Post -Body (@{ nombre='BadProd'; descripcion='desc'; precio=-10; cantidad=1; sku='BAD-1'; categoria='Test' } | ConvertTo-Json) -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" } } 'must be a positive number'

Write-Output "== Escenario 4: Crear factura con producto no existente =="
$clienteBody = @{ nombre='Tmp Cliente'; email='tmpcliente@test.com'; telefono='300000'; cedula=(Get-Random -Maximum 99999999).ToString(); direccion='addr'; ciudad='ciudad' } | ConvertTo-Json
$cliente = Invoke-RestMethod -Uri "$api/clientes" -Method Post -Body $clienteBody -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" }
$badInvoice = @{ clienteId=$cliente.id; items = @(@{ productoId = '00000000-0000-0000-0000-000000000000'; cantidad=1; precio=100 }); notas='test' } | ConvertTo-Json -Depth 5
Expect-Failure { Invoke-RestMethod -Uri "$api/facturas" -Method Post -Body $badInvoice -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" } } 'Error'

Write-Output "== Escenario 5: Flujo válido breve =="
# Crear producto válido
$prod = @{ nombre='TS-Product'; descripcion='Producto de prueba para el sistema de facturación'; precio=50; cantidad=10; sku=('SKU'+(Get-Random -Maximum 99999)); categoria='Test' } | ConvertTo-Json
$p = Invoke-RestMethod -Uri "$api/productos" -Method Post -Body $prod -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" }
# Crear factura con ese producto
$invoice = @{ clienteId=$cliente.id; items=@(@{ productoId=$p.id; cantidad=2; precio=50 }); notas='ok' } | ConvertTo-Json -Depth 5
$f = Invoke-RestMethod -Uri "$api/facturas" -Method Post -Body $invoice -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" }
Write-Output "[PASS] Factura creada: $($f.id)"

Write-Output "== Escenarios completados =="
