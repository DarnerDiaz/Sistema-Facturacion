$ErrorActionPreference = 'Stop'
$api = 'http://localhost:5000/api'
try {
    Write-Output "== Registro de usuario =="
    $reg = @{ nombre='Prueba Usuario'; email='prueba1@example.com'; password='password123' } | ConvertTo-Json
    try {
        $r = Invoke-RestMethod -Uri "$api/auth/registro" -Method Post -Body $reg -ContentType 'application/json'
        Write-Output ($r | ConvertTo-Json)
    } catch {
        # Si el usuario ya existe (409), continuar al login
        if ($_.Exception -and $_.Exception.Response) {
            try {
                $status = $_.Exception.Response.StatusCode.value__
                if ($status -eq 409) {
                    Write-Output 'Usuario ya registrado — continuando con login'
                } else {
                    throw $_
                }
            } catch {
                throw $_
            }
        } else { throw $_ }
    }

    Write-Output "== Login =="
    $login = @{ email='prueba1@example.com'; password='password123' } | ConvertTo-Json
    $resp = Invoke-RestMethod -Uri "$api/auth/login" -Method Post -Body $login -ContentType 'application/json'
    $token = $resp.token
    Write-Output "TOKEN: $token"

    Write-Output "== Crear Producto =="
    $prod = @{ nombre='Producto Prueba'; descripcion='Descripción prueba'; precio=150; cantidad=20; sku='PRUEBA-001'; categoria='Test' } | ConvertTo-Json
    $p = Invoke-RestMethod -Uri "$api/productos" -Method Post -Body $prod -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" }
    Write-Output ($p | ConvertTo-Json)

    Write-Output "== Crear Cliente =="
    $cliente = @{ nombre='Cliente Prueba'; email='cliente1@example.com'; telefono='300111222'; cedula='1234567890'; direccion='Calle Falsa 123'; ciudad='Ciudad' } | ConvertTo-Json
    $c = Invoke-RestMethod -Uri "$api/clientes" -Method Post -Body $cliente -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" }
    Write-Output ($c | ConvertTo-Json)

    Write-Output "== Obtener IDs y crear factura =="
    $prods = Invoke-RestMethod -Uri "$api/productos" -Method Get -Headers @{ Authorization = "Bearer $token" }
    $clientes = Invoke-RestMethod -Uri "$api/clientes" -Method Get -Headers @{ Authorization = "Bearer $token" }
    $prodId = $prods[0].id
    $clienteId = $clientes[0].id
    Write-Output "prodId=$prodId clienteId=$clienteId"

    $fact = @{ clienteId = $clienteId; items = @(@{ productoId = $prodId; cantidad = 2; precio = 150 }); notas = 'Factura de prueba' } | ConvertTo-Json -Depth 5
    $f = Invoke-RestMethod -Uri "$api/facturas" -Method Post -Body $fact -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" }
    Write-Output ($f | ConvertTo-Json)

    Write-Output "== Flujo completado con éxito =="
} catch {
    Write-Output "ERROR:"
    # Mostrar información completa del error para diagnosticar
    $_ | Format-List * -Force
    if ($_.Exception -and $_.Exception.Response) {
        $resp = $_.Exception.Response
        try {
            $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
            $text = $sr.ReadToEnd()
            Write-Output "--- Response body ---"
            Write-Output $text
        } catch {
            Write-Output "No se pudo leer el cuerpo de la respuesta"
        }
    }
    exit 1
}