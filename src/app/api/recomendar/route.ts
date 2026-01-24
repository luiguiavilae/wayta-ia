import { NextResponse } from "next/server";
import { recomendar } from "@/lib/motor/motor";
import type { EntradaMotor } from "@/lib/motor/tipos";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as EntradaMotor;

    if (
      !body?.nivelMistico ||
      !body?.intencion ||
      !body?.inspiracionAncestral ||
      !body?.direccionRegalo
    ) {
      return NextResponse.json(
        {
          error:
            "Faltan campos requeridos: nivelMistico, intencion, inspiracionAncestral, direccionRegalo",
        },
        { status: 400 }
      );
    }

    const recomendado = recomendar(body);
    return NextResponse.json({ recomendado });
  } catch (e) {
    return NextResponse.json(
      { error: "Error procesando la recomendación" },
      { status: 500 }
    );
  }
}
