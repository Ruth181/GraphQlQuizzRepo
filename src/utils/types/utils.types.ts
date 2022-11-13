import { HttpStatus } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export interface BaseMyContext {
  req: Request;
  res: Response;
}

export const NODE_ENV = process.env.NODE_ENV || 'development';

export const DEFAULT_PASSPORT_LINK =
  'https://origamiportal.s3.us-east-2.amazonaws.com/Images/user_male.png';

export const ApiMessageList = {
  GENERIC_ERROR_MESSAGE: 'An error occured',
  BAD_REQUEST:
    'This request payload, was entered wrongly. Check the Docs for confirmation',
  UNAUTHORIZED_REQUEST: 'You are not authorized to view this resource',
  NOT_FOUND: 'This resource was not found',
  CONFLICT_ERROR_MESSAGE: (field?: string) => {
    const fieldValue = field ? field : 'value';
    return `A conflict occured. This '${fieldValue}' already exists`;
  },
  GENERIC_SUCCESS_MESSAGE: `Successful`,
  FORBIDDEN_ERROR_MESSAGE: `Account is deactivated, contact admin`,
  BAD_NUMERIC_ERROR_MESSAGE: 'Any numerical data must be > 0',
};

export const DELIVERY_COST = 4.99;
export const POINTS_PER_QUESTION = 5;

export class BaseResponseTypeDTO {
  success: boolean;
  code: HttpStatus;
  message: string;
}

@InputType()
export class PaginationRequestDTO {
  @Field()
  pageNumber: number;

  @Field()
  pageSize: number;
}

@ObjectType()
export class PaginationResponseDTO {
  @Field()
  currentPage: number;

  @Field()
  totalPages: number;

  @Field()
  pageSize: number;

  @Field()
  totalCount: number;

  @Field()
  hasPrevious: boolean;

  @Field()
  hasNext: boolean;

  @Field()
  isPaginated: boolean;
}

export enum NODE_ENVIRONMENT {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export enum RequestStatus {
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
}

export enum TimeDuration {
  ONE_DAY = 'ONE_DAY',
  ONE_WEEK = 'ONE_WEEK',
  ONE_MONTH = 'ONE_MONTH',
  TWO_MONTHS = 'TWO_MONTHS',
  SIX_MONTHS = 'SIX_MONTHS',
  ONE_YEAR = 'ONE_YEAR',
  TWO_YEARS = 'TWO_YEARS',
  FOREVER = 'FOREVER',
}

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
}

export interface SelectFieldType {
  key: string;
  value: string | number;
}

export class DefaultResponseType<T> {
  message: string;

  status: RequestStatus;

  payload?: T;
}

@ObjectType()
export class DefaultResponseTypeGQL {
  @Field(() => String)
  message: string;

  @Field(() => RequestStatus)
  status: RequestStatus;
}

export enum AppRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum TwoWayOption {
  YES = 'YES',
  NO = 'NO',
}

export class RoleMetadata {
  role: AppRole;
  metadata?: string[];
}

export enum DecodedTokenKey {
  DATE_CREATED = 'dateCreated',
  EMAIL = 'email',
  ROLE = 'role',
  ID = 'id',
  IAT = 'iat',
  EXP = 'exp',
}

export enum PaymentStatus {
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
  PROCESSING = 'PROCESSING',
  PENDING = 'PENDING',
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum WeekDay {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum DiscountType {
  FULL_DISCOUNT = 'FULL_DISCOUNT',
  PART_DISCOUNT = 'PART_DISCOUNT',
}

export enum NutritionalValue {
  FULL_STACK = 'FULL_STACK', //Todo: Remove this ridiculous demo
}

export enum WebsocketEvent {
  SEND_USER_MESSAGE = 'SEND_USER_MESSAGE',
  SEND_ADMIN_MESSAGE = 'SEND_ADMIN_MESSAGE',

  GET_ADMIN_MESSAGES = 'GET_ADMIN_MESSAGES',
  GET_USER_MESSAGES = 'GET_USER_MESSAGES',
}

export enum MenuCategory {
  CLASSIC_PLATE = 'CLASSIC_PLATE',
  VEGGIE_PLATE = 'VEGGIE_PLATE',
  EASY_PLATE = 'EASY_PLATE',
  FAMILY_PLATE = 'FAMILY_PLATE',
}

export enum ShopType {
  INGREDIENT_SHOP = 'INGREDIENT_SHOP',
  MENU_SHOP = 'MENU_SHOP',
}

export enum FileType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  PDF = 'PDF',
}

export enum TestType {
  BALANCED_TEST = 'BALANCED_TEST',
  RANDOMIZED_TEST = 'RANDOMIZED_TEST',
}

export enum StatusType {
  FAILED = 'FAILED',
  CORRECT = 'CORRECT',
  SKIPPED = 'SKIPPED',
}

registerEnumType(StatusType, { name: 'StatusType' });

registerEnumType(TestType, { name: 'TestType' });

registerEnumType(FileType, { name: 'FileType' });

registerEnumType(ShopType, { name: 'ShopType' });

registerEnumType(MenuCategory, { name: 'MenuCategory' });

registerEnumType(WebsocketEvent, { name: 'WebsocketEvent' });

registerEnumType(TwoWayOption, { name: 'TwoOption' });

registerEnumType(DeliveryStatus, { name: 'DeliveryStatus' });

registerEnumType(NutritionalValue, { name: 'NutritionalValue' });

registerEnumType(DiscountType, { name: 'DiscountType' });

registerEnumType(WeekDay, { name: 'WeekDay' });

registerEnumType(PaymentStatus, { name: 'PaymentStatus' });

registerEnumType(RequestStatus, {
  name: 'RequestStatus',
  description: `Status of http request`,
});

registerEnumType(AppRole, {
  name: 'AppRole',
  description: `Describes the user roles on app`,
});

registerEnumType(TimeDuration, { name: 'TimeDuration' });

registerEnumType(PaymentProvider, { name: 'PaymentProvider' });
