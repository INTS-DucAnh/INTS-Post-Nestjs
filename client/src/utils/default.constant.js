export const FIND_CONSTANT = {
  skip: 0,
  limit: 10,
  max: 0,
};

export const MESSAGE_CONSTANT = {
  err: (message) => ({
    400: message,
    401: "Unauthorized",
    403: "Permission requied!",
  }),
  user: {
    deleted: {
      fail: "",
      success: "Deleted a user!",
    },
    created: {
      fail: "",
      success: "Created User!",
    },
    updated: {
      fail: "",
      success: "Updated User!",
    },
  },
  post: {
    deleted: {
      fail: "",
      success: "Deleted a post!",
    },
    created: {
      fail: "",
      success: "Created Category!",
    },
    updated: {
      fail: "",
      success: "Updated Post!",
    },
  },
  category: {
    deleted: {
      fail: "Deleted a category!",
      success: "",
    },
    created: {
      success: "Created Category!",
      fail: "",
    },
    updated: {
      fail: "Updated Category!",
      success: "",
    },
  },
};

export const IMAGE_CONSTANT = {
  type: "image/*",
  maxsize: {
    size: 10,
    unit: "mb",
  },
};

export const TIME_CONSTANT = {
  oneDay: { time: 24, unit: "d", child: "h" },
  oneHour: { time: 60, unit: "h", child: "m" },
  oneMinute: { time: 60, unit: "m", child: "s" },
  oneSec: { time: 1000, unit: "s", child: "ms" },
};

export const FILE_CONSTANT = {
  oneGigabyte: { size: 1024, unit: "gb", child: "mb" },
  oneMegabyte: { size: 1024, unit: "mb", child: "kb" },
  onKilobyte: { size: 1024, unit: "kb", child: "b" },
};
