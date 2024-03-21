export const MESSAGE_CONSTANT = {
  permission: {
    notAllow: `You don't have permission to do this!`,
    notOwn: (target: string) => `You don't owned this ${target}!`,
  },
  param: {
    invalid: (param: string) => `${param} invalid!`,
  },
  targetNonExist: (target: string) => `This ${target} is non exist!`,
  auth: {
    badrequest: {
      exist: `This user already exist!`,
      incorrect: (field: string) => `${field} is incorrect!`,
    },
  },
  categories: {
    badrequest: {},
  },
  jwt: {
    forbidden: {
      invalid: (token: string) => `invalid ${token} token`,
    },
  },
  user: {
    success: {
      update: 'Succesfully update password!',
    },
    badrequest: {
      delete: {
        self: 'Can not delete your account!',
      },
      update: {},
    },
  },
};

export const TOKEN_CONSTANT = {
  jwt: {
    access: {
      secret: 'SECRET_ACCESS_TOKEN',
      expire: 'ACCESS_TOKEN_EXPIRE',
    },
    refresh: {
      secret: 'SECRET_REFRESH_TOKEN',
      expire: 'REFRESH_TOKEN_EXPIRE',
    },
  },
};

export const COOKIES_CONSTANT = {
  name: 'COOKIES_NAME',
  expire: 'COOKIES_EXPIRE',
};

export const IMAGE_CONSTANT = {
  maxsize: {
    upload: '10 mb',
  },
  filetype: /(jpg|jpeg|png)$/,
};

export const TIME_CONSTANT = {
  oneDay: { time: 24, unit: 'd', child: 'h' },
  oneHour: { time: 60, unit: 'h', child: 'm' },
  oneMinute: { time: 60, unit: 'm', child: 's' },
  oneSec: { time: 1000, unit: 's', child: 'ms' },
};

export const FILE_CONSTANT = {
  oneGigabyte: { size: 1024, unit: 'gb', child: 'mb' },
  oneMegabyte: { size: 1024, unit: 'mb', child: 'kb' },
  onKilobyte: { size: 1024, unit: 'kb', child: 'b' },
};

export const S3_CONSTANT = {
  bucket: {
    name: 'S3_BUCKET_NAME',
  },
};
