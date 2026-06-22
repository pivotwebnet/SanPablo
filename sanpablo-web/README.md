# Rotisería San Pablo — Frontend (PWA)

Sistema interno de toma de pedidos. React + Vite + TypeScript + Tailwind, instalable como PWA en tablets y teléfonos.

## Requisitos
- Node 18+ (probado con Node 24)

## Puesta en marcha

```bash
npm install
cp .env.example .env   # ya viene con VITE_USE_MOCK=true para correr sin backend
npm run dev
```

Abrí http://localhost:5173. Por defecto usa un **menú de ejemplo** (mock), así que funciona sin el backend .NET.

### Probar en la tablet/celular (misma red Wi-Fi)
El server ya escucha en `host: true`. En la tablet abrí `http://<IP-de-la-PC>:5173`.

### Conectar al backend real
En `.env`:
```
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:5080/api
```

## Estructura
```
src/
├── api/          # cliente axios, tipos y llamadas (menu, orders) + mock
├── lib/          # formato de moneda/fecha (es-AR)
└── features/
    └── pos/      # pantalla de toma de pedidos
        ├── components/  CategoryTabs, ProductGrid, CartPanel, PaymentSelector
        ├── hooks/       useCart (carrito + total en vivo)
        └── pages/       PosPage
```

## Estado actual
- [x] Pantalla POS mobile-first (grilla táctil + carrito + pago + confirmar)
- [x] PWA instalable (vite-plugin-pwa)
- [x] Datos mock para desarrollar sin backend
- [x] Dashboard de métricas (KPIs, desglose Efectivo/Transferencia, top productos, gráfico temporal, filtro de fechas) — en `/dashboard`, lazy-loaded
- [x] Historial de pedidos en `/historial` (persistido en localStorage en modo mock)
- [x] Impresión de comanda para cocina (automática al confirmar + reimprimir desde el historial) — `src/lib/ticket.ts`, ticket térmico 80mm
- [~] Exportación a Excel (botón listo; descarga real al conectar el backend)
- [ ] Login de empleados
- [ ] ABM de catálogo (admin)

## Impresión de comanda
Al confirmar un pedido se imprime automáticamente la **comanda de cocina** (ticket
de 80mm con cliente, ítems y total). Usa el diálogo de impresión del navegador, así
que funciona con cualquier impresora de recibos instalada como impresora del sistema
(seleccionala como predeterminada para que salga directo).

> Para impresión ESC/POS "cruda" (sin diálogo, corte automático de papel) se
> reemplaza `printTicket()` por un agente local / WebUSB / QZ Tray. La estructura
> ya está aislada en `src/lib/ticket.ts`.

## Build de producción
```bash
npm run build      # genera dist/  (servir con Nginx en Coolify)
npm run preview    # previsualizar el build
```

> Nota PWA: faltan los íconos `public/pwa-192x192.png` y `public/pwa-512x512.png`.
> Generalos desde el logo real del local antes de publicar.
