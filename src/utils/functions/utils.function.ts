import { BadRequestException, HttpStatus, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import axios, { AxiosResponse } from 'axios';
import * as xlsx from 'xlsx';
import {
  ApiMessageList,
  BaseResponseTypeDTO,
  PaginationRequestDTO,
  PaginationResponseDTO,
} from '@utils/types/utils.types';
import { Repository, FindManyOptions } from 'typeorm';

dotenv.config();

const {
  AWS_BUCKET_NAME,
  AWS_KEY_NAME,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env;

const logger: Logger = new Logger('UtilFunctions');

export const generateUniqueKey = (length = 5) =>
  (uuidv4() as string).slice(0, length);

export const hashPassword = async (rawPassword: string): Promise<string> => {
  return await new Promise((resolve, reject) => {
    bcrypt.hash(rawPassword, 10, (err, hash) => {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });
};

export const verifyPasswordHash = async (
  rawPassword: string,
  encryptedPassword: string,
): Promise<string> => {
  return await new Promise((resolve, reject) => {
    bcrypt.compare(rawPassword, encryptedPassword, (err, passwordMatch) => {
      if (err) {
        reject(err);
      }
      resolve(passwordMatch);
    });
  });
};

export const extractExcelSheetData = <T>(
  path: string,
  deleteAfterUpload = false,
): T[] => {
  try {
    let errorMessage: string;
    const excelSheetRead = xlsx.readFile(path, { cellDates: true });
    if (excelSheetRead.SheetNames?.length > 0) {
      const sheetName: string = excelSheetRead.SheetNames[0];
      const targetExcelSheet: string = excelSheetRead.SheetNames.find(
        (s: string) => s === sheetName,
      );
      if (targetExcelSheet) {
        const excelWorkSheet: xlsx.WorkSheet = excelSheetRead.Sheets[sheetName];
        const extractedContent: T[] = xlsx.utils.sheet_to_json(excelWorkSheet);
        //Delete the uploaded File after reading
        fs.unlinkSync(path);
        return extractedContent;
      }
    } else {
      errorMessage = 'This file does not contain any sheets';
    }
    //Delete the uploaded File after reading
    if (deleteAfterUpload) {
      fs.unlinkSync(path);
    }
    if (errorMessage) {
      logger.error(errorMessage);
      throw new BadRequestException(errorMessage);
    }
  } catch (ex) {
    logger.error(ex);
    throw ex;
  }
};

export const httpGet = async <T>(url: string, headers = {}): Promise<T> => {
  try {
    const response: AxiosResponse = await axios.get(url, { headers });
    return response.data as T;
  } catch (error) {
    throw error;
  }
};

export const httpPost = async <U, T>(
  url: string,
  payload: T,
  headers = {},
): Promise<U> => {
  try {
    const response: AxiosResponse = await axios.post(url, payload, { headers });
    return response.data as U;
  } catch (error) {
    throw error;
  }
};

// export const sendEmail = async (
//   html: string,
//   subject: string,
//   recipientEmail: string,
// ): Promise<BaseResponseTypeDTO> => {
//   try {
//     const mailgun: Mailgun = new Mailgun({
//       apiKey: process.env.MAILGUN_API_KEY,
//       domain: process.env.MAILGUN_DOMAIN_NAME,
//     });

//     const data = {
//       from: 'Hwfa <okaforchijioke01@gmail.com>',
//       to: recipientEmail,
//       subject,
//       html,
//     };
//     const response: any = await new Promise((resolve, reject) => {
//       mailgun.messages().send(data, (err, data) => {
//         if (err) {
//           reject(err);
//           throw err;
//         } else {
//           resolve(data);
//         }
//       });
//     });
//     if (response?.id) {
//       return {
//         message: response.message,
//         code: HttpStatus.OK,
//         success: true,
//       };
//     }
//   } catch (ex) {
//     logger.error(ex);
//     return {
//       success: false,
//       message: 'Email not sent',
//       code: HttpStatus.OK,
//     };
//   }
// };

export const sendEmail = async (
  html: string,
  subject: string,
  recipientEmails: string[],
): Promise<BaseResponseTypeDTO> => {
  const serverHost = 'smtp.gmail.com';
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: serverHost,
    port: 465,
    auth: {
      user: process.env.EMAIL_ADMIN,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: `"Quizz App" <${process.env.EMAIL_ADMIN}>`,
    to: recipientEmails.join(','),
    subject,
    html,
  };
  try {
    const response: any = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        }
        resolve(info);
      });
    });
    if (response?.messageId) {
      return {
        message: `Nodemailer sent message: ${response.messageId}`,
        code: HttpStatus.OK,
        success: true,
      };
    }
  } catch (ex) {
    logger.error(ex);
    return {
      success: false,
      message: 'Email not sent',
      code: HttpStatus.OK,
    };
  }
};

