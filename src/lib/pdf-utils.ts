import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const BUSINESS = {
  name: 'Flower K',
  address: '127, avenue de Gravelle',
  city: '94410 Saint-Maurice',
  siret: 'SIRET: 993 329 259 00010',
  legal: 'TVA non applicable, art. 293B du CGI',
}

function formatDateFR(date: string | Date | null | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatEUR(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

async function loadLogoBase64(): Promise<string | null> {
  try {
    const res = await fetch('/logo.jpeg')
    if (!res.ok) return null
    const blob = await res.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function addBusinessHeader(doc: jsPDF, logo: string | null, yStart: number): number {
  let y = yStart
  if (logo) {
    try {
      doc.addImage(logo, 'JPEG', 14, y, 30, 30)
    } catch {
      // skip logo on error
    }
  }
  const xText = logo ? 50 : 14
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(BUSINESS.name, xText, y + 8)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(BUSINESS.address, xText, y + 15)
  doc.text(BUSINESS.city, xText, y + 20)
  doc.text(BUSINESS.siret, xText, y + 25)
  return y + 35
}

export async function downloadQuotePDF(quote: any): Promise<void> {
  const doc = new jsPDF('p', 'mm', 'a4')
  const logo = await loadLogoBase64()

  let y = addBusinessHeader(doc, logo, 10)

  // Document title
  y += 5
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`DEVIS N° ${quote.quoteNumber}`, 14, y)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Date : ${formatDateFR(quote.createdAt)}`, 14, y + 7)
  y += 15

  // Event info
  if (quote.event) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Événement :', 14, y)
    doc.setFont('helvetica', 'normal')
    doc.text(quote.event.name, 45, y)
    y += 5
    if (quote.event.date) {
      doc.text(`Date : ${formatDateFR(quote.event.date)}`, 14, y)
      y += 5
    }
    if (quote.event.address) {
      doc.text(`Adresse : ${quote.event.address}`, 14, y)
      y += 5
    }
    if (quote.event.client) {
      doc.text(`Client : ${quote.event.client.name}`, 14, y)
      y += 5
      if (quote.event.client.address) {
        doc.text(`Adresse client : ${quote.event.client.address}`, 14, y)
        y += 5
      }
    }
  }

  y += 5

  // Lines table
  const lines = quote.lines || []
  const tableBody = lines.map((line: any) => [
    line.prestation,
    line.description || '',
    String(line.quantity),
    formatEUR(line.unitPrice),
    formatEUR(line.quantity * line.unitPrice),
  ])

  autoTable(doc, {
    startY: y,
    head: [['Prestation', 'Description', 'Quantité', 'Prix unitaire', 'Total']],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [200, 190, 175], textColor: [10, 10, 10], fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 50 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' },
    },
    margin: { left: 14, right: 14 },
  })

  // Grand total
  const finalY = (doc as any).lastAutoTable?.finalY || y + 20
  y = finalY + 8
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`Total HT : ${formatEUR(quote.totalHT)}`, 196, y, { align: 'right' })

  y += 10

  // Validity
  if (quote.validUntil) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`Devis valable jusqu'au : ${formatDateFR(quote.validUntil)}`, 14, y)
    y += 6
  }

  // Conditions
  if (quote.conditions) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const splitConditions = doc.splitTextToSize(quote.conditions, 180)
    doc.text(splitConditions, 14, y)
    y += splitConditions.length * 4 + 4
  }

  // Notes
  if (quote.notes) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    const splitNotes = doc.splitTextToSize(`Notes : ${quote.notes}`, 180)
    doc.text(splitNotes, 14, y)
  }

  // Legal
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(BUSINESS.legal, 105, 285, { align: 'center' })

  doc.save(`devis-${quote.quoteNumber}.pdf`)
}

export async function downloadInvoicePDF(invoice: any): Promise<void> {
  const doc = new jsPDF('p', 'mm', 'a4')
  const logo = await loadLogoBase64()

  let y = addBusinessHeader(doc, logo, 10)

  // Client info block on the right
  if (invoice.clientName) {
    const xRight = 120
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(invoice.clientName, xRight, 15)
    doc.setFont('helvetica', 'normal')
    let cy = 21
    if (invoice.clientAddress) {
      doc.text(invoice.clientAddress, xRight, cy)
      cy += 5
    }
    if (invoice.clientEmail) {
      doc.text(invoice.clientEmail, xRight, cy)
      cy += 5
    }
    if (invoice.clientPhone) {
      doc.text(invoice.clientPhone, xRight, cy)
    }
  }

  // Document title
  y += 5
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`FACTURE N° ${invoice.invoiceNumber}`, 14, y)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Date d'émission : ${formatDateFR(invoice.issuedDate)}`, 14, y + 7)
  if (invoice.dueDate) {
    doc.text(`Date d'échéance : ${formatDateFR(invoice.dueDate)}`, 14, y + 12)
    y += 5
  }
  y += 15

  // Event info
  if (invoice.event) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Événement :', 14, y)
    doc.setFont('helvetica', 'normal')
    doc.text(invoice.event.name, 45, y)
    y += 5
    if (invoice.event.date) {
      doc.text(`Date : ${formatDateFR(invoice.event.date)}`, 14, y)
      y += 5
    }
    if (invoice.event.address) {
      doc.text(`Adresse : ${invoice.event.address}`, 14, y)
      y += 5
    }
  }

  y += 5

  // Lines table from quote
  const lines = invoice.quote?.lines || []
  const tableBody = lines.map((line: any) => [
    line.prestation,
    line.description || '',
    String(line.quantity),
    formatEUR(line.unitPrice),
    formatEUR(line.quantity * line.unitPrice),
  ])

  autoTable(doc, {
    startY: y,
    head: [['Prestation', 'Description', 'Quantité', 'Prix unitaire (€)', 'Total (€)']],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [200, 190, 175], textColor: [10, 10, 10], fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 50 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' },
    },
    margin: { left: 14, right: 14 },
  })

  // Grand total
  const finalY = (doc as any).lastAutoTable?.finalY || y + 20
  y = finalY + 8
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`Total HT : ${formatEUR(invoice.totalHT)}`, 196, y, { align: 'right' })

  y += 8

  // Notes
  if (invoice.notes) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    const splitNotes = doc.splitTextToSize(`Notes : ${invoice.notes}`, 180)
    doc.text(splitNotes, 14, y)
    y += splitNotes.length * 4 + 4
  }

  // Legal mentions at the bottom
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(BUSINESS.legal, 105, 278, { align: 'center' })
  doc.text(`${BUSINESS.name} - ${BUSINESS.address}, ${BUSINESS.city}`, 105, 283, { align: 'center' })
  doc.text(BUSINESS.siret, 105, 288, { align: 'center' })

  doc.save(`facture-${invoice.invoiceNumber}.pdf`)
}
