import { NextResponse } from 'next/server'
import { getAllTeminDosyalari, updateTeminDosyasi, createTeminDosyasi } from '@/lib/db/temin-repository'

export async function GET() {
  try {
    const dosyalari = getAllTeminDosyalari()
    return NextResponse.json({ success: true, data: dosyalari })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (body.action === 'create') {
      const newId = createTeminDosyasi(body.data || {})
      return NextResponse.json({ success: Boolean(newId), id: newId })
    }

    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Dosya ID gereklidir.' }, { status: 400 })
    }

    const updates = body.updates || body.data || {}
    const ok = updateTeminDosyasi(body.id, updates)
    return NextResponse.json({ success: ok })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

