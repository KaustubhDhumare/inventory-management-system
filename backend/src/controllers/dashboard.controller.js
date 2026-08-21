import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getDashboard } from "../services/dashboard.service.js";

const getDashboardData = asyncHandler(async (req, resp) => {
  const dashboard = await getDashboard();

  return resp
    .status(200)
    .json(
      new ApiResponse(
        200,
        { dashboard },
        "Dashboard data fetched successfully",
      ),
    );
});

export { getDashboardData };
