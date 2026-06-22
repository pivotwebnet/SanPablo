import { formatCurrency, formatDateTime } from './format'

// Datos mínimos para imprimir una comanda (los satisface el tipo Order
// y también el objeto que arma el POS al confirmar).
export interface TicketItem {
  quantity: number
  productName: string
  variantName: string
  lineTotal: number
}

export interface TicketData {
  orderNumber: number
  customerName: string
  createdAt: string
  paymentMethod: string
  total: number
  items: TicketItem[]
}

// HTML del ticket pensado para impresora térmica de 80mm.
// Items grandes y en negrita: es la comanda que lee la cocina.
function renderTicketHtml(o: TicketData): string {
  const rows = o.items
    .map(
      (i) => `
      <tr>
        <td class="qty">${i.quantity}x</td>
        <td class="name">${escapeHtml(i.productName)} <b>${escapeHtml(i.variantName)}</b></td>
      </tr>`,
    )
    .join('')

  return `<!doctype html>
<html><head><meta charset="utf-8" />
<title>Comanda #${o.orderNumber}</title>
<style>
  @page { size: 80mm auto; margin: 0; }
  * { box-sizing: border-box; }
  body { width: 80mm; margin: 0; padding: 6mm 4mm;
         font-family: 'Courier New', monospace; color: #000; }
  .center { text-align: center; }
  .title { font-size: 18px; font-weight: 800; }
  .sub { font-size: 12px; }
  hr { border: none; border-top: 1px dashed #000; margin: 6px 0; }
  .meta { font-size: 13px; }
  .cliente { font-size: 17px; font-weight: 800; margin: 4px 0; }
  table { width: 100%; border-collapse: collapse; }
  td { vertical-align: top; padding: 3px 0; font-size: 16px; }
  td.qty { width: 28px; font-weight: 800; }
  td.name { line-height: 1.2; }
  .total { display: flex; justify-content: space-between;
           font-size: 18px; font-weight: 800; margin-top: 4px; }
  .foot { font-size: 11px; margin-top: 8px; }
</style></head>
<body>
  <div class="center title">ROTISERÍA SAN PABLO</div>
  <div class="center sub">COMANDA COCINA</div>
  <hr />
  <div class="meta">Pedido <b>#${o.orderNumber}</b></div>
  <div class="meta">${formatDateTime(o.createdAt)}</div>
  <div class="cliente">Cliente: ${escapeHtml(o.customerName)}</div>
  <hr />
  <table>${rows}</table>
  <hr />
  <div class="meta">Pago: ${escapeHtml(o.paymentMethod)}</div>
  <div class="total"><span>TOTAL</span><span>${formatCurrency(o.total)}</span></div>
  <hr />
  <div class="center foot">¡Gracias!</div>
</body></html>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Imprime la comanda usando un iframe oculto (evita bloqueadores de popups).
// Funciona con cualquier impresora instalada en el sistema (incluida la
// térmica de recibos). Para ESC/POS "crudo" se reemplaza esta función por
// un agente local / WebUSB / QZ Tray en el backend más adelante.
export function printTicket(data: TicketData): void {
  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;'
  document.body.appendChild(iframe)

  const win = iframe.contentWindow
  if (!win) return
  win.document.open()
  win.document.write(renderTicketHtml(data))
  win.document.close()

  // Esperar a que pinte antes de imprimir
  iframe.onload = () => {
    win.focus()
    win.print()
    setTimeout(() => document.body.removeChild(iframe), 1000)
  }
}