export const validateEmail = (email: string): boolean => {
  const regExp =
    /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return regExp.test(email);
};

export const uploadFileToS3 = async (
  filePath: string,
  deleteAfterUpload = false,
): Promise<string> => {
  try {
    const awsConfigOptions: AWS.S3.ClientConfiguration = {
      accessKeyId: String(AWS_ACCESS_KEY_ID).trim(),
      secretAccessKey: String(AWS_SECRET_ACCESS_KEY).trim(),
    };
    const s3: AWS.S3 = new AWS.S3(awsConfigOptions);
    //Create a readstream for the uploaded files
    const createdReadStream = fs.createReadStream(filePath);

    //Create AWS Params object
    const awsBucketParams: AWS.S3.PutObjectRequest = {
      Bucket: String(AWS_BUCKET_NAME).trim(),
      Key: `${String(AWS_KEY_NAME).trim()}/${filePath}`,
      Body: createdReadStream,
      ACL: 'public-read',
    };

    //Upload file to AWS storage bucket
    const result = await s3.upload(awsBucketParams).promise();

    if (result && deleteAfterUpload) {
      fs.unlinkSync(filePath);
    }
    return result.Location;
  } catch (ex) {
    logger.error(`${ApiMessageList.GENERIC_ERROR_MESSAGE} ${ex}`);
    throw ex;
  }
};

export const uploadBase64StringToS3 = async (
  dataURI: string,
  contentType = 'image/png',
): Promise<string> => {
  try {
    const [, url] = dataURI.split(',');
    const [, ext] = contentType.split('/');
    const buffer = Buffer.from(url, 'base64');
    const params = {
      Key: `${process.env.AWS_KEY_NAME}/${uuidv4()}.${ext}`,
      Body: buffer,
      Bucket: process.env.AWS_BUCKET_NAME,
      contentType: 'image/png',
      ContentEncoding: 'base64',
      ACL: 'public-read',
    };

    const awsConfigOptions: AWS.S3.ClientConfiguration = {
      accessKeyId: String(AWS_ACCESS_KEY_ID).trim(),
      secretAccessKey: String(AWS_SECRET_ACCESS_KEY).trim(),
    };
    const bucket = new AWS.S3(awsConfigOptions);
    const responseData: AWS.S3.ManagedUpload.SendData = await new Promise(
      (resolve, reject) => {
        bucket.upload(params, (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
      },
    );
    return responseData?.Location;
  } catch (ex) {
    logger.error(ex);
    throw ex;
  }
};

export const deleteFileFromS3 = async (filePath: string): Promise<boolean> => {
  try {
    const awsConfigOptions: AWS.S3.ClientConfiguration = {
      accessKeyId: String(AWS_ACCESS_KEY_ID).trim(),
      secretAccessKey: String(AWS_SECRET_ACCESS_KEY).trim(),
    };
    const s3: AWS.S3 = new AWS.S3(awsConfigOptions);
    const [firstPathSection, secondPathSection] = filePath.split('/').slice(-2);

    // Create AWS Params object
    const awsBucketParams: any = {
      Bucket: String(AWS_BUCKET_NAME).trim(),
      Key: `${process.env.AWS_KEY_NAME}/${firstPathSection}/${secondPathSection}`,
    };
    try {
      // Check if file exists in s3
      await s3.headObject(awsBucketParams).promise();
      logger.log('File Found in S3');
    } catch (ex) {
      logger.error(`File not Found AWS_CODE: ${ex.code}`);
      return false;
    }
    return await new Promise((resolve, reject) => {
      s3.deleteObject(
        awsBucketParams,
        (error, data: AWS.S3.DeleteObjectOutput) => {
          if (error) {
            reject(error);
          }
          if (data) {
            resolve(true);
          }
        },
      );
    });
  } catch (ex) {
    throw ex;
  }
};

export const shuffleArray = <T>(array: T[]): T[] => {
  return array.length > 0 ? array.sort(() => Math.random() - 0.5) : array;
};

export const groupBy = <T>(list: T[], key: string): any => {
  return list.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const validateURL = (url: string): boolean => {
  const regEx =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  return regEx.test(url);
};

export const findMatchInStringArray = (
  arr1: string[],
  arr2: string[],
  filter: 'IN' | 'NOT_IN',
): string[] => {
  const arr = [];
  arr1 = arr1.toString().split(',').map(String);
  arr2 = arr2.toString().split(',').map(String);
  // for array1
  if (filter === 'IN') {
    for (const i in arr1) {
      if (arr2.indexOf(arr1[i]) !== -1) arr.push(arr1[i]);
    }
  } else {
    for (const i in arr1) {
      if (arr2.indexOf(arr1[i]) === -1) arr.push(arr1[i]);
    }
  }
  return arr.sort((x, y) => x - y);
};

export const createLogFile = (path: string): void => {
  const pathSegments = path.split('/');
  if (pathSegments?.length <= 1) {
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, '');
    }
  } else {
    const dir = pathSegments.slice(0, pathSegments.length - 1).join('/');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, '');
    }
  }
};

