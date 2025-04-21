import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from 'http-status-codes'

import SemesterService from "@/data-layer/services/SemesterService";
import { CreateSemesterData } from "@/types/Collections";
import { CreateProjectRequestBody } from "@/types/request-models/SemesterRequests";
import { ZodError } from "zod";

export const POST = async (req: NextRequest) => {
  try {
    const parsedBody = CreateProjectRequestBody.parse(await req.json());

    const semesterService = new SemesterService();
    const newSemester = await semesterService.createSemester(parsedBody as CreateSemesterData);

    return NextResponse.json(newSemester);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: StatusCodes.BAD_REQUEST }
      );
    } else {
      console.error(error);
      return NextResponse.json({ error: "Internal server error" }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
    }
  }
};
