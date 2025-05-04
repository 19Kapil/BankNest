import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; 
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['accessToken'];  // Get JWT from cookies

    if (!token) return false;  

    try {
      const decoded = this.jwtService.verify(token);  
      const userRoles = decoded?.role;  

      return requiredRoles.some(role => userRoles && userRoles.includes(role));  // Check if required roles are present
    } catch (error) {
      return false;  
    }
  }
}