export const saveLogToFile = (error: any) => {
  try {
    const fileName = 'logs/response-log.txt';
    createLogFile(fileName);

    const errorData = typeof error === 'object' ? JSON.stringify(error) : error;
    const file = fs.createWriteStream(fileName, { flags: 'a' });
    const formattedData = `
      ========${new Date().toISOString()}=============\n
      ${errorData}
      ===============================================\n
    `;
    file.write(formattedData);
  } catch (ex) {
    throw ex;
  }
};

export const arrayDifference = <T>(array1: T[], array2: T[], key): T[] => {
  const result = [];
  if (array1.length > 0 && array2.length > 0) {
    if (
      !Object.keys(array1[0]).includes(key) ||
      !Object.keys(array1[0]).includes(key)
    ) {
      return result;
    }
  }
  for (let i = 0; i < array1.length; i++) {
    let found = false;
    for (let j = 0; j < array2.length; j++) {
      if (array1[i][key] == array2[j][key]) {
        found = true;
        break;
      }
    }
    if (!found) {
      result.push(array1[i]);
    }
  }
  return result;
};

export const calculatePaginationControls = async <T>(
  repository: Repository<T>,
  options: FindManyOptions<T>,
  payload: PaginationRequestDTO,
): Promise<{ paginationControl: PaginationResponseDTO; response: T[] }> => {
  const [response, total] = await repository.findAndCount(options);
  return {
    paginationControl: {
      totalPages: Math.ceil(total / payload?.pageSize),
      currentPage: payload?.pageNumber,
      pageSize: payload?.pageSize,
      hasNext: payload?.pageNumber < Math.ceil(total / payload?.pageSize),
      hasPrevious: payload?.pageNumber > 1,
      totalCount: total,
      isPaginated: true,
    },
    response,
  };
};

export const randomizeOrderOfArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return [...array];
};

export type PaginationResponse = {
  paginationControl: {
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
    totalCount: number;
  };
  response: any[];
};

export const calculateControlsOnArrays = <T>(
  payload: T[],
  pageNumber = 1,
  pageSize = 10,
): PaginationResponse => {
  const total = (payload ?? []).length;
  const response = [...payload].slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize,
  );
  return {
    paginationControl: {
      totalPages: Math.ceil(total / pageSize),
      currentPage: pageNumber,
      pageSize,
      hasNext: pageNumber < Math.ceil(total / pageSize),
      hasPrevious: pageNumber > 1,
      totalCount: total,
    },
    response,
  };
};

export const getDefaultPaginationResponse = <T>(
  response: T[],
): { response: T[]; paginationControl: PaginationResponseDTO } => {
  return {
    response,
    paginationControl: {
      currentPage: 0,
      hasNext: false,
      hasPrevious: false,
      isPaginated: false,
      totalCount: 0,
      totalPages: 0,
      pageSize: 0,
    },
  };
};

// export const validateEnum = (enum: , enumValue: string) => Object.values(enum).includes(enumValue);
