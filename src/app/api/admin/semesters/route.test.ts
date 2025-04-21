import { StatusCodes } from 'http-status-codes'

import SemesterService from "@/data-layer/services/SemesterService";
import { POST } from "./route";
import { createMockNextPostRequest } from "@/test-config/utils";

const testBody = {
  name: "test test",
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  deadline: new Date().toISOString(),
};

describe("tests /api/admin/semesters", () => {
  const semesterService = new SemesterService();

  describe("POST /api/admin/semesters", () => {
    it("should create a semester", async () => {
      const res = await POST(createMockNextPostRequest("", testBody));
      expect(res.status).toBe(StatusCodes.CREATED);

      const json = await res.json();
      const fetchedSemester = await semesterService.getSemester(json.id);
      expect(json).toEqual(fetchedSemester);
    });

    it("should error when missing required fields", async () => {
      const res = await POST(createMockNextPostRequest("", { ...testBody, name: undefined }));
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should error if an invalid date is provided", async () => {
      const res = await POST(createMockNextPostRequest("", { ...testBody, startDate: "invalid date" }));
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
})
