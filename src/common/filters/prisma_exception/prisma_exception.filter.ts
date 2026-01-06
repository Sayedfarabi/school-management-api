/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from 'generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred.';
    // console.log('Prisma Exception Filter:', exception);

    switch (exception.code) {
      case 'P2000':
        status = HttpStatus.BAD_REQUEST;
        message = `Input too long for field: ${exception?.meta?.field}`;
        break;

      case 'P2001':
        status = HttpStatus.NOT_FOUND;
        message = `No record found for the given query conditions.`;
        break;

      case 'P2002': {
        status = HttpStatus.BAD_REQUEST;
        const fields = Array.isArray(exception.meta?.target)
          ? exception.meta.target.join(', ')
          : exception.meta?.target;
        message = `The value for [${fields}] already exists. Please use a different one.`;
        break;
      }

      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = `Invalid reference. Foreign key constraint failed on: ${exception.meta?.field}`;
        break;

      case 'P2004':
        status = HttpStatus.BAD_REQUEST;
        message = `A constraint violation occurred. ${exception.meta?.details}`;
        break;

      case 'P2005':
        status = HttpStatus.BAD_REQUEST;
        message = `Invalid value provided for field: ${exception.meta?.field}`;
        break;

      case 'P2006':
        status = HttpStatus.BAD_REQUEST;
        message = `Invalid data type for: ${exception.meta?.field}`;
        break;

      case 'P2007':
        status = HttpStatus.BAD_REQUEST;
        message = `Data validation failed. Please check your input.`;
        break;

      case 'P2008':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = `Query parsing error. Please check your Prisma query syntax.`;
        break;

      case 'P2009':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = `Query validation error. Please ensure the query is correct.`;
        break;

      case 'P2010':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = `Raw query failed. ${exception.meta?.details}`;
        break;

      case 'P2011':
        status = HttpStatus.BAD_REQUEST;
        message = `Field cannot be null: ${exception.meta?.field}`;
        break;

      case 'P2012':
        status = HttpStatus.BAD_REQUEST;
        message = `Missing required value for: ${exception.meta?.field}`;
        break;

      case 'P2013':
        status = HttpStatus.BAD_REQUEST;
        message = `Missing required argument in query.`;
        break;

      case 'P2014':
        status = HttpStatus.BAD_REQUEST;
        message = `Related record not found. Please ensure the relationship exists.`;
        break;

      case 'P2015':
        status = HttpStatus.BAD_REQUEST;
        message = `The record is not properly connected.`;
        break;

      case 'P2016':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = `Query interpretation error occurred.`;
        break;

      case 'P2017':
        status = HttpStatus.BAD_REQUEST;
        message = `Required related records not found.`;
        break;

      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = `The resource you are trying to update/delete does not exist.`;
        break;

      case 'P2026':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = `Invalid Prisma schema. Contact backend developer.`;
        break;

      default:
        message = `An unknown Prisma error occurred: ${exception.code}`;
        break;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      error: 'PrismaValidationError',
      timestamp: new Date().toISOString(),
    });
  }
}
