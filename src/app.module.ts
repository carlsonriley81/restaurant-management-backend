import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './gateway/events.module';

import { AuthModule } from './modules/auth/auth.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrdersModule } from './modules/orders/orders.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { RecipesModule } from './modules/recipes/recipes.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { TablesModule } from './modules/tables/tables.module';
import { KitchenModule } from './modules/kitchen/kitchen.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { DiscountsModule } from './modules/discounts/discounts.module';
import { TrucksModule } from './modules/trucks/trucks.module';
import { PrepModule } from './modules/prep/prep.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { ReceiptsModule } from './modules/receipts/receipts.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReportsModule } from './modules/reports/reports.module';
import { PosModule } from './modules/pos/pos.module';
import { WaitstaffModule } from './modules/waitstaff/waitstaff.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    EventsModule,
    AuthModule,
    MenuModule,
    OrdersModule,
    InventoryModule,
    RecipesModule,
    EmployeesModule,
    TablesModule,
    KitchenModule,
    ReservationsModule,
    DiscountsModule,
    TrucksModule,
    PrepModule,
    PayrollModule,
    ReceiptsModule,
    NotificationsModule,
    ReportsModule,
    PosModule,
    WaitstaffModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
